const express = require('express');
const router = express.Router();
const expedientesController = require('../controllers/expedientesController');
const authMiddleware = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// ⚠️ Primero, rutas específicas que usan `/:id`
router.delete('/delete/:id', expedientesController.deleteExpediente);
router.put('/:id/finalizar', expedientesController.finalizarExpediente);
router.put('/:tipo/atrasados', expedientesController.updateAtrasados);
router.put('/:id', expedientesController.updateExpediente);
router.get('/usuario/:tipo', expedientesController.getExpedientesDelUsuario);
router.post('/usuario/nuevo/:tipo', expedientesController.crearExpedienteParaUsuario);

// ⚠️ Luego las rutas genéricas
router.get('/:tipo/:id', expedientesController.getExpedienteByTipoYId);
router.post('/:tipo', expedientesController.createExpediente);
router.get('/:tipo', expedientesController.getExpedientes);



module.exports = router;
