// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-completes', 'root', 'Sept@45454545', {
//   dialect: 'mysql',
//   host: 'localhost'
// });
// sequelize.authenticate().then(() => {
// // try{
//   console.log('Connection has been established successfully (from util(folder) database.js).');
// })

// .catch((error) => {
//   console.error('Unable to connect to the database: ', error);
// });

// module.exports = sequelize;


const Sequelize = require('sequelize');

const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(database, username, password, {
  dialect: 'mysql',
  host: host
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully (from util(folder) database.js).');
  })
  .catch((error) => {
    console.error('Unable to connect to the database: ', error);
  });

module.exports = sequelize;
