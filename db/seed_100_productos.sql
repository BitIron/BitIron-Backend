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
('Iso Whey Zero 1.5kg', 'Aislado de proteína sin lactosa sabor vainilla.', 65.50, 80, 'unisex', 'LifePro', 'Definicion', 1),
('Creatina Monohidrato Creapure 500g', 'Creatina con sello Creapure para máxima pureza.', 29.90, 300, 'unisex', 'Optimum Nutrition', 'Fuerza', 1),
('Gold Standard 100% Whey 2.27kg', 'La proteína más vendida del mundo.', 74.99, 120, 'unisex', 'Optimum Nutrition', 'Volumen', 1),
('Pre-Entreno C4 Explosive', 'Energía extrema y bombeo muscular.', 35.00, 90, 'unisex', 'Amix', 'Rendimiento', 1),
('BCAA 8:1:1 + Glutamina 500g', 'Recuperador intra y post entreno.', 28.50, 100, 'unisex', 'BIG', 'Recuperacion', 1),
('Caseína Micelar 1kg', 'Proteína de liberación sostenida para la noche.', 39.99, 60, 'unisex', 'MyProtein', 'Recuperacion', 1),
('Multivitamínico Daily One', 'Complejo vitamínico y mineral completo.', 15.90, 200, 'unisex', 'Amix', 'Salud', 1),
('Omega 3 1000mg 100 caps', 'Ácidos grasos esenciales EPA y DHA.', 18.50, 150, 'unisex', 'LifePro', 'Salud', 1),
('Citrulina Malato 300g', 'Precursor del óxido nítrico para máximo bombeo.', 22.90, 85, 'unisex', 'BIG', 'Rendimiento', 1),
('Clear Whey Isolate 500g', 'Proteína ligera y refrescante tipo zumo.', 29.99, 110, 'unisex', 'MyProtein', 'Definicion', 1),
('ZMA (Zinc, Magnesio y B6)', 'Optimiza la recuperación y los niveles hormonales.', 19.99, 95, 'unisex', 'Optimum Nutrition', 'Descanso', 1),
('Pre-Entreno Moonstruck 2.0', 'Fórmula ultra concentrada para entrenamientos intensos.', 38.50, 70, 'unisex', 'Zoomad Labs', 'Fuerza', 1),
('Hydro Whey 1.6kg', 'Proteína hidrolizada de absorción ultra rápida.', 85.00, 40, 'unisex', 'Optimum Nutrition', 'Definicion', 1),
('Aminoácidos Esenciales (EAA) 300g', 'Perfil completo de aminoácidos para el músculo.', 25.90, 130, 'unisex', 'Amix', 'Recuperacion', 1),
('Carbohidratos Cíclicos (Cluster Dextrin)', 'Energía rápida sin pesadez estomacal.', 34.50, 60, 'unisex', 'BIG', 'Rendimiento', 1),
('Ashwagandha KSM-66', 'Adaptógeno natural para reducir el cortisol.', 21.00, 120, 'unisex', 'LifePro', 'Descanso', 1),
('Melatonina 1.9mg', 'Para un sueño profundo y reparador.', 12.50, 250, 'unisex', 'Amix', 'Descanso', 1),
('Vitamina D3 + K2', 'Salud ósea y sistema inmunológico.', 16.90, 180, 'unisex', 'MyProtein', 'Salud', 1),
('Proteína Vegana Guisante/Arroz 1kg', 'Alternativa vegetal completa con alto VB.', 27.99, 90, 'unisex', 'LifePro', 'Volumen', 1),
('Creatina Kre-Alkalyn 120 caps', 'Creatina con pH tamponado para mejor absorción.', 26.50, 80, 'unisex', 'Amix', 'Fuerza', 1),
('Geles Isotonicos Energy (Caja 15)', 'Geles de rápida absorción para resistencia.', 22.50, 150, 'unisex', 'MyProtein', 'Rendimiento', 1),
('Electrolitos en Polvo 500g', 'Hidratación óptima intra-entreno.', 18.99, 100, 'unisex', 'LifePro', 'Recuperacion', 1),
('Beta Alanina 250g', 'Retrasa la fatiga muscular (efecto tamponador).', 17.50, 110, 'unisex', 'Optimum Nutrition', 'Resistencia', 1),
('HMB 100 caps', 'Metabolito de la leucina anti-catabólico.', 24.90, 60, 'unisex', 'BIG', 'Recuperacion', 1),
('L-Glutamina Pura 500g', 'Protección inmunológica y muscular.', 21.50, 140, 'unisex', 'Amix', 'Recuperacion', 1),
('Pre-Entreno Sin Cafeína (Pump)', 'Bombeo extremo sin alterar el sistema nervioso.', 32.00, 75, 'unisex', 'LifePro', 'Rendimiento', 1),
('Termogénico Lipo 6 Black', 'Potente quemagrasas de acción rápida.', 39.90, 50, 'unisex', 'Nutrex', 'Definicion', 1),
('Extracto de Té Verde', 'Antioxidante y diurético natural.', 14.50, 160, 'unisex', 'MyProtein', 'Salud', 1),
('Colágeno + Magnesio 300g', 'Salud articular y tendinosa.', 20.00, 130, 'unisex', 'Amix', 'Salud', 1),
('Vitamina C 1000mg', 'Refuerzo del sistema inmune.', 11.90, 200, 'unisex', 'Optimum Nutrition', 'Salud', 1),
('Magnesio Bisglicinato', 'Alta biodisponibilidad para evitar calambres.', 18.00, 120, 'unisex', 'LifePro', 'Descanso', 1),
('Harina de Arroz Precocida 1.5kg', 'Fuente de carbohidratos limpia y fácil de digerir.', 13.50, 180, 'unisex', 'BIG', 'Volumen', 1),
('Aislado de Carne (Beef Protein) 1kg', 'Proteína alternativa a los lácteos.', 42.00, 45, 'unisex', 'Amix', 'Volumen', 1),
('Serious Mass Gainer 2.7kg', 'Ganador de peso alto en calorías.', 49.99, 70, 'unisex', 'Optimum Nutrition', 'Volumen', 1),
('Pre-Entreno C4 Ripped', 'Energía y quema de grasa combinadas.', 37.50, 85, 'unisex', 'Cellucor', 'Definicion', 1),
('Espirulina Orgánica', 'Súperalimento rico en nutrientes.', 16.50, 110, 'unisex', 'MyProtein', 'Salud', 1),
('Maca Andina 500mg', 'Potenciador natural de la libido y energía.', 15.90, 140, 'unisex', 'LifePro', 'Salud', 1),
('D-Aspártico (DAA)', 'Potenciador natural de testosterona.', 22.00, 65, 'unisex', 'BIG', 'Fuerza', 1),
('Barrita Proteica Carb Killa (Caja 12)', 'Alta en proteína, baja en azúcar.', 28.50, 200, 'unisex', 'Grenade', 'Rendimiento', 1);

