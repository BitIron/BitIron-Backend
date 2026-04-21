-- =========================================================================
-- 1. CONTINGENCIA Y CREACIÓN DE LA BASE DE DATOS
-- =========================================================================
DROP DATABASE IF EXISTS bitiron_db;
CREATE DATABASE bitiron_db;
USE bitiron_db;

-- =========================================================================
-- 2. CREACIÓN DE TABLAS (Estructura base)
-- =========================================================================

CREATE TABLE CATEGORIA (
    IdCategoria  INT AUTO_INCREMENT PRIMARY KEY,
    Nombre       VARCHAR(100) NOT NULL,
    Descripcion  TEXT,
    Imagen_Url   VARCHAR(255)
);

CREATE TABLE PRODUCTO (
    IdProducto          INT AUTO_INCREMENT PRIMARY KEY,
    Nombre              VARCHAR(255) NOT NULL,
    Descripcion         TEXT,
    Precio              DECIMAL(10,2) NOT NULL,
    Stock               INT NOT NULL DEFAULT 0,
    Imagen_Url          VARCHAR(255),
    Genero              ENUM('hombre', 'mujer', 'unisex') NOT NULL DEFAULT 'unisex',
    Marca               VARCHAR(100),
    ObjetivoRecomendado VARCHAR(50), 
    Activo              BOOLEAN NOT NULL DEFAULT TRUE,
    IdCategoria         INT NOT NULL
);

