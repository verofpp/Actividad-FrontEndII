import express from "express"
const routers = express.Router()

//Importando controladores
import { FincaController } from "../controllers/fincasController.js"
import { LoteController } from "../controllers/loteController.js"
import { TiposCafeController } from "../controllers/tiposcafeController.js"
import { ProductosController } from "../controllers/productosController.js"
import { CompradoresController } from "../controllers/compradoresController.js"
import { VentasController } from "../controllers/ventasController.js"
import { InventarioController } from "../controllers/inventarioController.js"

const fincaController = new FincaController()
const loteController = new LoteController()
const tiposCafeController = new TiposCafeController()
const productosController = new ProductosController()
const compradoresController = new CompradoresController()
const ventasController = new VentasController()
const inventarioController = new InventarioController()

//Rutas de la entidad Fincas
routers.get("/finca", fincaController.mostrarFinca)
routers.get("/finca/:id", fincaController.buscarFinca)
routers.get("/finca/nombre/:nombre", fincaController.buscarNombreFinca)
routers.get("/finca/datos/encargado", fincaController.mostrarEncargadoFinca)
routers.get("/finca/encargado/:encargado", fincaController.buscarEncargadoFinca)
routers.post("/finca", fincaController.crearFinca)
routers.delete("/finca", fincaController.eliminarFinca)
routers.put("/finca/:id", fincaController.editarFinca)

//Rutas de la entidad TiposCafe
routers.get("/tiposcafe", tiposCafeController.mostrarTipoCafe)
routers.get("/tiposcafe/:id", tiposCafeController.buscarTipoCafe)
routers.get("/tiposcafe/nombre/:nombre", tiposCafeController.buscarNombreTipoCafe)
routers.post("/tiposcafe", tiposCafeController.crearTipoCafe)
routers.delete("/tiposcafe", tiposCafeController.eliminarTipoCafe)
routers.put("/tiposcafe/:id", tiposCafeController.editarTipoCafe)

//Rutas de la entidad Productos
routers.get("/producto", productosController.mostrarProductos)
routers.get("/producto/:id", productosController.buscarProductos)
routers.get("/producto/nombre/:nombre", productosController.buscarNombreProductos)
routers.get("/producto/tipo/:tipo_cafe_id", productosController.buscarPorTipoCafe)
routers.post("/producto", productosController.crearProductos)
routers.delete("/producto", productosController.eliminarProductos)
routers.put("/producto/:id", productosController.editarProductos)

//Rutas de la entidad Compradores
routers.get("/comprador", compradoresController.mostrarCompradores)
routers.get("/comprador/:id", compradoresController.buscarCompradores)
routers.get("/comprador/nombre/:nombre", compradoresController.buscarNombreCompradores)
routers.post("/comprador", compradoresController.crearCompradores)
routers.delete("/comprador", compradoresController.eliminarCompradores)
routers.put("/comprador/:id", compradoresController.editarCompradores)

//Rutas de la entidad Lotes
routers.get("/lote", loteController.mostrarLote)
routers.get("/lote/:id", loteController.buscarLote)
routers.get("/lote/finca/:id", loteController.buscarLoteFinca)
routers.get("/lote/fecha/:fecha", loteController.buscarLoteFecha)
routers.get("/lote/tipo/:tipo", loteController.buscarLoteTipo)
routers.get("/lote/tipoListo/:tipo", loteController.buscarLoteTipoListo)
routers.get("/lote/tipoAll/:tipo", loteController.buscarLoteTipoAll)
routers.get("/lote/estado/:estado", loteController.buscarLoteEstado)
routers.post("/lote", loteController.crearLote)
routers.put("/lote/:id", loteController.editarLote)
routers.delete("/lote", loteController.eliminarLote)
routers.post("/lote/cambiarestado", loteController.cambiarEstadoLote)

//Rutas de la entidad Ventas
routers.post("/venta", ventasController.crearVenta)
routers.get("/venta/fecha/:fecha", ventasController.buscarVentaPorFecha)
routers.get("/venta/comprador/:comprador", ventasController.buscarVentaPorComprador)
routers.get("/venta/mensual/:anio/:mes", ventasController.ventasMensuales)
routers.get("/venta/anual/:anio", ventasController.ventasAnuales)
routers.get("/venta/mejorescompradores", ventasController.mejoresCompradores);
routers.get("/venta/productosmasdemandados", ventasController.productosMasDemandados);

//Rutas de la entidad Inventario
routers.get("/inventario/:id", inventarioController.mostrarInventario)
routers.post("/inventario", inventarioController.crearInventario)

export default routers;