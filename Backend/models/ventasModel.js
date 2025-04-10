import conn from "../config/database.js";

export class VentasModels {
  static async crearVenta(data) {
    await conn.beginTransaction();

    try {
      // 1. Verificar que existan todos los productos
      const productosIds = data.productos.map(p => p.producto_id);
      const [productosExistentes] = await conn.query(
        "SELECT id FROM Productos WHERE id IN (?);",
        [productosIds]
      );

      if (productosExistentes.length !== data.productos.length) {
        throw new Error("Uno o más productos no existen en la base de datos");
      }

      // 2. Verificar disponibilidad en inventario
      for (const producto of data.productos) {
        const [inventario] = await conn.query(
          `SELECT id, cantidad 
           FROM Inventario 
           WHERE producto_id = ? AND cantidad >= ? 
           ORDER BY fecha_vencimiento ASC 
           LIMIT 1`,
          [producto.producto_id, producto.cantidad]
        );

        if (inventario.length === 0) {
          throw new Error(`No hay suficiente stock para el producto ${producto.producto_id}`);
        }
      }

      // 3. Insertar en Ventas
      const [resultVenta] = await conn.query(
        "INSERT INTO Ventas (comprador_id, fecha_venta, total) VALUES (?, ?, ?);",
        [
          data.comprador_id,
          new Date(data.fecha_venta).toISOString().split("T")[0],
          data.total
        ]
      );

      const ventaId = resultVenta.insertId;

      // 4. Procesar cada producto y actualizar inventario
      for (const producto of data.productos) {
        // Actualizar inventario (restar cantidad y sumar a vendido)
        await conn.query(
          `UPDATE Inventario 
           SET cantidad = cantidad - ?, 
               cantidad_vendido = IFNULL(cantidad_vendido, 0) + ? 
           WHERE producto_id = ? 
           ORDER BY fecha_vencimiento ASC 
           LIMIT 1`,
          [producto.cantidad, producto.cantidad, producto.producto_id]
        );

        // Insertar detalle de venta
        await conn.query(
          "INSERT INTO DetalleVentas (venta_id, producto_id, cantidad) VALUES (?, ?, ?);",
          [ventaId, producto.producto_id, producto.cantidad]
        );
      }

      // 5. Generar recibo
      const recibo = {
        venta_id: ventaId,
        fecha: new Date().toLocaleDateString(),
        total: data.total,
        productos: data.productos
      };

      await conn.commit();
      return recibo;

    } catch (error) {
      await conn.rollback();
      console.error("Error en crearVenta:", error);
      throw error;
    }
  }

  static async buscarVentaPorFecha(fecha) {
    try {
      // Primero obtenemos las ventas de la fecha
      const [ventas] = await conn.query(
        `SELECT v.id, c.nombre AS comprador, v.fecha_venta, v.total
         FROM Ventas v
         JOIN Compradores c ON v.comprador_id = c.id
         WHERE v.fecha_venta = ?
         ORDER BY v.fecha_venta DESC`,
        [fecha]
      );
  
      if (ventas.length === 0) {
        throw new Error("No se encontraron ventas para esta fecha");
      }
  
      // Luego obtenemos los productos para cada venta
      for (const venta of ventas) {
        const [productos] = await conn.query(
          `SELECT p.nombre AS producto, dv.cantidad
           FROM DetalleVentas dv
           JOIN Productos p ON dv.producto_id = p.id
           WHERE dv.venta_id = ?`,
          [venta.id]
        );
        venta.productos = productos;
      }
  
      return ventas;
  
    } catch (error) {
      console.error("Error en buscarVentaPorFecha:", error);
      throw error;
    }
  }

