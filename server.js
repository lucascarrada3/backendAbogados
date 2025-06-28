const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const expedientesRoutes = require('./routes/expedientes');
const authMiddleware = require('./middleware/auth');

const http = require('http');
const { Server } = require('socket.io');

const app = express(); // ← MOVER ESTA LÍNEA AQUÍ
const port = process.env.PORT || 3001

const server = http.createServer(app); // ← YA puedes usar `app` aquí

const io = new Server(server, {
  cors: {
    origin: '*', // o tu dominio del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// const PORT = 3001;

app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Middleware de autenticación para TODO lo que no sea /auth
app.use(authMiddleware);

// Rutas protegidas
app.use('/expedientes', expedientesRoutes);

// Otras rutas protegidas
app.get('/estado/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const estado = await db.Estado.findByPk(id);
        if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
        res.json(estado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/estado', async (req, res) => {
    const estados = await db.Estado.findAll();
    res.json(estados);
});

// Cronjob para actualizar atrasados
require('./atrasadosCron');

// Conexión y sync con base de datos
// Conexión y sync con base de datos
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados.');

    // ✅ SOLO AHORA cargamos el cronjob, cuando `app` ya existe
    require('./atrasadosCron')(app);

    // Y arrancamos el servidor
    server.listen(port, () => {
      // console.log(`Servidor corriendo en http://localhost:${port}`);
      console.log(`Servidor corriendo en https://backendabogados-w78u.onrender.com`);
      
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

// en tu app.js o index.js de Express
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
app.use('/googleCalendar', googleCalendarRoutes);

module.exports = app;
