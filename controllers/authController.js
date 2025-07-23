// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { Usuario } = require('../models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { RecuperacionPassword } = require('../models');
// const transporter = require('../config/mailer'); 
// const Usuario = db.Usuario;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'agenda.estudio3026@gmail.com',
    pass: 'hgfz argf wcro sbaz',
  }
});

const SECRET_KEY = 'Prueba123.';

exports.register = async (req, res) => {
  try {
    const { nombreCompleto, nombreUsuario, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await Usuario.create({
      nombreCompleto,
      nombreUsuario,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      if (field === 'email') {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      } else if (field === 'nombreUsuario') {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }
    }

    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.login = async (req, res) => {
  try {
    const { nombreUsuario, password } = req.body;
    const usuario = await Usuario.findOne({ where: { nombreUsuario } });

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ idUsuario: usuario.idUsuario }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token, usuario: { id: usuario.idUsuario, nombre: usuario.nombreUsuario } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};



exports.solicitarRecuperacion = async (req, res) => {
  const { email } = req.body;

  try {
    // 1) Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'No existe un usuario con ese correo.' });
    }

    // 2) Generar token único y fecha de expiración
    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // 3) Borrar tokens viejos y guardar nuevo
    await RecuperacionPassword.destroy({ where: { idUsuario: usuario.idUsuario } });
    await RecuperacionPassword.create({
      idUsuario: usuario.idUsuario,
      token,
      expiracion
    });

    // 4) Crear link con TU dominio real
    const resetLink = `https://romanoyasociadoslegal.vercel.app/reset-password?token=${token}`;
    //local
    // const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // 5) Opciones de mail como en tu crearEvento
    const mailOptions = {
      from: '"Estudio Romano - Soporte" <agenda.estudio3026@gmail.com>',
      to: usuario.email,
      subject: '🔑 Recuperación de contraseña',
      text: `Hola ${usuario.nombreCompleto},

        Recibimos tu solicitud para recuperar tu contraseña.

        Para crear una nueva, haz click en este enlace (válido por 30 minutos):

        ${resetLink}

        Si no solicitaste este cambio, ignora este mensaje.

        Saludos,
        Equipo Estudio Romano`
    };

    // 6) Enviar
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error enviando mail de recuperación:', err.message);
      } else {
        console.log('Mail de recuperación enviado:', info.response);
      }
    });

    res.json({ mensaje: 'Te enviamos un correo con instrucciones para recuperar tu contraseña.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al solicitar recuperación', error });
  }
};


exports.resetearPassword = async (req, res) => {
  const { token, nuevoPassword, repetirPassword } = req.body;

  try {
    // Validar que coincidan
    if (nuevoPassword !== repetirPassword) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    }

    const recuperacion = await RecuperacionPassword.findOne({ where: { token } });

    if (!recuperacion || recuperacion.expiracion < new Date()) {
      return res.status(400).json({ mensaje: 'Token inválido o expirado' });
    }

    const usuario = await Usuario.findByPk(recuperacion.idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Pisar contraseña igual que tu cambiarPassword
    const nuevoHash = await bcrypt.hash(nuevoPassword, 10);
    usuario.password = nuevoHash;
    await usuario.save();

    // Eliminar el token para que no se reutilice
    await recuperacion.destroy();

    res.json({ mensaje: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al restablecer contraseña', error });
  }
};