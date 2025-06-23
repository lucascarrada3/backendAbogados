// models/Expedientes.js
module.exports = (sequelize, DataTypes) => {
  const Expedientes = sequelize.define('Expedientes', {
    idExpediente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    numeroExpediente: { type: DataTypes.STRING(100), allowNull: false },
    juzgado: { type: DataTypes.STRING(255), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    caratula: { type: DataTypes.TEXT },
    proveido: { type: DataTypes.TEXT },
    observaciones: { type: DataTypes.TEXT },
    idEstado: { type: DataTypes.INTEGER, allowNull: false },
    idTipo: { type: DataTypes.INTEGER, allowNull: false },
    fechaActualizacion: { type: DataTypes.DATE, allowNull: false },
    idUsuario: { type: DataTypes.INTEGER,  allowNull: false },
    eliminado: { type: DataTypes.BOOLEAN,  allowNull: false },
  }, {
    tableName: 'Expedientes',
    timestamps: true,
    createdAt: false,
    updatedAt: 'fechaActualizacion'
  });

  Expedientes.associate = (models) => {
    Expedientes.belongsTo(models.Estado, { foreignKey: 'idEstado', as: 'estado' });
    Expedientes.belongsTo(models.TipoExpediente, { foreignKey: 'idTipo', as: 'tipo' });
    Expedientes.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'usuario'});
  };

  // Hook para actualizar fechaActualizacion manualmente
  Expedientes.beforeUpdate((expediente, options) => {
    expediente.fechaActualizacion = new Date();
  });

  return Expedientes;
};
