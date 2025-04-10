import { useState, useEffect, useCallback } from "react";
import TablaInventario from "../components/TablaInventario";
import { mostrarInventario } from "../services/InventarioService";
import ModalCrearInventario from "../components/ModalInventario/ModalCrear";
import { mostrarTiposCafe } from "../services/TiposdeCafeService";
import { buscarLotes } from '../services/LotesService';

const Inventario = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInventarioId, setSelectedInventarioId] = useState(null);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);

  const [inventario, setInventario] = useState([]);
  const [selectedTipoCafe, setSelectedTipoCafe] = useState("");
  const [selectedLote, setSelectedLote] = useState("");
  const [lotes, setLotes] = useState([]);
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [kilosLote, setKilosLote] = useState(null);

  const [tiposCafe, setTiposCafe] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    fetchTiposCafe();
  }, []);

  const fetchInventarioPorLote = useCallback(async () => {
    if (!selectedLote) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await mostrarInventario(selectedLote);
      setInventario(data);
    } catch (err) {
      console.error("Error al cargar inventario:", err);
      setError({ message: "Error al cargar inventario del lote" });
      setInventario([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLote]);

  useEffect(() => {
    fetchInventarioPorLote();
  }, [fetchInventarioPorLote]);

  useEffect(() => {
    const fetchLotes = async () => {
      if (selectedTipoCafe) {
        setLoadingLotes(true);
        try {
          const data = await buscarLotes("tipoAll", selectedTipoCafe);
          setLotes(data);
        } catch (err) {
          console.error("Error al cargar lotes:", err);
          setError({ message: "Error al cargar lotes" });
          setLotes([]);
        } finally {
          setLoadingLotes(false);
        }
      } else {
        setLotes([]);
        setSelectedLote("");
        setKilosLote(null);
      }
    };

    fetchLotes();
  }, [selectedTipoCafe]);

  useEffect(() => {
    if (selectedLote && lotes.length > 0) {
      const loteSeleccionado = lotes.find(lote => lote.id.toString() === selectedLote);
      setKilosLote(loteSeleccionado?.cantidad_kilos || null);
    } else {
      setKilosLote(null);
    }
  }, [selectedLote, lotes]);

  const fetchTiposCafe = async () => {
    setLoadingTipos(true);
    setError(null);
    try {
      const data = await mostrarTiposCafe();
      setTiposCafe(data);
    } catch (err) {
      console.error("Error al cargar tipos de café:", err);
      setError({ message: "Error al cargar tipos de café" });
    } finally {
      setLoadingTipos(false);
    }
  };

  const handleTipoCafeChange = (e) => {
    setSelectedTipoCafe(e.target.value);
    setSelectedLote("");
    setKilosLote(null);
  };

  const handleLoteChange = (e) => {
    setSelectedLote(e.target.value);
  };

  const handleAddClick = () => {
    setIsModalOpenAdd(true);
  };

  const closeError = () => {
    setError(null);
  };

  const closeSuccess = () => {
    setSuccess(null);
  };

  return (
    <div className="bg-white p-10 flex gap-10 flex-col w-full h-full">
      {error && (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg border-l-4 border-red-500 bg-red-100 text-red-700 flex items-center">
          <img src="/icons/error_icon.svg" alt="Error" className="w-6 h-6 mr-2" />
          <span>{error.message}</span>
          <button 
            onClick={closeError}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 p-4 rounded-lg border-l-4 border-green-500 bg-green-100 text-green-700 flex items-center">
          <img src="/icons/success_icon.svg" alt="Éxito" className="w-6 h-6 mr-2" />
          <span>{success.message}</span>
          <button 
            onClick={closeSuccess}
            className="ml-4 text-green-700 hover:text-green-900"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex w-full gap-4 items-center">
        <button
          onClick={handleAddClick}
          className="flex text-nowrap w-fit rounded-full justify-center items-center px-6 pl-1 bg-orange-300 text-xl text-orange-900 cursor-pointer hover:bg-orange-400 transition-colors h-16"
        >
          <img src="/icons/create_icon.svg" alt="Añadir" className="flex h-14 pl-2" />
          Añadir Producción
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4 items-start md:items-center">
        <div className="w-full md:w-1/3">
          <label className="block text-orange-800 font-bold text-xl mb-2">
            Tipo de Café
          </label>
          {loadingTipos ? (
            <div className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center">
              Cargando tipos de café...
            </div>
          ) : (
            <select
              name="tipo_cafe_id"
              value={selectedTipoCafe}
              onChange={handleTipoCafeChange}
              className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 ring-0 outline-0 appearance-none"
            >
              <option value="">Todos los tipos</option>
              {tiposCafe.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedTipoCafe && (
          <div className="w-full md:w-1/3">
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Lotes
            </label>
            {loadingLotes ? (
              <div className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center">
                Cargando lotes...
              </div>
            ) : (
              <select
                name="lote_id"
                value={selectedLote}
                onChange={handleLoteChange}
                className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 ring-0 outline-0 appearance-none"
              >
                <option value="">Todos los lotes</option>
                {lotes.map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    {lote.nombre || `Lote #${lote.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {kilosLote !== null && (
          <div className="w-full md:w-1/3">
            <label className="block text-orange-800 font-bold text-xl mb-2">
              Kilos Totales
            </label>
            <div className="bg-orange-200 text-orange-950 rounded-full h-12 w-full text-xl px-4 flex items-center justify-center font-bold">
              {kilosLote}kg
            </div>
          </div>
        )}
      </div>

      <TablaInventario
        loading={loading}
        fetchInventario={fetchInventarioPorLote}
        selectedInventarioId={selectedInventarioId}
        setSelectedInventarioId={setSelectedInventarioId}
        inventario={inventario}
        kilosLote={kilosLote}
        selectedTipoCafe={selectedTipoCafe}
        selectedLote={selectedLote}
      />

      <ModalCrearInventario
        isOpen={isModalOpenAdd}
        fetchInventario={() => {
          fetchInventarioPorLote();
          setSuccess({ message: "Producción añadida exitosamente" });
        }}
        onClose={() => setIsModalOpenAdd(false)}
      />
    </div>
  );
};

export default Inventario;