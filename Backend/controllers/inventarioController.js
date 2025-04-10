import { InventarioModels } from "../models/inventarioModel.js"
import { validateInventario, validateIdInventario } from "../schema/inventarioSchema.js"

export class InventarioController {
    mostrarInventario = async (req, res) => {
        try {
            const id = req.params.id
            const result = await InventarioModels.mostrarInventario(id)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener el inventario"
            }
            )
        }
    }

    crearInventario = async (req, res) => {
        try {
            const result = validateInventario(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isInsert = await InventarioModels.crearInventario(result.data)
            if (!isInsert.success) {
                throw new Error("Ha ocurrido un error al crear el inventario");
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
}