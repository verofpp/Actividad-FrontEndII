import { useEffect } from "react";

const TablaFincas = ({
  loading,
  fetchFincas,
  selectedFincaId,
  setSelectedFincaId,
  fincas
}) => {
  const stylesTh =
    "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedFincaId(id);
  };

  useEffect(() => {
    fetchFincas();
  }, []);

  if (loading) return <div>Cargando fincas...</div>;
  if (fincas.length === 0) return <div className="w-full text-4xl text-orange-800 font-bold text-center">No hay fincas registradas</div>

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Nombre</th>
              <th className={stylesTh}>Dirección</th>
              <th className={stylesTh}>Encargado</th>
              <th className={stylesTh}>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {fincas.map((finca) => (
              <tr
                key={finca.id}
                className={`hover:bg-orange-200 cursor-pointer ${
                  selectedFincaId === finca.id ? "bg-orange-200" : ""
                }`}
                onClick={() => handleRowClick(finca.id)}
              >
                <td className={stylesTd}>{finca.id}</td>
                <td className={stylesTd}>{finca.nombre}</td>
                <td className={stylesTd}>{finca.dirección}</td>
                <td className={stylesTd}>{finca.encargado}</td>
                <td className={stylesTd}>{finca.teléfono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablaFincas;
