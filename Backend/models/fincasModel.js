import conn from "../config/database.js"

export class FincaModels {
    static async mostrarFinca() {
        try {
            const queryFinca = "SELECT * FROM Fincas;"
            const [result] = await conn.query(queryFinca);

            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarFinca(data) {
        try {
            const queryFinca = "SELECT * FROM Fincas WHERE id = ?;"
            const values = [data.id]
            const [result] = await conn.query(queryFinca, values);
            if (result.length === 0) {
                throw new Error("No se encontró la finca")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarNombreFinca(data) {
        try {
            const queryFinca = `SELECT * FROM Fincas WHERE nombre LIKE "%${data.nombre}%";`
            const [result] = await conn.query(queryFinca);
            if (result.length === 0) {
                throw new Error("No se encontró la finca")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async mostrarEncargadoFinca() {
        try {
            const queryFinca = "SELECT DISTINCT encargado, teléfono FROM Fincas;"
            const [result] = await conn.query(queryFinca);

            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };    

    static async buscarEncargadoFinca(data) {
        try {
            const queryFinca = `SELECT * FROM Fincas WHERE encargado LIKE "%${data.encargado}%";`
            const [result] = await conn.query(queryFinca);
            if (result.length === 0) {
                throw new Error("No se encontró la finca")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async crearFinca(data) {
        try {
            const queryFincaS = "SELECT nombre FROM Fincas WHERE nombre = ?";
            const valuesS = [data.nombre]
            const [result] = await conn.query(queryFincaS, valuesS);

            if (result.length > 0) {
                throw new Error("La finca ya existe")
            }
            const queryFinca = "INSERT INTO Fincas (nombre, dirección, encargado, teléfono) VALUES ( ?, ?, ?, ?);";
            const values = [data.nombre, data.direccion, data.encargado, data.telefono]
            await conn.query(queryFinca, values);

            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async eliminarFinca(data) {
        try {
            const queryFinca = "SELECT id FROM Fincas WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryFinca, values);

            if (result.length === 0) {
                throw new Error("La finca seleccionada no existe")
            }
            const queryDelete = "DELETE FROM Fincas WHERE id = ?";
            const valuesDelete = [data.id]
            await conn.query(queryDelete, valuesDelete);
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async editarFinca(data) {
        try {
            const queryFincaS = "SELECT id,nombre FROM Fincas WHERE id = ?";
            const valuesS = [data.id]
            const [result] = await conn.query(queryFincaS, valuesS);

            if (result.length === 0) {
                throw new Error("La finca a editar no existe")
            }
            if(result[0].nombre !== data.nombre) {
                const queryFincaN = "SELECT nombre FROM Fincas WHERE nombre = ?";
                const valuesN = [data.nombre]
                const [resultN] = await conn.query(queryFincaN, valuesN);
    
                if (resultN.length > 0) {
                    throw new Error("La finca ya existe")
                }
            }
            const queryFinca = "UPDATE Fincas SET nombre = ?, dirección = ?, encargado = ?, teléfono = ? WHERE id = ?;";
            const values = [data.nombre, data.direccion, data.encargado, data.telefono, data.id]
            await conn.query(queryFinca, values);

            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

};