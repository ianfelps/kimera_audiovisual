CREATE DATABASE IF NOT EXISTS kimera_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE kimera_db;

-- Tabela 1: Fotos_Perfil
CREATE TABLE IF NOT EXISTS Fotos_Perfil (
    `id_foto` INT NOT NULL AUTO_INCREMENT,
    `url_foto` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(100) NULL,
    PRIMARY KEY (`id_foto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 2: Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    `id_usuario` INT NOT NULL AUTO_INCREMENT,
    `nome_completo` VARCHAR(100) NOT NULL,
    `nome_usuario` VARCHAR(30) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `biografia` VARCHAR(160) NULL,
    `id_foto_perfil` INT NULL DEFAULT 1,
    `data_criacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data_atualizacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_usuario`),
    UNIQUE KEY `idx_nome_usuario_unico` (`nome_usuario`),
    UNIQUE KEY `idx_email_unico` (`email`),
    CONSTRAINT `fk_usuario_foto_perfil`
        FOREIGN KEY (`id_foto_perfil`)
        REFERENCES Fotos_Perfil(`id_foto`)
        ON DELETE SET NULL 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 3: Seguidores
CREATE TABLE IF NOT EXISTS Seguidores (
    `id_seguidor` INT NOT NULL,
    `id_seguindo` INT NOT NULL,
    `data_inicio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_seguidor`, `id_seguindo`), 
    CONSTRAINT `fk_seguidor`
        FOREIGN KEY (`id_seguidor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE, 
    CONSTRAINT `fk_seguindo`
        FOREIGN KEY (`id_seguindo`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 4: Posts
CREATE TABLE IF NOT EXISTS Posts (
    `id_post` INT NOT NULL AUTO_INCREMENT,
    `id_usuario_autor` INT NOT NULL,
    `conteudo_texto` TEXT NOT NULL,
    `data_publicacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_post`),
    CONSTRAINT `fk_post_autor`
        FOREIGN KEY (`id_usuario_autor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 5: Comentarios
CREATE TABLE IF NOT EXISTS Comentarios (
    `id_comentario` INT NOT NULL AUTO_INCREMENT,
    `id_post` INT NOT NULL,
    `id_usuario_autor` INT NOT NULL,
    `texto_comentario` VARCHAR(280) NOT NULL,
    `data_comentario` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_comentario`),
    CONSTRAINT `fk_comentario_post`
        FOREIGN KEY (`id_post`)
        REFERENCES Posts(`id_post`)
        ON DELETE CASCADE, 
    CONSTRAINT `fk_comentario_autor`
        FOREIGN KEY (`id_usuario_autor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 6: Curtidas
CREATE TABLE IF NOT EXISTS Curtidas (
    `id_post` INT NOT NULL,
    `id_usuario_curtiu` INT NOT NULL,
    `data_curtida` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_post`, `id_usuario_curtiu`), 
    CONSTRAINT `fk_curtida_post`
        FOREIGN KEY (`id_post`)
        REFERENCES Posts(`id_post`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_curtida_usuario`
        FOREIGN KEY (`id_usuario_curtiu`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5 opções de fotos de perfil iniciais
INSERT INTO Fotos_Perfil (`id_foto`, `url_foto`, `descricao`) VALUES
(1, '/img/icons/ico01.png', 'Avatar 01'),
(2, '/img/icons/ico02.png', 'Avatar 02'),
(3, '/img/icons/ico03.png', 'Avatar 03'),
(4, '/img/icons/ico04.png', 'Avatar 04'),
(5, '/img/icons/ico05.png', 'Avatar 05'),
(6, '/img/icons/ico06.png', 'Avatar 06'),
(7, '/img/icons/ico07.png', 'Avatar 07')
ON DUPLICATE KEY UPDATE url_foto=VALUES(url_foto), descricao=VALUES(descricao);


CREATE INDEX idx_data_publicacao ON Posts(`data_publicacao` DESC);
CREATE INDEX idx_data_comentario ON Comentarios(`data_comentario` DESC);