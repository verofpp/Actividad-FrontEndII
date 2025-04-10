import axiosInstance from "../utils/axiosConfig";

const fincasApi = import.meta.env.VITE_API_FINCAS;
const fincasNApi = import.meta.env.VITE_API_FINCAS_NOMBRE;
const fincasEApi = import.meta.env.VITE_API_FINCAS_ENCARGADO;

export const mostrarFinca = async () => {
  try {
    const response = await axiosInstance.get(fincasApi);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarFinca = async (data) => {
  try {
    const response = await axiosInstance.put(`${fincasApi}/${data.id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearFinca = async (data) => {
  try {
    const response = await axiosInstance.post(fincasApi, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const eliminarFinca = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(fincasApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarFincas = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${fincasApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "nombre") {
      const response = await axiosInstance.get(`${fincasNApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "encargado") {
      const response = await axiosInstance.get(`${fincasEApi}/${Term}`);
      return response.data.data;
    }
    throw new Error("La API no se ha encontrado")
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