CREATE TABLE CLIENTE (
    IdCliente       INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto  VARCHAR(255) NOT NULL,
    Email           VARCHAR(255) NOT NULL UNIQUE,
    Password_Hash   VARCHAR(255) NOT NULL,
    Rol             ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    ObjetivoFitness VARCHAR(100),
    FechaRegistro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ASESORIA (
    IdAsesoria    INT AUTO_INCREMENT PRIMARY KEY,
    TipoPlan      VARCHAR(100) NOT NULL,
    PrecioMensual DECIMAL(10,2) NOT NULL,
    FechaInicio   DATE NOT NULL DEFAULT (CURRENT_DATE),
    FechaFin      DATE,
    PagadoAlDia   BOOLEAN NOT NULL DEFAULT FALSE,
    EstadoActivo  BOOLEAN DEFAULT TRUE,
    IdCliente     INT NOT NULL
);

CREATE TABLE PEDIDO (
    IdPedido    INT AUTO_INCREMENT PRIMARY KEY,
    FechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalPagar  DECIMAL(10,2) NOT NULL DEFAULT 0,
    IdCliente   INT NOT NULL
);

CREATE TABLE DETALLE_PEDIDO (
    IdDetalle      INT AUTO_INCREMENT PRIMARY KEY,
    IdPedido       INT NOT NULL,
    IdProducto     INT NOT NULL,
    Cantidad       INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE CARRITO (
    IdCarrito     INT AUTO_INCREMENT PRIMARY KEY,
    IdCliente     INT NOT NULL,
    IdProducto    INT NOT NULL,
    Cantidad      INT NOT NULL DEFAULT 1,
    FechaAgregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 3. RESTRICCIONES (Claves Foráneas y validaciones lógicas)
-- =========================================================================

-- Relaciones (Foreign Keys)
ALTER TABLE PRODUCTO ADD CONSTRAINT FK_Producto_Categoria
    FOREIGN KEY (IdCategoria) REFERENCES CATEGORIA(IdCategoria) ON DELETE RESTRICT;

ALTER TABLE ASESORIA ADD CONSTRAINT FK_Asesoria_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE PEDIDO ADD CONSTRAINT FK_Pedido_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT FK_Detalle_Pedido
    FOREIGN KEY (IdPedido) REFERENCES PEDIDO(IdPedido) ON DELETE CASCADE;

ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT FK_Detalle_Producto
    FOREIGN KEY (IdProducto) REFERENCES PRODUCTO(IdProducto) ON DELETE RESTRICT;

ALTER TABLE CARRITO ADD CONSTRAINT FK_Carrito_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE CARRITO ADD CONSTRAINT FK_Carrito_Producto
    FOREIGN KEY (IdProducto) REFERENCES PRODUCTO(IdProducto) ON DELETE CASCADE;

-- Validaciones de Integridad (Check Constraints)
ALTER TABLE PRODUCTO ADD CONSTRAINT CK_Prod_Precio CHECK (Precio >= 0);
ALTER TABLE PRODUCTO ADD CONSTRAINT CK_Prod_Stock  CHECK (Stock >= 0);
ALTER TABLE ASESORIA ADD CONSTRAINT CK_Ases_Precio CHECK (PrecioMensual >= 0);
ALTER TABLE CLIENTE ADD CONSTRAINT CK_Cliente_Email CHECK (Email LIKE '%@%.%');
ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT CK_Detalle_Cant CHECK (Cantidad > 0);
ALTER TABLE CARRITO ADD CONSTRAINT CK_Carrito_Cant CHECK (Cantidad > 0);

-- =========================================================================
-- 4. PARAMETRIZACIÓN E INSERTS INICIALES (Con Transacciones)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE DETALLE_PEDIDO;
TRUNCATE TABLE PEDIDO;
TRUNCATE TABLE CARRITO;
TRUNCATE TABLE ASESORIA;
TRUNCATE TABLE PRODUCTO;
TRUNCATE TABLE CATEGORIA;
TRUNCATE TABLE CLIENTE;
SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

INSERT INTO CATEGORIA (IdCategoria, Nombre, Descripcion) VALUES
(1, 'Suplementacion', 'Proteinas, creatinas y vitaminas de alto rendimiento.'),
(2, 'Equipamiento',   'Cinturones, straps y accesorios de gimnasio.'),
(3, 'Ropa Fitness',   'Textil deportivo de alta calidad.');

INSERT INTO PRODUCTO (IdProducto, Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
(1, 'Proteina Whey Isolate', 'Aislado de suero.',       45.99, 50,  'unisex', 'Optimum',   'Volumen',    1),
(2, 'Creatina Monohidrato',  'Pura 100% sin sabor.',    24.50, 120, 'unisex', 'MyProtein', 'Volumen',    1),
(3, 'Cinturon Powerlifting', 'Cuero 10mm palanca.',     55.00, 15,  'hombre', 'RDX',       'Fuerza',     2),
(4, 'Camiseta Oversize',     'Algodon premium negro.',  22.00, 60,  'unisex', 'BIT-ITRON', 'Estetica',   3),
(5, 'Quemador L-Carnitina',  'Acelera perdida grasa.',  19.99, 40,  'unisex', 'Amix',      'Definicion', 1);

INSERT INTO CLIENTE (IdCliente, NombreCompleto, Email, Password_Hash, Rol, ObjetivoFitness) VALUES
(1, 'Juan Garcia', 'juan@example.com', 'hash_1', 'cliente', 'Volumen'),
(2, 'Ana Lopez',   'ana@example.com',  'hash_2', 'cliente', 'Definicion'),
(3, 'Admin BIT',   'admin@bitiron.com','hash_3', 'admin',   NULL);

INSERT INTO ASESORIA (IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia) VALUES
(1, 'Volumen',    49.99, '2025-04-01', TRUE),
(2, 'Definicion', 59.99, '2025-04-01', TRUE);

INSERT INTO PEDIDO (IdPedido, IdCliente, TotalPagar) VALUES (1, 1, 100.99);

INSERT INTO DETALLE_PEDIDO (IdPedido, IdProducto, Cantidad, PrecioUnitario) VALUES
(1, 1, 1, 45.99),
(1, 3, 1, 55.00);

INSERT INTO CARRITO (IdCliente, IdProducto, Cantidad) VALUES
(1, 2, 1),
(2, 5, 2);

COMMIT;