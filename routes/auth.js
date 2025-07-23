const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas (sin protección JWT)
router.post('/login', authController.login);
router.post('/register', authController.register); 
router.post('/solicitar-recuperacion', authController.solicitarRecuperacion);
router.post('/resetear-password', authController.resetearPassword);

module.exports = router;
