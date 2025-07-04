const { Evento } = require('../models');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'agenda.estudio3026@gmail.com',
    pass: 'hgfz argf wcro sbaz',
  }
});

exports.getEventos = async (req, res) => {
  try {
    const userId = req.user.idUsuario;
    if (!userId) return res.status(401).json({ error: 'Usuario no autorizado' });

    const eventos = await Evento.findAll({ where: { idUsuario: userId } });
    res.json(eventos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

exports.getEventoById = async (req, res) => {
  try {
    const userId = req.user.idUsuario || req.user.id;
    const idEvento = req.params.id;

    if (!userId) return res.status(401).json({ error: 'Usuario no autorizado' });

    const evento = await Evento.findOne({
      where: { id: idEvento, idUsuario: userId }
    });

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (err) {
    console.error('Error en getEventoById:', err);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
};


exports.crearEvento = async (req, res) => {
  const { titulo, descripcion, fecha, hora_inicio, hora_fin } = req.body;
  try {
    const userId = req.user.idUsuario;
    if (!userId) return res.status(401).json({ error: 'Usuario no autorizado' });

    const evento = await Evento.create({
      titulo,
      descripcion,
      fecha,
      hora_inicio,
      hora_fin,
      idUsuario: userId,
      recordatorioEnviado: false, // Nuevo campo en la tabla
    });

    // Buscar usuario para enviar mail
    const usuario = await Evento.sequelize.models.Usuario.findByPk(userId);

    const mailOptions = {
      from: '"Estudio Romano - Agenda" <agenda.estudio3026@gmail.com>',
      to: usuario.email,
      subject: '✅ Evento creado exitosamente',
      text: `Hola ${usuario.nombreCompleto},\n\nTu evento "${titulo}" ha sido creado para el día ${fecha} a las ${hora_inicio}.\n\nGracias por usar nuestra agenda.`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error enviando mail creación evento:', err.message);
      } else {
        console.log('Mail de creación enviado:', info.response);
      }
    });

    res.status(201).json(evento);
  } catch (err) {
    console.error('Error en crearEvento:', err);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};


exports.eliminarEvento = async (req, res) => {
  try {
    const userId = req.user.idUsuario || req.user.id;

    const evento = await Evento.findOne({ where: { id: req.params.id, idUsuario: userId } });
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    await evento.destroy();
    res.json({ mensaje: 'Evento eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};

exports.actualizarEvento = async (req, res) => {
  const { titulo, descripcion, fecha, hora_inicio, hora_fin } = req.body;
  try {
    const userId = req.user.idUsuario || req.user.id;

    const evento = await Evento.findOne({ where: { id: req.params.id, idUsuario: userId } });
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    evento.titulo = titulo;
    evento.descripcion = descripcion;
    evento.fecha = fecha;
    evento.hora_inicio = hora_inicio;
    evento.hora_fin = hora_fin;
    await evento.save();
    res.json(evento);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};
