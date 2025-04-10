import conn from "../config/database.js";

export class ProductosModels {
    static async mostrarProducto() {
        try {
            const queryProductos = "SELECT p.id, p.nombre, p.presentacion, t.nombre AS tipo_cafe_id, p.precio FROM Productos AS p INNER JOIN TiposCafe AS t ON p.tipo_cafe_id = t.id ORDER BY p.id ASC ;"
            const [result] = await conn.query(queryProductos);

            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarProducto(data) {
        try {
            const queryProductos = `
                SELECT p.id, p.nombre, p.presentacion, t.nombre AS tipo_cafe_id, p.precio 
                FROM Productos AS p 
                INNER JOIN TiposCafe AS t ON p.tipo_cafe_id = t.id 
                WHERE p.id = ?;
            `;
            const values = [data.id]
            const [result] = await conn.query(queryProductos, values);
            if (result.length === 0) {
                throw new Error("No se encontró el producto")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarNombreProducto(data) {
        try {
            const queryProductos = `
                SELECT p.id, p.nombre, p.presentacion, t.nombre AS tipo_cafe_id, p.precio 
                FROM Productos AS p 
                INNER JOIN TiposCafe AS t ON p.tipo_cafe_id = t.id 
                WHERE p.nombre LIKE "%${data.nombre}%";
            `;
            const [result] = await conn.query(queryProductos);
            if (result.length === 0) {
                throw new Error("No se encontró el producto")
            }
            return result;

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async buscarPorTipoCafe(data) {
        try {
            const query = `
                SELECT p.id, p.nombre, p.presentacion, t.nombre AS tipo_cafe, p.precio 
                FROM Productos AS p 
                INNER JOIN TiposCafe AS t ON p.tipo_cafe_id = t.id 
                WHERE p.tipo_cafe_id = ? 
                ORDER BY p.id ASC;
            `;
            const values = [data.tipo_cafe_id];
            const [result] = await conn.query(query, values);
    
            if (result.length === 0) {
                throw new Error("No se encontraron productos con este tipo de café");
            }
    
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }    

    static async crearProducto(data) {
        try {
            const queryProductos = "SELECT nombre FROM Productos WHERE nombre = ?";
            const values = [data.nombre]
            const [result] = await conn.query(queryProductos, values);

            if (result.length > 0) {
                throw new Error("El producto ya existe")
            }
            const queryProducto = "INSERT INTO Productos (nombre, presentacion, tipo_cafe_id, precio) VALUES ( ?, ?, ?, ?);";
            const value = [data.nombre, data.presentacion, data.tipo_cafe_id, data.precio]
            await conn.query(queryProducto, value);

            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async eliminarProducto(data) {
        try {
            const queryProducto = "SELECT id FROM Productos WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryProducto, values);

            if (result.length === 0) {
                throw new Error("El producto seleccionado no existe")
            }
            const queryDelete = "DELETE FROM Productos WHERE id = ?";
            const valuesDelete = [data.id]
            await conn.query(queryDelete, valuesDelete);
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };

    static async editarProducto(data) {
        try {
            const queryProductos = "SELECT id,nombre FROM Productos WHERE id = ?";
            const values = [data.id]
            const [result] = await conn.query(queryProductos, values);

            if (result.length === 0) {
                throw new Error("El producto a editar no existe")
            }
            if(result[0].nombre !== data.nombre) {
                const queryProductosN = "SELECT nombre FROM Productos WHERE nombre = ?";
                const valuesN = [data.nombre]
                const [resultN] = await conn.query(queryProductosN, valuesN);
    
                if (resultN.length > 0) {
                    throw new Error("El producto ya existe")
                }
            }
            const queryProducto = "UPDATE Productos SET nombre = ?, presentacion = ?, tipo_cafe_id = ?, precio = ? WHERE id = ?;";
            const value = [data.nombre, data.presentacion, data.tipo_cafe_id, data.precio, data.id]
            await conn.query(queryProducto, value);
            console.log(values)
            return true

        } catch (error) {
            console.error(error)
            throw error;
        }
    };
};