  static async buscarVentaPorComprador(datosComprador) {
    try {
      let ventasQuery;
      let values;
      
      if (typeof datosComprador.comprador === 'number') {
        // Búsqueda por ID
        ventasQuery = `
          SELECT v.id, c.nombre AS comprador, v.fecha_venta, v.total
          FROM Ventas v
          JOIN Compradores c ON v.comprador_id = c.id
          WHERE v.comprador_id = ?
          ORDER BY v.fecha_venta DESC`;
        values = [datosComprador.comprador];
      } else {
        // Búsqueda por nombre
        ventasQuery = `
          SELECT v.id, c.nombre AS comprador, v.fecha_venta, v.total
          FROM Ventas v
          JOIN Compradores c ON v.comprador_id = c.id
          WHERE c.nombre LIKE ?
          ORDER BY v.fecha_venta DESC`;
        values = [`%${datosComprador.comprador}%`];
      }
  
      const [ventas] = await conn.query(ventasQuery, values);
      
      if (ventas.length === 0) {
        throw new Error("No se encontraron ventas para este comprador");
      }
  
      // Obtener productos para cada venta
      for (const venta of ventas) {
        const [productos] = await conn.query(
          `SELECT p.nombre AS producto, dv.cantidad
           FROM DetalleVentas dv
           JOIN Productos p ON dv.producto_id = p.id
           WHERE dv.venta_id = ?`,
          [venta.id]
        );
        venta.productos = productos;
      }
  
      return ventas;
  
    } catch (error) {
      console.error("Error en buscarVentaPorComprador:", error);
      throw error;
    }
  }

  static async ventasMensuales(anio, mes) {
    try {
      const [result] = await conn.query(
        `SELECT 
          DAY(v.fecha_venta) AS dia,
          COUNT(v.id) AS total_ventas,
          SUM(v.total) AS monto_total,
          AVG(v.total) AS promedio_venta
         FROM Ventas v
         WHERE YEAR(v.fecha_venta) = ? AND MONTH(v.fecha_venta) = ?
         GROUP BY DAY(v.fecha_venta)
         ORDER BY dia`,
        [anio, mes]
      );
  
      if (result.length === 0) {
        throw new Error("No hay ventas registradas para el mes especificado");
      }
  
      return result;
    } catch (error) {
      console.error("Error en ventasMensuales:", error);
      throw error;
    }
  }

  static async ventasAnuales(anio) {
    try {
      const [result] = await conn.query(
        `SELECT 
          MONTH(v.fecha_venta) AS mes,
          COUNT(v.id) AS total_ventas,
          SUM(v.total) AS monto_total,
          AVG(v.total) AS promedio_venta
         FROM Ventas v
         WHERE YEAR(v.fecha_venta) = ?
         GROUP BY MONTH(v.fecha_venta)
         ORDER BY mes`,
        [anio]
      );
  
      if (result.length === 0) {
        throw new Error("No hay ventas registradas para el año especificado");
      }
  
      // Convertir números de mes a nombres
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      
      return result.map(item => ({
        ...item,
        nombre_mes: meses[item.mes - 1]
      }));
      
    } catch (error) {
      console.error("Error en ventasAnuales:", error);
      throw error;
    }
  }

  static async mejoresCompradores(limite = 10) {
    try {
      const [result] = await conn.query(
        `SELECT 
          c.id,
          c.nombre,
          COUNT(v.id) AS total_compras,
          SUM(dv.cantidad) AS total_productos,
          SUM(v.total) AS monto_total,
          ROUND(SUM(v.total) / COUNT(v.id), 2) AS promedio_compra
         FROM Compradores c
         JOIN Ventas v ON c.id = v.comprador_id
         JOIN DetalleVentas dv ON v.id = dv.venta_id
         GROUP BY c.id
         ORDER BY total_productos DESC, total_compras DESC
         LIMIT ?`,
        [limite]
      );
  
      if (result.length === 0) {
        throw new Error("No hay datos de compradores disponibles");
      }
  
      return result;
    } catch (error) {
      console.error("Error en mejoresCompradores:", error);
      throw error;
    }
  }

  static async productosMasDemandados(limite = 10) {
    try {
      const [result] = await conn.query(
        `SELECT 
          p.id,
          p.nombre,
          SUM(dv.cantidad) AS total_vendido,
          COUNT(DISTINCT v.id) AS veces_comprado,
          SUM(v.total) AS ingresos_generados
         FROM Productos p
         JOIN DetalleVentas dv ON p.id = dv.producto_id
         JOIN Ventas v ON dv.venta_id = v.id
         GROUP BY p.id
         ORDER BY total_vendido DESC
         LIMIT ?`,
        [limite]
      );
  
      if (result.length === 0) {
        throw new Error("No hay datos de productos vendidos disponibles");
      }
  
      return result;
    } catch (error) {
      console.error("Error en productosMasDemandados:", error);
      throw error;
    }
  }
}