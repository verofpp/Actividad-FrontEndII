import { useEffect, useState } from "react";
import { eliminarProducto } from "../../services/ProductosService.js";

const ModalEliminarProducto = ({
  isOpen,
  fetchProductos,
  onClose,
  productoId,
  productos,
}) => {
  const [productoData, setProductoData] = useState({
    id: "",
    nombre: "",
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productoId && productos.length > 0) {
      const productoSeleccionado = productos.find((p) => p.id === productoId);
      if (productoSeleccionado) {
        setProductoData({
          id: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
        });
      }
    }
  }, [productoId, productos]);

  const handleEliminar = async () => {
    setLoading(true);
    setFormError("");
    try {
      await eliminarProducto({ id: productoId });
      fetchProductos();
      onClose();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      try {
        const errorData = JSON.parse(err.message);
        setFormError(errorData.message || "Error al eliminar el producto");
      } catch {
        setFormError(err.message || "Error al eliminar el producto");
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

      <div className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
        style={{ animation: isOpen ? "modalEnter 0.3s ease-out forwards" : "" }}>
        
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <img
            src="/icons/close_small_icon dark.svg"
            alt="Cerrar modal"
            className="flex h-8"
          />
        </button>

        <h2 className="text-3xl font-bold text-orange-800 mb-6">
          Eliminar Producto
        </h2>

        <div className="space-y-6">
          <p className="text-xl text-orange-800">
            ¿Estás seguro que deseas eliminar el producto{" "}
            <strong>"{productoData.nombre}"</strong> con <strong>ID: #{productoId}</strong>?
          </p>
          <p className="text-lg text-orange-700 italic">
            Esta acción no se puede deshacer.
          </p>

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

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEliminar}
              className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </>
              ) : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEliminarProducto;