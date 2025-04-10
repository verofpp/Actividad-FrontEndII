import { useEffect } from "react";

const TablaCompradores = ({
  loading,
  fetchCompradores,
  selectedCompradorId,
  setSelectedCompradorId,
  compradores
}) => {
  const stylesTh =
    "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedCompradorId(id);
  };

  useEffect(() => {
    fetchCompradores();
  }, []);

  if (loading) return <div>Cargando compradores...</div>;
  if (compradores.length === 0) return <div className="w-full text-4xl text-orange-800 font-bold text-center">No hay compradores registrados</div>

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Nombre</th>
              <th className={stylesTh}>Dirección</th>
              <th className={stylesTh}>Teléfono</th>
              <th className={stylesTh}>Email</th>
            </tr>
          </thead>
          <tbody>
            {compradores.map((comprador) => (
              <tr
                key={comprador.id}
                className={`hover:bg-orange-200 cursor-pointer ${
                  selectedCompradorId === comprador.id ? "bg-orange-200" : ""
                }`}
                onClick={() => handleRowClick(comprador.id)}
              >
                <td className={stylesTd}>{comprador.id}</td>
                <td className={stylesTd}>{comprador.nombre}</td>
                <td className={stylesTd}>{comprador.direccion}</td>
                <td className={stylesTd}>{comprador.telefono}</td>
                <td className={stylesTd}>{comprador.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablaCompradores;
