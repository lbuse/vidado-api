# ************************************************************
# Sequel Ace SQL dump
# Versão 20033
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Servidor: raspberrypi.local (MySQL 5.5.5-10.5.15-MariaDB-0+deb11u1)
# Banco de Dados: projetovb
# Tempo de geração: 2022-07-05 00:20:46 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump de tabela Grupos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Grupos`;

CREATE TABLE `Grupos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump de tabela Lojas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Lojas`;

CREATE TABLE `Lojas` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `pais` varchar(255) NOT NULL,
  `uf` varchar(2) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump de tabela Produtos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Produtos`;

CREATE TABLE `Produtos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_grupo` int(11) unsigned NOT NULL,
  `nome` varchar(255) NOT NULL,
  `quantidade_sugerida` int(10) unsigned NOT NULL DEFAULT 1,
  `preco` decimal(10,2) NOT NULL DEFAULT 0.00,
  `preco_custo` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `id_grupo` (`id_grupo`),
  CONSTRAINT `Produtos_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `Grupos` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump de tabela produtos_loja
# ------------------------------------------------------------

DROP TABLE IF EXISTS `produtos_loja`;

CREATE TABLE `produtos_loja` (
  `id_loja` int(11) unsigned NOT NULL,
  `id_produto` int(11) unsigned NOT NULL,
  `preco` decimal(10,2) NOT NULL DEFAULT 0.00,
  KEY `id_loja` (`id_loja`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `produtos_loja_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `Lojas` (`id`),
  CONSTRAINT `produtos_loja_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `Produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump de tabela venda_itens
# ------------------------------------------------------------

DROP TABLE IF EXISTS `venda_itens`;

CREATE TABLE `venda_itens` (
  `id_venda` bigint(20) unsigned NOT NULL,
  `id_produto` int(11) unsigned NOT NULL,
  `quantidade` int(11) unsigned NOT NULL DEFAULT 1,
  `preco_unitario` decimal(10,2) NOT NULL DEFAULT 0.00,
  `observacao` varchar(255) DEFAULT NULL,
  `data_adicao` datetime NOT NULL,
  KEY `id_venda` (`id_venda`),
  KEY `id_produto` (`id_produto`),
  KEY `id_venda__id_produto_idx` (`id_venda`,`id_produto`),
  CONSTRAINT `venda_itens_ibfk_1` FOREIGN KEY (`id_venda`) REFERENCES `vendas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `venda_itens_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `Produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump de tabela vendas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vendas`;

CREATE TABLE `vendas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_loja` int(11) unsigned NOT NULL,
  `nota` varchar(255) NOT NULL,
  `data` datetime NOT NULL,
  `pessoas_atendidas` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `id_loja` (`id_loja`),
  KEY `data` (`data`),
  KEY `id_loja__data_idx` (`id_loja`,`data`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `Lojas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
