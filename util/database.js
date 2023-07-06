const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-completes', 'root', 'Sept@45454545', {
  dialect: 'mysql',
  host: 'localhost'
});
sequelize.authenticate().then(() => {
// try{
  console.log('Connection has been established successfully (from util(folder) database.js).');
})

.catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;

