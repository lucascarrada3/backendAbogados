const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const path = require('path');
// const multer = require('multer');
const upload = require('../middleware/upload');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // carpeta donde se guardan las imágenes
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const nombreArchivo = `fotoPerfil-${req.user.idUsuario}-${Date.now()}${ext}`;
//     cb(null, nombreArchivo);
//   }
// });
// const upload = multer({
//   storage,
//   limits: { fileSize: 1024 * 1024 * 2 }, // límite 2MB
//   fileFilter: (req, file, cb) => {
//     // Solo aceptar imagenes jpeg/png/gif
//     const tiposValidos = /jpeg|jpg|png|gif/;
//     const mimetypeValido = tiposValidos.test(file.mimetype);
//     const extValido = tiposValidos.test(path.extname(file.originalname).toLowerCase());

//     if (mimetypeValido && extValido) {
//       cb(null, true);
//     } else {
//       cb(new Error('Solo imágenes JPG, PNG o GIF son permitidas'));
//     }
//   }
// }).single('foto');


exports.getMiPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.idUsuario, {
      attributes: ['idUsuario', 'nombreCompleto', 'nombreUsuario', 'email', 'fotoPerfil'],
    });

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil', error });
  }
};

exports.actualizarPerfil = async (req, res) => {
  const { nombreCompleto, nombreUsuario } = req.body;

  try {
    const usuario = await Usuario.findByPk(req.user.idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    usuario.nombreCompleto = nombreCompleto;
    usuario.nombreUsuario = nombreUsuario;

    await usuario.save();
    res.json({ mensaje: 'Perfil actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error });
  }
};

exports.cambiarPassword = async (req, res) => {
  const { nuevoPassword, repetirPassword } = req.body;

  try {
    const usuario = await Usuario.findByPk(req.user.idUsuario);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Validar que coincidan
    if (nuevoPassword !== repetirPassword) {
      return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
    }

    // Hashear y guardar
    const nuevoHash = await bcrypt.hash(nuevoPassword, 10);
    usuario.password = nuevoHash;
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar contraseña', error });
  }
};


exports.subirFotoPerfil = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ mensaje: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ mensaje: 'Archivo no recibido' });
    }

    try {
      const rutaImagen = `/uploads/${req.file.filename}`;

      const usuario = await Usuario.findByPk(req.user.idUsuario);
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      usuario.fotoPerfil = rutaImagen;
      await usuario.save();

      res.json({ mensaje: 'Foto de perfil actualizada con éxito', rutaImagen });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al subir foto de perfil', error });
    }
  });
};

