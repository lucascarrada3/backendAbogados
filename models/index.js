const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
  });
  
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Cargar modelos
db.Estado = require('./Estado')(sequelize, DataTypes);
db.TipoExpediente = require('./TipoExpediente')(sequelize, DataTypes);
db.Expedientes = require('./Expedientes')(sequelize, DataTypes);


// Asociaciones (si existen)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
