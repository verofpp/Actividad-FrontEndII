import { useState, useEffect } from "react";
import { crearProducto } from "../../services/ProductosService.js";
import { mostrarTiposCafe } from "../../services/TiposdeCafeService.js";

const ModalCrearProducto = ({
  isOpen,
  fetchProductos,
  onClose,
}) => {
  const [productoData, setProductoData] = useState({
    nombre: "",
    presentacion: "",
    tipo_cafe_id: "",
    precio: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    presentacion: "",
    tipo_cafe_id: "",
    precio: "",
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [tiposCafe, setTiposCafe] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTiposCafe();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setProductoData({
      nombre: "",
      presentacion: "",
      tipo_cafe_id: "",
      precio: "",
    });
    setErrors({
      nombre: "",
      presentacion: "",
      tipo_cafe_id: "",
      precio: "",
    });
    setFormError("");
    setSubmitAttempted(false);
  };

  const fetchTiposCafe = async () => {
    setLoadingTipos(true);
    try {
      const data = await mostrarTiposCafe();
      setTiposCafe(data);
    } catch (err) {
      console.error("Error al cargar tipos de café:", err);
      setFormError("Error al cargar los tipos de café disponibles");
    } finally {
      setLoadingTipos(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return value.trim() === "" ? "El nombre es requerido" : "";
      case "presentacion":
        if (value === "") return "La presentación es requerida";
        if (isNaN(value) || parseFloat(value) <= 0) 
          return "Debe ser un número mayor a cero";
        return "";
      case "precio":
        if (value === "") return "El precio es requerido";
        if (isNaN(value) || parseFloat(value) <= 0) 
          return "Debe ser un número mayor a cero";
        return "";
      case "tipo_cafe_id":
        return value === "" ? "Seleccione un tipo de café" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setProductoData(prev => ({
      ...prev,
      [name]: value
    }));

    if (submitAttempted) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      nombre: validateField("nombre", productoData.nombre),
      presentacion: validateField("presentacion", productoData.presentacion),
      precio: validateField("precio", productoData.precio),
      tipo_cafe_id: validateField("tipo_cafe_id", productoData.tipo_cafe_id)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      setFormError("Por favor complete todos los campos requeridos correctamente");
      return;
    }

    try {
      const data = {
        nombre: productoData.nombre.trim(),
        presentacion: parseFloat(productoData.presentacion),
        tipo_cafe_id: productoData.tipo_cafe_id,
        precio: parseFloat(productoData.precio)
      };

      await crearProducto(data);
      fetchProductos();
      onClose();
    } catch (err) {
      console.error("Error al crear producto:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al crear el producto");
      } catch {
        setFormError(err.message || "Error al crear el producto");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-2xl mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
        style={{ animation: isOpen ? "modalEnter 0.3s ease-out forwards" : "" }}>
        
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <img
            src="/icons/close_small_icon dark.svg"
            alt="Cerrar modal"
            className="flex h-8"
          />
        </button>

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Crear Producto</h2>

        {formError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center">
              <img
                src="/icons/error_icon.svg"
                alt="Error"
                className="w-6 h-6 mr-2"
              />
              <span className="font-semibold">{formError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.nombre ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="nombre"
              value={productoData.nombre}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.nombre && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.nombre}</span>
              </div>
            )}
          </div>

          {/* Campo Presentación */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.presentacion ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Presentación (gramos)
            </label>
            <input
              type="number"
              name="presentacion"
              value={productoData.presentacion}
              onChange={handleInputChange}
              min="1"
              step="1"
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.presentacion && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.presentacion}</span>
              </div>
            )}
          </div>

          {/* Campo Tipo de Café */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.tipo_cafe_id ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Tipo de Café
            </label>
            {loadingTipos ? (
              <div className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center">
                Cargando tipos de café...
              </div>
            ) : (
              <select
                name="tipo_cafe_id"
                value={productoData.tipo_cafe_id}
                onChange={handleInputChange}
                className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none appearance-none"
              >
                <option value="">Seleccione un tipo...</option>
                {tiposCafe.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            )}
            {errors.tipo_cafe_id && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.tipo_cafe_id}</span>
              </div>
            )}
          </div>

          {/* Campo Precio */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.precio ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Precio
            </label>
            <input
              type="number"
              name="precio"
              value={productoData.precio}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.precio && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.precio}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearProducto;