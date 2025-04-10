-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-04-2025 a las 06:18:41
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `Cafetalera`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `CambioEstados`
--

CREATE TABLE `CambioEstados` (
  `id` int(11) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `lote_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Compradores`
--

CREATE TABLE `Compradores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `DetalleVentas`
--

CREATE TABLE `DetalleVentas` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Fincas`
--

CREATE TABLE `Fincas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `dirección` varchar(30) NOT NULL,
  `encargado` varchar(30) NOT NULL,
  `teléfono` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Inventario`
--

CREATE TABLE `Inventario` (
  `id` int(11) NOT NULL,
  `lote_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `cantidad_vendido` decimal(10,2) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Lotes`
--

CREATE TABLE `Lotes` (
  `id` int(11) NOT NULL,
  `finca_id` int(11) DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cantidad_kilos` decimal(10,2) DEFAULT NULL,
  `kilos_restante` decimal(10,2) DEFAULT NULL,
  `tipo_cafe_id` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'Cosechado',
  `porcentaje_perdido` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Productos`
--

CREATE TABLE `Productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `presentacion` int(10) DEFAULT NULL,
  `tipo_cafe_id` int(11) DEFAULT NULL,
  `precio` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TiposCafe`
--

CREATE TABLE `TiposCafe` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Ventas`
--

CREATE TABLE `Ventas` (
  `id` int(11) NOT NULL,
  `comprador_id` int(11) DEFAULT NULL,
  `fecha_venta` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `CambioEstados`
--
ALTER TABLE `CambioEstados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote_id` (`lote_id`) USING BTREE;

--
-- Indices de la tabla `Compradores`
--
ALTER TABLE `Compradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `DetalleVentas`
--
ALTER TABLE `DetalleVentas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venta_id` (`venta_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `Fincas`
--
ALTER TABLE `Fincas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `Inventario`
--
ALTER TABLE `Inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote_id` (`lote_id`),
  ADD KEY `producto_id` (`producto_id`);

--
-- Indices de la tabla `Lotes`
--
ALTER TABLE `Lotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `finca_id` (`finca_id`),
  ADD KEY `tipo_cafe_id` (`tipo_cafe_id`);

--
-- Indices de la tabla `Productos`
--
ALTER TABLE `Productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_cafe_id` (`tipo_cafe_id`);

--
-- Indices de la tabla `TiposCafe`
--
ALTER TABLE `TiposCafe`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Ventas`
--
ALTER TABLE `Ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comprador_id` (`comprador_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `CambioEstados`
--
ALTER TABLE `CambioEstados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Compradores`
--
ALTER TABLE `Compradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `DetalleVentas`
--
ALTER TABLE `DetalleVentas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Fincas`
--
ALTER TABLE `Fincas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Inventario`
--
ALTER TABLE `Inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Lotes`
--
ALTER TABLE `Lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Productos`
--
ALTER TABLE `Productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `TiposCafe`
--
ALTER TABLE `TiposCafe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Ventas`
--
ALTER TABLE `Ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `CambioEstados`
--
ALTER TABLE `CambioEstados`
  ADD CONSTRAINT `cambioestados_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `Lotes` (`id`);

--
-- Filtros para la tabla `DetalleVentas`
--
ALTER TABLE `DetalleVentas`
  ADD CONSTRAINT `detalleventas_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `Ventas` (`id`),
  ADD CONSTRAINT `detalleventas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`id`);

--
-- Filtros para la tabla `Inventario`
--
ALTER TABLE `Inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `Lotes` (`id`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `Productos` (`id`);

--
-- Filtros para la tabla `Lotes`
--
ALTER TABLE `Lotes`
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`finca_id`) REFERENCES `Fincas` (`id`),
  ADD CONSTRAINT `lotes_ibfk_2` FOREIGN KEY (`tipo_cafe_id`) REFERENCES `TiposCafe` (`id`);

--
-- Filtros para la tabla `Productos`
--
ALTER TABLE `Productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`tipo_cafe_id`) REFERENCES `TiposCafe` (`id`);

--
-- Filtros para la tabla `Ventas`
--
ALTER TABLE `Ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`comprador_id`) REFERENCES `Compradores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
