import axiosInstance from "../utils/axiosConfig";

const ventasApi = import.meta.env.VITE_API_VENTAS;
const ventasFechaApi = import.meta.env.VITE_API_VENTAS_FECHA;
const ventasCompradorApi = import.meta.env.VITE_API_VENTAS_COMPRADOR;
const ventasMensualApi = import.meta.env.VITE_API_VENTAS_MENSUAL;
const ventasAnualApi = import.meta.env.VITE_API_VENTAS_ANUAL;
const mejoresCompradoresApi = import.meta.env.VITE_API_MEJORES_COMPRADORES;
const productosDemandadosApi = import.meta.env.VITE_API_PRODUCTOS_DEMANDADOS;

export const crearVenta = async (data) => {
  try {
    const response = await axiosInstance.post(ventasApi, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarVentaPorFecha = async (fecha) => {
  try {
    const response = await axiosInstance.get(`${ventasFechaApi}/${fecha}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarVentaPorComprador = async (comprador) => {
  try {
    const response = await axiosInstance.get(`${ventasCompradorApi}/${comprador}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const ventasMensuales = async (anio, mes) => {
  try {
    const response = await axiosInstance.get(`${ventasMensualApi}/${anio}/${mes}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const ventasAnuales = async (anio) => {
  try {
    const response = await axiosInstance.get(`${ventasAnualApi}/${anio}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const obtenerMejoresCompradores = async (limite = 10) => {
  try {
    const response = await axiosInstance.get(`${mejoresCompradoresApi}?limite=${limite}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const obtenerProductosMasDemandados = async (limite = 10) => {
  try {
    const response = await axiosInstance.get(`${productosDemandadosApi}?limite=${limite}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};