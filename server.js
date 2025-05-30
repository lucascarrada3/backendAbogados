const express = require('express');
const cors = require('cors');
const db = require('./models');
const expedientesRoutes = require('./routes/expedientes');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/expedientes', expedientesRoutes);
require('./atrasadosCron');

app.get('/estado/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const estado = await db.Estado.findByPk(id);  // Buscar el estado en la base de datos
      if (!estado) return res.status(404).json({ error: 'Estado no encontrado' });
      res.json(estado);  // Devolver el estado en formato JSON
    } catch (error) {
      res.status(400).json({ error: error.message });  // Manejo de errores
    }
});

app.get('/estado', async (req, res) => {
    const estados = await db.Estado.findAll();
    res.json(estados);
  });

// Conexión y sync con base de datos
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');

    return db.sequelize.sync(); // sincroniza modelos con la base
  })
  .then(() => {
    console.log('Modelos sincronizados.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });
