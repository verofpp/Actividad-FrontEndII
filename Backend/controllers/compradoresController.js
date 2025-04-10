import { CompradoresModels } from "../models/compradoresModel.js"
import { validateCompradores, validateIdCompradores, validateNombre } from "../schema/compradoresSchema.js"

export class CompradoresController {
    mostrarCompradores = async (req, res) => {
        try {
            const result = await CompradoresModels.mostrarCompradores()
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

    buscarCompradores = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const resultId = validateIdCompradores({ id });
            if (!resultId.success) {
                throw new Error(resultId.error.message);
            }

            const result = await CompradoresModels.buscarCompradores(resultId.data)
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

    buscarNombreCompradores = async (req, res) => {
        try {
            const nombre = req.params.nombre
            const resultNombre = validateNombre({nombre});
            if (!resultNombre.success) {
                throw new Error(resultNombre.error.message);
            }

            const result = await CompradoresModels.buscarNombreCompradores(resultNombre.data)
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

    crearCompradores = async (req, res) => {
        try {
            const result = validateCompradores(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isInsert = await CompradoresModels.crearCompradores(result.data)
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

    eliminarCompradores = async (req, res) => {
        try {
            const result = validateIdCompradores(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isDelete = await CompradoresModels.eliminarCompradores(result.data)
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

    editarCompradores = async (req, res) => {
        try {
            const data = { id: parseInt(req.params.id), ...req.body }
            const result = validateCompradores(data);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isModified = await CompradoresModels.editarCompradores(result.data)
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