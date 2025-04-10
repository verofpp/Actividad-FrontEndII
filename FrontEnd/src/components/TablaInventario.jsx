import { useEffect } from "react";

const TablaInventario = ({
  loading,
  fetchInventario,
  selectedInventarioId,
  setSelectedInventarioId,
  inventario,
  kilosLote,
  selectedTipoCafe,
  selectedLote
}) => {
  const stylesTh = 
    "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = 
    "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedInventarioId(id);
  };

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  if (!selectedTipoCafe) {
    return (
      <div className="w-full text-4xl text-orange-800 font-bold text-center py-10">
        Por favor selecciona un tipo de café
      </div>
    );
  }

  if (!selectedLote) {
    return (
      <div className="w-full text-4xl text-orange-800 font-bold text-center py-10">
        Por favor selecciona un lote
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full text-4xl text-orange-800 font-bold text-center py-10">
        Cargando inventario...
      </div>
    );
  }

  if (inventario.length === 0) {
    return (
      <div className="w-full text-4xl text-orange-800 font-bold text-center py-10">
        No hay registros de inventario para este lote
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-orange-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-orange-300">
          <th className={stylesTh}>Producto</th>
            <th className={stylesTh}>Presentación</th>
            <th className={stylesTh}>Kilos</th>
            <th className={stylesTh}>Porcentaje</th>
            <th className={stylesTh}>Cantidad (Paq.)</th>
            <th className={stylesTh}>Fecha de Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item, i) => (
            <tr
              key={i}
              className={`hover:bg-orange-200 cursor-pointer transition-colors ${
                selectedInventarioId === item.presentacion ? "bg-orange-200" : ""
              }`}
              onClick={() => handleRowClick(item.presentacion)}
            >
              <td className={stylesTd}>{item.nombre}</td>
              <td className={stylesTd}>{item.presentacion}g</td>
              <td className={stylesTd}>
                {((item.presentacion * item.cantidad_paquetes) / 1000).toFixed(2)}kg
              </td>
              <td className={stylesTd}>
                {(100 * ((item.presentacion * item.cantidad_paquetes) / 1000) / kilosLote).toFixed(2)}%
              </td>
              <td className={stylesTd}>{item.cantidad_paquetes}</td>
              <td className={stylesTd}>
                {new Date(item.fecha_vencimiento).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInventario;