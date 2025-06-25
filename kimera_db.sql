-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS kimera_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados para usar
USE kimera_db;

-- Tabela 1: Fotos_Perfil
-- Armazena as fotos pré-definidas que os usuários podem escolher.
CREATE TABLE IF NOT EXISTS Fotos_Perfil (
    `id_foto` INT NOT NULL AUTO_INCREMENT,
    `url_foto` VARCHAR(255) NOT NULL,
    `descricao` VARCHAR(100) NULL,
    PRIMARY KEY (`id_foto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 2: Usuarios
-- Tabela principal que armazena os dados dos usuários.
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
        ON DELETE SET NULL  -- Se uma foto for deletada, o perfil do usuário fica sem foto, mas o usuário não é deletado.
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 3: Seguidores
-- Tabela de junção para a relação N:N entre usuários (quem segue quem).
CREATE TABLE IF NOT EXISTS Seguidores (
    `id_seguidor` INT NOT NULL,
    `id_seguindo` INT NOT NULL,
    `data_inicio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_seguidor`, `id_seguindo`), -- Chave composta impede seguir a mesma pessoa duas vezes
    CONSTRAINT `fk_seguidor`
        FOREIGN KEY (`id_seguidor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE, -- Se o seguidor deletar a conta, o registro é removido.
    CONSTRAINT `fk_seguindo`
        FOREIGN KEY (`id_seguindo`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE -- Se quem é seguido deletar a conta, o registro é removido.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 4: Posts
-- Armazena as publicações de texto dos usuários.
CREATE TABLE IF NOT EXISTS Posts (
    `id_post` INT NOT NULL AUTO_INCREMENT,
    `id_usuario_autor` INT NOT NULL,
    `conteudo_texto` TEXT NOT NULL,
    `data_publicacao` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_post`),
    CONSTRAINT `fk_post_autor`
        FOREIGN KEY (`id_usuario_autor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE -- Se o autor for deletado, seus posts também são.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 5: Comentarios
-- Armazena os comentários feitos em um post.
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
        ON DELETE CASCADE, -- Se o post for deletado, seus comentários também são.
    CONSTRAINT `fk_comentario_autor`
        FOREIGN KEY (`id_usuario_autor`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE -- Se o autor do comentário for deletado, seus comentários também são.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela 6: Curtidas
-- Tabela de junção para registrar qual usuário curtiu qual post.
CREATE TABLE IF NOT EXISTS Curtidas (
    `id_post` INT NOT NULL,
    `id_usuario_curtiu` INT NOT NULL,
    `data_curtida` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id_post`, `id_usuario_curtiu`), -- Chave composta impede curtir o mesmo post duas vezes
    CONSTRAINT `fk_curtida_post`
        FOREIGN KEY (`id_post`)
        REFERENCES Posts(`id_post`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_curtida_usuario`
        FOREIGN KEY (`id_usuario_curtiu`)
        REFERENCES Usuarios(`id_usuario`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Inserindo as 5 opções de fotos de perfil iniciais
INSERT INTO Fotos_Perfil (`id_foto`, `url_foto`, `descricao`) VALUES
(1, '/img/icons/ico01.png', 'Avatar 01'),
(2, '/img/icons/ico02.png', 'Avatar 02'),
(3, '/img/icons/ico03.png', 'Avatar 03'),
(4, '/img/icons/ico04.png', 'Avatar 04'),
(5, '/img/icons/ico05.png', 'Avatar 05')
ON DUPLICATE KEY UPDATE url_foto=VALUES(url_foto), descricao=VALUES(descricao);


CREATE INDEX idx_data_publicacao ON Posts(`data_publicacao` DESC);
CREATE INDEX idx_data_comentario ON Comentarios(`data_comentario` DESC);