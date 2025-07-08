const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nombreArchivo = `perfil_${req.user.idUsuario}_${Date.now()}${ext}`;
    cb(null, nombreArchivo);
  }
});

const upload = multer({ storage: storage }).single('foto');

module.exports = upload;
