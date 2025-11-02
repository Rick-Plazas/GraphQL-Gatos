// database/db.js

const { Sequelize } = require('sequelize'); //ORM

const sequelize = new Sequelize('studentsdb', 'postgres', 'fuerzaaerea2',{
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize; 