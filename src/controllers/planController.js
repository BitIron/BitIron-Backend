const productoModel = require('../models/productoModel');
const planModel = require('../models/planModel');
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

const generarPlan = catchAsync(async (req, res, next) => {
    const idCliente = req.usuario.id;

    const {
      disciplina, objetivo, nivel, diasEntreno,
      tipoDieta, nivelSuplementacion, comidasAlDia = 4,
      horaEntreno
    } = req.body;

    if (!disciplina || !objetivo || !nivel || !diasEntreno || !tipoDieta || !nivelSuplementacion || !horaEntreno) {
      return next(new CustomError('Faltan parámetros críticos para la generación del plan de alto rendimiento (incluyendo horaEntreno).', 400));
    }

    const horaNum = parseInt(horaEntreno.split(':')[0]);

    let rutina = '';
    let dieta = '';
    let palabrasClaveSuplementos = [];

    // ============================================================================
    // 1. PROGRAMACIÓN DE ENTRENAMIENTO (MÉTODO TS/BO + FALLO TÉCNICO + CIENCIA)
    // ============================================================================

    const glosarioIntensidad = `
=== ELITE METHODOLOGY: SCIENCE & BIOMECHANICS ===
[ PRINCIPLES OF HYPERTROPHY AND MECHANICAL TENSION ]
* The myth of "high reps to tone" is false. The stimulus must be maximal always; the caloric deficit will do the rest.
* Stretch-Mediated Hypertrophy: Muscle growth is maximized in the eccentric phase (lowering) and when the muscle is lengthened. Control the eccentric (2-3 seconds) and pause for 1 sec at maximum stretch.
* Effective Repetitions: The last reps of a set, when bar speed involuntarily slows down (grinding), are the ones that recruit high-threshold fibers and generate hypertrophy.

[ INTENSITY CONCEPTS (TS/BO METHOD) ]
* TS (Top Set): Your heaviest set of the exercise. Max load for the indicated rep range at RIR 1 (you keep 1 rep in the tank to avoid premature CNS fatigue).
* BO (Back Off): Volume set after the heavy one. Drop the weight by 10-15% and go to TECHNICAL FAILURE (RIR 0). Science shows proximity to failure is the main driver of hypertrophy. Squeeze the muscle to the max with flawless technique.
* RIR (Reps In Reserve): Reps left in the tank. RIR 0 means you couldn't do one more rep with good technique.
---------------------------------------------------------
`;

    if (disciplina.toLowerCase() === 'musculacion' || disciplina.toLowerCase() === 'mixta') {

      const calentamientoTorso = `
[ UPPER BODY WARM-UP (8 MIN) ]
1. Myofascial Release: Pecs and lats with a lacrosse ball or foam roller (2 min).
2. Rotator Cuff: External rotations with resistance band (2 x 15 per arm).
3. Mobility: Shoulder dislocates with a PVC pipe (2 x 15) and thoracic rotations.
4. Warm-up Sets (Post-Activation Potentiation - PAP): 3 pyramid sets (50%, 70%, 85% of your Top Set weight) only on the first exercise, doing 2 to 5 explosive reps to prime the nervous system without fatigue.
`;

      const calentamientoPierna = `
[ LOWER BODY WARM-UP (10 MIN) ]
1. Myofascial Release: Foam Roller on quads, IT band, and calves (3 min).
2. Mobility: Isometric deep squat holding the bottom position (2 x 45 sec) to open hips (ankle dorsiflexion).
3. Activation: Bodyweight dynamic lunges (10 per leg) and Glute Bridges (2 x 15).
4. Warm-up Sets (Post-Activation Potentiation - PAP): 3 progressively heavier sets on your first compound exercise, low reps to prime the CNS.
`;

      let cuerpoRutina = '';

      if (diasEntreno <= 3) {
        cuerpoRutina = `
=== 3-DAY SPLIT: ADVANCED FULL BODY ===
DAY 1: FULL BODY A (Quad & Push Focus)
${calentamientoPierna}
- Barbell Squat: 1 TS (5-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Barbell Bench Press: 1 TS (5-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Barbell Row (Pendlay): 3 sets (8-10 reps, RIR 0)
- 45º Leg Press: 2 sets (12-15 reps, RIR 0)
- Cable Chest Flyes: 2 sets (15 reps, RIR 0)
- Dumbbell Lateral Raises: 3 sets (15-20 reps, RIR 0)
- EZ Bar Bicep Curl: 2 sets (10-12 reps, RIR 0)
- Cable Tricep Extension: 2 sets (12-15 reps, RIR 0)

DAY 2: FULL BODY B (Posterior Chain & Pull Focus)
${calentamientoTorso}
- Romanian Deadlift: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Seated Dumbbell Shoulder Press: 1 TS (6-8 reps, RIR 1) + 2 BO (10 reps, RIR 0/Failure)
- Weighted Pull-ups or Lat Pulldown: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Bulgarian Split Squats: 2 sets (10-12 reps per leg, RIR 0)
- Low Cable Row (Gironda): 2 sets (12 reps, RIR 0)
- Face Pulls: 3 sets (15 reps, RIR 0)
- Standing Calf Raises: 4 sets (15 reps, RIR 0) (Focus on max stretch at the bottom).

DAY 3: FULL BODY C (Balance)
${calentamientoPierna}
- Incline Dumbbell Press: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Hack Squat or Smith Machine: 3 sets (10-12 reps, RIR 0)
- Close-Grip Lat Pulldown: 3 sets (10 reps, RIR 0)
- Lying Leg Curls: 3 sets (12-15 reps, RIR 0)
- Cable Lateral Raises: 3 sets (15 reps, RIR 0)
- Dumbbell Hammer Curls: 2 sets (12 reps, RIR 0)
- Barbell Skull Crushers: 2 sets (12 reps, RIR 0)
- Weighted Planks: 3 x 60 sec
`;
      } else if (diasEntreno == 4) {
        cuerpoRutina = `
=== 4-DAY SPLIT: UPPER / LOWER (HIGH VARIETY) ===
DAY 1: HEAVY UPPER (Push Dominant)
${calentamientoTorso}
- Barbell Bench Press: 1 TS (3-5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Failure)
- Weighted Pull-ups or Heavy Lat Pulldown: 1 TS (5-8 reps, RIR 1) + 2 BO (10 reps, RIR 0/Failure)
- Standing Barbell Overhead Press: 3 sets (8-10 reps, RIR 0)
- Low Cable Row (V-Grip): 3 sets (10-12 reps, RIR 0)
- Incline Flyes or Pec-Deck: 2 sets (15 reps, RIR 0)
- Dumbbell Lateral Raises: 4 sets (15 reps, RIR 0)
- Cable Tricep Rope Extension: 3 sets (12-15 reps, RIR 0)

DAY 2: HEAVY LOWER (Quad Dominant)
${calentamientoPierna}
- Barbell Squat: 1 TS (3-5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Failure)
- Romanian Deadlift: 3 sets (8-10 reps, RIR 0/Failure)
- Leg Press (Feet low & narrow): 3 sets (12-15 reps, RIR 0)
- Leg Extensions: 3 sets (15 reps, Technical Failure RIR 0 + Drop Set on last)
- Seated Leg Curls: 2 sets (12-15 reps, RIR 0)
- Standing Calf Raises: 4 sets (15-20 reps, RIR 0)
- Cable Crunches: 3 sets (12-15 reps, RIR 0)

DAY 3: HYPERTROPHY UPPER (Pull Dominant)
${calentamientoTorso}
- Barbell Row: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Incline Dumbbell Press: 1 TS (8-10 reps, RIR 1) + 2 BO (12 reps, RIR 0/Failure)
- Supinated Lat Pulldown: 3 sets (10-12 reps, RIR 0)
- Weighted Dips: 3 sets (8-10 reps, RIR 0)
- Face Pulls (Rear Delts): 3 sets (15 reps, RIR 0)
- Straight Bar Bicep Curls: 3 sets (10-12 reps, RIR 0)
- Single Arm Cable Tricep Extension: 2 sets (12 reps, RIR 0)

DAY 4: HYPERTROPHY LOWER (Posterior Chain Dominant)
${calentamientoPierna}
- Conventional or Sumo Deadlift: 1 TS (3-5 reps, RIR 1) + 2 BO (8 reps, RIR 0/Failure)
- Dumbbell Bulgarian Split Squats: 3 sets (10-12 reps per leg, RIR 0)
- Lying Leg Curls: 3 sets (12-15 reps, Failure on last RIR 0)
- Leg Press (Feet high & wide): 3 sets (15 reps, RIR 0)
- Barbell Hip Thrusts: 3 sets (10-12 reps, RIR 0)
- Seated Calf Raises (Soleus Focus): 4 sets (20 reps, RIR 0)
`;
      } else {
        cuerpoRutina = `
=== 5/6-DAY SPLIT: PUSH / PULL / LEGS / UPPER / LOWER ===
DAY 1: PUSH
${calentamientoTorso}
- Barbell Bench Press: 1 TS (5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Failure)
- Press Militar Sentado (Mancuernas): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Fallo)
- Convergent Machine Incline Press: 2 sets (10-12 reps, RIR 0)
- Cable Flyes (Low Pecs): 2 sets (15 reps, RIR 0)
- Lateral Raises (Cable, Unilateral): 3 sets (15 reps, RIR 0)
- EZ Bar Skull Crushers: 3 sets (10-12 reps, RIR 0)
- Rope Tricep Extension: 2 sets (15 reps, RIR 0)

DAY 2: PULL
${calentamientoTorso}
- Pull-ups or Wide Lat Pulldown: 1 TS (6 reps, RIR 1) + 2 BO (10 reps, RIR 0/Failure)
- Barbell Row (Pronated Grip): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Straight-Arm Cable Pullover: 2 sets (12-15 reps, RIR 0)
- Unilateral Machine Row: 2 sets (10-12 reps per arm, RIR 0)
- Dumbbell Reverse Flyes (Rear Delts): 3 sets (15 reps, RIR 0)
- Alternating Dumbbell Curls: 3 sets (10 reps, RIR 0)
- Low Cable Bicep Curls: 2 sets (15 reps, RIR 0)

DAY 3: LEGS
${calentamientoPierna}
- Barbell Squat: 1 TS (5 reps, RIR 1) + 2 BO (8-10 reps, RIR 0/Failure)
- 45 Degree Leg Press: 3 sets (12-15 reps, RIR 0)
- Dumbbell Walking Lunges: 2 sets (12 steps per leg, RIR 0)
- Lying Leg Curls: 3 sets (12-15 reps, RIR 0)
- Standing Calf Raises: 4 sets (15 reps, RIR 0)

DAY 4: UPPER (Full Upper Body - 2x Frequency)
${calentamientoTorso}
- Incline Press (Dumbbell or Barbell): 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- T-Bar or Gironda Row: 3 sets (8-10 reps, RIR 0)
- Machine Shoulder Press: 3 sets (10-12 reps, RIR 0)
- Close-Grip Lat Pulldown: 3 sets (10-12 reps, RIR 0)
- Dumbbell Lateral Raises: 3 sets (15-20 reps, RIR 0)
- Superset: Hammer Curls + Cable Tricep Extension: 3 sets (12 reps, RIR 0)

DAY 5: LOWER (Posterior Chain)
${calentamientoPierna}
- Romanian Deadlift: 1 TS (6-8 reps, RIR 1) + 2 BO (10-12 reps, RIR 0/Failure)
- Smith Machine Bulgarian Split Squats: 3 sets (10 reps per leg, RIR 0)
- Leg Extensions: 3 sets (15 reps, RIR 0)
- Seated Leg Curls: 3 sets (12 reps, RIR 0)
- Hip Thrusts: 3 sets (10 reps, RIR 0)
- Ab Wheel or Weighted Planks: 3 sets to failure (RIR 0).
`;
      }

      if (disciplina.toLowerCase() === 'mixta') {
        cuerpoRutina += `
=== AEROBIC ENDURANCE BLOCK (HYBRID ATHLETE) ===
Since this is a hybrid plan, you must fit this work without interfering with your hypertrophy adaptations (Interference Effect):
- Session 1 (Aerobic Base): 45 minutes of steady-state Running or Cycling in Zone 2 (60-70% Max HR). You should be able to hold a conversation. Ideal for weight training rest days or post-upper body workouts. Avoid HIIT the day before heavy Leg training.
- Session 2 (Aerobic Power / HIIT): 10 min warm-up + 6 sets of (40 sec max sprint / 80 sec active walk) + 10 min cool-down.
`;
      }

      rutina = glosarioIntensidad + cuerpoRutina;

    } else if (disciplina.toLowerCase() === 'aerobico') {
      rutina = `
=== PRO ENDURANCE & AEROBIC PLAN ===
This plan aims to improve your VO2 Max, lactate threshold, and running economy using real physiological principles.

[ SPECIFIC WARM-UP (10-15 MIN) ]
- Dynamic lower body mobility: Hip circles, leg swings (forward/back & lateral) (10 per leg).
- Glute Medius Activation: Lateral band walks. Essential to prevent knee valgus (collapsing inward) under fatigue.
- 5 minutes of ultra-light jogging (Zone 1), progressively raising heart rate until you break a sweat.

[ ADVANCED PERFORMANCE & PHYSIOLOGY TIPS ]
1. 80/20 Distribution (Polarized): 80% of your weekly volume should be low intensity (Zone 2). The remaining 20% at high intensity (Zones 4 and 5). The common mistake is doing everything at moderate intensity (Zone 3 or "Black Hole"), creating excessive fatigue without optimal cardiovascular adaptations.
2. Cadence: When running, aim for 170-180 steps per minute to reduce ground contact time and joint impact. On the bike, maintain 85-95 rpm.
3. Intra-Workout Hydration & Nutrition: For sessions over 60-75 mins, it's non-negotiable to consume 30-60g of fast-absorbing carbs per hour and around 500ml of water with electrolytes (mostly sodium to prevent hyponatremia and cramps).

[ WEEKLY PROGRAMMING (${diasEntreno} DAYS) ]
- Session 1 (Base Building & Mitochondrial Efficiency): 60 to 90 mins LISS in Zone 2. Strict focus on keeping heart rate controlled. If it spikes, walk. Improves fat oxidation and capillary network development.
- Session 2 (Lactate Threshold Training): 15 min warm-up + 3 sets of 10 mins at threshold pace (RPE 7-8/10, a pace you could hold for 1 hour) with 3 mins light jog between sets + 10 min cool-down. Teaches your body to clear and recycle lactate faster.
- Session 3 (Intervals / VO2 Max): 15 min warm-up + 8 to 10 sets of (400 meters at 90-95% capacity / 90 sec passive rest or walking) + 10 min cool-down. Increases the maximum amount of oxygen the body can process per unit of time.
- Session 4 (Active Recovery): 30-40 mins of very light swimming or stationary bike to flush nutrient-rich blood to damaged muscles and accelerate recovery without overloading the CNS.
- Session 5 (Weekend Long Run): Increase Session 1 volume by 10-15%. Race mentality, test your gels and nutritional strategy you would use on race day here.
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

    dieta = `=== HIGH PERFORMANCE NUTRITIONAL PLAN (Base ~70kg) ===\n`;
    dieta += `Daily Kcal: ~${calorias} | Proteins: ${proteinas}g | Carbs: ${carbos}g | Fats: ${grasas}g\n`;
    dieta += `Chosen Distribution: ${comidasAlDia} daily meals.\n\n`;

    dieta += `[ THE "WHY" BEHIND YOUR MEALS (TIMING & NUTRITIONAL PHYSIOLOGY) ]
Since you indicated you train around ${horaEntreno}, we have structured your key meals:
* MEAL ${preWorkoutMeal} is your PRE-WORKOUT. It provides complex carbohydrates to fill hepatic and muscle glycogen stores, minimizing central and peripheral fatigue. We moderate fat to speed up gastric emptying.
* MEAL ${postWorkoutMeal} is your POST-WORKOUT. Focus on high biological value protein to surpass the "leucine threshold" (~3g of leucine), trigger the mTOR pathway (muscle protein synthesis) and start repairing muscle fibers damaged during training to failure.
---------------------------------------------------------\n\n`;

    // Generador dinámico del Menú Extenso
    for (let i = 1; i <= comidasAlDia; i++) {

      let tituloComida = `[ MEAL ${i} ]`;
      if (i === preWorkoutMeal) tituloComida += " - 🔥 PRE-WORKOUT 🔥";
      if (i === postWorkoutMeal) tituloComida += " - 🔨 POST-WORKOUT 🔨";
      if (i === comidasAlDia) tituloComida += " - 🌙 RECOVERY DINNER 🌙";

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
          opciones = `- Option A: 4 Scrambled eggs, 100g oatmeal cooked with milk, 1 banana and 30g walnuts.\n- Option B: 3 Large sourdough toasts, 150g turkey, 1 whole avocado and 1 Greek yogurt.\n- Option C: Massive shake (1.5 scoops whey, 100g oat flour, 1 banana, 50g peanut butter, whole milk).`;
        } else if (tipoComida === "desayuno") {
          opciones = `- Option A: 3 Scrambled eggs, 80g oatmeal and 1 apple.\n- Option B: 2 Toasts, 100g turkey and half an avocado.\n- Option C: Shake (1 scoop whey, 60g oats, 30g peanut butter, skim milk).`;
        } else if (tipoComida === "almuerzo_fuerte") {
          opciones = `- Option A: 200g Chicken breast, 150g rice (dry weight), broccoli and 1 tbsp olive oil.\n- Option B: 200g Lean beef, 150g pasta and mixed salad.\n- Option C: 2 Cans of tuna, 400g boiled potato, tomato and cucumber salad.`;
        } else if (tipoComida === "almuerzo") {
          opciones = `- Option A: 150g Chicken, 100g rice and vegetables.\n- Option B: 150g Beef, 100g pasta and salad.\n- Option C: 150g Lean pork loin, 250g baked potato, asparagus.`;
        } else if (tipoComida === "cena_fuerte") {
          opciones = `- Option A: 200g Salmon, 350g baked potato and asparagus.\n- Option B: Omelette (3 whole eggs + 3 egg whites), 150g whole wheat bread and fresh cheese.\n- Option C: 200g Baked sea bream, 120g quinoa and sautéed mushrooms.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in the cotransport of glucose and amino acids to muscle cells during overnight repair.`;
        } else if (tipoComida === "cena") {
          opciones = `- Option A: 150g Salmon, 250g baked potato.\n- Option B: 150g Hake, mushrooms and 1 slice of bread.\n- Option C: French omelette (2 eggs + 2 whites) and a large salad.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in the cotransport of glucose and amino acids to muscle cells during overnight repair.`;
        } else if (tipoComida === "snack_pesado") {
          opciones = `- Option A: 1 Greek yogurt + 1 scoop whey + 30g almonds.\n- Option B: 5 Rice cakes with peanut butter and a Whey shake.\n- Option C: 2 Slices of whole wheat bread with 100g lean Serrano ham.`;
        } else if (tipoComida === "snack_ligero") {
          opciones = `- Option A: 1 Piece of fruit and 20g walnuts.\n- Option B: Whey protein shake with water.\n- Option C: 3 Corn cakes with turkey breast.`;
        }

      } else if (tipoDieta.toLowerCase() === 'vegano') {
        if (tipoComida === "desayuno_fuerte") {
          opciones = `- Option A: Porridge (100g oats, 1.5 scoops vegan protein, chia seeds, peanut butter).\n- Option B: 300g Scrambled tofu (turmeric, black salt) on 3 rye toasts and 1 glass of soy milk.\n- Option C: Caloric shake (soy milk, 1.5 scoops protein, 2 bananas, 50g walnuts).`;
        } else if (tipoComida === "desayuno") {
          opciones = `- Option A: Porridge (80g oats, 1 scoop vegan protein, strawberries).\n- Option B: Scrambled tofu on 2 toasts.\n- Option C: 2 Toasts with peanut butter and banana slices.`;
        } else if (tipoComida === "almuerzo_fuerte") {
          opciones = `- Option A: 250g Grilled firm tofu, 120g quinoa and a large vegetable stir-fry.\n- Option B: 200g Heura or textured soy, 120g red lentil pasta.\n- Option C: 300g Chickpeas (drained), with 80g basmati rice and homemade tomato sauce.`;
        } else if (tipoComida === "almuerzo") {
          opciones = `- Option A: 200g Tofu, 80g quinoa and vegetables.\n- Option B: 150g Heura, 100g lentil macaroni.\n- Option C: 200g Cooked lentils with rice and mixed vegetables.`;
        } else if (tipoComida === "cena_fuerte") {
          opciones = `- Option A: 200g Seitan, 350g baked potato and vegetable cream.\n- Option B: Double bean burgers with spinach and a large baked sweet potato.\n- Option C: 250g Baked tempeh, 100g brown rice and peppers.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in the cotransport of glucose and amino acids to muscle cells during overnight repair.`;
        } else if (tipoComida === "cena") {
          opciones = `- Option A: 150g Seitan, 250g baked potato.\n- Option B: Marinated baked tempeh with stir-fry.\n- Option C: Homemade veggie burger with spinach side.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in the cotransport of glucose and amino acids to muscle cells during overnight repair.`;
        } else if (tipoComida === "snack_pesado") {
          opciones = `- Option A: Plain soy yogurt, 1 scoop vegan protein and walnuts.\n- Option B: 4 Corn cakes with plenty of hummus.\n- Option C: Edamame bowl (150g) and 30g almonds.`;
        } else if (tipoComida === "snack_ligero") {
          opciones = `- Option A: Fruit and almonds.\n- Option B: Small vegan protein shake with water.\n- Option C: 2 Rice cakes with tahini.`;
        }

      } else { // Flexible
        if (tipoComida.includes("fuerte")) {
          opciones = `- Choose heavy portions. Example: Large cereal and yogurt bowl for breakfast, massive "Bodybuilder bowl" (rice, lean protein, zero sauces) for lunch, and a large Fit Pizza for dinner.\n- Remember: Always prioritize a leucine-rich source in every major meal to maximize protein synthesis.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in nutrient cotransport.`;
        } else if (tipoComida.includes("snack")) {
          opciones = `- IIFYM Snacks: Protein bars, rice cakes, fruit or a treat (cookie/chocolate) as long as it fits your macros.\n- If your cheat meal is coming up, reduce fats and carbs in these snacks.`;
        } else {
          opciones = `- Standard options: Fish with potatoes, chicken fajitas adjusting macros (whole wheat tortillas, chicken, veggies), or toasts with avocado and turkey.\n- You can use sugar-free sauces and spices freely.\n*Physiology Tip: Add salt normally to your dinner. Sodium helps retain fluids intracellularly (cellular hydration) and assists in nutrient cotransport.`;
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
        const idsAgregados = new Set();

        const inyectarSimulado = (palabra) => {
          let nombreSim = `Premium ${palabra}`;
          let descSim = `Suplemento avanzado de ${palabra} de grado farmacéutico formulado para optimizar el rendimiento atlético.`;
          let precioSim = 24.99;
          let imgSim = null;

          if (palabra.toLowerCase() === 'gel') {
            nombreSim = 'BitIron Energy Gel 60g (Glucosa/Fructosa 2:1)';
            descSim = 'Gel energético avanzado de absorción ultra-rápida. Evita la fatiga gástrica y aporta 40g de carbohidratos.';
            precioSim = 2.50;
            imgSim = '/assets/products/bitiron_energy_gel.png';
          } else if (palabra.toLowerCase() === 'isotonico') {
            nombreSim = 'BitIron Isotonic Electrolyte Stack';
            descSim = 'Bebida isotónica con ratio óptimo de sodio, potasio y magnesio para evitar calambres y deshidratación.';
            precioSim = 14.90;
            imgSim = '/assets/products/bitiron_isotonico.png';
          } else if (palabra.toLowerCase() === 'magnesio') {
            nombreSim = 'Bisglicinato de Magnesio Quelado 120 caps';
            descSim = 'Magnesio de alta biodisponibilidad. Mejora el descanso, la contracción y reduce el estrés del SNC.';
            precioSim = 18.99;
            imgSim = '/assets/products/lifepro_zma.png';
          } else if (palabra.toLowerCase() === 'proteina') {
            nombreSim = 'BitIron Whey Protein Concentrate 1kg';
            descSim = 'Concentrado de suero de máxima pureza sabor Doble Chocolate. 24g de proteína por toma.';
            precioSim = 29.99;
            imgSim = '/assets/products/myprotein_whey.png';
          } else if (palabra.toLowerCase() === 'creatina') {
            nombreSim = 'Creatina Monohidrato Ultrapura 300g';
            descSim = 'Creatina monohidratada micronizada. Aumenta la fuerza explosiva y resíntesis de ATP.';
            precioSim = 22.50;
            imgSim = '/assets/products/lifepro_creapure.png';
          } else if (palabra.toLowerCase() === 'pre-entreno') {
            nombreSim = 'BitIron Pre-Workout Nitric Oxidizer';
            descSim = 'Fórmula extrema de bombeo y foco cognitivo con L-Citrulina, Beta-Alanina y cafeína anhidra.';
            precioSim = 32.00;
            imgSim = '/assets/products/amix_c4.png';
          }

          suplementosRecomendados.push({
            IdProducto: `GEN-${palabra.toUpperCase()}`,
            Nombre: nombreSim,
            Descripcion: descSim,
            Precio: precioSim,
            Imagen_Url: imgSim,
            _simulado: true
          });
        };

        for (const palabra of palabrasClaveSuplementos) {
          // Si busca Proteina, intentamos buscar también "Protein" por la nomenclatura en base de datos
          const terminos = palabra.toLowerCase() === 'proteina' ? ['Proteina', 'Protein'] : [palabra];
          let encontradosParaPalabra = [];

          for (const t of terminos) {
            const resBusqueda = await productoModel.getAll({ nombre: t });
            if (resBusqueda && resBusqueda.rows && resBusqueda.rows.length > 0) {
              encontradosParaPalabra.push(...resBusqueda.rows);
            }
          }

          if (encontradosParaPalabra.length > 0) {
            let agregadosDePalabra = 0;
            for (const prod of encontradosParaPalabra) {
              const id = prod.IdProducto || prod.idProducto || prod.id_producto || prod.id;
              const nombre = prod.Nombre || prod.nombre;
              const desc = prod.Descripcion || prod.descripcion || '';
              const precio = prod.Precio || prod.precio || 0;
              const img = prod.Imagen_Url || prod.imagen_url || null;

              if (id && !idsAgregados.has(id)) {
                suplementosRecomendados.push({
                  IdProducto: id,
                  Nombre: nombre,
                  Descripcion: desc,
                  Precio: Number(precio),
                  Imagen_Url: img
                });
                idsAgregados.add(id);
                agregadosDePalabra++;
              }
            }

            if (agregadosDePalabra === 0) {
              inyectarSimulado(palabra);
            }
          } else {
            inyectarSimulado(palabra);
          }
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
    // 4. CROSS-SELLING (VENTA CRUZADA)
    // ============================================================================
    
    const pool = require('../config/db');
    let tiendaRecomendaciones = [];
    
    try {
      const [productosCrossSelling] = await pool.query(
        `SELECT IdProducto, Nombre, Descripcion, Precio, Marca, ObjetivoRecomendado 
         FROM PRODUCTO 
         WHERE ObjetivoRecomendado LIKE ? AND Stock > 0
         ORDER BY RAND() 
         LIMIT 3`,
        [`%${objetivo}%`]
      );
      tiendaRecomendaciones = productosCrossSelling;
    } catch (errorDb) {
      console.error("Error al obtener recomendaciones de Cross-Selling:", errorDb);
    }

    // ============================================================================
    // 5. RESPUESTA FINAL
    // ============================================================================

    const idAsesoria = await planModel.guardarPlanGenerado(idCliente, disciplina, rutina, dieta);

    return res.status(200).json({
      mensaje: "High Performance Plan Generated Successfully",
      idAsesoria,
      configuracion: { disciplina, objetivo, nivel, diasEntreno, tipoDieta, comidasAlDia, horaEntreno, nivelSuplementacion },
      rutina,
      dieta,
      suplementosRecomendados,
      tiendaRecomendaciones
    });
});

const getHistorial = catchAsync(async (req, res, next) => {
  const [planes] = await pool.query('SELECT * FROM ASESORIA WHERE IdCliente = ?', [req.usuario.id]);
  res.status(200).json(planes);
});

module.exports = {
  generarPlan,
  getHistorial
};
