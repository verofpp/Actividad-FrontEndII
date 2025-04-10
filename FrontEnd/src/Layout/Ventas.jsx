import { useState, useEffect } from "react";
import TablaVentas from "../components/TablaVentas";
import ModalCrearVenta from "../components/ModalVenta/ModalCrear";
import {
  buscarVentaPorFecha,
  buscarVentaPorComprador,
  ventasMensuales,
  ventasAnuales,
  obtenerMejoresCompradores,
  obtenerProductosMasDemandados
} from "../services/VentasService";
import { mostrarComprador } from "../services/CompradoresService";

const Ventas = () => {
  const [loading, setLoading] = useState(true);
  const [selectedVentaId, setSelectedVentaId] = useState(null);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("fecha");
  const [reporteTipo, setReporteTipo] = useState("detalle");
  const [anioReporte, setAnioReporte] = useState(new Date().getFullYear().toString());
  const [mesReporte, setMesReporte] = useState((new Date().getMonth() + 1).toString());
  const [compradores, setCompradores] = useState([]);
  const [loadingCompradores, setLoadingCompradores] = useState(false);
  const [notification, setNotification] = useState(null);

  const searchOptions = [
    { value: "fecha", label: "Fecha" },
    { value: "comprador", label: "Comprador" }
  ];

  const reporteOptions = [
    { value: "detalle", label: "Detalle de Ventas" },
    { value: "mensual", label: "Reporte Mensual" },
    { value: "anual", label: "Reporte Anual" },
    { value: "mejores", label: "Mejores Compradores" },
    { value: "productos", label: "Productos Más Demandados" }
  ];

  const meses = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" }
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchCompradores = async () => {
    setLoadingCompradores(true);
    try {
      const data = await mostrarComprador();
      setCompradores(data || []);
    } catch (err) {
      console.error("Error al cargar compradores:", err);
      setCompradores([]);
      showNotification("Error al cargar lista de compradores", "error");
    } finally {
      setLoadingCompradores(false);
    }
  };

  const fetchVentas = async () => {
    setLoading(true);
    try {
      let data;
      switch(reporteTipo) {
        case "detalle":
          if (searchField === "fecha") {
            const fechaBusqueda = searchTerm.trim() 
              ? searchTerm
              : new Date().toISOString().split('T')[0];
            
            data = await buscarVentaPorFecha(fechaBusqueda);
          } else if (searchField === "comprador" && searchTerm.trim()) {
            data = await buscarVentaPorComprador(searchTerm);
          } else {
            data = [];
          }
          break;
        case "mensual":
          data = await ventasMensuales(anioReporte, mesReporte);
          break;
        case "anual":
          data = await ventasAnuales(anioReporte);
          break;
        case "mejores":
          data = await obtenerMejoresCompradores();
          break;
        case "productos":
          data = await obtenerProductosMasDemandados();
          break;
        default:
          data = [];
      }
      
      const ventasData = data?.data || data || [];
      setVentas(Array.isArray(ventasData) ? ventasData : [ventasData]);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setVentas([]);
      showNotification("Error al cargar ventas", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const handleFilterChange = (value, type) => {
    switch(type) {
      case 'searchTerm':
        setSearchTerm(value);
        break;
      case 'searchField':
        setSearchField(value);
        setSearchTerm("");
        break;
      case 'reporteTipo':
        setReporteTipo(value);
        break;
      case 'anioReporte':
        setAnioReporte(value);
        break;
      case 'mesReporte':
        setMesReporte(value);
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchVentas();
    }
  };

  useEffect(() => {
    if (reporteTipo !== "detalle") {
      fetchVentas();
    }
  }, [reporteTipo, anioReporte, mesReporte]);

  useEffect(() => {
    if (reporteTipo === "detalle" && searchField === "comprador") {
      fetchCompradores();
    }
  }, [reporteTipo, searchField]);

  useEffect(() => {
    fetchVentas();
  }, []);

  const renderSearchInput = () => {
    if (searchField === "comprador") {
      return (
        <select
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none appearance-none cursor-pointer"
          disabled={loadingCompradores}
        >
          <option value="">Todos los compradores</option>
          {compradores.map((comprador) => (
            <option key={comprador.id} value={comprador.nombre}>
              {comprador.nombre}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 h-full px-4 bg-orange-200 text-orange-950 rounded-r-xl text-xl outline-none"
        />
      );
    }
  };

  return (
    <div className="bg-white p-10 flex flex-col gap-10 w-full h-full relative">
      {/* Notificación flotante */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg border-l-4 flex items-center ${
          notification.type === "success" 
            ? "bg-green-100 text-green-700 border-green-500"
            : "bg-red-100 text-red-700 border-red-500"
        }`}>
          <img
            src={`/icons/${notification.type}_icon.svg`}
            alt={notification.type}
            className="w-6 h-6 mr-2"
          />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Selector de tipo de reporte */}
      <div className="w-full">
        <label className="block text-orange-900 text-xl font-bold mb-2">Tipo de Reporte</label>
        <select
          value={reporteTipo}
          onChange={(e) => handleFilterChange(e.target.value, 'reporteTipo')}
          className="w-full p-3 bg-orange-100 border-0 text-orange-900 rounded-lg focus:outline-none focus:ring-0"
        >
          {reporteOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtros específicos según tipo de reporte */}
      {reporteTipo === "mensual" && (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 bg-orange-100 p-3 rounded-lg">
            <label className="text-orange-900 font-semibold text-base whitespace-nowrap">Mes:</label>
            <select
              value={mesReporte}
              onChange={(e) => handleFilterChange(e.target.value, 'mesReporte')}
              className="w-fit p-2 h-10 bg-white text-orange-900 rounded-lg focus:outline-none focus:ring-0"
            >
              {meses.map((mes) => (
                <option key={mes.value} value={mes.value}>
                  {mes.label}
                </option>
              ))}
            </select>
            <label className="text-orange-900 font-semibold text-base whitespace-nowrap">Año:</label>
            <input
              type="number"
              value={anioReporte}
              onChange={(e) => handleFilterChange(e.target.value, 'anioReporte')}
              className="w-20 p-2 h-10 bg-white text-orange-900 rounded-lg focus:outline-none focus:ring-0"
              placeholder="Año"
            />
          </div>
        </div>
      )}

      {reporteTipo === "anual" && (
        <div className="flex justify-center">
          <div className="flex items-center gap-3 bg-orange-100 p-3 rounded-lg">
            <label className="text-orange-900 font-semibold text-base whitespace-nowrap">Año:</label>
            <input
              type="number"
              value={anioReporte}
              onChange={(e) => handleFilterChange(e.target.value, 'anioReporte')}
              className="w-20 p-2 h-10 bg-white text-orange-900 rounded-lg focus:outline-none focus:ring-0"
              placeholder="Año"
            />
          </div>
        </div>
      )}

      {reporteTipo === "detalle" && (
        <div className="flex w-full gap-4 justify-center items-center">
          <div className="relative flex items-center bg-orange-200 rounded-xl h-16 w-1/2">
            <select
              value={searchField}
              onChange={(e) => handleFilterChange(e.target.value, 'searchField')}
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
            onClick={fetchVentas}
            disabled={loading}
            className="h-16 w-16 bg-orange-300 cursor-pointer rounded-full flex items-center justify-center"
          >
            <img 
              src="/icons/search_icon.svg" 
              alt="buscar" 
              className="h-8 w-8" 
            />
          </button>
        </div>
      )}

      {/* Botón de Generar Venta y tabla */}
      <div className="flex w-full gap-4 items-center">
        <button
          onClick={handleAddClick}
          className="flex text-nowrap w-fit rounded-full justify-center items-center px-6 pl-1 bg-orange-300 text-xl text-orange-900 cursor-pointer hover:bg-orange-400 transition-colors h-16"
        >
          <img
            src="/icons/create_icon.svg"
            alt="Generar"
            className="flex h-14 pl-2"
          />
          Generar Venta
        </button>
      </div>

      {/* Tabla de resultados */}
      <div className="flex-1">
        <TablaVentas
          loading={loading}
          reporteTipo={reporteTipo}
          ventas={ventas}
          selectedVentaId={selectedVentaId}
          setSelectedVentaId={setSelectedVentaId}
          refreshVentas={fetchVentas}
        />
      </div>

      {/* Modal para crear nueva venta */}
      <ModalCrearVenta
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        refreshVentas={() => {
          fetchVentas();
          showNotification("Venta creada exitosamente");
        }}
      />
    </div>
  );
};

export default Ventas;