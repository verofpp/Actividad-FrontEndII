import { useEffect, useState } from "react";
import { editarTipoCafe } from "../../services/TiposdeCafeService.js";

const ModalEditarTipoCafe = ({
  isOpen,
  fetchTiposCafe,
  onClose,
  tipocafeId,
  tiposcafe
}) => {
  const [tipocafeData, setTipoCafeData] = useState({
    nombre: "",
  });
  const [errors, setErrors] = useState({
    nombre: ""
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (tipocafeId && tiposcafe.length > 0) {
      const tipocafeSeleccionado = tiposcafe.find((tc) => tc.id === tipocafeId);
      if (tipocafeSeleccionado) {
        setTipoCafeData({
          nombre: tipocafeSeleccionado.nombre || ""
        });
      }
    }
    setErrors({ nombre: "" });
    setFormError("");
    setSubmitAttempted(false);
  }, [tipocafeId, tiposcafe]);

  const validateField = (name, value) => {
    if (name === "nombre") {
      return value.trim() === "" ? "El nombre es requerido" : "";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setTipoCafeData(prev => ({
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
      nombre: validateField("nombre", tipocafeData.nombre)
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
        nombre: tipocafeData.nombre.trim(),
        id: tipocafeId
      };

      await editarTipoCafe(data);
      fetchTiposCafe();
      onClose();
    } catch (err) {
      console.error("Error al editar tipo de café:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al editar el tipo de café");
      } catch {
        setFormError(err.message || "Error al editar el tipo de café");
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

        <h2 className="text-3xl font-bold text-orange-800 mb-6">
          Editar Tipo de Café #{tipocafeId}
        </h2>

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
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.nombre ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={tipocafeData.nombre}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              autoFocus
            />
            {errors.nombre && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.nombre}</span>
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarTipoCafe;