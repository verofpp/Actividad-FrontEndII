import conn from "../config/database.js";

export class InventarioModels {
  static async mostrarInventario(data) {
    try {
      const queryInventario =
        "SELECT p.presentacion AS presentacion, p.nombre, i.cantidad AS cantidad_paquetes, i.fecha_vencimiento FROM Inventario AS i INNER JOIN Productos AS p ON i.producto_id = p.id WHERE i.lote_id = ?";
      const value = [data];
      const [result] = await conn.query(queryInventario, value);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async crearInventario(data) {
    try {
        await conn.beginTransaction();

        // 1. Validar datos de entrada básicos
        if (!data.lote_id || !data.tipo_cafe_id || !data.presentaciones) {
            throw new Error("Datos de entrada incompletos");
        }

        // 2. Obtener y validar el lote con bloqueo
        const [loteRows] = await conn.query(
            `SELECT id, cantidad_kilos, kilos_restante, estado, porcentaje_perdido 
             FROM Lotes 
             WHERE id = ? AND tipo_cafe_id = ? 
             FOR UPDATE`,
            [data.lote_id, data.tipo_cafe_id]
        );

        if (!loteRows || loteRows.length === 0) {
            throw new Error("El lote especificado no existe o no coincide con el tipo de café");
        }

        const lote = loteRows[0];

        // 3. Validar estado del lote
        if (lote.estado.toLowerCase() !== 'listo') {
            throw new Error(`El lote no está listo para procesar. Estado actual: ${lote.estado}`);
        }

        // 4. Calcular kilos disponibles (usar kilos_restante si existe, sino cantidad_kilos)
        const kilosDisponibles = parseFloat(lote.kilos_restante)
        const perdidas = parseFloat(data.perdidas) || 0;

        // 5. Calcular total de kilos usados en presentaciones
        const totalKilosPresentaciones = data.presentaciones.reduce(
            (sum, pres) => sum + (parseFloat(pres.kilos) || 0),
            0
        );

        // 6. Validaciones de cantidades
        if (perdidas < 0) {
            throw new Error("Las pérdidas no pueden ser negativas");
        }

        if (totalKilosPresentaciones + perdidas > kilosDisponibles) {
            throw new Error(
                `No hay suficientes kilos disponibles (${kilosDisponibles.toFixed(2)}). ` +
                `Intenta usar: ${totalKilosPresentaciones.toFixed(2)} kilos en presentaciones + ` +
                `${perdidas.toFixed(2)} en pérdidas = ${(totalKilosPresentaciones + perdidas).toFixed(2)}`
            );
        }

        // 7. Calcular nuevo porcentaje de pérdida (incluyendo pérdidas previas si existen)
        const porcentajePerdidaTotal = (
            ((parseFloat(lote.porcentaje_perdido || 0) * parseFloat(lote.cantidad_kilos) / 100) + perdidas) / 
            parseFloat(lote.cantidad_kilos)
        ) * 100;

        // 8. Insertar registros de inventario
        for (const presentacion of data.presentaciones) {
            const kilos = parseFloat(presentacion.kilos) || 0;
            if (kilos > 0) {
                await conn.query(
                    `INSERT INTO Inventario 
                     (lote_id, producto_id, cantidad, fecha_vencimiento) 
                     VALUES (?, ?, ?, ?)`,
                    [
                        data.lote_id,
                        presentacion.producto_id,
                        presentacion.cantidad,
                        presentacion.fecha_vencimiento || data.fecha_vencimiento
                    ]
                );
            }
        }

        // 9. Actualizar el lote con nuevos valores
        const nuevoKilosRestante = kilosDisponibles - totalKilosPresentaciones - perdidas;
        
        await conn.query(
            `UPDATE Lotes 
             SET kilos_restante = ?, 
                 porcentaje_perdido = ?,
                 estado = CASE 
                    WHEN ? <= 0 THEN 'Agotado' 
                    ELSE 'Listo' 
                 END
             WHERE id = ?`,
            [
                nuevoKilosRestante,
                porcentajePerdidaTotal.toFixed(2),
                nuevoKilosRestante,
                data.lote_id
            ]
        );

        await conn.commit();
        
        return {
            success: true,
            message: "Inventario creado correctamente",
            data: {
                kilos_restantes: nuevoKilosRestante,
                porcentaje_perdido: porcentajePerdidaTotal,
                estado_lote: nuevoKilosRestante <= 0 ? 'Agotado' : 'Procesado'
            }
        };
    } catch (error) {
        if (conn) await conn.rollback();
        console.error("Error en transacción de inventario:", error);
        throw {
            success: false,
            message: error.message,
            code: error.code || "INVENTARIO_ERROR",
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
      }
  }
}
