const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// Aquí podríamos añadir el middleware esAdmin en el futuro
// const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/dashboard', adminController.getDashboardStats);

module.exports = router;
