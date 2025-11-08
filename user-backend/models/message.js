// File : user-backend/models/message.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    tittle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      validate: {
        len: [1, 50000] // Limite à 50000 caractères max
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    attachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Message;
};
