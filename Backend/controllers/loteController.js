import { LoteModels } from "../models/lotesModel.js";
import {
  validateIdLote,
  validateLote,
  validateFechaLote,
  validateTypeLote,
  validateIdLoteFinca,
  validateStatusLote,
  validateEstado
} from "../schema/lotesSchema.js";

export class LoteController {
  mostrarLote = async (req, res) => {
    try {
      const result = await LoteModels.mostrarLote();
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener los Lotes",
      });
    }
  };

  buscarLote = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resultId = validateIdLote({ id });
      if (!resultId.success) {
        throw new Error(resultId.error.message);
      }

      const result = await LoteModels.buscarLote(resultId.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  buscarLoteFinca = async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resultId = validateIdLoteFinca({ finca_id: id });
      if (!resultId.success) {
        throw new Error(resultId.error.message);
      }

      const result = await LoteModels.buscarLoteFinca(resultId.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  buscarLoteFecha = async (req, res) => {
    try {
      const resultFecha = validateFechaLote({ fecha_cosecha: req.params.fecha });
      if (!resultFecha.success) {
        throw new Error(resultFecha.error.message);
      }
  
      const result = await LoteModels.buscarLoteFecha(resultFecha.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  buscarLoteTipo = async (req, res) => {
    try {
      const tipo = parseInt(req.params.tipo);
      const resultId = validateTypeLote({ tipo_cafe_id: tipo });
      if (!resultId.success) {
        throw new Error(resultId.error.message);
      }

      const result = await LoteModels.buscarLoteTipo(resultId.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  buscarLoteTipoListo = async (req, res) => {
    try {
      const tipo = parseInt(req.params.tipo);
      const resultId = validateTypeLote({ tipo_cafe_id: tipo });
      if (!resultId.success) {
        throw new Error(resultId.error.message);
      }

      const result = await LoteModels.buscarLoteTipoListo(resultId.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  buscarLoteTipoAll = async (req, res) => {
    try {
      const tipo = parseInt(req.params.tipo);
      const resultId = validateTypeLote({ tipo_cafe_id: tipo });
      if (!resultId.success) {
        throw new Error(resultId.error.message);
      }

      const result = await LoteModels.buscarLoteTipoAll(resultId.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  buscarLoteEstado = async (req, res) => {
    try {
      const estado = req.params.estado;
      const resultStatus = validateStatusLote({ estado });
      if (!resultStatus.success) {
        throw new Error(resultStatus.error.message);
      }

      const result = await LoteModels.buscarLoteEstado(resultStatus.data);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al obtener el lote",
      });
    }
  };

  crearLote = async (req, res) => {
    try {
      const data = new Date(req.body.fecha_cosecha);
      const result = validateLote({ ...req.body, fecha_cosecha: data });
      if (!result.success) {
        throw new Error(result.error.message);
      }

      const isInsert = await LoteModels.crearLote(result.data);
      if (!isInsert) {
        throw new Error("Ha ocurrido un error al crear el Lote");
      }
      return res.status(200).json({
        success: true,
        message: "Se ha creado con éxito",
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  editarLote = async (req, res) => {
    try {
      const data = new Date(req.body.fecha_cosecha);
      const result = validateLote({
        id: parseInt(req.params.id),
        ...req.body,
        fecha_cosecha: data,
      });
      if (!result.success) {
        throw new Error(result.error.message);
      }

      const isEdit = await LoteModels.editarLote(result.data);
      if (!isEdit) {
        throw new Error("Ha ocurrido un error al editar el Lote");
      }
      return res.status(200).json({
        success: true,
        message: `Se ha editado el lote con id ${result.data.id} con éxito`,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  eliminarLote = async (req, res) => {
    try {
      const result = validateIdLote(req.body);
      if (!result.success) {
        throw new Error(result.error.message);
      }

      const isDelete = await LoteModels.eliminarLote(result.data);
      if (!isDelete) {
        throw new Error("Ha ocurrido un error al eliminar el lote.");
      }
      return res.status(200).json({
        success: true,
        message: `Se ha eliminado el lote con id ${result.data.id} con éxito`,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  cambiarEstadoLote = async (req, res) => {
    try {
      const result = validateEstado( req.body );
      if (!result.success) {
        throw new Error(result.error.message);
      }

      const isInsert = await LoteModels.cambiarEstadoLote(result.data);
      if (!isInsert) {
        throw new Error("Ha ocurrido un error al actualizar el estado");
      }
      return res.status(200).json({
        success: true,
        message: "Se ha creado con éxito",
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
