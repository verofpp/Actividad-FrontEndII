import { useState, useEffect } from "react";
import TablaCompradores from "../components/TablaCompradores";
import ModalEditarComprador from "../components/ModalComprador/ModalEditar";
import { mostrarComprador, buscarCompradores } from "../services/CompradoresService";
import ModalCrearComprador from "../components/ModalComprador/ModalCrear";
import ModalEliminarComprador from "../components/ModalComprador/ModalEliminar";

const Compradores = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCompradorId, setSelectedCompradorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [compradores, setCompradores] = useState([]);
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

  const fetchCompradores = async () => {
    try {
      setLoading(true);
      const data = await mostrarComprador();
      setCompradores(data);
    } catch (err) {
      console.error(err.message);
      setCompradores([]);
      showNotification("Error al cargar compradores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCompradores();
      return;
    }

    setLoading(true);
    try {
      const data = await buscarCompradores(searchField, searchTerm);
      setCompradores(data);
      if (data.length === 0) {
        showNotification("No se encontraron compradores", "info");
      }
    } catch (err) {
      console.error("Error al buscar compradores:", err);
      setCompradores([]);
      showNotification("Error al buscar compradores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedCompradorId) {
      setIsModalOpen(true);
    } else {
      showNotification("Seleccione un comprador para editar", "info");
    }
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleDeleteClick = () => {
    if (selectedCompradorId) {
      setIsModalOpenDelete(true);
    } else {
      showNotification("Seleccione un comprador para eliminar", "info");
    }
  };

  useEffect(() => {
    fetchCompradores();
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
              fetchCompradores();
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
                  fetchCompradores();
                }
              } else {
                setSearchTerm(e.target.value);
                if (!e.target.value.trim()) {
                  fetchCompradores();
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
          Añadir Comprador
        </button>
        <div className="flex w-full justify-end items-center gap-4">
          <button
            onClick={handleEditClick}
            disabled={!selectedCompradorId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedCompradorId
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
            disabled={!selectedCompradorId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedCompradorId
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

      <TablaCompradores
        loading={loading}
        fetchCompradores={fetchCompradores}
        selectedCompradorId={selectedCompradorId}
        setSelectedCompradorId={setSelectedCompradorId}
        compradores={compradores}
      />

      <ModalEditarComprador
        isOpen={isModalOpen}
        fetchCompradores={() => {
          fetchCompradores();
          showNotification("Comprador actualizado exitosamente");
        }}
        onClose={() => setIsModalOpen(false)}
        compradorId={selectedCompradorId}
        compradores={compradores}
      />

      <ModalCrearComprador
        isOpen={isModalOpenAdd}
        fetchCompradores={() => {
          fetchCompradores();
          showNotification("Comprador creado exitosamente");
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />

      <ModalEliminarComprador
        isOpen={isModalOpenDelete}
        fetchCompradores={() => {
          fetchCompradores();
          showNotification("Comprador eliminado exitosamente");
        }}
        onClose={() => setIsModalOpenDelete(false)}
        compradorId={selectedCompradorId}
        compradores={compradores}
      />
    </div>
  );
};

export default Compradores;