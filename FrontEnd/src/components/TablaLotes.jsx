import { useEffect, useState } from "react";
import { cambiarEstado } from "../services/LotesService";

const TablaLotes = ({
  loading,
  fetchLotes,
  selectedLoteId,
  setSelectedLoteId,
  lotes = [],
}) => {
  const stylesTh = "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";
  const buttonStyles = "px-3 py-1 bg-blue-900 cursor-pointer rounded-full text-white rounded hover:bg-blue-800 transition";
  
  const [updating, setUpdating] = useState(null);

  const handleRowClick = (id) => {
    setSelectedLoteId(id);
  };

  const handleCambiarEstado = async (e, loteId) => {
    e.stopPropagation();
    setUpdating(loteId);

    try {
      await cambiarEstado(loteId);
      await fetchLotes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "--/--/----";
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.error("Fecha inválida recibida:", dateValue);
      return "--/--/----";
    }

    return date.toLocaleDateString("es-VE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Caracas",
    });
  };

  // Validaciones mejoradas
  if (loading) return <div>Cargando lotes...</div>;
  if (!lotes || (lotes && !Array.isArray(lotes) && typeof lotes !== 'object')) 
    return <div>Error: Datos de lotes no válidos</div>;
  if ((Array.isArray(lotes) && lotes.length === 0) || (lotes && !Array.isArray(lotes) && Object.keys(lotes).length === 0)) 
    return (
      <div className="w-full text-4xl text-orange-800 font-bold text-center">
        No hay lotes registrados
      </div>
    );

  // Convierte a array si es un solo objeto
  const dataToRender = Array.isArray(lotes) ? lotes : [lotes];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-orange-300">
        <thead>
          <tr>
            <th className={stylesTh}>ID</th>
            <th className={stylesTh}>Finca</th>
            <th className={stylesTh}>Cosecha</th>
            <th className={stylesTh}>Kg</th>
            <th className={stylesTh}>Tipo de Café</th>
            <th className={stylesTh}>Estado</th>
            <th className={stylesTh}>Pérdida</th>
            <th className={stylesTh}></th>
          </tr>
        </thead>
        <tbody>
          {dataToRender.map((lote) => (
            <tr
              key={lote.id}
              className={`hover:bg-orange-200 cursor-pointer ${
                selectedLoteId === lote.id ? "bg-orange-200" : ""
              }`}
              onClick={() => handleRowClick(lote.id)}
            >
              <td className={stylesTd}>{lote.id}</td>
              <td className={stylesTd}>{lote.finca_id}</td>
              <td className={stylesTd}>{formatDate(lote.fecha_cosecha)}</td>
              <td className={stylesTd}>{lote.cantidad_kilos}</td>
              <td className={stylesTd}>{lote.tipo_cafe_id}</td>
              <td className={stylesTd}>{lote.estado}</td>
              <td className={stylesTd}>
                {lote.porcentaje_perdido === null
                  ? "Pendiente"
                  : `${lote.porcentaje_perdido} %`}
              </td>
              <td className={stylesTd}>
                {lote.estado !== "Listo" && lote.estado !== "Agotado" && (
                  <button
                    className={buttonStyles}
                    onClick={(e) => handleCambiarEstado(e, lote.id)}
                    disabled={updating === lote.id}
                  >
                    {updating === lote.id ? "Procesando..." : "Cambiar Estado"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaLotes;