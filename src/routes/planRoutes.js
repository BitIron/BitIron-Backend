const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/historial', verificarToken, planController.getHistorial);
router.post('/generar', verificarToken, planController.generarPlan);

module.exports = router;