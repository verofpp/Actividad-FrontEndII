import { useState, useEffect } from "react";
import TablaLotes from "../components/TablaLotes";
import ModalEditarLote from "../components/ModalLote/ModalEditar";
import { mostrarLote, buscarLotes } from "../services/LotesService";
import ModalCrearLote from "../components/ModalLote/ModalCrear";
import ModalEliminarLote from "../components/ModalLote/ModalEliminar";
import { mostrarFinca } from "../services/FincasService";
import { mostrarTiposCafe } from "../services/TiposdeCafeService";

const Lotes = () => {
  const [loading, setLoading] = useState(true);
  const [selectedLoteId, setSelectedLoteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [fincas, setFincas] = useState([]);
  const [tiposCafe, setTiposCafe] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [notification, setNotification] = useState(null);

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "finca", label: "Finca" },
    { value: "fecha_cosecha", label: "Fecha" },
    { value: "tipo", label: "Tipo de Café" },
    { value: "estado", label: "Estado" }
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingOptions(true);
        const [fincasData, tiposData] = await Promise.all([
          mostrarFinca(),
          mostrarTiposCafe()
        ]);
        
        setFincas(fincasData);
        setTiposCafe(tiposData);
        await fetchLotes();
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
        showNotification("Error al cargar datos iniciales", "error");
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const data = await mostrarLote();
      setLotes(data);
    } catch (err) {
      console.error("Error al cargar lotes:", err.message);
      setLotes([]);
      showNotification("Error al cargar lotes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if ((searchField === "finca" || searchField === "tipo") && !searchTerm) {
      fetchLotes();
      return;
    }

    setLoading(true);
    try {
      let searchValue = searchTerm;
      
      if (searchField === "fecha_cosecha" && searchTerm) {
        const date = new Date(searchTerm);
        if (!isNaN(date.getTime())) {
          searchValue = date.toISOString().split('T')[0];
        } else {
          showNotification("Formato de fecha inválido", "error");
          setLoading(false);
          return;
        }
      }

      const data = await buscarLotes(searchField, searchValue);
      
      let resultados = [];
      if (Array.isArray(data)) {
        resultados = data;
      } else if (data && typeof data === 'object') {
        resultados = [data];
      }
      
      setLotes(resultados);
      
      if (resultados.length === 0) {
        showNotification("No se encontraron lotes", "info");
      }
    } catch (err) {
      console.error("Error al buscar lotes:", err);
      setLotes([]);
      showNotification(err.message || "Error al buscar lotes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    if (selectedLoteId) {
      setIsModalOpen(true);
    } else {
      showNotification("Seleccione un lote para editar", "info");
    }
  };
  
  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };
  
  const handleDeleteClick = () => {
    if (selectedLoteId) {
      setIsModalOpenDelete(true);
    } else {
      showNotification("Seleccione un lote para eliminar", "info");
    }
  };

  const renderSearchInput = () => {
    if (loadingOptions) {
      return (
        <div className="flex-1 h-full px-4 flex items-center">
          <span className="text-orange-900">Cargando opciones...</span>
        </div>
      );
    }

    switch (searchField) {
      case "finca":
        return (
          <select
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) fetchLotes();
            }}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none appearance-none cursor-pointer"
          >
            <option value="">Todas las fincas</option>
            {fincas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
        );
      case "tipo":
        return (
          <select
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) fetchLotes();
            }}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none appearance-none cursor-pointer"
          >
            <option value="">Todos los tipos</option>
            {tiposCafe.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        );
      case "estado":
        return (
          <select
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) fetchLotes();
            }}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none appearance-none cursor-pointer"
          >
            <option value="">Todos los estados</option>
            <option value="Cosechado">Cosechado</option>
            <option value="Procesado">Procesado</option>
            <option value="Secado">Secado</option>
            <option value="Tostado">Tostado</option>
            <option value="Molido">Molido</option>
            <option value="Listo">Listo</option>
          </select>
        );
      case "id":
        return (
          <input
            type="number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl placeholder:italic outline-none"
            placeholder="Buscar por id..."
            min="1"
          />
        );
      case "fecha_cosecha":
        return (
          <input
            type="date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none"
          />
        );
      default:
        return (
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) fetchLotes();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none placeholder:italic"
            placeholder={`Buscar por ${searchOptions.find(opt => opt.value === searchField)?.label.toLowerCase()}...`}
          />
        );
    }
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
              fetchLotes();
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
          disabled={loading || loadingOptions}
          className={`h-16 w-16 rounded-full flex items-center justify-center ${
            loading || loadingOptions
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
          Añadir Lote
        </button>
        <div className="flex w-full justify-end items-center gap-4">
          <button
            onClick={handleEditClick}
            disabled={!selectedLoteId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedLoteId
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
            disabled={!selectedLoteId}
            className={`flex rounded-full justify-center h-14 w-14 items-center ${
              selectedLoteId
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
      
      <TablaLotes
        loading={loading}
        fetchLotes={fetchLotes}
        selectedLoteId={selectedLoteId}
        setSelectedLoteId={setSelectedLoteId}
        lotes={lotes}
      />
      
      <ModalEditarLote
        isOpen={isModalOpen}
        fetchLotes={() => {
          fetchLotes();
          showNotification("Lote actualizado exitosamente");
        }}
        onClose={() => setIsModalOpen(false)}
        loteId={selectedLoteId}
        lotes={lotes}
      />
      <ModalCrearLote
        isOpen={isModalOpenAdd}
        fetchLotes={() => {
          fetchLotes();
          showNotification("Lote creado exitosamente");
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />
      <ModalEliminarLote
        isOpen={isModalOpenDelete}
        fetchLotes={() => {
          fetchLotes();
          showNotification("Lote eliminado exitosamente");
        }}
        onClose={() => setIsModalOpenDelete(false)}
        loteId={selectedLoteId}
        lotes={lotes}
      />
    </div>
  );
};

export default Lotes;