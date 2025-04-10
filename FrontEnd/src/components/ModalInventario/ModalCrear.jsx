import { useState, useEffect } from "react";
import { crearInventario } from "../../services/InventarioService.js";
import { mostrarTiposCafe } from "../../services/TiposdeCafeService";
import { buscarLotes } from "../../services/LotesService";
import { buscarProductos } from "../../services/ProductosService";

const ModalCrearInventario = ({ isOpen, fetchInventario, onClose }) => {
  
  const getDefaultExpirationDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 5);
    return futureDate.toISOString().split("T")[0];
  };

  const [inventarioData, setInventarioData] = useState({
    lote_id: "",
    tipo_cafe_id: "",
    presentaciones: [],
    perdidas: "0",
    fecha_vencimiento: getDefaultExpirationDate(),
  });

  const [error, setError] = useState([]);
  const [tiposCafe, setTiposCafe] = useState([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [loadingPresentaciones, setLoadingPresentaciones] = useState(false);
  const [kilosDisponibles, setKilosDisponibles] = useState(0);
  const [kilosRestantes, setKilosRestantes] = useState(0);
  const [kilosAsignados, setKilosAsignados] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchTiposCafe();
      setInventarioData({
        lote_id: "",
        tipo_cafe_id: "",
        presentaciones: [],
        perdidas: "0",
        fecha_vencimiento: getDefaultExpirationDate(),
      });
      setKilosDisponibles(0);
      setKilosRestantes(0);
      setKilosAsignados(0);
      setError([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (inventarioData.tipo_cafe_id) {
      fetchLotesPorTipo();
    } else {
      setLotes([]);
      setInventarioData(prev => ({
        ...prev,
        lote_id: "",
        presentaciones: [],
      }));
    }
  }, [inventarioData.tipo_cafe_id]);

  useEffect(() => {
    if (inventarioData.lote_id && inventarioData.tipo_cafe_id) {
      const loteSeleccionado = lotes.find(
        lote => lote.id.toString() === inventarioData.lote_id
      );
      if (loteSeleccionado) {
        const kilos = parseFloat(loteSeleccionado.cantidad_kilos) || 0;
        const kilosRest = parseFloat(loteSeleccionado.kilos_restante) || kilos;
        setKilosDisponibles(kilosRest);
        setKilosRestantes(kilosRest);
        fetchPresentacionesPorTipo();
      }
    } else {
      setKilosDisponibles(0);
      setKilosRestantes(0);
    }
  }, [inventarioData.lote_id, lotes]);

  useEffect(() => {
    const totalUsado = inventarioData.presentaciones.reduce(
      (sum, pres) => sum + (parseFloat(pres.kilos) || 0),
      0
    );
    setKilosAsignados(totalUsado);
    
    const perdidas = parseFloat(inventarioData.perdidas) || 0;
    const nuevosKilosRestantes = kilosDisponibles - totalUsado - perdidas;
    setKilosRestantes(nuevosKilosRestantes > 0 ? nuevosKilosRestantes : 0);
  }, [inventarioData.presentaciones, inventarioData.perdidas, kilosDisponibles]);

  const fetchTiposCafe = async () => {
    setLoadingTipos(true);
    try {
      const data = await mostrarTiposCafe();
      setTiposCafe(data);
    } catch (err) {
      console.error("Error al cargar tipos de café:", err);
      setError([{ message: "Error al cargar tipos de café" }]);
    } finally {
      setLoadingTipos(false);
    }
  };

  const fetchLotesPorTipo = async () => {
    setLoadingLotes(true);
    try {
      const data = await buscarLotes("tipolisto", inventarioData.tipo_cafe_id);
      setLotes(data);
    } catch (err) {
      console.error("Error al cargar lotes:", err);
      setError([{ message: "Error al cargar lotes" }]);
      setLotes([]);
    } finally {
      setLoadingLotes(false);
    }
  };

  const fetchPresentacionesPorTipo = async () => {
    setLoadingPresentaciones(true);
    try {
      const data = await buscarProductos("tipo", inventarioData.tipo_cafe_id);

      setInventarioData(prev => ({
        ...prev,
        presentaciones: data.map(producto => ({
          producto_id: producto.id,
          producto_nombre: producto.nombre,
          presentacion: producto.presentacion,
          kilos: "",
          porcentaje: "",
          cantidad: "",
        })),
      }));
    } catch (err) {
      console.error("Error al cargar presentaciones:", err);
      setError([{ message: "Error al cargar presentaciones" }]);
      setInventarioData(prev => ({
        ...prev,
        presentaciones: [],
      }));
    } finally {
      setLoadingPresentaciones(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "perdidas") {
      const perdidasValue = parseFloat(value) || 0;
      
      if (perdidasValue > kilosDisponibles) {
        setError([{ message: `Las pérdidas no pueden ser mayores a ${kilosDisponibles.toFixed(2)} kg` }]);
        return;
      }
      
      if (perdidasValue + kilosAsignados > kilosDisponibles) {
        setError([{ 
          message: `La suma de pérdidas (${perdidasValue.toFixed(2)}) + kilos asignados (${kilosAsignados.toFixed(2)}) ` +
                   `no puede superar los kilos disponibles (${kilosDisponibles.toFixed(2)})`
        }]);
        return;
      }
    }

    setInventarioData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError([]);
  };

  const handlePresentacionChange = (index, field, value) => {
    if (field === "kilos") {
      const kilosValue = parseFloat(value) || 0;
      const perdidas = parseFloat(inventarioData.perdidas) || 0;
      
      const otrosKilos = inventarioData.presentaciones.reduce(
        (sum, pres, i) => i !== index ? sum + (parseFloat(pres.kilos) || 0) : sum,
        0
      );
      
      if (kilosValue + otrosKilos + perdidas > kilosDisponibles) {
        const maxPermitido = kilosDisponibles - otrosKilos - perdidas;
        setError([{ 
          message: `Máximo permitido: ${maxPermitido.toFixed(2)} kg ` +
                   `(Kilos disponibles: ${kilosDisponibles.toFixed(2)} - ` +
                   `Pérdidas: ${perdidas.toFixed(2)} - ` +
                   `Otros kilos asignados: ${otrosKilos.toFixed(2)})`
        }]);
        return;
      }
    }

    const newPresentaciones = [...inventarioData.presentaciones];
    newPresentaciones[index][field] = value;

    if (field === "kilos") {
      const kilosValue = parseFloat(value) || 0;
      
      if (kilosDisponibles > 0) {
        newPresentaciones[index].porcentaje = (
          (kilosValue / kilosDisponibles) * 100
        ).toFixed(2);
      }
      
      const presentacionStr = String(newPresentaciones[index].presentacion);
      const tamanoKg = parseFloat(presentacionStr.replace(/[^\d.]/g, "")) / 1000;
      newPresentaciones[index].cantidad = Math.floor(kilosValue / tamanoKg).toString();
    }

    setInventarioData(prev => ({
      ...prev,
      presentaciones: newPresentaciones,
    }));
    setError([]);
  };

  const handleTipoCafeChange = (e) => {
    handleInputChange(e);
    setInventarioData(prev => ({
      ...prev,
      lote_id: "",
      presentaciones: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!inventarioData.tipo_cafe_id) {
      setError([{ message: "Debe seleccionar un tipo de café" }]);
      return;
    }
    
    if (!inventarioData.lote_id) {
      setError([{ message: "Debe seleccionar un lote" }]);
      return;
    }
    
    if (inventarioData.perdidas === "" || isNaN(parseFloat(inventarioData.perdidas))) {
      setError([{ message: "Debe ingresar un valor válido para pérdidas" }]);
      return;
    }

    const totalUsado = inventarioData.presentaciones.reduce(
      (sum, pres) => sum + (parseFloat(pres.kilos) || 0),
      0
    );
    const perdidas = parseFloat(inventarioData.perdidas) || 0;

    if (totalUsado + perdidas > kilosDisponibles) {
      setError([
        {
          message: "La suma de kilos usados y pérdidas supera los kilos disponibles",
        },
      ]);
      return;
    }

    const hasKilosAssigned = inventarioData.presentaciones.some(
      pres => parseFloat(pres.kilos) > 0
    );
    
    if (!hasKilosAssigned) {
      setError([{ message: "Debe asignar kilos a al menos una presentación" }]);
      return;
    }

    try {
      const dataToSend = {
        lote_id: parseInt(inventarioData.lote_id),
        tipo_cafe_id: parseInt(inventarioData.tipo_cafe_id),
        presentaciones: inventarioData.presentaciones
          .filter(pres => pres.kilos && parseFloat(pres.kilos) > 0)
          .map(pres => ({
            producto_id: parseInt(pres.producto_id),
            presentacion: pres.presentacion,
            cantidad: parseInt(pres.cantidad) || 0,
            kilos: parseFloat(pres.kilos) || 0,
            fecha_vencimiento: inventarioData.fecha_vencimiento,
          })),
        perdidas: perdidas,
      };

      await crearInventario(dataToSend);
      await fetchInventario();
      onClose();
    } catch (err) {
      console.error("Error al crear inventario:", err);
      setError([{ 
        message: err.message || "Error al crear inventario"
      }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-orange-300 rounded-2xl p-6 w-full max-w-4xl mx-auto transform transition-all duration-300 scale-95 opacity-0 shadow-2xl shadow-orange-950"
        style={{ animation: isOpen ? "modalEnter 0.3s ease-out forwards" : "" }}>
        
        <button onClick={onClose} className="absolute top-4 right-4 cursor-pointer">
          <img
            src="/icons/close_small_icon dark.svg"
            alt="Cerrar modal"
            className="flex h-8"
          />
        </button>

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Producción</h2>

        <form onSubmit={handleSubmit}>
          {error.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center">
                <img src="/icons/error_icon.svg" alt="Error" className="w-6 h-6 mr-2" />
                <div>
                  {error.map((err, index) => (
                    <p key={index} className="font-semibold">{err.message}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-orange-200 p-4 rounded-lg">
              <div className="font-bold text-orange-900 mb-2">Tipo</div>
              {loadingTipos ? (
                <div className="bg-orange-100 text-orange-950 rounded-full h-10 px-4 flex items-center">
                  Cargando...
                </div>
              ) : (
                <select
                  name="tipo_cafe_id"
                  value={inventarioData.tipo_cafe_id}
                  onChange={handleTipoCafeChange}
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                  required
                >
                  <option value="">Seleccione tipo</option>
                  {tiposCafe.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-orange-200 p-4 rounded-lg">
              <div className="font-bold text-orange-900 mb-2">Lote</div>
              {loadingLotes ? (
                <div className="bg-orange-100 text-orange-950 rounded-full h-10 px-4 flex items-center">
                  Cargando...
                </div>
              ) : (
                <select
                  name="lote_id"
                  value={inventarioData.lote_id}
                  onChange={handleInputChange}
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                  required
                  disabled={!inventarioData.tipo_cafe_id}
                >
                  <option value="">Seleccione lote</option>
                  {lotes.map(lote => (
                    <option key={lote.id} value={lote.id}>
                      {lote.nombre || `Lote #${lote.id}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {inventarioData.lote_id && inventarioData.tipo_cafe_id && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6 bg-orange-200 p-4 rounded-lg">
                <div>
                  <div className="font-bold text-orange-900 mb-2">Kilos</div>
                  <div className="text-xl">{kilosDisponibles.toFixed(2)}Kg</div>
                </div>
                <div>
                  <div className="font-bold text-orange-900 mb-2">Pérdidas</div>
                  <input
                    type="number"
                    name="perdidas"
                    value={inventarioData.perdidas}
                    onChange={handleInputChange}
                    className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                    min="0"
                    max={kilosDisponibles}
                    step="0.01"
                    required
                  />
                  <div className="text-xs text-orange-700 mt-1">
                    Máx: {kilosDisponibles.toFixed(2)} kg
                  </div>
                </div>
                <div>
                  <div className="font-bold text-orange-900 mb-2">
                    Kilos Restantes
                  </div>
                  <div className={`text-xl ${kilosRestantes < 0 ? "text-red-600" : ""}`}>
                    {kilosRestantes.toFixed(2)}Kg
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-orange-200 p-4 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-400">
                      <th className="text-left py-2 font-bold text-orange-900">
                        Producto
                      </th>
                      <th className="text-left py-2 font-bold text-orange-900">
                        Presentaciones
                      </th>
                      <th className="text-center py-2 font-bold text-orange-900">
                        Kilos
                      </th>
                      <th className="text-center py-2 font-bold text-orange-900">
                        Porcentaje
                      </th>
                      <th className="text-center py-2 font-bold text-orange-900">
                        Cantidad (Paquetes)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingPresentaciones ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Cargando presentaciones...
                        </td>
                      </tr>
                    ) : (
                      inventarioData.presentaciones.map((pres, index) => {
                        const otrosKilos = inventarioData.presentaciones.reduce(
                          (sum, p, i) => i !== index ? sum + (parseFloat(p.kilos) || 0) : sum,
                          0
                        );
                        const perdidas = parseFloat(inventarioData.perdidas) || 0;
                        const maxPermitido = kilosDisponibles - otrosKilos - perdidas;
                        
                        return (
                          <tr key={index} className="border-b border-orange-300">
                            <td className="py-2">{pres.producto_nombre}</td>
                            <td className="py-2">{pres.presentacion}</td>
                            <td className="text-center">
                              <input
                                type="number"
                                value={pres.kilos}
                                onChange={e =>
                                  handlePresentacionChange(index, "kilos", e.target.value)
                                }
                                className="bg-orange-100 text-orange-950 rounded-full h-8 w-20 px-2 text-center outline-none"
                                min="0"
                                max={maxPermitido}
                                step="0.01"
                              />
                              <div className="text-xs text-orange-700">
                                Máx: {maxPermitido.toFixed(2)} kg
                              </div>
                            </td>
                            <td className="text-center">
                              {pres.porcentaje || "0.00"}%
                            </td>
                            <td className="text-center">
                              {pres.cantidad || "0"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mb-6 bg-orange-200 p-4 rounded-lg">
                <div className="font-bold text-orange-900 mb-2">
                  Fecha de Vencimiento
                </div>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={inventarioData.fecha_vencimiento}
                  onChange={handleInputChange}
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-xl font-bold"
              disabled={
                kilosRestantes < 0 ||
                loadingPresentaciones ||
                !inventarioData.lote_id ||
                inventarioData.perdidas === "" ||
                parseFloat(inventarioData.perdidas) > kilosDisponibles ||
                inventarioData.presentaciones.reduce(
                  (sum, pres) => sum + (parseFloat(pres.kilos) || 0),
                  0
                ) + parseFloat(inventarioData.perdidas || 0) > kilosDisponibles
              }
            >
              Añadir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearInventario;