import axiosInstance from "../utils/axiosConfig";

const compradoresApi = import.meta.env.VITE_API_COMPRADORES;
const compradoresNApi = import.meta.env.VITE_API_COMPRADORES_NOMBRE;

export const mostrarComprador = async () => {
  try {
    const response = await axiosInstance.get(compradoresApi);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarComprador = async (data) => {
  try {
    const response = await axiosInstance.put(`${compradoresApi}/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearComprador = async (data) => {
  try {
    const response = await axiosInstance.post(compradoresApi, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const eliminarComprador = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(compradoresApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarCompradores = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${compradoresApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "nombre") {
      const response = await axiosInstance.get(`${compradoresNApi}/${Term}`);
      return response.data.data;
    }
    throw new Error("La API no se ha encontrado")
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
