const mysql = require('mysql');

const connection = mysql.createPool({
    host: '68.178.227.196',
    user: 'efinFP',
    password: 'efinFP',
    database: 'device_asset'
});

connection.getConnection((err) => {
    if (!!err) {
        console.log(err);
    } else {
        console.log('Connected...');
    }
  
  });

  module.exports = connection
  
