import { useState } from "react";
import { eliminarFinca } from "../../services/FincasService";

const ModalEliminarFinca = ({
  isOpen,
  fetchFincas,
  onClose,
  fincaId,
  fincaNombre
}) => {
  const [error, setError] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEliminar = async () => {
    setIsDeleting(true);
    try {
      await eliminarFinca({ id: fincaId });
      await fetchFincas();
      onClose();
    } catch (err) {
      console.error("Error al eliminar finca:", err);
      try {
        const dataError = JSON.parse(err.message);
        setError(Array.isArray(dataError) ? dataError : [dataError]);
      } catch {
        setError([{ message: "Error al eliminar la finca" }]);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div
        className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
        style={{
          animation: isOpen ? "modalEnter 0.3s ease-out forwards" : "",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer"
          disabled={isDeleting}
        >
          <img
            src="/icons/close_small_icon dark.svg"
            alt="Cerrar modal"
            className="flex h-8"
          />
        </button>

        <h2 className="text-3xl font-bold text-orange-800 mb-6">
          Eliminar Finca
        </h2>

        <div className="space-y-6">
          <p className="text-xl text-orange-800">
            ¿Estás seguro que deseas eliminar la finca{" "}
            <strong>"{fincaNombre}"</strong> con <strong>ID: #{fincaId}</strong>?
          </p>
          
          <p className="text-lg text-orange-700 italic">
            Esta acción no se puede deshacer.
          </p>

          {error.length > 0 && (
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
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarFinca;