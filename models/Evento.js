// models/Evento.js
module.exports = (sequelize, DataTypes) => {
  const Evento = sequelize.define('Evento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    fecha: DataTypes.DATEONLY,
    hora_inicio: DataTypes.TIME,
    hora_fin: DataTypes.TIME,
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',   
        key: 'idUsuario'      
      }
    },
    recordatorioEnviado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'Eventos',
    timestamps: false, 
  });

  Evento.associate = function(models) {
    Evento.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
      targetKey: 'idUsuario',
      as: 'usuario'
    });
  };

  return Evento;
};
