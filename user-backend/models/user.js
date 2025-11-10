module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: DataTypes.STRING,
        bio: DataTypes.TEXT,
        password: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN,
        lastActivity: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Message, { foreignKey: 'userId' });
    };

    return User;
};