import conn from "../config/database.js"

export class CompradoresModels {
    static async mostrarCompradores() {
        try {
            const queryCompradores = "SELECT * FROM Compradores;"
            const [result] = await conn.query(queryCompradores);

            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarCompradores(data) {
        try {
            const queryCompradores = "SELECT * FROM Compradores WHERE id = ?;"
            const values = [data.id]
            const [result] = await conn.query(queryCompradores, values);
            if (result.length === 0) {
                throw new Error("No se encontró el comprador")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarNombreCompradores(data) {
        try {
            const queryCompradores = `SELECT * FROM Compradores WHERE nombre LIKE "%${data.nombre}%";`
            const [result] = await conn.query(queryCompradores);
            if (result.length === 0) {
                throw new Error("No se encontró el comprador")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async crearCompradores(data) {
        try {
            const queryCompradores = "SELECT email FROM Compradores WHERE email = ?";
            const values = [data.email]
            const [result] = await conn.query(queryCompradores, values);

            if (result.length > 0) {
                throw new Error("El comprador ya existe")
            }
            const queryComprador = "INSERT INTO Compradores (nombre, direccion, telefono, email) VALUES ( ?, ?, ?, ?);";
            const value = [data.nombre, data.direccion, data.telefono, data.email]
            await conn.query(queryComprador, value);

            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async eliminarCompradores(data) {
        try {
            const queryCompradores = "SELECT id FROM Compradores WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryCompradores, values);

            if (result.length === 0) {
                throw new Error("El comprador seleccionado no existe")
            }
            const queryDelete = "DELETE FROM Compradores WHERE id = ?";
            const valuesDelete = [data.id]
            await conn.query(queryDelete, valuesDelete);
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async editarCompradores(data) {
        try {
            const queryCompradores = "SELECT id,nombre FROM Compradores WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryCompradores, values);

            if (result.length === 0) {
                throw new Error("El comprador a editar no existe")
            }
            if(result[0].nombre !== data.nombre) {
                const queryCompradoresN = "SELECT nombre FROM Compradores WHERE nombre = ?";
                const valuesN = [data.nombre]
                const [resultN] = await conn.query(queryCompradoresN, valuesN);
    
                if (resultN.length > 0) {
                    throw new Error("El comprador ya existe")
                }
            }
            const queryComprador = "UPDATE Compradores SET nombre = ?, direccion = ?, telefono = ?, email = ? WHERE id = ?;";
            const value = [data.nombre, data.direccion, data.telefono, data.email, data.id]
            await conn.query(queryComprador, value);
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

};