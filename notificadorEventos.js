// notificadorEventos.js (o archivo separado)

const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { Op } = require('sequelize');
const { Evento, Usuario } = require('./models');

// Configura tu transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'agenda.estudio3026@gmail.com',
    pass: 'hgfz argf wcro sbaz',
  }
});

module.exports = () => {
  cron.schedule('* * * * *', async () => {
    const ahora = moment();
    const enUnaHora = moment().add(1, 'hours');

    try {
      const eventos = await Evento.findAll({
        where: {
          fecha: ahora.format('YYYY-MM-DD'),
          hora_inicio: {
            [Op.between]: [ahora.format('HH:mm:ss'), enUnaHora.format('HH:mm:ss')]
          },
          recordatorioEnviado: false
        },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['email', 'nombreCompleto']
        }]
      });

      for (const evento of eventos) {
        const mailOptions = {
          from: '"Estudio Romano - Agenda" <agenda.estudio3026@gmail.com>',
          to: evento.usuario.email,
          subject: '⏰ Recordatorio: evento en 1 hora',
          text: `Hola ${evento.usuario.nombreCompleto},\n\nRecordatorio: tu evento "${evento.titulo}" empieza en 1 hora.\nHora: ${evento.hora_inicio}\nFecha: ${evento.fecha}\n\n¡No te lo pierdas!`
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Recordatorio enviado a ${evento.usuario.email}`);
          evento.recordatorioEnviado = true;
          await evento.save();
        } catch (error) {
          console.error(`Error enviando recordatorio a ${evento.usuario.email}:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error en cron de recordatorios:', error.message);
    }
  });
};
