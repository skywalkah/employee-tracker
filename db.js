// Purpose: Establishes connection to MySQL database
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '<ADD YOUR PASSWORD HERE>',
    database: 'employee_db'
}).promise();

module.exports = db;