-- =========================================================================
-- BLOQUE 2: COMIDA FIT (20 Productos) - IdCategoria = 4
-- Marcas: Max Protein, Servivita, Weider
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Crema de Cacahuete 100% Natural 1kg', 'Sin aceite de palma ni azúcares añadidos.', 9.99, 300, 'unisex', 'Max Protein', 'Salud', 4),
('Harina de Avena Sabor Brownie 1.5kg', 'Desayunos fit dulces y saludables.', 12.50, 250, 'unisex', 'Max Protein', 'Volumen', 4),
('Sirope de Chocolate Zero Cal.', 'Sirope sin calorías ideal para tortitas.', 5.90, 180, 'unisex', 'Servivita', 'Definicion', 4),
('Salsa Barbacoa Zero Cal.', 'Salsa salada perfecta para carnes a la plancha.', 5.90, 160, 'unisex', 'Servivita', 'Definicion', 4),
('Salsa Ketchup Zero Cal.', 'El clásico sin azúcar.', 5.90, 150, 'unisex', 'Servivita', 'Definicion', 4),
('Yippie! Bar (Caja 12 uds)', 'Barrita proteica crujiente multicapa.', 32.00, 100, 'unisex', 'Weider', 'Volumen', 4),
('Pan Proteico Rebanado 300g', 'Pan bajo en carbos y alto en proteína.', 4.50, 80, 'unisex', 'Weider', 'Definicion', 4),
('Crema de Almendras 500g', 'Grasas saludables premium.', 14.50, 120, 'unisex', 'Max Protein', 'Salud', 4),
('Crema de Anacardos 500g', 'Suave y nutritiva.', 15.90, 90, 'unisex', 'Max Protein', 'Salud', 4),
('Harina de Avena Sabor Galleta María 1.5kg', 'Sabor clásico sin azúcar.', 12.50, 200, 'unisex', 'Max Protein', 'Volumen', 4),
('Sirope de Caramelo Zero Cal.', 'Perfecto para el café o postres.', 5.90, 140, 'unisex', 'Servivita', 'Definicion', 4),
('Sirope de Fresa Zero Cal.', 'Sabor frutal sin culpa.', 5.90, 130, 'unisex', 'Servivita', 'Definicion', 4),
('Protein Pancake Mix 1kg', 'Preparado para tortitas proteicas.', 19.90, 85, 'unisex', 'Weider', 'Volumen', 4),
('Crema de Cacao y Avellanas Zero (Nutella Fit)', 'El sabor de siempre, sin el azúcar.', 16.50, 220, 'unisex', 'Max Protein', 'Salud', 4),
('Salsa Mostaza y Miel Zero Cal.', 'Toque dulce y ácido para ensaladas.', 5.90, 110, 'unisex', 'Servivita', 'Definicion', 4),
('Bolas de Cacao Proteicas (Snack)', 'Crujientes bolitas ricas en proteína.', 8.50, 150, 'unisex', 'Max Protein', 'Salud', 4),
('Protein Muffin Mix 500g', 'Haz tus propias magdalenas fit.', 12.00, 70, 'unisex', 'Weider', 'Volumen', 4),
('Mermelada de Fresa Zero Azúcar', 'Desayunos ligeros.', 4.90, 100, 'unisex', 'Servivita', 'Definicion', 4),
('Salsa César Zero Cal.', 'Para ensaladas voluminosas en definición.', 5.90, 160, 'unisex', 'Servivita', 'Definicion', 4),
('Cookies Proteicas (Pack 6)', 'Galletas blandas altas en proteína.', 14.00, 120, 'unisex', 'Weider', 'Volumen', 4);

