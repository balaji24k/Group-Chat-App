const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define('message', {
  id : {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },  
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
  },
  fileName: {
    type: Sequelize.STRING,
  },
  fileUrl: {
    type: Sequelize.STRING,
  }
});

module.exports = Message;