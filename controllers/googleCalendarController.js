// const { google } = require('googleapis');
// const db = require('../models');
// const createOAuth2Client = require('../google/googleAuth');

// exports.getAuthUrl = (req, res) => {
//   const oAuth2Client = createOAuth2Client();
//   const scopes = ['https://www.googleapis.com/auth/calendar'];
//   const url = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes,
//     prompt: 'consent',
//   });
//   res.json({ url });
// };

// exports.saveTokens = async (req, res) => {
//   const { code } = req.body;
//   const { idUsuario } = req.user;

//   try {
//     const oAuth2Client = createOAuth2Client();
//     const { tokens } = await oAuth2Client.getToken(code);

//     await db.Usuario.update(
//       { googleTokens: JSON.stringify(tokens) },
//       { where: { id: idUsuario } }
//     );

//     res.json({ message: 'Tokens guardados correctamente' });
//   } catch (error) {
//     console.error('Error al guardar tokens:', error);
//     res.status(500).json({ error: 'Error al guardar tokens' });
//   }
// };

// exports.createEvent = async (req, res) => {
//   const { idUsuario } = req.user;
//   const { summary, description, start, end } = req.body;

//   try {
//     const usuario = await db.Usuario.findByPk(idUsuario);

//     if (!usuario.googleTokens) {
//       return res.status(400).json({ error: 'Usuario no autenticado con Google' });
//     }

//     const tokens = JSON.parse(usuario.googleTokens);
//     const oAuth2Client = createOAuth2Client();
//     oAuth2Client.setCredentials(tokens);

//     const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

//     const event = {
//       summary,
//       description,
//       start: { dateTime: start, timeZone: 'America/Argentina/Buenos_Aires' },
//       end: { dateTime: end, timeZone: 'America/Argentina/Buenos_Aires' },
//     };

//     const response = await calendar.events.insert({
//       calendarId: 'primary',
//       requestBody: event,
//     });

//     res.json({ message: 'Evento creado', eventId: response.data.id });
//   } catch (error) {
//     console.error('Error al crear evento:', error);
//     res.status(500).json({ error: 'Error al crear evento' });
//   }
// };

// exports.getEvents = async (req, res) => {
//   const { idUsuario } = req.user;

//   try {
//     const usuario = await db.Usuario.findByPk(idUsuario);
//     if (!usuario.googleTokens) {
//       return res.status(400).json({ error: 'Usuario no autenticado con Google' });
//     }

//     const tokens = JSON.parse(usuario.googleTokens);
//     const oAuth2Client = createOAuth2Client();
//     oAuth2Client.setCredentials(tokens);

//     const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

//     const response = await calendar.events.list({
//       calendarId: 'primary',
//       timeMin: new Date().toISOString(),
//       maxResults: 100,
//       singleEvents: true,
//       orderBy: 'startTime',
//     });

//     res.json(response.data.items);
//   } catch (error) {
//     console.error('Error al obtener eventos:', error);
//     res.status(500).json({ error: 'Error al obtener eventos' });
//   }
// };