-- =========================================================================
-- BLOQUE 3: EQUIPAMIENTO DE GIMNASIO (20 Productos) - IdCategoria = 2
-- Marcas: SBD, Rogue Fitness, Velites, Eleiko
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Cinturón Palanca 13mm IPF Approved', 'Máxima rigidez para sentadilla y peso muerto.', 215.00, 40, 'unisex', 'SBD', 'Fuerza', 2),
('Rodilleras Neopreno 7mm', 'Soporte articular extremo para powerlifting.', 95.00, 60, 'unisex', 'SBD', 'Fuerza', 2),
('Muñequeras Stiff 60cm', 'Estabilización total en presses pesados.', 45.00, 80, 'unisex', 'SBD', 'Fuerza', 2),
('Straps de Algodón Clásicos', 'Agarre infinito para tirones pesados.', 15.00, 150, 'unisex', 'Rogue Fitness', 'Fuerza', 2),
('Lifting Straps (Figure 8)', 'Agarre fijo para strongman y deadlift.', 25.00, 70, 'unisex', 'Rogue Fitness', 'Fuerza', 2),
('Comba de Velocidad Fire 2.0', 'Saltos dobles ultra rápidos para CrossFit.', 49.90, 120, 'unisex', 'Velites', 'Rendimiento', 2),
('Calleras de Carbono 3 Agujeros', 'Protección de manos en barra de dominadas.', 39.50, 100, 'unisex', 'Velites', 'Rendimiento', 2),
('Magnesio Líquido 250ml', 'Agarre seco sin ensuciar el gimnasio.', 12.00, 300, 'unisex', 'Velites', 'Fuerza', 2),
('Magnesio en Bloque (Tiza)', 'El clásico para competiciones de fuerza.', 4.50, 500, 'unisex', 'Eleiko', 'Fuerza', 2),
('Barra Olímpica de Powerlifting 20kg', 'Barra rígida y moleteado agresivo.', 850.00, 10, 'unisex', 'Eleiko', 'Fuerza', 2),
('Discos Fraccionales (Pack 0.5kg - 2.5kg)', 'Para progresión lineal exacta.', 120.00, 25, 'unisex', 'Eleiko', 'Fuerza', 2),
('Rodillo de Espuma (Foam Roller)', 'Liberación miofascial y recuperación.', 29.90, 85, 'unisex', 'Rogue Fitness', 'Recuperacion', 2),
('Bandas Elásticas de Resistencia (Set de 5)', 'Movilidad y calentamiento articular.', 22.00, 140, 'unisex', 'Rogue Fitness', 'Salud', 2),
('Coderas de Neopreno 5mm', 'Calor y compresión para articulación del codo.', 55.00, 50, 'unisex', 'SBD', 'Salud', 2),
('Fat Gripz (Engrosadores de Barra)', 'Desarrollo masivo de antebrazos.', 35.00, 75, 'unisex', 'Rogue Fitness', 'Volumen', 2),
('Cinturón de Lastre con Cadena', 'Para fondos y dominadas pesadas.', 45.00, 60, 'unisex', 'Rogue Fitness', 'Fuerza', 2),
('Mochila Táctica 45L', 'Espacio para todo tu material de entreno.', 65.00, 90, 'unisex', 'Velites', 'Rendimiento', 2),
('Calcetines de Peso Muerto', 'Largos y anti-fricción.', 18.00, 110, 'unisex', 'SBD', 'Fuerza', 2),
('Collares Cierre de Barra (Abrazaderas)', 'Seguridad en levantamientos.', 15.00, 200, 'unisex', 'Eleiko', 'Seguridad', 2),
('Goma de Oclusión (BFR Bands)', 'Para entrenamiento de restricción de flujo sanguíneo.', 29.00, 40, 'unisex', 'Rogue Fitness', 'Volumen', 2);

