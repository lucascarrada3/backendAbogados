const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/auth');
const expedientesRoutes = require('./routes/expedientes');
const eventosRoutes = require('./routes/eventos');
const authMiddleware = require('./middleware/auth');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.set('socketio', io);

// Middleware
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/auth', authRoutes);

// Middleware autenticación
app.use(authMiddleware);

// Rutas protegidas
app.use('/expedientes', expedientesRoutes);
app.use('/eventos', eventosRoutes);

// Otros endpoints
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

// Conexión y sync DB
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados.');

    // Cargamos los cron jobs solo acá, cuando app e io ya existen
    require('./atrasadosCron')(app);
    require('./notificadorEventos')();

    server.listen(port, () => {
      // console.log(`Servidor corriendo en http://localhost:${port}`);
      console.log(`Servidor corriendo en https://backendabogados-w78u.onrender.com`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

module.exports = app;
