const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/generar', verificarToken, planController.generarPlan);

module.exports = router;