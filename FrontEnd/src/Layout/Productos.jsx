import { useState, useEffect } from "react";
import TablaProductos from "../components/TablaProductos.jsx";
import ModalEditarProducto from "../components/ModalProducto/ModalEditar.jsx";
import { mostrarProductos, buscarProductos } from "../services/ProductosService.js";
import ModalCrearProducto from "../components/ModalProducto/ModalCrear.jsx";
import ModalEliminarProducto from "../components/ModalProducto/ModalEliminar.jsx";
import { mostrarTiposCafe } from "../services/TiposdeCafeService.js";

const Productos = () => {
  const [loading, setLoading] = useState(true);
  const [selectedProductoId, setSelectedProductoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [tiposCafe, setTiposCafe] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [notification, setNotification] = useState(null);

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" },
    { value: "tipo", label: "Tipo de Café" }
  ];

  // Función para mostrar notificaciones
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchTiposCafe = async () => {
      try {
        setLoadingOptions(true);
        const data = await mostrarTiposCafe();
        setTiposCafe(data);
      } catch (err) {
        console.error("Error al cargar tipos de café:", err);
        showNotification("Error al cargar tipos de café", "error");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchTiposCafe();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await mostrarProductos();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err.message);
      setProductos([]);
      showNotification("Error al cargar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && searchField !== "tipo") {
      fetchProductos();
      return;
    }

    setLoading(true);
    try {
      const data = await buscarProductos(searchField, searchTerm);
      setProductos(data);
      if (data.length === 0) {
        showNotification("No se encontraron productos", "info");
      }
    } catch (err) {
      console.error("Error al buscar productos:", err);
      setProductos([]);
      showNotification("Error al buscar productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedProductoId) {
      setIsModalOpen(true);
    } else {
      showNotification("Seleccione un producto para editar", "info");
    }
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleDeleteClick = () => {
    if (selectedProductoId) {
      setIsModalOpenDelete(true);
    } else {
      showNotification("Seleccione un producto para eliminar", "info");
    }
  };

  const renderSearchInput = () => {
    if (searchField === "tipo") {
      return (
        <select
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) fetchProductos();
          }}
          className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none appearance-none cursor-pointer"
          disabled={loadingOptions}
        >
          <option value="">Todos los tipos</option>
          {tiposCafe.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={searchField === "id" ? "number" : "text"}
        value={searchTerm}
        onChange={(e) => {
          if (searchField === "id") {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setSearchTerm(value);
            if (!value.trim()) {
              fetchProductos();
            }
          } else {
            setSearchTerm(e.target.value);
            if (!e.target.value.trim()) {
              fetchProductos();
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && searchTerm.trim()) {
            handleSearch();
          }
        }}
        className="flex-1 h-full px-4 bg-orange-200 rounded-r-xl text-orange-950 text-xl outline-none placeholder:italic"
        placeholder={`Buscar por ${searchOptions
          .find((opt) => opt.value === searchField)
          ?.label.toLowerCase()}...`}
        min={searchField === "id" ? "1" : undefined}
      />
    );
  };

  return (
    <div className="bg-white p-10 flex gap-10 flex-col w-full h-full">
      {/* Notificación flotante */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg border-l-4 flex items-center ${
          notification.type === "success" 
            ? "bg-green-100 text-green-700 border-green-500"
            : notification.type === "error"
            ? "bg-red-100 text-red-700 border-red-500"
            : "bg-blue-100 text-blue-700 border-blue-500"
        }`}>
          <img
            src={`/icons/${notification.type}_icon.svg`}
            alt={notification.type}
            className="w-6 h-6 mr-2"
          />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="flex w-full gap-4 justify-center items-center">
        <div className="relative flex items-center bg-orange-200 rounded-xl h-16 w-1/2">
          <select
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              setSearchTerm("");
              fetchProductos();
            }}
            className="h-full px-4 bg-orange-300 text-orange-900 font-bold rounded-l-xl outline-none appearance-none cursor-pointer"
          >
            {searchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {renderSearchInput()}
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || (searchField === "tipo" && loadingOptions)}
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            loading || (searchField === "tipo" && loadingOptions)
              ? "bg-orange-200 cursor-not-allowed"
              : "bg-orange-300 cursor-pointer hover:bg-orange-400"
          } transition-colors`}
        >
          <img
            src="/icons/search_icon.svg"
            alt="buscar"
            className="h-8 w-8"
          />
        </button>
      </div>

      {/* Botones de acción */}
      <div className="flex w-full gap-4 items-center">
        <button
          onClick={handleAddClick}
          className="flex text-nowrap w-fit rounded-full justify-center items-center px-6 pl-1 bg-orange-300 text-xl text-orange-900 cursor-pointer hover:bg-orange-400 transition-colors h-16"
        >
          <img
            src="/icons/create_icon.svg"
            alt="Añadir"
            className="flex h-14 pl-2"
          />
          Añadir Producto
        </button>
        <div className="flex w-full justify-end items-center gap-4">
          <button
            onClick={handleEditClick}
            disabled={!selectedProductoId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedProductoId
                ? "bg-orange-300 cursor-pointer hover:bg-orange-400"
                : "bg-orange-200 cursor-not-allowed"
            } transition-colors`}
          >
            <img
              src="/icons/edit_icon.svg"
              alt="Modificar"
              className="flex h-10"
            />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={!selectedProductoId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedProductoId
                ? "bg-orange-300 cursor-pointer hover:bg-orange-400"
                : "bg-orange-200 cursor-not-allowed"
            } transition-colors`}
          >
            <img
              src="/icons/delete-icon.svg"
              alt="Eliminar"
              className="flex h-10"
            />
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      <TablaProductos
        loading={loading}
        fetchProductos={fetchProductos}
        selectedProductoId={selectedProductoId}
        setSelectedProductoId={setSelectedProductoId}
        productos={productos}
      />

      {/* Modals */}
      <ModalEditarProducto
        isOpen={isModalOpen}
        fetchProductos={() => {
          fetchProductos();
          showNotification("Producto actualizado exitosamente");
        }}
        onClose={() => setIsModalOpen(false)}
        productoId={selectedProductoId}
        productos={productos}
      />

      <ModalCrearProducto
        isOpen={isModalOpenAdd}
        fetchProductos={() => {
          fetchProductos();
          showNotification("Producto creado exitosamente");
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />

      <ModalEliminarProducto
        isOpen={isModalOpenDelete}
        fetchProductos={() => {
          fetchProductos();
          showNotification("Producto eliminado exitosamente");
        }}
        onClose={() => setIsModalOpenDelete(false)}
        productoId={selectedProductoId}
        productos={productos}
      />
    </div>
  );
};

export default Productos;