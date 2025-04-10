import axiosInstance from "../utils/axiosConfig";

const inventarioApi = import.meta.env.VITE_API_INVENTARIO;
const tiposcafeNApi = import.meta.env.VITE_API_INVENTARIO_NOMBRE;

export const mostrarInventario = async (id) => {
  try {
    const response = await axiosInstance.get(`${inventarioApi}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarInventario = async (data) => {
  console.log(data)
  try {
    const tipocafe = {
      ...data,
      nombre: data.nombre,
    };
    console.log(tipocafe, data)
    const response = await axiosInstance.put(
      `${inventarioApi}/${data.id}`,
      tipocafe
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearInventario = async (data) => {
  try {

    const response = await axiosInstance.post(inventarioApi, data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const eliminarInventario = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(inventarioApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarInventario = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${inventarioApi}/${Term}`);
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
