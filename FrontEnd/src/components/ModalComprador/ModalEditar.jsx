import { useEffect, useState } from "react";
import { editarComprador } from "../../services/CompradoresService";

const ModalEditarComprador = ({
  isOpen,
  fetchCompradores,
  onClose,
  compradorId,
  compradores,
}) => {
  const [compradorData, setCompradorData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [error, setError] = useState([]);

  // Encontrar la finca seleccionada cuando cambia el ID
  useEffect(() => {
    if (compradorId && compradores.length > 0) {
      const compradorSeleccionado = compradores.find((c) => c.id === compradorId);
      if (compradorSeleccionado) {
        setCompradorData({
          nombre: compradorSeleccionado.nombre || "",
          direccion: compradorSeleccionado.direccion || "",
          telefono: compradorSeleccionado.telefono || "",
          email: compradorSeleccionado.email || "",
        });
      }
    }
  }, [compradorId, compradores]);

  const closeError = ()=> {
    setError([])
    onClose()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompradorData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError([]);
  };

  const fetchCompradoresesEditar = async () => {
    try {
      const data = {
        nombre: compradorData.nombre,
        direccion: compradorData.direccion,
        telefono: compradorData.telefono,
        email: compradorData.email,
        id: compradorId,
      };

      await editarComprador(data);
      await fetchCompradores();
      closeError()
    } catch (err) {
      console.error(err.message);
      const dataError = JSON.parse(err.message);
      console.error(dataError);
      setError(dataError);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      setError([]);
      fetchCompradoresesEditar();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro con animación */}
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300"
        onClick={closeError}
      ></div>

      {/* Modal con animación */}
      <div
        className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-2xl mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
        style={{
          animation: isOpen ? "modalEnter 0.3s ease-out forwards" : "",
        }}
      >
        <button
          onClick={closeError}
          className="absolute top-4 right-4 cursor-pointer"
        >
          <img
            src="/icons/close_small_icon dark.svg"
            alt="Cerrar modal"
            className="flex h-8"
          />
        </button>

        <h2 className="text-3xl font-bold text-orange-800 mb-6">
          Editar Comprador #{compradorId}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-orange-800 font-bold text-xl mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={compradorData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese un nombre..."
                className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 placeholder:italic ring-0 outline-0"
                required
              />
            </div>

            <div>
              <label className="block text-orange-800 font-bold text-xl mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={compradorData.direccion}
                onChange={handleInputChange}
                placeholder="Ingrese una dirección..."
                className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 placeholder:italic ring-0 outline-0"
                required
              />
            </div>


            <div>
              <label className="block text-orange-800 font-bold text-xl mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={compradorData.telefono}
                onChange={handleInputChange}
                placeholder="Ingrese un teléfono..."
                className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 placeholder:italic ring-0 outline-0"
                required
              />
            </div>

            <div>
              <label className="block text-orange-800 font-bold text-xl mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={compradorData.email}
                onChange={handleInputChange}
                placeholder="Ingrese un email..."
                className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 placeholder:italic ring-0 outline-0"
                required
              />
            </div>

          </div>
          {error && (
            <div className="w-full flex flex-col py-2">
              {error.map((e, i) => (
                <span
                  key={i}
                  className="text-lg text-orange-800 italic font-bold"
                >
                  * {e.message}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeError}
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

export default ModalEditarComprador;
