module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombreCompleto: DataTypes.STRING,
    nombreUsuario: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    fotoPerfil: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'Usuarios',
    timestamps: true,
  });

  Usuario.associate = function(models) {
    Usuario.hasMany(models.Evento, {
      foreignKey: 'idUsuario',
      as: 'eventos'
    });

    Usuario.hasMany(models.Expedientes, {
      foreignKey: 'idUsuario',
      as: 'expedientes'
    });
  };

  return Usuario;
};
