// const mysql2= require('mysql2');

// const pool = mysql2.createPool({
//     host: 'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'Dev@#Hunz@#787@#Ali.'
// })

// module.exports = pool.promise();

const {Sequelize} = require('sequelize');

const sequelize= new Sequelize('node-complete','root','Dev@#Hunz@#787@#Ali.',{
    dialect: 'mysql', host: 'localhost'
});
module.exports = sequelize;