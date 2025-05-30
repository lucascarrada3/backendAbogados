const cron = require('node-cron');
const db = require('./models');
const { Op } = require('sequelize');

const Expedientes = db.Expedientes;

// Cron que corre todos los días a la medianoche (00:00)
cron.schedule('0 0 * * *', async () => {
  console.log('Ejecutando tarea diaria para marcar atrasados');

  try {
    const cincoDiasAtras = new Date();
    cincoDiasAtras.setDate(cincoDiasAtras.getDate() - 5);

    const [updatedCount] = await Expedientes.update(
      { idEstado: 3 }, // 3 = Atrasado
      {
        where: {
          updatedAt: { [Op.lt]: cincoDiasAtras },
          idEstado: { [Op.ne]: 4 } // No actualizar si ya está Finalizado
        }
      }
    );

    console.log(`Expedientes actualizados a Atrasado: ${updatedCount}`);
  } catch (error) {
    console.error('Error en cron job de atrasados:', error);
  }
});
