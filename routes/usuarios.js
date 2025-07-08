const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/miPerfil', usuariosController.getMiPerfil);
router.put('/actualizarPerfil', usuariosController.actualizarPerfil);
router.put('/cambiarPassword', usuariosController.cambiarPassword);
router.put('/subirFotoPerfil', usuariosController.subirFotoPerfil);

module.exports = router;
