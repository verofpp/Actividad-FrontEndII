import { useEffect, useState } from "react";
import { crearLote } from "../../services/LotesService";
import { mostrarTiposCafe } from "../../services/TiposdeCafeService.js";
import { mostrarFinca } from "../../services/FincasService.js";

const ModalCrearLote = ({ isOpen, fetchLotes, onClose }) => {
  const [loteData, setLoteData] = useState({
    finca_id: "",
    fecha_de_cosecha: new Date().toISOString().split('T')[0],
    cantidad_kilo: "",
    tipo_cafe_id: "",
  });
  const [errors, setErrors] = useState({
    finca_id: "",
    fecha_de_cosecha: "",
    cantidad_kilo: "",
    tipo_cafe_id: "",
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [tiposCafe, setTiposCafe] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
      resetForm();
    }
  }, [isOpen]);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [tiposData, fincasData] = await Promise.all([
        mostrarTiposCafe(),
        mostrarFinca()
      ]);
      setTiposCafe(tiposData);
      setFincas(fincasData);
    } catch (err) {
      console.error("Error al cargar opciones:", err);
      setFormError("Error al cargar opciones del formulario");
    } finally {
      setLoadingOptions(false);
    }
  };

  const resetForm = () => {
    setLoteData({
      finca_id: "",
      fecha_de_cosecha: new Date().toISOString().split('T')[0],
      cantidad_kilo: "",
      tipo_cafe_id: "",
    });
    setErrors({
      finca_id: "",
      fecha_de_cosecha: "",
      cantidad_kilo: "",
      tipo_cafe_id: "",
    });
    setFormError("");
    setSubmitAttempted(false);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "finca_id":
        return value === "" ? "Seleccione una finca" : "";
      case "fecha_de_cosecha":
        if (value === "") return "La fecha es requerida";
        if (new Date(value) > new Date()) return "La fecha no puede ser futura";
        return "";
      case "cantidad_kilo":
        if (value === "") return "La cantidad es requerida";
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
    
    setLoteData(prev => ({
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
      finca_id: validateField("finca_id", loteData.finca_id),
      fecha_de_cosecha: validateField("fecha_de_cosecha", loteData.fecha_de_cosecha),
      cantidad_kilo: validateField("cantidad_kilo", loteData.cantidad_kilo),
      tipo_cafe_id: validateField("tipo_cafe_id", loteData.tipo_cafe_id)
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
        finca_id: loteData.finca_id,
        fecha_cosecha: loteData.fecha_de_cosecha,
        cantidad_kilos: parseFloat(loteData.cantidad_kilo),
        tipo_cafe_id: loteData.tipo_cafe_id
      };

      await crearLote(data);
      fetchLotes();
      onClose();
    } catch (err) {
      console.error("Error al crear lote:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al crear el lote");
      } catch {
        setFormError(err.message || "Error al crear el lote");
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

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Crear Lote</h2>

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
          {/* Campo Finca */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.finca_id ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Finca
            </label>
            {loadingOptions ? (
              <div className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center">
                Cargando fincas...
              </div>
            ) : (
              <select
                name="finca_id"
                value={loteData.finca_id}
                onChange={handleInputChange}
                className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none appearance-none"
              >
                <option value="">Seleccione una finca...</option>
                {fincas.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            )}
            {errors.finca_id && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.finca_id}</span>
              </div>
            )}
          </div>

          {/* Campo Fecha de Cosecha */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.fecha_de_cosecha ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Fecha de Cosecha
            </label>
            <input
              type="date"
              name="fecha_de_cosecha"
              max={new Date().toISOString().split('T')[0]}
              value={loteData.fecha_de_cosecha}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.fecha_de_cosecha && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.fecha_de_cosecha}</span>
              </div>
            )}
          </div>

          {/* Campo Cantidad de Kilos */}
          <div className={`bg-orange-200 p-4 rounded-lg ${
            errors.cantidad_kilo ? "ring-2 ring-red-500" : ""
          }`}>
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Cantidad de Kilos
            </label>
            <input
              type="number"
              name="cantidad_kilo"
              value={loteData.cantidad_kilo}
              onChange={handleInputChange}
              className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 outline-none"
            />
            {errors.cantidad_kilo && (
              <div className="mt-2 text-red-600 text-sm flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-4 h-4 mr-1" />
                <span>{errors.cantidad_kilo}</span>
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
            {loadingOptions ? (
              <div className="bg-orange-100 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center">
                Cargando tipos de café...
              </div>
            ) : (
              <select
                name="tipo_cafe_id"
                value={loteData.tipo_cafe_id}
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
              Crear Lote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearLote;