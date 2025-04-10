const TablaVentas = ({
  loading,
  reporteTipo,
  ventas,
  selectedVentaId,
  setSelectedVentaId
}) => {
  const stylesTh = "px-4 py-2 text-2xl font-black text-orange-900 text-center align-middle";
  const stylesTd = "px-4 py-2 text-lg text-orange-900 text-center align-middle";

  const handleRowClick = (id) => {
    setSelectedVentaId(id);
  };

  if (loading) return <div>Cargando ventas...</div>;
  if (!ventas || ventas.length === 0) return <div className="w-full text-4xl text-orange-800 font-bold text-center">No hay datos disponibles</div>;

  if (reporteTipo === "detalle") {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Comprador</th>
              <th className={stylesTh}>Fecha</th>
              <th className={stylesTh}>Productos</th>
              <th className={stylesTh}>Cantidad</th>
              <th className={stylesTh}>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr
                key={venta.id}
                className={`hover:bg-orange-200 cursor-pointer ${
                  selectedVentaId === venta.id ? "bg-orange-200" : ""
                }`}
                onClick={() => handleRowClick(venta.id)}
              >
                <td className={stylesTd}>{venta.id}</td>
                <td className={stylesTd}>{venta.comprador}</td>
                <td className={stylesTd}>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                <td className={stylesTd}>
                  {venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0 ? (
                    <ul>
                      {venta.productos.map((producto, index) => (
                        <li key={index}>{producto.producto}</li>
                      ))}
                    </ul>
                  ) : "No hay productos"}
                </td>
                <td className={stylesTd}>
                  {venta.productos && Array.isArray(venta.productos) && venta.productos.length > 0 ? (
                    <ul>
                      {venta.productos.map((producto, index) => (
                        <li key={index}>{producto.cantidad}</li>
                      ))}
                    </ul>
                  ) : "-"}
                </td>
                <td className={stylesTd}>${parseFloat(venta.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reporteTipo === "mensual") {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>Día</th>
              <th className={stylesTh}>Total Ventas</th>
              <th className={stylesTh}>Promedio Venta</th>
              <th className={stylesTh}>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, i) => (
              <tr key={i} className="hover:bg-orange-200">
                <td className={stylesTd}>{venta.dia}</td>
                <td className={stylesTd}>{venta.total_ventas}</td>
                <td className={stylesTd}>${parseFloat(venta.promedio_venta).toFixed(2)}</td>
                <td className={stylesTd}>${parseFloat(venta.monto_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reporteTipo === "anual") {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>Mes</th>
              <th className={stylesTh}>Total Ventas</th>
              <th className={stylesTh}>Promedio Venta</th>
              <th className={stylesTh}>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, i) => (
              <tr key={i} className="hover:bg-orange-200">
                <td className={stylesTd}>{venta.nombre_mes}</td>
                <td className={stylesTd}>{venta.total_ventas}</td>
                <td className={stylesTd}>${parseFloat(venta.promedio_venta).toFixed(2)}</td>
                <td className={stylesTd}>${parseFloat(venta.monto_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reporteTipo === "mejores") {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Comprador</th>
              <th className={stylesTh}>Total Compras</th>
              <th className={stylesTh}>Total Productos</th>
              <th className={stylesTh}>Promedio Compra</th>
              <th className={stylesTh}>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((comprador, i) => (
              <tr key={i} className="hover:bg-orange-200">
                <td className={stylesTd}>{comprador.id}</td>
                <td className={stylesTd}>{comprador.nombre}</td>
                <td className={stylesTd}>{comprador.total_compras}</td>
                <td className={stylesTd}>{comprador.total_productos}</td>
                <td className={stylesTd}>${parseFloat(comprador.promedio_compra).toFixed(2)}</td>
                <td className={stylesTd}>${parseFloat(comprador.monto_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (reporteTipo === "productos") {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-orange-300">
          <thead>
            <tr>
              <th className={stylesTh}>ID</th>
              <th className={stylesTh}>Producto</th>
              <th className={stylesTh}>Total Vendido</th>
              <th className={stylesTh}>Veces Comprado</th>
              <th className={stylesTh}>Ingresos Generados</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((producto, i) => (
              <tr key={i} className="hover:bg-orange-200">
                <td className={stylesTd}>{producto.id}</td>
                <td className={stylesTd}>{producto.nombre}</td>
                <td className={stylesTd}>{producto.total_vendido}</td>
                <td className={stylesTd}>{producto.veces_comprado}</td>
                <td className={stylesTd}>${parseFloat(producto.ingresos_generados).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};

export default TablaVentas;