import { useState, useEffect } from "react";
import { crearComprador } from "../../services/CompradoresService";

const ModalCrearComprador = ({
  isOpen,
  fetchCompradores,
  onClose,
}) => {
  const [compradorData, setCompradorData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: ""
  });
  const [errors, setErrors] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: ""
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCompradorData({
      nombre: "",
      direccion: "",
      telefono: "",
      email: ""
    });
    setErrors({
      nombre: "",
      direccion: "",
      telefono: "",
      email: ""
    });
    setFormError("");
    setSubmitAttempted(false);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return value.trim() === "" ? "El nombre es requerido" : "";
      case "direccion":
        return value.trim() === "" ? "La dirección es requerida" : "";
      case "telefono":
        if (value.trim() === "") return "El teléfono es requerido";
        if (!/^[0-9]{10,15}$/.test(value)) return "Teléfono inválido (10-15 dígitos)";
        return "";
      case "email":
        if (value.trim() === "") return "El email es requerido";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setCompradorData(prev => ({
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
      nombre: validateField("nombre", compradorData.nombre),
      direccion: validateField("direccion", compradorData.direccion),
      telefono: validateField("telefono", compradorData.telefono),
      email: validateField("email", compradorData.email)
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
        nombre: compradorData.nombre.trim(),
        direccion: compradorData.direccion.trim(),
        telefono: compradorData.telefono.trim(),
        email: compradorData.email.trim()
      };

      await crearComprador(data);
      fetchCompradores();
      onClose();
    } catch (err) {
      console.error("Error al crear comprador:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al crear el comprador");
      } catch {
        setFormError(err.message || "Error al crear el comprador");
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

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Crear Comprador</h2>

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
              value={compradorData.nombre}
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

          {/* Campo Dirección */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.direccion ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={compradorData.direccion}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.direccion && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.direccion}</span>
              </div>
            )}
          </div>

          {/* Campo Teléfono */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.telefono ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={compradorData.telefono}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
              pattern="[0-9]{10,15}"
              title="10-15 dígitos numéricos"
            />
            {errors.telefono && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.telefono}</span>
              </div>
            )}
          </div>

          {/* Campo Email */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.email ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={compradorData.email}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.email && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.email}</span>
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
              Crear Comprador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearComprador;