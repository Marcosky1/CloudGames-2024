-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-07-2024 a las 01:25:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cloudpf`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertUser` (IN `p_Username` VARCHAR(50))   BEGIN
    INSERT INTO Users (Username)
    VALUES (p_Username)
    ON DUPLICATE KEY UPDATE Username = VALUES(Username);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateScoreVJ1` (IN `p_Username` VARCHAR(50), IN `p_Score` INT)   BEGIN
    -- Insertar o actualizar en VJ1 usando Username
    INSERT INTO VJ1 (Username, Score)
    VALUES (p_Username, p_Score)
    ON DUPLICATE KEY UPDATE
        Score = IF(VALUES(Score) > Score, VALUES(Score), Score);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateScoreVJ2` (IN `p_Username` VARCHAR(50), IN `p_TimeCompleted` TIME)   BEGIN
    -- Insertar o actualizar en VJ2 usando Username
    INSERT INTO VJ2 (Username, TimeCompleted)
    VALUES (p_Username, p_TimeCompleted)
    ON DUPLICATE KEY UPDATE
        TimeCompleted = LEAST(VALUES(TimeCompleted), TimeCompleted);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateScoreVJ3` (IN `p_Username` VARCHAR(50), IN `p_Score` INT, IN `p_Coins` INT)   BEGIN
    -- Insertar o actualizar en VJ3 usando Username
    INSERT INTO VJ3 (Username, Score, Coins)
    VALUES (p_Username, p_Score, p_Coins)
    ON DUPLICATE KEY UPDATE
        Score = IF(VALUES(Score) > Score, VALUES(Score), Score),
        Coins = IF(VALUES(Coins) > Coins, VALUES(Coins), Coins);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`UserID`, `Username`) VALUES
(3, 'Marco'),
(2, 'Raz'),
(1, 'testuser');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `users_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `users_view` (
`UserID` int(11)
,`Username` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vj1`
--

CREATE TABLE `vj1` (
  `ScoreID` int(11) NOT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `Score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vj1`
--

INSERT INTO `vj1` (`ScoreID`, `Username`, `Score`) VALUES
(4, 'testuser', 200),
(5, 'testuser', 300),
(6, 'testuser', 500),
(7, 'Raz', 100),
(8, 'Marco', 20);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vj1_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vj1_view` (
`Username` varchar(50)
,`Score` int(11)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vj2`
--

CREATE TABLE `vj2` (
  `ScoreID` int(11) NOT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `TimeCompleted` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vj2`
--

INSERT INTO `vj2` (`ScoreID`, `Username`, `TimeCompleted`) VALUES
(1, 'Marco', '00:00:38'),
(2, 'Marco', '00:00:38'),
(3, 'Marco', '00:00:20'),
(4, 'Marco', '00:00:20'),
(5, 'Marco', '00:00:40'),
(6, 'Marco', '00:00:40');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vj2_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vj2_view` (
`Username` varchar(50)
,`TimeCompleted` time
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vj3`
--

CREATE TABLE `vj3` (
  `ScoreID` int(11) NOT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `Score` int(11) NOT NULL,
  `Coins` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vj3`
--

INSERT INTO `vj3` (`ScoreID`, `Username`, `Score`, `Coins`) VALUES
(1, 'Marco', 40, 200);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vj3_view`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vj3_view` (
`Username` varchar(50)
,`Score` int(11)
,`Coins` int(11)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `users_view`
--
DROP TABLE IF EXISTS `users_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `users_view`  AS SELECT `users`.`UserID` AS `UserID`, `users`.`Username` AS `Username` FROM `users` ORDER BY `users`.`Username` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vj1_view`
--
DROP TABLE IF EXISTS `vj1_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vj1_view`  AS SELECT `v`.`Username` AS `Username`, `v`.`Score` AS `Score` FROM (`vj1` `v` join `users` `u` on(`v`.`Username` = `u`.`Username`)) ORDER BY `v`.`Score` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vj2_view`
--
DROP TABLE IF EXISTS `vj2_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vj2_view`  AS SELECT `v`.`Username` AS `Username`, `v`.`TimeCompleted` AS `TimeCompleted` FROM (`vj2` `v` join `users` `u` on(`v`.`Username` = `u`.`Username`)) ORDER BY `v`.`TimeCompleted` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vj3_view`
--
DROP TABLE IF EXISTS `vj3_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vj3_view`  AS SELECT `v`.`Username` AS `Username`, `v`.`Score` AS `Score`, `v`.`Coins` AS `Coins` FROM (`vj3` `v` join `users` `u` on(`v`.`Username` = `u`.`Username`)) ORDER BY `v`.`Score` DESC ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- Indices de la tabla `vj1`
--
ALTER TABLE `vj1`
  ADD PRIMARY KEY (`ScoreID`),
  ADD KEY `Username` (`Username`);

--
-- Indices de la tabla `vj2`
--
ALTER TABLE `vj2`
  ADD PRIMARY KEY (`ScoreID`),
  ADD KEY `Username` (`Username`);

--
-- Indices de la tabla `vj3`
--
ALTER TABLE `vj3`
  ADD PRIMARY KEY (`ScoreID`),
  ADD KEY `Username` (`Username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `vj1`
--
ALTER TABLE `vj1`
  MODIFY `ScoreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `vj2`
--
ALTER TABLE `vj2`
  MODIFY `ScoreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `vj3`
--
ALTER TABLE `vj3`
  MODIFY `ScoreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `vj1`
--
ALTER TABLE `vj1`
  ADD CONSTRAINT `vj1_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `users` (`Username`);

--
-- Filtros para la tabla `vj2`
--
ALTER TABLE `vj2`
  ADD CONSTRAINT `vj2_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `users` (`Username`);

--
-- Filtros para la tabla `vj3`
--
ALTER TABLE `vj3`
  ADD CONSTRAINT `vj3_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `users` (`Username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
