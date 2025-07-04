const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/getEventos', eventosController.getEventos);
router.get('/getEvento/:id', eventosController.getEventoById);
router.post('/crearEventos', eventosController.crearEvento);
router.put('/actualizarEventos/:id', eventosController.actualizarEvento);
router.delete('/deleteEvento/:id', eventosController.eliminarEvento); 

module.exports = router;
