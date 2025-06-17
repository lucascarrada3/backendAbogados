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
    });

    // Definir la asociación dentro de una función associate que recibe los modelos
    Usuario.associate = function(models) {
        Usuario.hasMany(models.Expedientes, {
            foreignKey: 'idUsuario',
            as: 'expedientes'
        });
    };

    return Usuario;
};
