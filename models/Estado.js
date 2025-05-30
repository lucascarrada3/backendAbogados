module.exports = (sequelize, DataTypes) => {
  const Estado = sequelize.define('Estado', {
    idEstado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'Estados',
    timestamps: false
  });

  Estado.associate = (models) => {
    Estado.hasMany(models.Expedientes, { foreignKey: 'idEstado', as: 'expedientes' });
  };

  return Estado;
};
