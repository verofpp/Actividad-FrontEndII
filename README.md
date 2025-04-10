# Actividad-FrontEndII
Actividad de FrontEndII, Sistema de Administración de una Cafetalera. Verónica Parra v-30.600.365, Cristhofer Solarte v-30.959.561. Universidad Valle del Momboy. Marzo 2025.

# React + Vite
Pasos para la Instalación:
1- Descargar o clonar el repositorio
2- Descargar la base de datos e importarla en sql, con el nombre "Cafetalera"
3- Realizar la configuración necesaria, en los archivos .env

- Dentro de la carpeta Backend
Archivo: ".env":

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=Cafetalera

PORT = 4000

- Dentro de la carpeta de FrontEnd
Archivo: ".env.local":

VITE_API_URL = http://localhost:4000
VITE_API_TIMEOUT = 5000

VITE_API_FINCAS = /finca
VITE_API_FINCAS_NOMBRE = /finca/nombre
VITE_API_FINCAS_ENCARGADO = /finca/encargado

VITE_API_PRODUCTOS = /producto
VITE_API_PRODUCTOS_TIPO = /producto/tipo
VITE_API_PRODUCTOS_NOMBRE = /producto/nombre

VITE_API_TIPOSCAFE = /tiposcafe
VITE_API_TIPOSCAFE_NOMBRE = /tiposcafe/nombre

VITE_API_COMPRADORES = /comprador
VITE_API_COMPRADORES_NOMBRE = /comprador/nombre

VITE_API_LOTE = /lote
VITE_API_LOTE_FINCA = /lote/finca
VITE_API_LOTE_FECHA = /lote/fecha
VITE_API_LOTE_TIPO = /lote/tipo
VITE_API_LOTE_TIPOLISTO = /lote/tipoListo
VITE_API_LOTE_ESTADO = /lote/estado
VITE_API_LOTE_CAMBIARESTADO = /lote/cambiarestado
VITE_API_LOTE_TIPOALL = /lote/tipoAll

VITE_API_INVENTARIO = /inventario

VITE_API_VENTAS = /venta
VITE_API_VENTAS_FECHA = /venta/fecha
VITE_API_VENTAS_COMPRADOR = /venta/comprador
VITE_API_VENTAS_MENSUAL = /venta/mensual
VITE_API_VENTAS_ANUAL = /venta/anual
VITE_API_MEJORES_COMPRADORES = /venta/mejorescompradores
VITE_API_PRODUCTOS_DEMANDADOS = /venta/productosmasdemandados

4- Abrir la terminal dentro de la carpeta "Backend" y correr el comando: "npm i" para instalar las dependencias
5- Repetir el paso 4 dentro de la carpeta "FrontEnd"
6- Dentro de la carpeta "Backend" y correr el comando: "node --run dev"
7- Repetir el paso 6 dentro de la carpeta "FrontEnd"
8- Abrir en el navegador http://localhost:3000