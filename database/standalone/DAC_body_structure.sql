USE casemix_dev; -- replace with your database name

DROP TABLE IF EXISTS `body_structure`;

CREATE TABLE `body_structure` (
  `id` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `body_structure` (`id`, `description`) VALUES (80891009, 'Heart structure (body structure)');
INSERT INTO `body_structure` (`id`, `description`) VALUES (45595009, 'Laparoscopic cholecystectomy');
INSERT INTO `body_structure` (`id`, `description`) VALUES (27865001, 'Bilateral mastectomy ');
