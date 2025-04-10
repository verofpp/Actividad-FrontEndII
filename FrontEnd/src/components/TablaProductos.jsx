import { useEffect } from "react";

const TablaProductos = ({
  loading,
  fetchProductos,
  selectedProductoId,
  setSelectedProductoId,
  productos
}) => {
  const stylesTh =
    "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedProductoId(id);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (loading) return <div>Cargando productos...</div>;
  if (productos.length === 0) return <div className="w-full text-4xl text-orange-800 font-bold text-center">No hay productos registrados</div>

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Nombre</th>
              <th className={stylesTh}>Presentación</th>
              <th className={stylesTh}>Tipo de Café</th>
              <th className={stylesTh}>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr
                key={producto.id}
                className={`hover:bg-orange-200 cursor-pointer ${
                  selectedProductoId === producto.id ? "bg-orange-200" : ""
                }`}
                onClick={() => handleRowClick(producto.id)}
              >
                <td className={stylesTd}>{producto.id}</td>
                <td className={stylesTd}>{producto.nombre}</td>
                <td className={stylesTd}>{producto.presentacion}g</td>
                <td className={stylesTd}>{producto.tipo_cafe_id}</td>
                <td className={stylesTd}>{producto.precio}$</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablaProductos;
