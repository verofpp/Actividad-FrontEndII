import axiosInstance from "../utils/axiosConfig";

const lotesApi = import.meta.env.VITE_API_LOTE;
const lotesTApi = import.meta.env.VITE_API_LOTE_TIPO;
const lotesFApi = import.meta.env.VITE_API_LOTE_FINCA;
const lotesFeApi = import.meta.env.VITE_API_LOTE_FECHA;
const lotesEApi = import.meta.env.VITE_API_LOTE_ESTADO;
const lotesCApi = import.meta.env.VITE_API_LOTE_CAMBIARESTADO;
const lotesLApi = import.meta.env.VITE_API_LOTE_TIPOLISTO;
const lotesALApi = import.meta.env.VITE_API_LOTE_TIPOALL;

export const mostrarLote = async () => {
  try {
    const response = await axiosInstance.get(lotesApi);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarLote = async (data) => {
  try {
    const d = {
      finca_id: parseInt(data.finca_id),
      cantidad_kilos: parseInt(data.cantidad_kilos),
      tipo_cafe_id: parseInt(data.tipo_cafe_id),
      fecha_cosecha: data.fecha_cosecha
    };
    const response = await axiosInstance.put(`${lotesApi}/${data.id}`, d);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearLote = async (data) => {
  try {
    const fechaCosecha = data.fecha_cosecha instanceof Date 
      ? data.fecha_cosecha.toISOString().split('T')[0]
      : data.fecha_cosecha;

    const d = {
      finca_id: parseInt(data.finca_id),
      cantidad_kilos: parseInt(data.cantidad_kilos),
      tipo_cafe_id: parseInt(data.tipo_cafe_id),
      fecha_cosecha: fechaCosecha
    };
    
    const response = await axiosInstance.post(lotesApi, d);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw typeof error.response.data === 'string' 
        ? { message: error.response.data } 
        : error.response.data;
    }
    throw { message: error.message };
  }
};

export const cambiarEstado = async (data) => {
  try {
    const d = {lote_id: parseInt(data)}
    const response = await axiosInstance.post(lotesCApi, d);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw typeof error.response.data === 'string' 
        ? { message: error.response.data } 
        : error.response.data;
    }
    throw { message: error.message };
  }
};

export const eliminarLote = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(lotesApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarLotes = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${lotesApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "tipo") {
      const response = await axiosInstance.get(`${lotesTApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "finca") {
      const response = await axiosInstance.get(`${lotesFApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "fecha_cosecha") {
      const response = await axiosInstance.get(`${lotesFeApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "estado") {
      const response = await axiosInstance.get(`${lotesEApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "tipolisto") {
      const response = await axiosInstance.get(`${lotesLApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "tipoAll") {
      const response = await axiosInstance.get(`${lotesALApi}/${Term}`);
      return response.data.data;
    }
    throw new Error("Tipo de búsqueda no soportado");
  } catch (error) {
    console.error("Error en buscarLotes:", error);
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { message: "No se recibió respuesta del servidor" };
    } else {
      throw { message: error.message || "Error al realizar la búsqueda" };
    }
  }
};