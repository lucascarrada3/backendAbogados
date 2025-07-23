// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Prueba123.';

module.exports = (req, res, next) => {
  // Permitir rutas públicas
  if (req.path.startsWith('/auth')) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
