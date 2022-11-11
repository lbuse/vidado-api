-- --------------------------------------------------------
-- Servidor:                     192.168.10.28
-- Versão do servidor:           10.5.15-MariaDB-0+deb11u1 - Raspbian 11
-- OS do Servidor:               debian-linux-gnueabihf
-- HeidiSQL Versão:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para projetovb
DROP DATABASE IF EXISTS `projetovb`;
CREATE DATABASE IF NOT EXISTS `projetovb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `projetovb`;

-- Copiando estrutura para tabela projetovb.Autenticacao
DROP TABLE IF EXISTS `Autenticacao`;
CREATE TABLE IF NOT EXISTS `Autenticacao` (
  `id_usuario` int(11) unsigned NOT NULL,
  `token` text NOT NULL,
  `expiracao` date NOT NULL,
  KEY `FK_Autenticacao_Usuario` (`id_usuario`),
  CONSTRAINT `FK_Autenticacao_Usuario` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabela destinada a manutenção de emitidos aos usuários, pemitindo a renovação';

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Grupos
DROP TABLE IF EXISTS `Grupos`;
CREATE TABLE IF NOT EXISTS `Grupos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Lojas
DROP TABLE IF EXISTS `Lojas`;
CREATE TABLE IF NOT EXISTS `Lojas` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_matriz` int(11) unsigned NOT NULL,
  `nome` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `pais` varchar(255) NOT NULL,
  `uf` varchar(2) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Lojas_Matriz` (`id_matriz`),
  CONSTRAINT `FK_Lojas_Matriz` FOREIGN KEY (`id_matriz`) REFERENCES `Matriz` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Matriz
DROP TABLE IF EXISTS `Matriz`;
CREATE TABLE IF NOT EXISTS `Matriz` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `dominio` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='Tabela que contem dados das matrizes das lojas';

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Produtos
DROP TABLE IF EXISTS `Produtos`;
CREATE TABLE IF NOT EXISTS `Produtos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_grupo` int(11) unsigned NOT NULL,
  `nome` varchar(255) NOT NULL,
  `quantidade_sugerida` int(10) unsigned NOT NULL DEFAULT 1,
  `preco` decimal(10,2) NOT NULL DEFAULT 0.00,
  `preco_custo` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `id_grupo` (`id_grupo`),
  CONSTRAINT `Produtos_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `Grupos` (`id`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.produtos_loja
DROP TABLE IF EXISTS `produtos_loja`;
CREATE TABLE IF NOT EXISTS `produtos_loja` (
  `id_loja` int(11) unsigned NOT NULL,
  `id_produto` int(11) unsigned NOT NULL,
  `preco` decimal(10,2) NOT NULL DEFAULT 0.00,
  KEY `id_loja` (`id_loja`),
  KEY `id_produto` (`id_produto`),
  CONSTRAINT `produtos_loja_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `Lojas` (`id`),
  CONSTRAINT `produtos_loja_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `Produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Recuperacao_senha
DROP TABLE IF EXISTS `Recuperacao_senha`;
CREATE TABLE IF NOT EXISTS `Recuperacao_senha` (
  `id_usuario` int(11) unsigned NOT NULL,
  `codigo` smallint(5) unsigned NOT NULL DEFAULT 0,
  `expiracao` datetime DEFAULT NULL,
  KEY `FK_Recuperacao_senha_Usuario` (`id_usuario`),
  CONSTRAINT `FK_Recuperacao_senha_Usuario` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabela desintada ao processo de recuperação de senha';

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.Usuario
DROP TABLE IF EXISTS `Usuario`;
CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `dominio` varchar(255) NOT NULL,
  `ativo` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.vendas
DROP TABLE IF EXISTS `vendas`;
CREATE TABLE IF NOT EXISTS `vendas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `id_loja` int(11) unsigned NOT NULL,
  `nota` varchar(255) NOT NULL,
  `data` datetime NOT NULL,
  `pessoas_atendidas` int(11) NOT NULL DEFAULT 1,
  `satisfacao` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendas_index_4` (`id_loja`,`data`),
  KEY `id_loja` (`id_loja`),
  KEY `data` (`data`),
  CONSTRAINT `vendas_ibfk_1` FOREIGN KEY (`id_loja`) REFERENCES `Lojas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130968 DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela projetovb.venda_itens
DROP TABLE IF EXISTS `venda_itens`;
CREATE TABLE IF NOT EXISTS `venda_itens` (
  `id_venda` bigint(20) unsigned NOT NULL,
  `id_produto` int(11) unsigned NOT NULL,
  `quantidade` int(11) unsigned NOT NULL DEFAULT 1,
  `preco_unitario` decimal(10,2) NOT NULL DEFAULT 0.00,
  `observacao` varchar(255) DEFAULT NULL,
  `data_adicao` datetime NOT NULL,
  KEY `id_venda` (`id_venda`),
  KEY `id_produto` (`id_produto`),
  KEY `venda_itens_index_3` (`id_venda`,`id_produto`),
  CONSTRAINT `venda_itens_ibfk_1` FOREIGN KEY (`id_venda`) REFERENCES `vendas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `venda_itens_ibfk_2` FOREIGN KEY (`id_produto`) REFERENCES `Produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportação de dados foi desmarcado.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
