import { useEffect, useState } from "react";
import { editarFinca } from "../../services/FincasService";

const ModalEditarFinca = ({
  isOpen,
  fetchFincas,
  onClose,
  fincaId,
  fincas,
}) => {
  const [fincaData, setFincaData] = useState({
    nombre: "",
    dirección: "",
    encargado: "",
    teléfono: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    dirección: "",
    encargado: "",
    teléfono: "",
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Encontrar la finca seleccionada cuando cambia el ID
  useEffect(() => {
    if (fincaId && fincas.length > 0) {
      const fincaSeleccionada = fincas.find((f) => f.id === fincaId);
      if (fincaSeleccionada) {
        setFincaData({
          nombre: fincaSeleccionada.nombre || "",
          dirección: fincaSeleccionada.dirección || "",
          encargado: fincaSeleccionada.encargado || "",
          teléfono: fincaSeleccionada.teléfono || "",
        });
      }
    }
    // Resetear errores al abrir el modal
    setErrors({
      nombre: "",
      dirección: "",
      encargado: "",
      teléfono: "",
    });
    setFormError("");
    setSubmitAttempted(false);
  }, [fincaId, fincas, isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return value.trim() === "" ? "El nombre es requerido" : "";
      case "dirección":
        return value.trim() === "" ? "La dirección es requerida" : "";
      case "encargado":
        return value.trim() === "" ? "El encargado es requerido" : "";
      case "teléfono":
        if (value.trim() === "") return "El teléfono es requerido";
        if (!/^[0-9]+$/.test(value)) return "Debe contener solo números";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFincaData(prev => ({
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
      nombre: validateField("nombre", fincaData.nombre),
      dirección: validateField("dirección", fincaData.dirección),
      encargado: validateField("encargado", fincaData.encargado),
      teléfono: validateField("teléfono", fincaData.teléfono)
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
      setLoading(true);
      const data = {
        nombre: fincaData.nombre.trim(),
        direccion: fincaData.dirección.trim(),
        encargado: fincaData.encargado.trim(),
        telefono: fincaData.teléfono.trim(),
        id: fincaId,
      };

      await editarFinca(data);
      fetchFincas();
      onClose();
    } catch (err) {
      console.error("Error al editar finca:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al editar la finca");
      } catch {
        setFormError(err.message || "Error al editar la finca");
      }
    } finally {
      setLoading(false);
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

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Editar Finca #{fincaId}</h2>

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
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={fincaData.nombre}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              placeholder="Ingrese el nombre..."
            />
            {errors.nombre && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.nombre}</span>
              </div>
            )}
          </div>

          {/* Campo Dirección */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.dirección ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="dirección"
              value={fincaData.dirección}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              placeholder="Ingrese la dirección..."
            />
            {errors.dirección && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.dirección}</span>
              </div>
            )}
          </div>

          {/* Campo Encargado */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.encargado ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Encargado
            </label>
            <input
              type="text"
              name="encargado"
              value={fincaData.encargado}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              placeholder="Ingrese el encargado..."
            />
            {errors.encargado && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.encargado}</span>
              </div>
            )}
          </div>

          {/* Campo Teléfono */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.teléfono ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="teléfono"
              value={fincaData.teléfono}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              placeholder="Ingrese el teléfono..."
            />
            {errors.teléfono && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.teléfono}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <img src="/icons/loading_spinner.svg" alt="Cargando" className="h-5 w-5 mr-2 animate-spin" />
                  Guardando...
                </span>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarFinca;