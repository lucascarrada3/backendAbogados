const cron = require('node-cron');
const { updateAtrasados } = require('./controllers/expedientesController');

module.exports = (app) => {
  const tipos = ['federales', 'provinciales', 'extrajudiciales'];

  cron.schedule('0 0 * * * *', async () => {
    console.log('🕛 Ejecutando cron para actualizar expedientes atrasados...');
    const io = app.get('socketio');

    for (const tipo of tipos) {
      try {
        await updateAtrasados(
          { params: { tipo } },
          {
            json: (msg) => {
              console.log(`✔ ${tipo}: ${msg.mensaje}`);
              io.emit('expedientes-atrasados', { tipo, mensaje: msg.mensaje });
            },
            status: (code) => ({
              json: (err) => console.error(`✖ ${tipo} - Error ${code}:`, err),
            }),
          }
        );
      } catch (e) {
        console.error(`💥 Error al actualizar ${tipo}:`, e.message);
      }
    }
  });
};
