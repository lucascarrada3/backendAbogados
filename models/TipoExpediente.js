// models/TipoExpediente.js
module.exports = (sequelize, DataTypes) => {
  const TipoExpediente = sequelize.define('TipoExpediente', {
    idTipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombreTipo: { type: DataTypes.STRING(50), allowNull: false }
  }, {
    tableName: 'TiposExpediente',
    timestamps: false
  });

  TipoExpediente.associate = (models) => {
    TipoExpediente.hasMany(models.Expedientes, { foreignKey: 'idTipo' });
  };

  return TipoExpediente;
};
