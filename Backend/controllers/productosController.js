import { ProductosModels } from "../models/productosModel.js"
import { validateProductos, validateIdProductos, validateNombre } from "../schema/productosSchema.js"

export class ProductosController {
    mostrarProductos = async (req, res) => {
        try {
            const result = await ProductosModels.mostrarProducto()
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener tipos de café"
            }
            )
        }
    }

    buscarProductos = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const resultId = validateIdProductos({ id });
            if (!resultId.success) {
                throw new Error(resultId.error.message);
            }

            const result = await ProductosModels.buscarProducto(resultId.data)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener tipo de café"
            }
            )
        }
    }

    buscarNombreProductos = async (req, res) => {
        try {
            const nombre = req.params.nombre
            const resultNombre = validateNombre({nombre});
            if (!resultNombre.success) {
                throw new Error(resultNombre.error.message);
            }

            const result = await ProductosModels.buscarNombreProducto(resultNombre.data)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener tipo de café"
            }
            )
        }
    }

    buscarPorTipoCafe = async (req, res) => {
        try {
            const tipo_cafe_id = parseInt(req.params.tipo_cafe_id);
            
            if (isNaN(tipo_cafe_id)) {
                throw new Error("El ID del tipo de café debe ser un número válido");
            }
    
            const result = await ProductosModels.buscarPorTipoCafe({ tipo_cafe_id });
            return res.status(200).json({
                success: true,
                data: result,
            });
    
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
      

    crearProductos = async (req, res) => {
        try {
            const result = validateProductos(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isInsert = await ProductosModels.crearProducto(result.data)
            if (!isInsert) {
                throw new Error("Ha ocurrido un error al crear tipo de café");
            }
            return res.status(200).json({
                success: true,
                message: "Se ha creado con éxito",
            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: error.message
            }
            )
        }
    }

    eliminarProductos = async (req, res) => {
        try {
            const result = validateIdProductos(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isDelete = await ProductosModels.eliminarProducto(result.data)
            if (!isDelete) {
                throw new Error("Ha ocurrido un error al eliminar tipo de café");
            }
            return res.status(200).json({
                success: true,
                message: `Se ha eliminado el tipo de café con id ${result.data.id} con éxito`,
            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    editarProductos = async (req, res) => {
        try {
            const data = { id: parseInt(req.params.id), ...req.body }
            const result = validateProductos(data);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isModified = await ProductosModels.editarProducto(result.data)
            if (!isModified) {
                throw new Error("Ha ocurrido un error al editar el tipo de café");
            }
            return res.status(200).json({
                success: true,
                message: `Se ha editado el tipo de café con id ${result.data.id} con éxito`,
            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}