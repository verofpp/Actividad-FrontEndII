import { FincaModels } from "../models/fincasModel.js"
import { validateEncargado, validateFinca, validateIdFinca, validateNombre } from "../schema/fincaSchema.js"

export class FincaController {
    mostrarFinca = async (req, res) => {
        try {
            const result = await FincaModels.mostrarFinca()
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener Fincas"
            }
            )
        }
    }

    buscarFinca = async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const resultId = validateIdFinca({ id });
            if (!resultId.success) {
                throw new Error(resultId.error.message);
            }

            const result = await FincaModels.buscarFinca(resultId.data)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener Fincas"
            }
            )
        }
    }

    buscarNombreFinca = async (req, res) => {
        try {
            const nombre = req.params.nombre
            const resultNombre = validateNombre({nombre});
            if (!resultNombre.success) {
                throw new Error(resultNombre.error.message);
            }

            const result = await FincaModels.buscarNombreFinca(resultNombre.data)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener Fincas"
            }
            )
        }
    }

    mostrarEncargadoFinca = async (req, res) => {
        try {
            const result = await FincaModels.mostrarEncargadoFinca()
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener Fincas"
            }
            )
        }
    }

    buscarEncargadoFinca = async (req, res) => {
        try {
            const encargado = req.params.encargado
            const resultEncargado = validateEncargado({encargado});
            if (!resultEncargado.success) {
                throw new Error(resultEncargado.error.message);
            }

            const result = await FincaModels.buscarEncargadoFinca(resultEncargado.data)
            return res.status(200).json({
                success: true,
                data: result,

            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: "Ha ocurrido un error al obtener Fincas"
            }
            )
        }
    }

    crearFinca = async (req, res) => {
        try {
            const result = validateFinca(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isInsert = await FincaModels.crearFinca(result.data)
            if (!isInsert) {
                throw new Error("Ha ocurrido un error al crear Fincas");
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

    eliminarFinca = async (req, res) => {
        try {
            const result = validateIdFinca(req.body);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isDelete = await FincaModels.eliminarFinca(result.data)
            if (!isDelete) {
                throw new Error("Ha ocurrido un error al eliminar Finca");
            }
            return res.status(200).json({
                success: true,
                message: `Se ha eliminado la finca con id ${result.data.id} con éxito`,
            })
        } catch (error) {
            console.error(error)
            return res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }

    editarFinca = async (req, res) => {
        try {
            const data = { id: parseInt(req.params.id), ...req.body }
            const result = validateFinca(data);
            if (!result.success) {
                throw new Error(result.error.message);
            }

            const isModified = await FincaModels.editarFinca(result.data)
            if (!isModified) {
                throw new Error("Ha ocurrido un error al editar Finca");
            }
            return res.status(200).json({
                success: true,
                message: `Se ha editado la finca con id ${result.data.id} con éxito`,
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