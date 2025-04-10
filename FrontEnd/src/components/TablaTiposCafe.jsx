import { useEffect } from "react";

const TablaTiposCafe = ({
  loading,
  fetchTiposCafe,
  selectedTipoCafeId,
  setSelectedTipoCafeId,
  tiposcafe
}) => {
  const stylesTh =
    "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedTipoCafeId(id);
  };

  useEffect(() => {
    fetchTiposCafe();
  }, []);

  if (loading) return <div>Cargando tipos de café...</div>;
  if (tiposcafe.length === 0) return <div className="w-full text-4xl text-orange-800 font-bold text-center">No hay tipos de café registrados</div>

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {tiposcafe.map((tipocafe) => (
              <tr
                key={tipocafe.id}
                className={`hover:bg-orange-200 cursor-pointer ${
                  selectedTipoCafeId === tipocafe.id ? "bg-orange-200" : ""
                }`}
                onClick={() => handleRowClick(tipocafe.id)}
              >
                <td className={stylesTd}>{tipocafe.id}</td>
                <td className={stylesTd}>{tipocafe.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablaTiposCafe;
