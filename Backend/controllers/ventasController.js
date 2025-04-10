import { VentasModels } from "../models/ventasModel.js";
import { validateVenta, validateFechaBusqueda, validateCompradorBusqueda } from "../schema/ventasSchema.js";

export class VentasController {
  // Método como instancia (no estático)
  crearVenta = async (req, res) => {
    try {
      const result = validateVenta(req.body);
      if (!result.success) {
        throw new Error(result.error.message);
      }

      const recibo = await VentasModels.crearVenta(result.data);
      return res.status(200).json({
        success: true,
        message: "Venta registrada y recibo generado",
        data: recibo,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  buscarVentaPorFecha = async (req, res) => {
    try {
      const result = validateFechaBusqueda({ fecha: req.params.fecha });
      if (!result.success) {
        throw new Error(result.error.message);
      }
  
      const ventas = await VentasModels.buscarVentaPorFecha(result.data.fecha);
      return res.status(200).json({
        success: true,
        data: ventas
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

   buscarVentaPorComprador = async (req, res) => {
    try {
      // Determinar si el parámetro es ID o nombre
      const compradorParam = req.params.comprador;
      const compradorData = isNaN(compradorParam) 
        ? { comprador: compradorParam } 
        : { comprador: parseInt(compradorParam) };
  
      const result = validateCompradorBusqueda(compradorData);
      if (!result.success) {
        throw new Error(result.error.message);
      }
  
      const ventas = await VentasModels.buscarVentaPorComprador(result.data);
      return res.status(200).json({
        success: true,
        data: ventas
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

   ventasMensuales = async (req, res) => {
    try {
      const { anio, mes } = req.params;
      
      if (!anio || !mes || isNaN(anio) || isNaN(mes)) {
        throw new Error("Debe proporcionar un año y mes válidos");
      }
  
      const reporte = await VentasModels.ventasMensuales(parseInt(anio), parseInt(mes));
      
      return res.status(200).json({
        success: true,
        data: reporte
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  ventasAnuales = async (req, res) => {
    try {
      const { anio } = req.params;
      
      if (!anio || isNaN(anio)) {
        throw new Error("Debe proporcionar un año válido");
      }
  
      const reporte = await VentasModels.ventasAnuales(parseInt(anio));
      
      return res.status(200).json({
        success: true,
        data: reporte
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  mejoresCompradores = async (req, res) => {
    try {
      const limite = parseInt(req.query.limite) || 10;
      const compradores = await VentasModels.mejoresCompradores(limite);
      
      return res.status(200).json({
        success: true,
        data: compradores
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  productosMasDemandados = async (req, res) => {
    try {
      const limite = parseInt(req.query.limite) || 10;
      const productos = await VentasModels.productosMasDemandados(limite);
      
      return res.status(200).json({
        success: true,
        data: productos
      });
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}