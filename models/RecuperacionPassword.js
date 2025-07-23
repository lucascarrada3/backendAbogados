module.exports = (sequelize, DataTypes) => {
  const RecuperacionPassword = sequelize.define('RecuperacionPassword', {
    idRecuperacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiracion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'RecuperacionPassword',
    timestamps: false,
  });

  RecuperacionPassword.associate = function(models) {
    RecuperacionPassword.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
      as: 'usuario',
    });
  };

  return RecuperacionPassword;
};
