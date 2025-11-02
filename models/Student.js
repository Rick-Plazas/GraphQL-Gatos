// models/Student.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Student = sequelize.define('Student',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },

    career:{
        type: DataTypes.INTEGER
    },

    age:{
        type: DataTypes.INTEGER
    },

    semester:{
        type: DataTypes.INTEGER

    }
    }, {
        tableName: 'studentsdb',
        timestamps: false
});

module.exports = Student; 