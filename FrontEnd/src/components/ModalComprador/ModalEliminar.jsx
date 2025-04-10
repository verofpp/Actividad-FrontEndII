import { useEffect, useState } from "react";
import { eliminarComprador } from "../../services/CompradoresService";

const ModalEliminarComprador = ({
  isOpen,
  fetchCompradores,
  onClose,
  compradorId,
  compradores,
}) => {
  const [fincaData, setFincaData] = useState({
    id: "",
    nombre: "",
  });
  const [error, setError] = useState([]);

  const closeError = () => {
    setError([]);
    onClose();
  };

  const handleEliminar = async () => {
    try {
      await eliminarComprador(fincaData);
      await fetchCompradores();
      closeError();
    } catch (err) {
      console.error(err.message);
      const dataError = JSON.parse(err.message);
      console.error(dataError);
      setError(dataError);
    }
  };

  useEffect(() => {
    if (compradorId && compradores.length > 0) {
      const compradorSeleccionado = compradores.find((c) => c.id === compradorId);
      if (compradorSeleccionado) {
        setFincaData({
          id: compradorSeleccionado.id,
          nombre: compradorSeleccionado.nombre,
        });
      }
    }
  }, [compradorId, compradores]);

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
        className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
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
          Eliminar Comprador
        </h2>

        <div className="space-y-6">
          <p className="text-xl text-orange-800">
            ¿Estás seguro que deseas eliminar el comprador{" "}
            <strong>"{fincaData.nombre}"</strong> con <strong>ID: #{compradorId}</strong>?
          </p>
          <p className="text-lg text-orange-700 italic">
            Esta acción no se puede deshacer.
          </p>

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
              type="button"
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarComprador;
