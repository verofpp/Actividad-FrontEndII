import { useState, useEffect } from "react";
import TablaTiposCafe from "../components/TablaTiposCafe";
import ModalEditarTipoCafe from "../components/ModalTipoCafe/ModalEditar";
import { mostrarTiposCafe, buscarTipoCafe } from "../services/TiposdeCafeService";
import ModalCrearTipoCafe from "../components/ModalTipoCafe/ModalCrear";
import ModalEliminarTipoCafe from "../components/ModalTipoCafe/ModalEliminar";

const TiposCafe = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTipoCafeId, setSelectedTipoCafeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [tiposcafe, setTiposCafe] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [notification, setNotification] = useState(null);

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" }
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTiposCafe = async () => {
    try {
      setLoading(true);
      const data = await mostrarTiposCafe();
      setTiposCafe(data);
    } catch (err) {
      console.error(err.message);
      setTiposCafe([]);
      showNotification("Error al cargar tipos de café", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchTiposCafe();
      return;
    }

    setLoading(true);
    try {
      const data = await buscarTipoCafe(searchField, searchTerm);
      setTiposCafe(data);
      if (data.length === 0) {
        showNotification("No se encontraron tipos de café", "info");
      }
    } catch (err) {
      console.error("Error al buscar tipos de café:", err);
      setTiposCafe([]);
      showNotification("Error al buscar tipos de café", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedTipoCafeId) {
      setIsModalOpen(true);
    } else {
      showNotification("Seleccione un tipo de café para editar", "info");
    }
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleDeleteClick = () => {
    if (selectedTipoCafeId) {
      setIsModalOpenDelete(true);
    } else {
      showNotification("Seleccione un tipo de café para eliminar", "info");
    }
  };

  useEffect(() => {
    fetchTiposCafe();
  }, []);

  return (
    <div className="bg-white p-10 flex gap-10 flex-col w-full h-full">
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

      <div className="flex w-full gap-4 justify-center items-center">
        <div className="relative flex items-center bg-orange-200 rounded-xl h-16 w-1/2">
          <select
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              setSearchTerm("");
              fetchTiposCafe();
            }}
            className="h-full px-4 bg-orange-300 text-orange-900 font-bold rounded-l-xl outline-none appearance-none cursor-pointer"
          >
            {searchOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type={searchField === "id" ? "number" : "text"}
            value={searchTerm}
            onChange={(e) => {
              if (searchField === "id") {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setSearchTerm(value);
                if (!value.trim()) {
                  fetchTiposCafe();
                }
              } else {
                setSearchTerm(e.target.value);
                if (!e.target.value.trim()) {
                  fetchTiposCafe();
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
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            loading
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
          Añadir Tipo de Café
        </button>
        <div className="flex w-full justify-end items-center gap-4">
          <button
            onClick={handleEditClick}
            disabled={!selectedTipoCafeId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedTipoCafeId
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
            disabled={!selectedTipoCafeId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedTipoCafeId
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

      <TablaTiposCafe
        loading={loading}
        fetchTiposCafe={fetchTiposCafe}
        selectedTipoCafeId={selectedTipoCafeId}
        setSelectedTipoCafeId={setSelectedTipoCafeId}
        tiposcafe={tiposcafe}
      />

      <ModalEditarTipoCafe
        isOpen={isModalOpen}
        fetchTiposCafe={() => {
          fetchTiposCafe();
          showNotification("Tipo de café actualizado exitosamente");
        }}
        onClose={() => setIsModalOpen(false)}
        tipocafeId={selectedTipoCafeId}
        tiposcafe={tiposcafe}
      />

      <ModalCrearTipoCafe
        isOpen={isModalOpenAdd}
        fetchTiposCafe={() => {
          fetchTiposCafe();
          showNotification("Tipo de café creado exitosamente");
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />

      <ModalEliminarTipoCafe
        isOpen={isModalOpenDelete}
        fetchTiposCafe={() => {
          fetchTiposCafe();
          showNotification("Tipo de café eliminado exitosamente");
        }}
        onClose={() => setIsModalOpenDelete(false)}
        tipocafeId={selectedTipoCafeId}
        tiposcafe={tiposcafe}
      />
    </div>
  );
};

export default TiposCafe;