const Sequelize = require('sequelize'),
      sequelize = require('../../core/database/Sequelize');

/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255),
 * description TEXT,
 * username VARCHAR(255),
 * usage INT
 * );
 */

const sequelizeInstance = sequelize.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: Sequelize.TEXT,
  username: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = sequelizeInstance;