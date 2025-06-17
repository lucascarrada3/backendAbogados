// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const Usuario = db.Usuario;

const SECRET_KEY = 'Prueba123.';

exports.register = async (req, res) => {
  try {
    const { nombreCompleto, nombreUsuario, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { nombreUsuario } });
    if (usuarioExistente) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombreCompleto,
      nombreUsuario,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    console.error('Error en register:', error);  
    res.status(500).json({ error: 'Error en el registro' });
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
