const db = require('../config/db');

const guardarPlanGenerado = async (idCliente, tipoPlan, rutina, dieta) => {
    const precioMensual = 49.99;

    const query = `
    INSERT INTO ASESORIA (IdCliente, TipoPlan, PrecioMensual, PagadoAlDia, RutinaGenerada, DietaGenerada)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    try {
        const [resultado] = await db.execute(query, [
            idCliente,
            tipoPlan,
            precioMensual,
            0,
            rutina,
            dieta
        ]);
        return resultado.insertId;
    } catch (error) {
        console.error("Error en planModel.guardarPlanGenerado:", error);
        throw error;
    }
};

module.exports = {
    guardarPlanGenerado
};