const cors = require('cors');

app.use(cors({
  //origin: 'http://localhost:5173', // URL del frontend local
  origin: 'https://frontend-abogados-ja2z.vercel.app', // URL del frontend producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
