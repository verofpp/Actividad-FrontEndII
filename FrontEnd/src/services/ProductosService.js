import axiosInstance from "../utils/axiosConfig";

const productosApi = import.meta.env.VITE_API_PRODUCTOS;
const productosNApi = import.meta.env.VITE_API_PRODUCTOS_NOMBRE;
const productosTApi = import.meta.env.VITE_API_PRODUCTOS_TIPO;

export const mostrarProductos = async () => {
  try {
    const response = await axiosInstance.get(productosApi);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editarProducto = async (data) => {
  try {
    const producto = {
      ...data,
      presentacion: parseInt(data.presentacion),
      tipo_cafe_id: parseInt(data.tipo_cafe_id),
      precio: parseInt(data.precio),
    };
    console.log(producto, data)
    const response = await axiosInstance.put(
      `${productosApi}/${data.id}`,
      producto
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const crearProducto = async (data) => {
  try {
    const producto = {
      ...data,
      presentacion: parseInt(data.presentacion),
      tipo_cafe_id: parseInt(data.tipo_cafe_id),
      precio: parseInt(data.precio),
    };
    const response = await axiosInstance.post(productosApi, producto);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const eliminarProducto = async (data) => {
  try {
    const id = { id: data.id };
    const response = await axiosInstance.delete(productosApi, { data: id });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};

export const buscarProductos = async (Field, Term) => {
  try {
    if (Field === "id") {
      const response = await axiosInstance.get(`${productosApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "nombre") {
      const response = await axiosInstance.get(`${productosNApi}/${Term}`);
      return response.data.data;
    }
    if (Field === "tipo") {
      const response = await axiosInstance.get(`${productosTApi}/${Term}`);
      return response.data.data;
    }
    throw new Error("La API no se ha encontrado");
  } catch (error) {
    console.error(error);
    throw error.response.data;
  }
};
