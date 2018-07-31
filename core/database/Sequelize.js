const Sequelize = require('sequelize').Sequelize;

module.exports = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
  // SQLite only
  storage: 'database.sqlite',
});