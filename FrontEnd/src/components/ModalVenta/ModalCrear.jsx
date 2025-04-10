import { useState, useEffect } from "react";
import { crearVenta } from "../../services/VentasService";
import { mostrarComprador } from "../../services/CompradoresService";
import { mostrarProductos } from "../../services/ProductosService";

const ModalCrearVenta = ({ isOpen, onClose, refreshVentas, onSuccess }) => {
  const [formData, setFormData] = useState({
    comprador_id: "",
    comprador_nombre: "",
    fecha_venta: new Date().toISOString().split('T')[0],
    total: 0,
    productos: []
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: "",
    producto_nombre: "",
    presentacion: "",
    precio: 0,
    cantidad: 1,
    subtotal: 0,
    tipo_cafe: ""
  });

  const [compradores, setCompradores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingCompradores, setLoadingCompradores] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCompradores();
      fetchProductos();
      resetForm();
    }
  }, [isOpen]);

  const fetchCompradores = async () => {
    setLoadingCompradores(true);
    try {
      const data = await mostrarComprador();
      setCompradores(data || []);
    } catch (err) {
      console.error("Error al cargar compradores:", err);
      setError("Error al cargar lista de compradores");
    } finally {
      setLoadingCompradores(false);
    }
  };

  const fetchProductos = async () => {
    setLoadingProductos(true);
    try {
      const data = await mostrarProductos();
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar lista de productos");
    } finally {
      setLoadingProductos(false);
    }
  };

  const resetForm = () => {
    setFormData({
      comprador_id: "",
      comprador_nombre: "",
      fecha_venta: new Date().toISOString().split('T')[0],
      total: 0,
      productos: []
    });
    setNuevoProducto({
      producto_id: "",
      producto_nombre: "",
      presentacion: "",
      precio: 0,
      cantidad: 1,
      subtotal: 0,
      tipo_cafe: ""
    });
    setError(null);
    setSubmitAttempted(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCompradorChange = (e) => {
    const selectedId = e.target.value;
    const selectedComprador = compradores.find(c => c.id.toString() === selectedId);
    
    setFormData({
      ...formData,
      comprador_id: selectedId,
      comprador_nombre: selectedComprador?.nombre || ""
    });
  };

  const handleProductoSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedProducto = productos.find(p => p.id.toString() === selectedId);
    
    if (selectedProducto) {
      setNuevoProducto({
        ...nuevoProducto,
        producto_id: selectedId,
        producto_nombre: selectedProducto.nombre,
        presentacion: selectedProducto.presentacion,
        precio: selectedProducto.precio || 0,
        subtotal: (selectedProducto.precio || 0) * nuevoProducto.cantidad,
        tipo_cafe: selectedProducto.tipo_cafe_id || selectedProducto.tipo_cafe || ""
      });
    }
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 0;
    const subtotal = cantidad * nuevoProducto.precio;
    
    setNuevoProducto({
      ...nuevoProducto,
      cantidad,
      subtotal
    });
  };

  const agregarProducto = () => {
    if (!nuevoProducto.producto_id) {
      setError("¡Atención! Debe seleccionar un producto para agregar");
      return;
    }

    if (nuevoProducto.cantidad <= 0) {
      setError("¡Atención! La cantidad debe ser mayor a cero");
      return;
    }

    const productoExistente = formData.productos.find(
      p => p.producto_id === nuevoProducto.producto_id
    );

    if (productoExistente) {
      setError("Este producto ya fue agregado a la venta");
      return;
    }

    setFormData({
      ...formData,
      productos: [
        ...formData.productos,
        {
          producto_id: nuevoProducto.producto_id,
          cantidad: nuevoProducto.cantidad,
          tipo_cafe: nuevoProducto.tipo_cafe
        }
      ],
      total: formData.total + nuevoProducto.subtotal
    });

    setNuevoProducto({
      producto_id: "",
      producto_nombre: "",
      presentacion: "",
      precio: 0,
      cantidad: 1,
      subtotal: 0,
      tipo_cafe: ""
    });
    
    setError(null);
  };

  const eliminarProducto = (index) => {
    const productoEliminado = formData.productos[index];
    const nuevosProductos = [...formData.productos];
    nuevosProductos.splice(index, 1);
    
    const productoInfo = productos.find(p => p.id.toString() === productoEliminado.producto_id);
    const subtotalEliminado = productoInfo ? 
      (productoInfo.precio || 0) * productoEliminado.cantidad : 0;
    
    setFormData({
      ...formData,
      productos: nuevosProductos,
      total: formData.total - subtotalEliminado
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);

    const errors = [];
    
    if (!formData.comprador_id) {
      errors.push("comprador");
    }

    if (formData.productos.length === 0) {
      errors.push("productos");
    }

    if (errors.length > 0) {
      if (errors.includes("comprador") && errors.includes("productos")) {
        setError("¡Error! Debe seleccionar un comprador y agregar al menos un producto");
      } else if (errors.includes("comprador")) {
        setError("¡Error! Debe seleccionar un comprador para realizar la venta");
      } else {
        setError("¡Error! Debe agregar al menos un producto para realizar la venta");
      }
      return;
    }

    try {
      const ventaData = {
        comprador_id: parseInt(formData.comprador_id),
        fecha_venta: formData.fecha_venta,
        total: formData.total,
        productos: formData.productos.map(p => ({
          producto_id: parseInt(p.producto_id),
          cantidad: parseInt(p.cantidad),
          tipo_cafe: p.tipo_cafe
        }))
      };

      await crearVenta(ventaData);
      refreshVentas();
      onClose();
      onSuccess("¡Venta creada exitosamente!");
    } catch (err) {
      setError(err.message || "Error al crear la venta");
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

        <h2 className="text-3xl font-bold text-orange-800 mb-6">Nueva Venta</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center">
                <img
                  src="/icons/error_icon.svg"
                  alt="Error"
                  className="w-6 h-6 mr-2"
                />
                <span className="font-semibold">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`bg-orange-200 p-4 rounded-lg ${
              submitAttempted && !formData.comprador_id ? "ring-2 ring-red-500" : ""
            }`}>
              <div className="font-bold text-orange-900 mb-2">Comprador</div>
              {loadingCompradores ? (
                <div className="bg-orange-100 text-orange-950 rounded-full h-10 px-4 flex items-center">
                  Cargando...
                </div>
              ) : (
                <div className="flex flex-col">
                  <select
                    name="comprador_id"
                    value={formData.comprador_id}
                    onChange={handleCompradorChange}
                    className={`bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none ${
                      submitAttempted && !formData.comprador_id ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <option value="">Seleccione comprador</option>
                    {compradores.map(comprador => (
                      <option key={comprador.id} value={comprador.id}>
                        {comprador.nombre}
                      </option>
                    ))}
                  </select>
                  {submitAttempted && !formData.comprador_id && (
                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-lg flex items-start">
                      <img
                        src="/icons/error_icon.svg"
                        alt="Error"
                        className="w-5 h-5 mr-1"
                      />
                      <span>Seleccione un comprador para continuar</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-orange-200 p-4 rounded-lg">
              <div className="font-bold text-orange-900 mb-2">Fecha</div>
              <input
                type="date"
                name="fecha_venta"
                value={formData.fecha_venta}
                onChange={handleInputChange}
                className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
              />
            </div>
          </div>

          <div className={`mb-6 bg-orange-200 p-4 rounded-lg ${
            submitAttempted && formData.productos.length === 0 ? "ring-2 ring-red-500" : ""
          }`}>
            <h3 className="text-xl font-semibold text-orange-900 mb-4">Productos</h3>
            
            {submitAttempted && formData.productos.length === 0 && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center">
                  <img
                    src="/icons/error_icon.svg"
                    alt="Error"
                    className="w-6 h-6 mr-2"
                  />
                  <span className="font-semibold">¡Atención! No hay productos agregados</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="col-span-2">
                <div className="font-bold text-orange-900 mb-2">Producto</div>
                {loadingProductos ? (
                  <div className="bg-orange-100 text-orange-950 rounded-full h-10 px-4 flex items-center">
                    Cargando productos...
                  </div>
                ) : (
                  <select
                    name="producto_id"
                    value={nuevoProducto.producto_id}
                    onChange={handleProductoSelectChange}
                    className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                  >
                    <option value="">Seleccione producto</option>
                    {productos.map(producto => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - {producto.presentacion}g {producto.tipo_cafe_id && `(${producto.tipo_cafe_id})`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div>
                <div className="font-bold text-orange-900 mb-2">Precio</div>
                <input
                  type="number"
                  value={nuevoProducto.precio}
                  readOnly
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                />
              </div>
              
              <div>
                <div className="font-bold text-orange-900 mb-2">Cantidad</div>
                <input
                  type="number"
                  name="cantidad"
                  value={nuevoProducto.cantidad}
                  onChange={handleCantidadChange}
                  min="1"
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                />
              </div>
              
              <div>
                <div className="font-bold text-orange-900 mb-2">Subtotal</div>
                <input
                  type="number"
                  value={nuevoProducto.subtotal}
                  readOnly
                  className="bg-orange-100 text-orange-950 rounded-full h-10 w-full px-4 outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={agregarProducto}
              className="px-4 py-2 bg-orange-400 text-orange-900 rounded-full hover:bg-orange-500 transition-colors"
            >
              Añadir Producto
            </button>
          </div>

          {formData.productos.length > 0 && (
            <div className="mb-6 bg-orange-200 p-4 rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-400">
                    <th className="text-left py-2 font-bold text-orange-900">Producto</th>
                    <th className="text-left py-2 font-bold text-orange-900">Presentación</th>
                    <th className="text-left py-2 font-bold text-orange-900">Tipo de Café</th>
                    <th className="text-center py-2 font-bold text-orange-900">Precio</th>
                    <th className="text-center py-2 font-bold text-orange-900">Cantidad</th>
                    <th className="text-center py-2 font-bold text-orange-900">Subtotal</th>
                    <th className="text-center py-2 font-bold text-orange-900">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.productos.map((producto, index) => {
                    const productoInfo = productos.find(p => p.id.toString() === producto.producto_id);
                    const subtotal = productoInfo ? 
                      (productoInfo.precio || 0) * producto.cantidad : 0;
                    
                    return (
                      <tr key={index} className="border-b border-orange-300">
                        <td className="py-2">{productoInfo?.nombre || "N/A"}</td>
                        <td className="py-2">{productoInfo?.presentacion || "N/A"}g</td>
                        <td className="py-2">{productoInfo?.tipo_cafe_id || "N/A"}</td>
                        <td className="text-center">${productoInfo?.precio || "0"}</td>
                        <td className="text-center">{producto.cantidad}</td>
                        <td className="text-center">${subtotal}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-right font-bold py-2">Total:</td>
                    <td className="text-center font-bold">${formData.total}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-xl font-bold"
            >
              Guardar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearVenta;