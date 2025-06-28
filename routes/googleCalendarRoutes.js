// routes/googleCalendarRoutes.js
const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/auth');
const googleCalendarController = require('../controllers/googleCalendarController');

router.use(jwtAuth);

// Obtener URL para conectar cuenta de Google
router.get('/auth-url', googleCalendarController.getAuthUrl);

// Guardar tokens tras autenticación
router.post('/save-tokens', googleCalendarController.saveTokens);

// Crear un nuevo evento
router.post('/create-event', googleCalendarController.createEvent);

// Obtener eventos del usuario
router.get('/events', googleCalendarController.getEvents);

module.exports = router;
