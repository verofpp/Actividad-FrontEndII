import { useState, useEffect } from "react";
import TablaFincas from "../components/TablaFincas";
import ModalEditarFinca from "../components/ModalFinca/ModalEditar";
import { mostrarFinca, buscarFincas } from "../services/FincasService";
import ModalCrearFinca from "../components/ModalFinca/ModalCrear";
import ModalEliminarFinca from "../components/ModalFinca/ModalEliminar";

const Fincas = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFincaId, setSelectedFincaId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [fincas, setFincas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("nombre");
  const [notification, setNotification] = useState(null);

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "nombre", label: "Nombre" },
    { value: "encargado", label: "Encargado" },
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchFincas();
  }, []);

  const fetchFincas = async () => {
    try {
      setLoading(true);
      const data = await mostrarFinca();
      setFincas(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al cargar fincas:", err.message);
      setFincas([]);
      showNotification("Error al cargar fincas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchFincas();
      return;
    }

    setLoading(true);
    try {
      const data = await buscarFincas(searchField, searchTerm);
      const formattedData = Array.isArray(data) ? data : [data];
      setFincas(formattedData);
      
      if (formattedData.length === 0) {
        showNotification("No se encontraron fincas", "info");
      }
    } catch (err) {
      console.error("Error al buscar fincas:", err);
      setFincas([]);
      showNotification("Error al buscar fincas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedFincaId) {
      setIsModalOpen(true);
    } else {
      showNotification("Seleccione una finca para editar", "info");
    }
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleDeleteClick = () => {
    if (selectedFincaId) {
      setIsModalOpenDelete(true);
    } else {
      showNotification("Seleccione una finca para eliminar", "info");
    }
  };

  const renderSearchInput = () => {
    if (searchField === "id") {
      return (
        <input
          type="number"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setSearchTerm(value);
            if (!value.trim()) fetchFincas();
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 h-full px-4 bg-orange-200 rounded-r-xl text-orange-950 text-xl outline-none placeholder:italic"
          placeholder="Buscar por ID..."
          min="1"
        />
      );
    }

    return (
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (!e.target.value.trim()) fetchFincas();
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1 h-full px-4 bg-orange-200 rounded-r-xl text-orange-950 text-xl outline-none placeholder:italic"
        placeholder={`Buscar por ${searchOptions.find(opt => opt.value === searchField)?.label.toLowerCase()}...`}
      />
    );
  };

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
              fetchFincas();
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
          disabled={loading}
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            loading ? "bg-orange-200 cursor-not-allowed" : "bg-orange-300 hover:bg-orange-400"
          } transition-colors`}
        >
          <img src="/icons/search_icon.svg" alt="buscar" className="h-8 w-8" />
        </button>
      </div>

      <div className="flex w-full gap-4 items-center">
        <button
          onClick={handleAddClick}
          className="flex text-nowrap w-fit rounded-full justify-center items-center px-6 pl-1 bg-orange-300 text-xl text-orange-900 cursor-pointer hover:bg-orange-400 transition-colors h-16"
        >
          <img src="/icons/create_icon.svg" alt="Añadir" className="flex h-14 pl-2" />
          Añadir Finca
        </button>
        <div className="flex w-full justify-end items-center gap-4">
          <button
            onClick={handleEditClick}
            disabled={!selectedFincaId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedFincaId ? "bg-orange-300 hover:bg-orange-400" : "bg-orange-200 cursor-not-allowed"
            } transition-colors`}
          >
            <img src="/icons/edit_icon.svg" alt="Modificar" className="flex h-10" />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={!selectedFincaId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedFincaId ? "bg-orange-300 hover:bg-orange-400" : "bg-orange-200 cursor-not-allowed"
            } transition-colors`}
          >
            <img src="/icons/delete-icon.svg" alt="Eliminar" className="flex h-10" />
          </button>
        </div>
      </div>

      <TablaFincas
        loading={loading}
        fetchFincas={fetchFincas}
        selectedFincaId={selectedFincaId}
        setSelectedFincaId={setSelectedFincaId}
        fincas={fincas}
      />

      <ModalEditarFinca
        isOpen={isModalOpen}
        fetchFincas={() => {
          fetchFincas();
          showNotification("Finca actualizada exitosamente");
        }}
        onClose={() => setIsModalOpen(false)}
        fincaId={selectedFincaId}
        fincas={fincas}
      />

      <ModalCrearFinca
        isOpen={isModalOpenAdd}
        fetchFincas={() => {
          fetchFincas();
          showNotification("Finca creada exitosamente");
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />

      <ModalEliminarFinca
        isOpen={isModalOpenDelete}
        fetchFincas={() => {
          fetchFincas();
          showNotification("Finca eliminada exitosamente");
          setSelectedFincaId(null);
        }}
        onClose={() => setIsModalOpenDelete(false)}
        fincaId={selectedFincaId}
        fincaNombre={fincas.find(f => f.id === selectedFincaId)?.nombre || "Desconocido"}
      />
    </div>
  );
};

export default Fincas;