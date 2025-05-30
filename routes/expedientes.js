// routes/expedientes.js
const express = require('express');
const router = express.Router();
const expedientesController = require('../controllers/expedientesController');

// Obtener todos los expedientes de un tipo (federales, provinciales, extrajudiciales)
router.get('/:tipo', expedientesController.getExpedientes);

// Obtener expediente por ID
router.get('/ver/:id', expedientesController.getExpedienteById);

// Crear expediente según tipo
router.post('/:tipo', expedientesController.createExpediente);

// Editar expediente por ID
router.put('/:id', expedientesController.updateExpediente);

// Eliminar expediente por ID
router.delete('/:id', expedientesController.deleteExpediente);

// Cambiar a 'Finalizado'
router.put('/:id/finalizar', expedientesController.finalizarExpediente);

// Actualizar automáticamente a 'Atrasado' si fecha > 7 días
router.put('/:tipo/atrasados', expedientesController.updateAtrasados);

module.exports = router;
