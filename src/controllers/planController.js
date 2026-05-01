const productoModel = require('../models/productoModel');
const planModel = require('../models/planModel');

const generarPlan = async (req, res) => {
  try {
    const idCliente = req.usuario.id;

    const {
      disciplina, objetivo, nivel, diasEntreno,
      tipoDieta, nivelSuplementacion, comidasAlDia = 4,
      horaEntreno
    } = req.body;

    if (!disciplina || !objetivo || !nivel || !diasEntreno || !tipoDieta || !nivelSuplementacion || !horaEntreno) {
      return res.status(400).json({ error: 'Faltan parámetros críticos para la generación del plan de alto rendimiento (incluyendo horaEntreno).' });
    }

    const horaNum = parseInt(horaEntreno.split(':')[0]);

    let rutina = '';
    let dieta = '';
    let palabrasClaveSuplementos = [];

    // ============================================================================
    // 1. PROGRAMACIÓN DE ENTRENAMIENTO (MÉTODO TS/BO + FALLO TÉCNICO + CIENCIA)
    // ============================================================================

    const glosarioIntensidad = `
=== METODOLOGÍA DE ÉLITE: CIENCIA Y BIOMECÁNICA ===
[ PRINCIPIOS DE HIPERTROFIA Y TENSIÓN MECÁNICA ]
* El mito de "altas repeticiones para definir" es falso. El estímulo debe ser máximo siempre; el déficit calórico hará el resto.
* Hipertrofia mediada por estiramiento: El crecimiento muscular se maximiza en la fase excéntrica (bajada) y cuando el músculo está elongado. Controla la bajada (2-3 segundos) y haz una pausa de 1 seg en la máxima elongación.
* Repeticiones Efectivas: Las últimas repeticiones de una serie, cuando la velocidad de la barra disminuye involuntariamente (grinding), son las que reclutan las fibras de alto umbral y generan hipertrofia.

[ CONCEPTOS DE INTENSIDAD (MÉTODO TS/BO) ]
* TS (Top Set): Tu serie más pesada del ejercicio. Carga máxima para el rango de reps indicado a RIR 1 (te guardas 1 repetición para no fatigar el SNC prematuramente).
* BO (Back Off): Serie de volumen tras la pesada. Reduce el peso un 10-15% y ve al FALLO TÉCNICO (RIR 0). La ciencia demuestra que la cercanía al fallo es el principal motor de hipertrofia. Exprime el músculo al máximo con técnica impecable.
* RIR (Reps In Reserve): Repeticiones que dejas en la recámara. RIR 0 significa que no podrías hacer una repetición más con buena técnica.
---------------------------------------------------------
`;

    if (disciplina.toLowerCase() === 'musculacion' || disciplina.toLowerCase() === 'mixta') {

      const calentamientoTorso = `
[ CALENTAMIENTO ESPECÍFICO DE TORSO (8 MIN) ]
1. Liberación miofascial: Pectoral y dorsal con pelota de lacrosse o rodillo (2 min).
2. Manguito rotador: Rotaciones externas con banda elástica (2 x 15 por brazo).
3. Movilidad: Dislocaciones de hombro con pica (2 x 15) y rotaciones torácicas.
4. Aproximación (Potenciación Post-Activación - PAP): 3 series piramidales (50%, 70%, 85% del peso de tu Top Set) solo en el primer ejercicio, haciendo de 2 a 5 repeticiones explosivas para preparar el sistema nervioso sin generar fatiga.
`;

      const calentamientoPierna = `
[ CALENTAMIENTO ESPECÍFICO DE PIERNA (10 MIN) ]
1. Liberación miofascial: Pasadas con Foam Roller en cuádriceps, banda iliotibial y gemelos (3 min).
2. Movilidad: Sentadilla profunda isométrica aguantando la posición abajo (2 x 45 seg) para abrir caderas (dorsiflexión de tobillo).
3. Activación: Zancadas dinámicas sin peso (10 por pierna) y Glute Bridges (2 x 15).
4. Aproximación (Potenciación Post-Activación - PAP): 3 series subiendo peso progresivamente en tu primer ejercicio básico, bajas repeticiones para activar el SNC.
`;

      let cuerpoRutina = '';

      if (diasEntreno <= 3) {
        cuerpoRutina = `
=== SPLIT 3 DÍAS: FULL BODY AVANZADO ===
DÍA 1: FULL BODY A (Foco Cuádriceps y Empuje)
${calentamientoPierna}
- Sentadilla Libre (Barra): 1 TS (5-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Press Banca Plano (Barra): 1 TS (5-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Remo con Barra (Pendlay): 3 series (8-10 reps, RIR 0)
- Prensa Inclinada 45º: 2 series (12-15 reps, RIR 0)
- Cruces de Pecho en Polea: 2 series (15 reps, RIR 0)
- Elevaciones Laterales Mancuerna: 3 series (15-20 reps, RIR 0)
- Curl Bíceps con Barra Z: 2 series (10-12 reps, RIR 0)
- Extensión Tríceps Polea: 2 series (12-15 reps, RIR 0)

DÍA 2: FULL BODY B (Foco Cadena Posterior y Tirón)
${calentamientoTorso}
- Peso Muerto Rumano: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Press Militar Sentado (Mancuernas): 1 TS (6-8 reps, RIR 1) + 2 BO (10 reps, RIR 0/Fallo)
- Dominadas Lastradas o Jalón al Pecho: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Zancadas Búlgaras: 2 series (10-12 reps por pierna, RIR 0)
- Remo Gironda en Polea Baja: 2 series (12 reps, RIR 0)
- Face Pull: 3 series (15 reps, RIR 0)
- Gemelo de pie en máquina: 4 series (15 reps, RIR 0) (Foco en el estiramiento máximo abajo).

DÍA 3: FULL BODY C (Equilibrio)
${calentamientoPierna}
- Press Inclinado (Mancuernas): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Sentadilla Hack o Multipower: 3 series (10-12 reps, RIR 0)
- Jalón al Pecho Agarre Estrecho: 3 series (10 reps, RIR 0)
- Curl Femoral Tumbado: 3 series (12-15 reps, RIR 0)
- Elevaciones Laterales en Polea: 3 series (15 reps, RIR 0)
- Curl Martillo con Mancuernas: 2 series (12 reps, RIR 0)
- Press Francés con Barra: 2 series (12 reps, RIR 0)
- Planchas Abdominales Lastradas: 3 x 60 seg
`;
      } else if (diasEntreno == 4) {
        cuerpoRutina = `
=== SPLIT 4 DÍAS: TORSO / PIERNA (ALTA VARIEDAD) ===
DÍA 1: TORSO PESADO (Empuje Dominante)
${calentamientoTorso}
- Press Banca Plano (Barra): 1 TS (3-5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Fallo)
- Dominadas Lastradas o Jalón Pesado: 1 TS (5-8 reps, RIR 1) + 2 BO (10 reps, RIR 0/Fallo)
- Press Militar de Pie (Barra): 3 series (8-10 reps, RIR 0)
- Remo en Polea Baja (Agarre V): 3 series (10-12 reps, RIR 0)
- Aperturas Inclinadas o Pec-Deck: 2 series (15 reps, RIR 0)
- Elevaciones Laterales con Mancuernas: 4 series (15 reps, RIR 0)
- Tríceps Cuerda en Polea Alta: 3 series (12-15 reps, RIR 0)

DÍA 2: PIERNA PESADA (Cuádriceps Dominante)
${calentamientoPierna}
- Sentadilla Libre: 1 TS (3-5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Fallo)
- Peso Muerto Rumano: 3 series (8-10 reps, RIR 0/Fallo)
- Prensa Inclinada (Pies juntos y bajos): 3 series (12-15 reps, RIR 0)
- Extensiones de Cuádriceps: 3 series (15 reps, Fallo Técnico RIR 0 + Drop Set al final)
- Curl Femoral Sentado: 2 series (12-15 reps, RIR 0)
- Elevación de Talones de pie (Gemelo): 4 series (15-20 reps, RIR 0)
- Crunch Abdominal en Polea: 3 series (12-15 reps, RIR 0)

DÍA 3: TORSO HIPERTROFIA (Tirón Dominante)
${calentamientoTorso}
- Remo con Barra: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Press Inclinado (Mancuernas): 1 TS (8-10 reps, RIR 1) + 2 BO (12 reps, RIR 0/Fallo)
- Jalón al Pecho Agarre Supino: 3 series (10-12 reps, RIR 0)
- Fondos en Paralelas (Lastrados): 3 series (8-10 reps, RIR 0)
- Face Pull (Hombro Posterior): 3 series (15 reps, RIR 0)
- Curl Bíceps Barra Recta: 3 series (10-12 reps, RIR 0)
- Extensión Tríceps a una mano (Polea): 2 series (12 reps, RIR 0)

DÍA 4: PIERNA HIPERTROFIA (Cadena Posterior Dominante)
${calentamientoPierna}
- Peso Muerto Convencional o Sumo: 1 TS (3-5 reps, RIR 1) + 2 BO (8 reps, RIR 0/Fallo)
- Sentadilla Búlgara con Mancuernas: 3 series (10-12 reps por pierna, RIR 0)
- Curl Femoral Tumbado: 3 series (12-15 reps, Fallo en la última RIR 0)
- Prensa Horizontal (Pies altos y separados): 3 series (15 reps, RIR 0)
- Hip Thrust (Puente de Glúteo con Barra): 3 series (10-12 reps, RIR 0)
- Gemelo Sentado (Foco en Sóleo): 4 series (20 reps, RIR 0)
`;
      } else {
        cuerpoRutina = `
=== SPLIT 5/6 DÍAS: PUSH / PULL / LEGS / UPPER / LOWER ===
DÍA 1: PUSH (Empuje)
${calentamientoTorso}
- Press Banca Plano: 1 TS (5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Fallo)
- Press Militar Sentado (Mancuernas): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Press Inclinado en Máquina Convergente: 2 series (10-12 reps, RIR 0)
- Cruces en Polea (Pecho bajo): 2 series (15 reps, RIR 0)
- Elevaciones Laterales (Polea, unilateral): 3 series (15 reps, RIR 0)
- Press Francés con Barra Z: 3 series (10-12 reps, RIR 0)
- Extensión Tríceps Cuerda: 2 series (15 reps, RIR 0)

DÍA 2: PULL (Tirón)
${calentamientoTorso}
- Dominadas Libres o Jalón Abierto: 1 TS (6 reps, RIR 1) + 2 BO (10 reps, RIR 0/Fallo)
- Remo con Barra (Agarre Prono): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Pull-over en Polea Alta: 2 series (12-15 reps, RIR 0)
- Remo en Máquina Unilateral: 2 series (10-12 reps por brazo, RIR 0)
- Pájaros con Mancuerna (Hombro Posterior): 3 series (15 reps, RIR 0)
- Curl Bíceps Alterno Mancuernas: 3 series (10 reps, RIR 0)
- Curl Bíceps en Polea Baja: 2 series (15 reps, RIR 0)

DÍA 3: LEGS (Piernas Completo)
${calentamientoPierna}
- Sentadilla Libre: 1 TS (5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Fallo)
- Prensa 45 Grados: 3 series (12-15 reps, RIR 0)
- Zancadas Caminando con Mancuernas: 2 series (12 pasos por pierna, RIR 0)
- Curl Femoral Tumbado: 3 series (12-15 reps, RIR 0)
- Elevación de Talones de pie: 4 series (15 reps, RIR 0)

DÍA 4: UPPER (Torso Completo - Frecuencia 2)
${calentamientoTorso}
- Press Inclinado (Mancuernas o Barra): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Remo Gironda o en Punta: 3 series (8-10 reps, RIR 0)
- Press Hombro en Máquina: 3 series (10-12 reps, RIR 0)
- Jalón al Pecho Agarre Estrecho: 3 series (10-12 reps, RIR 0)
- Elevaciones Laterales Mancuerna: 3 series (15-20 reps, RIR 0)
- Superserie: Curl Martillo + Extensión Tríceps Polea: 3 series (12 reps, RIR 0)

DÍA 5: LOWER (Piernas - Cadena Posterior)
${calentamientoPierna}
- Peso Muerto Rumano: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Sentadilla Búlgara en Multipower: 3 series (10 reps por pierna, RIR 0)
- Extensión Cuádriceps: 3 series (15 reps, RIR 0)
- Curl Femoral Sentado: 3 series (12 reps, RIR 0)
- Hip Thrust: 3 series (10 reps, RIR 0)
- Rueda Abdominal o Planchas Lastradas: 3 series al fallo (RIR 0).
`;
      }

      if (disciplina.toLowerCase() === 'mixta') {
        cuerpoRutina += `
=== BLOQUE DE RESISTENCIA AERÓBICA (ATLETA HÍBRIDO) ===
Al ser un plan mixto, debes encajar este trabajo sin interferir en tus adaptaciones de hipertrofia (Efecto de Interferencia):
- Sesión 1 (Base Aeróbica): 45 minutos de Carrera continua o Bicicleta en Zona 2 (60-70% FCM). Debes poder mantener una conversación. Ideal para días de descanso de pesas o post-entreno de torso. Evita el HIIT el día antes de entrenar Pierna pesada.
- Sesión 2 (Potencia Aeróbica / HIIT): Calentamiento 10 min + 6 series de (40 seg sprint máximo / 80 seg caminar activo) + 10 min vuelta a la calma.
`;
      }

      rutina = glosarioIntensidad + cuerpoRutina;

    } else if (disciplina.toLowerCase() === 'aerobico') {
      rutina = `
=== PLAN PRO DE RESISTENCIA Y AERÓBICO ===
Este plan busca mejorar tu VO2 Máximo, tu umbral de lactato y tu economía de esfuerzo mediante bases fisiológicas reales.

[ CALENTAMIENTO ESPECÍFICO (10-15 MIN) ]
- Movilidad dinámica de tren inferior: Círculos de cadera, aperturas, balanceo de piernas adelante/atrás y lateral (10 por pierna).
- Activación de Glúteo Medio: Pasos laterales con banda de resistencia. Fundamental para evitar que las rodillas colapsen hacia adentro (valgo) con la fatiga.
- 5 minutos de rodaje ultra suave (Zona 1), subiendo pulsaciones progresivamente hasta romper a sudar.

[ TIPS DE RENDIMIENTO AVANZADO Y FISIOLOGÍA ]
1. Distribución 80/20 (Polarización): El 80% de tu volumen semanal debe ser a baja intensidad (Zona 2). El 20% restante a alta intensidad (Zonas 4 y 5). El error común es hacer todo a intensidad media (Zona 3 o "Black Hole"), generando fatiga excesiva sin adaptaciones cardiovasculares óptimas.
2. Cadencia: En carrera, busca 170-180 pasos por minuto para reducir el tiempo de contacto con el suelo y el impacto articular. En bici, mantén 85-95 rpm.
3. Hidratación y Nutrición Intra-Entreno: En sesiones superiores a 60-75 min, es innegociable consumir entre 30-60g de carbohidratos de absorción rápida por hora y unos 500ml de agua con electrolitos (sodio principalmente para prevenir hiponatremia y calambres).

[ PROGRAMACIÓN SEMANAL (${diasEntreno} DÍAS) ]
- Sesión 1 (Construcción Base y Eficiencia Mitocondrial): 60 a 90 min de rodaje LISS en Zona 2. Foco estricto en mantener las pulsaciones controladas. Si suben, camina. Mejora la oxidación de grasas y el desarrollo de la red capilar.
- Sesión 2 (Entrenamiento de Umbral de Lactato): 15 min calentamiento + 3 series de 10 min a ritmo de umbral (RPE 7-8/10, ritmo que podrías aguantar 1 hora en carrera) con 3 min de trote suave entre series + 10 min enfriamiento. Enseña a tu cuerpo a aclarar y reciclar lactato más rápido.
- Sesión 3 (Series / VO2 Max): 15 min calentamiento + 8 a 10 series de (400 metros al 90-95% de tu capacidad / 90 seg de descanso pasivo o caminata) + 10 min enfriamiento. Aumenta la cantidad máxima de oxígeno que el cuerpo puede procesar en la unidad de tiempo.
- Sesión 4 (Recuperación Activa): 30-40 min de natación o bicicleta estática muy suave para irrigar sangre rica en nutrientes a los músculos dañados y acelerar la recuperación sin sobrecargar el SNC.
- Sesión 5 (Tirada Larga de Fin de Semana): Aumenta el volumen de la Sesión 1 en un 10-15%. Mentalidad de carrera, prueba aquí tus geles y la estrategia nutricional que usarías el día de la prueba.
`;
    } else {
      return res.status(400).json({ error: "Disciplina no soportada. Use 'musculacion', 'mixta' o 'aerobico'." });
    }

    // ============================================================================
    // 2. DIETA PERSONALIZADA CON TIMING NUTRICIONAL Y MULTI-OPCIONES MASIVAS
    // ============================================================================

    // Asignación inteligente de comidas PRE y POST según la hora Y la cantidad de comidas
    let preWorkoutMeal, postWorkoutMeal;

    if (comidasAlDia == 3) {
      if (horaNum <= 13) { preWorkoutMeal = 1; postWorkoutMeal = 2; }
      else { preWorkoutMeal = 2; postWorkoutMeal = 3; }
    } else if (comidasAlDia == 4) {
      if (horaNum <= 11) { preWorkoutMeal = 1; postWorkoutMeal = 2; }
      else if (horaNum <= 16) { preWorkoutMeal = 2; postWorkoutMeal = 3; }
      else { preWorkoutMeal = 3; postWorkoutMeal = 4; }
    } else {
      // 5 o más comidas
      if (horaNum <= 10) { preWorkoutMeal = 1; postWorkoutMeal = 2; }
      else if (horaNum <= 14) { preWorkoutMeal = 2; postWorkoutMeal = 3; }
      else if (horaNum <= 18) { preWorkoutMeal = 3; postWorkoutMeal = 4; }
      else { preWorkoutMeal = 4; postWorkoutMeal = 5; }
    }

    let calorias, proteinas, carbos, grasas;
    if (objetivo.toLowerCase() === 'volumen') {
      calorias = 3100; proteinas = 165; carbos = 450; grasas = 70;
    } else if (objetivo.toLowerCase() === 'definicion') {
      calorias = 2100; proteinas = 175; carbos = 180; grasas = 65;
    } else { // recomposicion / mantenimiento
      calorias = 2500; proteinas = 165; carbos = 280; grasas = 75;
    }

    dieta = `=== PLAN NUTRICIONAL DE ALTO RENDIMIENTO (Base ~70kg) ===\n`;
    dieta += `Kcal Diarias: ~${calorias} | Proteínas: ${proteinas}g | Carbohidratos: ${carbos}g | Grasas: ${grasas}g\n`;
    dieta += `Distribución elegida: ${comidasAlDia} comidas diarias.\n\n`;

    dieta += `[ EL POR QUÉ DE TUS COMIDAS (TIMING Y FISIOLOGÍA NUTRICIONAL) ]
Al indicarnos que entrenas sobre las ${horaEntreno}, hemos estructurado tus comidas clave:
* La COMIDA ${preWorkoutMeal} es tu PRE-ENTRENO. Aporta carbohidratos complejos para llenar depósitos de glucógeno hepático y muscular, minimizando la fatiga central y periférica. Moderamos la grasa para acelerar el vaciamiento gástrico.
* La COMIDA ${postWorkoutMeal} es tu POST-ENTRENO. Foco en proteína de alto valor biológico para superar el "umbral de leucina" (~3g de leucina), encender la vía mTOR (síntesis proteica) y comenzar la regeneración de fibras dañadas en el entrenamiento al fallo.
---------------------------------------------------------\n\n`;

    // Generador dinámico del Menú Extenso
    for (let i = 1; i <= comidasAlDia; i++) {

      let tituloComida = `[ COMIDA ${i} ]`;
      if (i === preWorkoutMeal) tituloComida += " - 🔥 PRE-ENTRENO 🔥";
      if (i === postWorkoutMeal) tituloComida += " - 🔨 POST-ENTRENO 🔨";
      if (i === comidasAlDia) tituloComida += " - 🌙 CENA REPARADORA 🌙";

      // Lógica para saber qué TIPO de comida toca según las comidas totales
      let tipoComida = "";
      if (comidasAlDia == 3) {
        if (i === 1) tipoComida = "desayuno_fuerte";
        else if (i === 2) tipoComida = "almuerzo_fuerte";
        else tipoComida = "cena_fuerte";
      } else if (comidasAlDia == 4) {
        if (i === 1) tipoComida = "desayuno";
        else if (i === 2) tipoComida = "almuerzo";
        else if (i === 3) tipoComida = "snack_pesado";
        else tipoComida = "cena";
      } else {
        // 5 comidas
        if (i === 1) tipoComida = "desayuno";
        else if (i === 2) tipoComida = "snack_ligero";
        else if (i === 3) tipoComida = "almuerzo";
        else if (i === 4) tipoComida = "snack_pesado";
        else tipoComida = "cena";
      }

      let opciones = "";

      if (tipoDieta.toLowerCase() === 'omnivoro') {
        if (tipoComida === "desayuno_fuerte") {
          opciones = `- Opción A: 4 Huevos revueltos, 100g de avena cocida con leche, 1 plátano y 30g de nueces.\n- Opción B: 3 Tostadas grandes de masa madre, 150g de pavo, aguacate entero y 1 yogur griego.\n- Opción C: Batido masivo (1.5 scoops proteína, 100g harina avena, 1 plátano, 50g crema de cacahuete, leche entera).`;
        } else if (tipoComida === "desayuno") {
          opciones = `- Opción A: 3 Huevos revueltos, 80g de avena y 1 manzana.\n- Opción B: 2 Tostadas, 100g de pavo y medio aguacate.\n- Opción C: Batido (1 scoop proteína, 60g avena, 30g crema cacahuete, leche desnatada).`;
        } else if (tipoComida === "almuerzo_fuerte") {
          opciones = `- Opción A: 200g Pechuga de pollo, 150g de arroz (crudo), brócoli y 1 cda de AOVE.\n- Opción B: 200g Ternera magra, 150g pasta y ensalada mixta.\n- Opción C: 2 Latas de atún, 400g patata cocida, ensalada de tomate y pepino.`;
        } else if (tipoComida === "almuerzo") {
          opciones = `- Opción A: 150g Pollo, 100g arroz y verduras.\n- Opción B: 150g Ternera, 100g pasta y ensalada.\n- Opción C: 150g Lomo de cerdo magro, 250g patata asada, espárragos.`;
        } else if (tipoComida === "cena_fuerte") {
          opciones = `- Opción A: 200g Salmón, 350g patata asada y espárragos.\n- Opción B: Tortilla (3 huevos + 3 claras), 150g pan integral y queso fresco.\n- Opción C: 200g Dorada al horno, 120g quinoa y setas salteadas.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de glucosa y aminoácidos a las células musculares durante la reparación nocturna.`;
        } else if (tipoComida === "cena") {
          opciones = `- Opción A: 150g Salmón, 250g patata asada.\n- Opción B: 150g Merluza, champiñones y 1 rebanada de pan.\n- Opción C: Tortilla francesa (2 huevos + 2 claras) y ensalada grande.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de glucosa y aminoácidos a las células musculares durante la reparación nocturna.`;
        } else if (tipoComida === "snack_pesado") {
          opciones = `- Opción A: 1 Yogur griego + 1 scoop de proteína + 30g de almendras.\n- Opción B: 5 Tortitas de arroz con crema de cacahuete y batido Whey.\n- Opción C: 2 Rebanadas de pan integral con 100g de jamón serrano sin grasa.`;
        } else if (tipoComida === "snack_ligero") {
          opciones = `- Opción A: 1 Pieza de fruta y 20g de nueces.\n- Opción B: Batido de proteína con agua.\n- Opción C: 3 Tortitas de maíz con pavo.`;
        }

      } else if (tipoDieta.toLowerCase() === 'vegano') {
        if (tipoComida === "desayuno_fuerte") {
          opciones = `- Opción A: Porridge (100g avena, 1.5 scoops proteína vegetal, semillas de chía, crema de cacahuete).\n- Opción B: 300g Tofu revuelto (cúrcuma, sal negra) sobre 3 tostadas de centeno y 1 vaso de leche de soja.\n- Opción C: Batido calórico (leche de soja, 1.5 scoops proteína, 2 plátanos, 50g nueces).`;
        } else if (tipoComida === "desayuno") {
          opciones = `- Opción A: Porridge (80g avena, 1 scoop proteína vegetal, fresas).\n- Opción B: Tofu revuelto sobre 2 tostadas.\n- Opción C: 2 Tostadas con crema de cacahuete y rodajas de plátano.`;
        } else if (tipoComida === "almuerzo_fuerte") {
          opciones = `- Opción A: 250g Tofu firme a la plancha, 120g quinoa y gran salteado de verduras.\n- Opción B: 200g Heura o soja texturizada, 120g pasta de lentejas rojas.\n- Opción C: 300g Garbanzos (escurridos), con 80g arroz basmati y salsa de tomate casera.`;
        } else if (tipoComida === "almuerzo") {
          opciones = `- Opción A: 200g Tofu, 80g quinoa y verduras.\n- Opción B: 150g Heura, 100g macarrones de lenteja.\n- Opción C: 200g Lentejas cocidas con arroz y verduras variadas.`;
        } else if (tipoComida === "cena_fuerte") {
          opciones = `- Opción A: 200g Seitán, 350g patata asada y crema de verduras.\n- Opción B: Hamburguesas de alubias dobles con espinacas y boniato grande asado.\n- Opción C: 250g Tempeh horneado, 100g arroz integral y pimientos.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de glucosa y aminoácidos a las células musculares durante la reparación nocturna.`;
        } else if (tipoComida === "cena") {
          opciones = `- Opción A: 150g Seitán, 250g patata asada.\n- Opción B: Tempeh macerado al horno con salteado.\n- Opción C: Hamburguesa vegetal casera con guarnición de espinacas.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de glucosa y aminoácidos a las células musculares durante la reparación nocturna.`;
        } else if (tipoComida === "snack_pesado") {
          opciones = `- Opción A: Yogur de soja natural, 1 scoop proteína vegetal y nueces.\n- Opción B: 4 Tortitas de maíz con hummus abundante.\n- Opción C: Bowl de edamames (150g) y 30g de almendras.`;
        } else if (tipoComida === "snack_ligero") {
          opciones = `- Opción A: Fruta y almendras.\n- Opción B: Batido vegetal pequeño con agua.\n- Opción C: 2 Tortitas de arroz con tahini.`;
        }

      } else { // Flexible
        if (tipoComida.includes("fuerte")) {
          opciones = `- Elige raciones contundentes. Ejemplo: Gran bowl de cereales y yogur para desayunar, "Bowl culturista" masivo (arroz, proteína magra, salsas zero) para comer y Pizza Fit grande para cenar.\n- Recuerda: Prioriza siempre una fuente rica en leucina en cada ingesta fuerte para maximizar la síntesis de proteína.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de nutrientes.`;
        } else if (tipoComida.includes("snack")) {
          opciones = `- Snacks IIFYM: Barritas de proteína, tortitas de arroz, fruta o un capricho (galleta/chocolate) siempre que lo cuadres en tus macros.\n- Si tu comida libre es inminente, reduce grasas y carbohidratos en estos snacks.`;
        } else {
          opciones = `- Opciones estándar: Pescado con patata, fajitas de pollo ajustando macros (tortitas integrales, pollo, verduras), o tostadas con aguacate y pavo.\n- Puedes usar salsas sin azúcar y especias libremente.\n*Tip Fisiológico: Añade sal con normalidad a la cena. El sodio ayuda a retener fluidos intracelularmente (hidratación celular) y asiste en el cotransporte de nutrientes.`;
        }
      }

      dieta += `${tituloComida}\n${opciones}\n\n`;
    }

    // ============================================================================
    // 3. SUPLEMENTACIÓN (CONEXIÓN ESTRICTA CON BASE DE DATOS Y CROSS-SELLING)
    // ============================================================================

    let suplementosRecomendados = [];

    if (nivelSuplementacion.toLowerCase() !== 'nada') {
      if (disciplina.toLowerCase() === 'musculacion' || disciplina.toLowerCase() === 'mixta') {
        if (nivelSuplementacion.toLowerCase() === 'esencial') {
          palabrasClaveSuplementos = ['Proteina'];
        } else {
          palabrasClaveSuplementos = ['Proteina', 'Creatina', 'Pre-entreno'];
        }
      } else {
        // Aeróbico
        if (nivelSuplementacion.toLowerCase() === 'esencial') {
          palabrasClaveSuplementos = ['Gel'];
        } else {
          palabrasClaveSuplementos = ['Gel', 'Isotonico', 'Magnesio'];
        }
      }

      try {
        const promesasBusqueda = palabrasClaveSuplementos.map(palabra =>
          productoModel.getAll({ nombre: palabra })
        );

        const resultados = await Promise.all(promesasBusqueda);
        const productosEncontrados = resultados.flat();
        const idsAgregados = new Set();

        for (const prod of productosEncontrados) {
          if (!idsAgregados.has(prod.IdProducto)) {
            // Asegurarse de enviar precio e imagen_url
            suplementosRecomendados.push({
              IdProducto: prod.IdProducto,
              Nombre: prod.Nombre,
              Descripcion: prod.Descripcion,
              Precio: prod.Precio,
              Imagen_Url: prod.Imagen_Url || null
            });
            idsAgregados.add(prod.IdProducto);
          }
        }

        // Si no hay stock real en BD, se generan sugerencias ficticias coherentes (Cross-selling)
        if (suplementosRecomendados.length === 0) {
          suplementosRecomendados = palabrasClaveSuplementos.map((palabra, index) => ({
            IdProducto: `GEN-${index + 1}`,
            Nombre: `[Sugerencia de la Tienda] ${palabra} Premium`,
            Descripcion: `Suplemento clave de ${palabra} para maximizar tu ${objetivo} y la recuperación fisiológica celular. Búscalo en nuestra sección de productos.`,
            Precio: 29.99,
            Imagen_Url: null,
            _simulado: true
          }));
        }
      } catch (errorDb) {
        console.error("Error al buscar suplementos en la base de datos:", errorDb);
        // Fallback en caso de error
        suplementosRecomendados = palabrasClaveSuplementos.map((palabra, index) => ({
          IdProducto: `FALLBACK-${index}`,
          Nombre: `Recomendación: ${palabra}`,
          Descripcion: 'Producto no disponible actualmente.',
          Precio: 0,
          Imagen_Url: null
        }));
      }
    }

    // ============================================================================
    // 4. RESPUESTA FINAL
    // ============================================================================

    const idAsesoria = await planModel.guardarPlanGenerado(idCliente, disciplina, rutina, dieta);

    return res.status(200).json({
      mensaje: "Plan de Alto Rendimiento Generado Correctamente",
      idAsesoria,
      configuracion: { disciplina, objetivo, nivel, diasEntreno, tipoDieta, comidasAlDia, horaEntreno, nivelSuplementacion },
      rutina,
      dieta,
      suplementosRecomendados
    });

  } catch (error) {
    console.error('Error crítico al procesar la programación avanzada:', error);
    return res.status(500).json({ error: 'Error interno del servidor al generar el plan de élite.' });
  }
};

module.exports = {
  generarPlan
};
