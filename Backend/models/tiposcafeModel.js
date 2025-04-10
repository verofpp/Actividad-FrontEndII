import conn from "../config/database.js"

export class TiposCafeModels {
    static async mostrarTipoCafe() {
        try {
            const queryTiposCafe = "SELECT * FROM TiposCafe;"
            const [result] = await conn.query(queryTiposCafe);

            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarTipoCafe(data) {
        try {
            const queryTiposCafe = "SELECT * FROM TiposCafe WHERE id = ?;"
            const values = [data.id]
            const [result] = await conn.query(queryTiposCafe, values);
            if (result.length === 0) {
                throw new Error("No se encontró el tipo de café")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarNombreTipoCafe(data) {
        try {
            const queryTiposCafe = `SELECT * FROM TiposCafe WHERE nombre LIKE "%${data.nombre}%";`
            const [result] = await conn.query(queryTiposCafe);
            if (result.length === 0) {
                throw new Error("No se encontró el tipo de café")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async crearTipoCafe(data) {
        try {
            const queryTiposCafe = "SELECT nombre FROM TiposCafe WHERE nombre = ?";
            const values = [data.nombre]
            const [result] = await conn.query(queryTiposCafe, values);

            if (result.length > 0) {
                throw new Error("El tipo de café ya existe")
            }
            const queryTipoCafe = "INSERT INTO TiposCafe (nombre) VALUES (?);";
            const value = [data.nombre]
            await conn.query(queryTipoCafe, value);

            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async eliminarTipoCafe(data) {
        try {
            const queryTipoCafe = "SELECT id FROM TiposCafe WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryTipoCafe, values);

            if (result.length === 0) {
                throw new Error("El tipo de café seleccionado no existe")
            }
            const queryDelete = "DELETE FROM TiposCafe WHERE id = ?";
            const valuesDelete = [data.id]
            await conn.query(queryDelete, valuesDelete);
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async editarTipoCafe(data) {
        try {
            const queryTiposCafe = "SELECT id,nombre FROM TiposCafe WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryTiposCafe, values);

            if (result.length === 0) {
                throw new Error("El tipo de café a editar no existe")
            }
            if(result[0].nombre !== data.nombre) {
                const queryTiposCafeN = "SELECT nombre FROM TiposCafe WHERE nombre = ?";
                const valuesN = [data.nombre]
                const [resultN] = await conn.query(queryTiposCafeN, valuesN);
    
                if (resultN.length > 0) {
                    throw new Error("El tipo de café ya existe")
                }
            }
            const queryTipoCafe = "UPDATE TiposCafe SET nombre = ? WHERE id = ?;";
            const value = [data.nombre, data.id]
            await conn.query(queryTipoCafe, value);
            console.log(values)
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

};