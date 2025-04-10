import axiosInstance from "../utils/axiosConfig";

const tiposcafeApi = import.meta.env.VITE_API_TIPOSCAFE;
const tiposcafeNApi = import.meta.env.VITE_API_TIPOSCAFE_NOMBRE;

export const mostrarTiposCafe = async () => {
  try {
    const response = await axiosInstance.get(tiposcafeApi);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarTipoCafe = async (data) => {
  console.log(data)
  try {
    const tipocafe = {
      ...data,
      nombre: data.nombre,
    };
    console.log(tipocafe, data)
    const response = await axiosInstance.put(
      `${tiposcafeApi}/${data.id}`,
      tipocafe
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearTipoCafe = async (data) => {
  try {
    const tipocafe = {
        ...data,
        nombre: data.nombre,
      };
    const response = await axiosInstance.post(tiposcafeApi, tipocafe);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const eliminarTipoCafe = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(tiposcafeApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarTipoCafe = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${tiposcafeApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "nombre") {
      const response = await axiosInstance.get(`${tiposcafeNApi}/${Term}`);
      return response.data.data;
    }
    throw new Error("La API no se ha encontrado");
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
