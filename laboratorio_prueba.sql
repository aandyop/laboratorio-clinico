SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Estructura de tabla para `medicos`
DROP TABLE IF EXISTS `medicos`;
CREATE TABLE `medicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `codigo_colegiado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_colegiado` (`codigo_colegiado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 2. Estructura de tabla para `pacientes`
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Estructura de tabla para `examenes` (Catálogo de exámenes)
DROP TABLE IF EXISTS `examenes`;
CREATE TABLE `examenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Estructura de tabla para `valores_referencia`
DROP TABLE IF EXISTS `valores_referencia`;
CREATE TABLE `valores_referencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `examen_id` int(11) NOT NULL,
  `minimo` decimal(10,2) DEFAULT NULL,
  `maximo` decimal(10,2) DEFAULT NULL,
  `unidad` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `examen_id` (`examen_id`),
  CONSTRAINT `fk_referencia_examen` FOREIGN KEY (`examen_id`) REFERENCES `examenes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Estructura de tabla para `ordenes`
DROP TABLE IF EXISTS `ordenes`;
CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paciente_id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `fecha_orden` datetime DEFAULT current_timestamp(),
  `estado` enum('Pendiente','En Proceso','Completada') DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `paciente_id` (`paciente_id`),
  KEY `medico_id` (`medico_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ordenes_ibfk_2` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Estructura de tabla para `resultados`
DROP TABLE IF EXISTS `resultados`;
CREATE TABLE `resultados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orden_id` int(11) NOT NULL,
  `examen_id` int(11) NOT NULL,
  `valor_obtenido` varchar(255) DEFAULT NULL,
  `fuera_de_rango` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `examen_id` (`examen_id`),
  CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `resultados_ibfk_2` FOREIGN KEY (`examen_id`) REFERENCES `examenes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Estructura de tabla para `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','USER') DEFAULT 'USER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- DATOS DE PRUEBA (SEEDERS)
INSERT INTO `pacientes` (`id`, `nombre`, `cedula`) VALUES (1, 'Juan Pérez', 'V-123456');
INSERT INTO `medicos` (`id`, `nombre`, `especialidad`) VALUES (1, 'Dra. Elena Rodríguez', 'Medicina General');
INSERT INTO `examenes` (`id`, `nombre`, `precio`) VALUES (1, 'Glucosa en Ayunas', 12.50);
INSERT INTO `valores_referencia` (`examen_id`, `minimo`, `maximo`, `unidad`) VALUES (1, 70.00, 110.00, 'mg/dL');
INSERT INTO `ordenes` (`id`, `paciente_id`, `medico_id`, `estado`) VALUES (1, 1, 1, 'Pendiente');
INSERT INTO `resultados` (`orden_id`, `examen_id`, `valor_obtenido`, `fuera_de_rango`) VALUES (1, 1, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;