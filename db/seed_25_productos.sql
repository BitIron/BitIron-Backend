-- =========================================================================
-- SÚPER CATÁLOGO MASIVO - 100 PRODUCTOS (CROSS-SELLING)
-- =========================================================================

-- Asegurarnos de tener la categoría 'Comida Fit' (IdCategoria = 4)
INSERT IGNORE INTO CATEGORIA (IdCategoria, Nombre, Descripcion) VALUES 
(4, 'Comida Fit', 'Alimentación saludable, salsas zero, harinas y snacks.');

-- =========================================================================
-- BLOQUE 1: SUPLEMENTACIÓN (40 Productos) - IdCategoria = 1
-- Marcas: LifePro, Amix, BIG, Optimum Nutrition, MyProtein
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Whey Protein Concentrate 2kg', 'Concentrado de suero sabor chocolate.', 49.99, 150, 'unisex', 'MyProtein', 'Volumen', 1),
('Creatina Monohidrato Creapure 500g', 'Creatina con sello Creapure para máxima pureza.', 29.90, 300, 'unisex', 'LifePro', 'Fuerza', 1),
('Gold Standard 100% Whey 2.27kg', 'La proteína más vendida del mundo.', 74.99, 120, 'unisex', 'LifePro', 'Volumen', 1),
('Pre-Entreno C4 Explosive', 'Energía extrema y bombeo muscular.', 35.00, 90, 'unisex', 'Amix', 'Rendimiento', 1),
('Clear Whey Isolate 500g', 'Proteína ligera y refrescante tipo zumo.', 29.99, 110, 'unisex', 'MyProtein', 'Definicion', 1),
('ZMA (Zinc, Magnesio y B6)', 'Optimiza la recuperación y los niveles hormonales.', 19.99, 95, 'unisex', 'LifePro', 'Descanso', 1);

-- =========================================================================
-- BLOQUE 2: COMIDA FIT (20 Productos) - IdCategoria = 4
-- Marcas: Max Protein, Servivita, Weider
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Crema de Cacahuete 100% Natural 1kg', 'Sin aceite de palma ni azúcares añadidos.', 9.99, 300, 'unisex', 'Max Protein', 'Salud', 4),
('Harina de Avena Sabor Brownie 1.5kg', 'Desayunos fit dulces y saludables.', 12.50, 250, 'unisex', 'Max Protein', 'Volumen', 4),
('Sirope de Chocolate Zero Cal.', 'Sirope sin calorías ideal para tortitas.', 5.90, 180, 'unisex', 'Servivita', 'Definicion', 4),
('Yippie! Bar (Caja 12 uds)', 'Barrita proteica crujiente multicapa.', 32.00, 100, 'unisex', 'Weider', 'Volumen', 4),
('Salsa Barbacoa Zero Cal.', 'Salsa salada perfecta para carnes a la plancha.', 5.90, 160, 'unisex', 'Servivita', 'Definicion', 4);

-- =========================================================================
-- BLOQUE 3: EQUIPAMIENTO DE GIMNASIO (20 Productos) - IdCategoria = 2
-- Marcas: SBD, Rogue Fitness, Velites, Eleiko
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Cinturón Palanca 13mm IPF Approved', 'Máxima rigidez para sentadilla y peso muerto.', 215.00, 40, 'unisex', 'SBD', 'Fuerza', 2),
('Rodilleras Neopreno 7mm', 'Soporte articular extremo para powerlifting.', 95.00, 60, 'unisex', 'SBD', 'Fuerza', 2),
('Muñequeras Stiff 60cm', 'Estabilización total en presses pesados.', 45.00, 80, 'unisex', 'SBD', 'Fuerza', 2),
('Straps de Algodón Clásicos', 'Agarre infinito para tirones pesados.', 15.00, 150, 'unisex', 'Rogue Fitness', 'Fuerza', 2),
('Comba de Velocidad Fire 2.0', 'Saltos dobles ultra rápidos para CrossFit.', 49.90, 120, 'unisex', 'Velites', 'Rendimiento', 2),
('Barra Olímpica de Powerlifting 20kg', 'Barra rígida y moleteado agresivo.', 850.00, 10, 'unisex', 'Eleiko', 'Fuerza', 2);

-- =========================================================================
-- BLOQUE 4: ROPA DEPORTIVA (20 Productos) - IdCategoria = 3
-- Marcas: Nike, Adidas, Gymshark, Under Armour, BitIron
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Camiseta Oversize Pump Cover Negra', 'Ideal para inicio de entreno.', 29.99, 150, 'hombre', 'Gymshark', 'Estetica', 3),
('Leggings Sin Costuras (Seamless)', 'Adaptación perfecta a la pierna.', 45.00, 200, 'mujer', 'Gymshark', 'Estetica', 3),
('Zapatillas Romaleos 4 (Halterofilia)', 'Suela dura y tacón elevado para sentadilla.', 199.90, 30, 'unisex', 'Nike', 'Fuerza', 2),
('Camiseta Compresión Alter Ego', 'Se ajusta como una segunda piel.', 45.00, 110, 'hombre', 'Under Armour', 'Rendimiento', 3),
('Sudadera Project Rock', 'Edición especial de entrenamiento.', 75.00, 60, 'unisex', 'Under Armour', 'Estetica', 3),
('Zapatillas Ultraboost Light', 'Amortiguación máxima para carrera.', 180.00, 50, 'unisex', 'Adidas', 'Rendimiento', 3),
('Camiseta Tirantes (Stringer) BitIron', 'Muestra el trabajo del gimnasio.', 22.00, 100, 'hombre', 'BitIron', 'Estetica', 3);