-- =========================================================================
-- BLOQUE 4: ROPA DEPORTIVA (20 Productos) - IdCategoria = 3
-- Marcas: Nike, Adidas, Gymshark, Under Armour, BitIron
-- =========================================================================
INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
('Camiseta Oversize Pump Cover Negra', 'Ideal para inicio de entreno.', 29.99, 150, 'hombre', 'Gymshark', 'Estetica', 3),
('Camiseta Oversize Pump Cover Blanca', 'Corte ancho y cómodo.', 29.99, 130, 'hombre', 'Gymshark', 'Estetica', 3),
('Leggings Sin Costuras (Seamless)', 'Adaptación perfecta a la pierna.', 45.00, 200, 'mujer', 'Gymshark', 'Estetica', 3),
('Top Deportivo Alta Sujeción', 'Máximo confort en HIIT.', 35.00, 180, 'mujer', 'Gymshark', 'Rendimiento', 3),
('Zapatillas Romaleos 4 (Halterofilia)', 'Suela dura y tacón elevado para sentadilla.', 199.90, 30, 'unisex', 'Nike', 'Fuerza', 2),
('Zapatillas Metcon 9', 'Versatilidad para CrossFit y pesas.', 139.90, 80, 'unisex', 'Nike', 'Rendimiento', 2),
('Camiseta Compresión Alter Ego', 'Se ajusta como una segunda piel.', 45.00, 110, 'hombre', 'Under Armour', 'Rendimiento', 3),
('Shorts Entrenamiento 5 Pulgadas', 'Corte por encima de la rodilla.', 35.00, 140, 'hombre', 'Under Armour', 'Rendimiento', 3),
('Sudadera Project Rock', 'Edición especial de entrenamiento.', 75.00, 60, 'unisex', 'Under Armour', 'Estetica', 3),
('Zapatillas Ultraboost Light', 'Amortiguación máxima para carrera.', 180.00, 50, 'unisex', 'Adidas', 'Rendimiento', 3),
('Pantalón Chándal Tiro 23', 'Ligero y transpirable.', 50.00, 120, 'unisex', 'Adidas', 'Estetica', 3),
('Camiseta Tirantes (Stringer) BitIron', 'Muestra el trabajo del gimnasio.', 22.00, 100, 'hombre', 'BitIron', 'Estetica', 3),
('Sudadera Heavyweight BitIron Logo', 'Gruesa y cálida para invierno.', 55.00, 85, 'unisex', 'BitIron', 'Estetica', 3),
('Leggings Compresión BitIron Pro', 'Sujeción muscular avanzada.', 42.00, 95, 'mujer', 'BitIron', 'Rendimiento', 3),
('Calcetines Deportivos Crew (Pack 3)', 'Acolchados en zonas de presión.', 15.00, 300, 'unisex', 'Nike', 'Rendimiento', 3),
('Chaqueta Cortavientos Running', 'Protección contra lluvia ligera.', 65.00, 45, 'unisex', 'Adidas', 'Rendimiento', 3),
('Joggers Ajustados Gymshark', 'Corte cónico atlético.', 55.00, 110, 'hombre', 'Gymshark', 'Estetica', 3),
('Shorts Ciclista Mujer', 'Comodidad total en días de pierna.', 28.00, 150, 'mujer', 'Under Armour', 'Estetica', 3),
('Camiseta Dri-FIT Academy', 'Evacuación de sudor instantánea.', 25.00, 220, 'unisex', 'Nike', 'Rendimiento', 3),
('Gorra Deportiva BitIron Performance', 'Ligera y transpirable.', 18.00, 100, 'unisex', 'BitIron', 'Estetica', 3);
