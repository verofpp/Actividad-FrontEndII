import { TiposCafeModels } from "../models/tiposcafeModel.js"
import { validateTipoCafe, validateIdTipoCafe, validateNombre } from "../schema/tipocafeSchema.js"

export class TiposCafeController {
    mostrarTipoCafe = async (req, res) => {
        try {
            const result = await TiposCafeModels.mostrarTipoCafe()
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

    buscarTipoCafe = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const resultId = validateIdTipoCafe({ id });
            if (!resultId.success) {
                throw new Error(resultId.error.message);
            }

            const result = await TiposCafeModels.buscarTipoCafe(resultId.data)
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

    buscarNombreTipoCafe = async (req, res) => {
        try {
            const nombre = req.params.nombre
            const resultNombre = validateNombre({nombre});
            if (!resultNombre.success) {
                throw new Error(resultNombre.error.message);
            }

            const result = await TiposCafeModels.buscarNombreTipoCafe(resultNombre.data)
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

    crearTipoCafe = async (req, res) => {
        try {
            const result = validateTipoCafe(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isInsert = await TiposCafeModels.crearTipoCafe(result.data)
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

    eliminarTipoCafe = async (req, res) => {
        try {
            const result = validateIdTipoCafe(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isDelete = await TiposCafeModels.eliminarTipoCafe(result.data)
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

    editarTipoCafe = async (req, res) => {
        try {
            const data = { id: parseInt(req.params.id), ...req.body }
            const result = validateTipoCafe(data);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isModified = await TiposCafeModels.editarTipoCafe(result.data)
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