const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js');

//local

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     pool: dbConfig.pool
//   });


//produccion

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  dialectOptions: dbConfig.dialectOptions
});
  
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Cargar modelos
db.Estado = require('./Estado.js')(sequelize, DataTypes);
db.TipoExpediente = require('./TipoExpediente.js')(sequelize, DataTypes);
db.Expedientes = require('./Expedientes.js')(sequelize, DataTypes);
db.Usuario = require('./Usuario.js')(sequelize, DataTypes);
db.Evento = require('./Evento.js')(sequelize, DataTypes);


// Asociaciones (si existen)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
