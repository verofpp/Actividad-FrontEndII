import conn from "../config/database.js";

export class LoteModels {
  static async mostrarLote() {
    try {
      const queryLotes =
        "SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido FROM Lotes AS l INNER JOIN Fincas AS f ON l.finca_id = f.id INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id ORDER BY l.id ASC;";
      const [result] = await conn.query(queryLotes);
      const data = [...result].map((item) => {
        const fecha = new Date(item.fecha_cosecha);
        return { ...item, fecha_cosecha: fecha.toLocaleDateString() };
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLote(data) {
    try {
      const queryLotes = `
        SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
               t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
        FROM Lotes AS l 
        INNER JOIN Fincas AS f ON l.finca_id = f.id 
        INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
        WHERE l.id = ?;`;
      const values = [data.id];
      const [result] = await conn.query(queryLotes, values);
      if (result.length === 0) {
        throw new Error("No se encontró el lote.");
      }
      return result[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteFinca(data) {
    try {
      // Si viene con ID, busca por ID, si viene con nombre, busca por nombre
      if (data.finca_id) {
        const queryLotes = `
          SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
                 t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
          FROM Lotes AS l 
          INNER JOIN Fincas AS f ON l.finca_id = f.id 
          INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
          WHERE l.finca_id = ?;`;
        const values = [data.finca_id];
        const [result] = await conn.query(queryLotes, values);
        if (result.length === 0) {
          throw new Error("No se encontró el lote.");
        }
        return result;
      } else if (data.nombreFinca) {
        return await this.buscarLotePorNombreFinca(data);
      } else {
        throw new Error("Debe proporcionar ID o nombre de la finca.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteFecha(data) {
    try {
      const queryLotes = `
        SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
               t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
        FROM Lotes AS l 
        INNER JOIN Fincas AS f ON l.finca_id = f.id 
        INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
        WHERE DATE(l.fecha_cosecha) = ?;`;
      const values = [data.fecha_cosecha];
      const [result] = await conn.query(queryLotes, values);
      if (result.length === 0) {
        throw new Error("No se encontraron lotes para esta fecha.");
      }
      
      // Formatear fechas para la respuesta
      const formattedResult = result.map(item => ({
        ...item,
        fecha_cosecha: new Date(item.fecha_cosecha).toISOString().split('T')[0]
      }));
      
      return formattedResult;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteTipo(data) {
    try {
      // Si viene con ID, busca por ID, si viene con nombre, busca por nombre
      if (data.tipo_cafe_id) {
        const queryLotes = `
          SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
                 t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
          FROM Lotes AS l 
          INNER JOIN Fincas AS f ON l.finca_id = f.id 
          INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
          WHERE l.tipo_cafe_id = ?;`;
        const values = [data.tipo_cafe_id];
        const [result] = await conn.query(queryLotes, values);
        if (result.length === 0) {
          throw new Error("No se encontró el lote.");
        }
        return result;
      } else if (data.nombreTipoCafe) {
        return await this.buscarLotePorNombreTipoCafe(data);
      } else {
        throw new Error("Debe proporcionar ID o nombre del tipo de café.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteTipoListo(data) {
    try {
      // Si viene con ID, busca por ID, si viene con nombre, busca por nombre
      if (data.tipo_cafe_id) {
        const queryLotes = `
          SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, l.kilos_restante, 
                 t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
          FROM Lotes AS l 
          INNER JOIN Fincas AS f ON l.finca_id = f.id 
          INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
          WHERE l.tipo_cafe_id = ? AND estado = "Listo";`;
        const values = [data.tipo_cafe_id];
        const [result] = await conn.query(queryLotes, values);
        if (result.length === 0) {
          throw new Error("No se encontró el lote.");
        }
        return result;
      } else if (data.nombreTipoCafe) {
        return await this.buscarLotePorNombreTipoCafe(data);
      } else {
        throw new Error("Debe proporcionar ID o nombre del tipo de café.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteTipoAll(data) {
    try {
      // Si viene con ID, busca por ID, si viene con nombre, busca por nombre
      if (data.tipo_cafe_id) {
        const queryLotes = `SELECT 
    l.id, 
    f.nombre AS finca_id, 
    l.fecha_cosecha, 
    l.cantidad_kilos, 
    l.kilos_restante, 
    t.nombre AS tipo_cafe_id, 
    l.estado, 
    l.porcentaje_perdido 
FROM Lotes AS l 
INNER JOIN Fincas AS f ON l.finca_id = f.id 
INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
WHERE l.tipo_cafe_id = ? AND l.estado IN ('Listo', 'Agotado')`;
        const values = [data.tipo_cafe_id];
        const [result] = await conn.query(queryLotes, values);
        console.log(result)
        if (result.length === 0) {
          throw new Error("No se encontró el lote.");
        }
        return result;
      } else if (data.nombreTipoCafe) {
        return await this.buscarLotePorNombreTipoCafe(data);
      } else {
        throw new Error("Debe proporcionar ID o nombre del tipo de café.");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLoteEstado(data) {
    try {
      const queryLotes = `
        SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
               t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
        FROM Lotes AS l 
        INNER JOIN Fincas AS f ON l.finca_id = f.id 
        INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
        WHERE l.estado = ?;`;
      const values = [data.estado];
      const [result] = await conn.query(queryLotes, values);
      if (result.length === 0) {
        throw new Error("No se encontró el lote.");
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLotePorNombreFinca(data) {
    try {
      const queryLotes = `
        SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, 
               t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
        FROM Lotes AS l 
        INNER JOIN Fincas AS f ON l.finca_id = f.id 
        INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
        WHERE f.nombre LIKE ?;`;
      const values = [`%${data.nombreFinca}%`];
      const [result] = await conn.query(queryLotes, values);
      if (result.length === 0) {
        throw new Error("No se encontraron lotes para esta finca.");
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async buscarLotePorNombreTipoCafe(data) {
    try {
      const queryLotes = `
        SELECT l.id, f.nombre AS finca_id, l.fecha_cosecha, l.cantidad_kilos, l.kilos_restante, 
               t.nombre AS tipo_cafe_id, l.estado, l.porcentaje_perdido 
        FROM Lotes AS l 
        INNER JOIN Fincas AS f ON l.finca_id = f.id 
        INNER JOIN TiposCafe AS t ON l.tipo_cafe_id = t.id 
        WHERE t.nombre LIKE ?;`;
      const values = [`%${data.nombreTipoCafe}%`];
      const [result] = await conn.query(queryLotes, values);
      if (result.length === 0) {
        throw new Error("No se encontraron lotes para este tipo de café.");
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async crearLote(data) {
    try {
      const queryFinca = "SELECT id FROM Fincas WHERE id = ?;";
      const valuesFinca = [data.finca_id];
      const [resultFinca] = await conn.query(queryFinca, valuesFinca);

      if (resultFinca.length === 0) {
        throw new Error("No se encontró la finca");
      }

      const queryCafe = "SELECT id FROM TiposCafe WHERE id = ?;";
      const valuesCafe = [data.tipo_cafe_id];
      const [resultCafe] = await conn.query(queryCafe, valuesCafe);

      if (resultCafe.length === 0) {
        throw new Error("No se encontró el tipo de café.");
      }
      const fechaCorrecta = new Date(data.fecha_cosecha)
        .toISOString()
        .split("T")[0];

      const queryLote =
        "INSERT INTO Lotes (finca_id, fecha_cosecha, cantidad_kilos, kilos_restante, tipo_cafe_id) VALUES ( ?, ?, ?, ?, ?);";
      const values = [
        data.finca_id,
        fechaCorrecta,
        data.cantidad_kilos,
        data.cantidad_kilos,
        data.tipo_cafe_id,
      ];
      await conn.query(queryLote, values);

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async editarLote(data) {
    try {
      const queryLoteS = "SELECT * FROM Lotes WHERE id = ?";
      const valuesLotesS = [data.id];
      const [result] = await conn.query(queryLoteS, valuesLotesS);

      if (result.length === 0) {
        throw new Error("El lote a editar no existe");
      }

      if (data.finca_id !== result[0].finca_id) {
        const queryFinca = "SELECT id FROM Fincas WHERE id = ?;";
        const valuesFinca = [data.finca_id];
        const [resultFinca] = await conn.query(queryFinca, valuesFinca);

        if (resultFinca.length === 0) {
          throw new Error("No se encontró la finca");
        }
      }

      if (data.tipo_cafe_id !== result[0].tipo_cafe_id) {
        const queryCafe = "SELECT id FROM TiposCafe WHERE id = ?;";
        const valuesCafe = [data.tipo_cafe_id];
        const [resultCafe] = await conn.query(queryCafe, valuesCafe);

        if (resultCafe.length === 0) {
          throw new Error("No se encontró el tipo de café.");
        }
      }

      const fechaCorrecta = new Date(data.fecha_cosecha)
        .toISOString()
        .split("T")[0];

      const queryFinca =
        "UPDATE Lotes SET finca_id = ?, fecha_cosecha = ?, cantidad_kilos = ?, tipo_cafe_id = ?, estado = ?, porcentaje_perdido = ? WHERE id = ?;";
      const values = [
        data.finca_id,
        fechaCorrecta,
        data.cantidad_kilos,
        data.tipo_cafe_id,
        data.estado ?? result[0].estado,
        data.porcentaje_perdido ?? result[0].porcentaje_perdido,
        data.id,
      ];
      await conn.query(queryFinca, values);

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async eliminarLote(data) {
    try {
      const queryLote = "SELECT id FROM Lotes WHERE id = ?";
      const values = [data.id];
      const [result] = await conn.query(queryLote, values);

      if (result.length === 0) {
        throw new Error("El lote seleccionado no existe.");
      }
      const queryDelete = "DELETE FROM Lotes WHERE id = ?";
      const valuesDelete = [data.id];
      await conn.query(queryDelete, valuesDelete);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async cambiarEstadoLote(data) {
    // Orden de estados (secuencia fija)
    const estadosValidos = [
      "Cosechado",
      "Procesado",
      "Secado",
      "Tostado",
      "Molido",
      "Listo",
    ];
    await conn.beginTransaction();

    try {
      const [lote] = await conn.query(
        "SELECT estado FROM Lotes WHERE id = ? FOR UPDATE;",
        [data.lote_id]
      );

      if (!lote || lote.length === 0) {
        throw new Error("Lote no encontrado");
      }

      const estadoActual = lote[0].estado;
      const indiceActual = estadosValidos.indexOf(estadoActual);

      if (indiceActual === -1) {
        throw new Error("Estado actual no reconocido");
      }

      if (indiceActual === estadosValidos.length - 1) {
        throw new Error("El lote ya está en el estado final (listo)");
      }

      const siguienteEstado = estadosValidos[indiceActual + 1];

      await conn.query(
        "INSERT INTO CambioEstados (estado, lote_id) VALUES (?, ?);",
        [siguienteEstado, data.lote_id]
      );

      await conn.query("UPDATE Lotes SET estado = ? WHERE id = ?;", [
        siguienteEstado,
        data.lote_id,
      ]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      console.error("Error en avanzarEstadoLote:", error.message);
      throw error;
    }
  }
}
