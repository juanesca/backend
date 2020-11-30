const mysql = require("mysql");

const MySQLConnection = mysql.createConnection({
  /*
  host: "bghkvgdcwrzp4hrgmdg0-mysql.services.clever-cloud.com",
  user: "uvswjbyhatviorp7",
  password: "45uXNHuMIEJVG7HiR29c",
  database: "bghkvgdcwrzp4hrgmdg0",
  multipleStatements: true
  */
 host: 'localhost',
 user: 'root',
 password: '1001470357',
 database: 'recapito',
 multipleStatements: true
});

MySQLConnection.connect((error) => {
  if (error) {
    console.error(error);
    return;
  } else {
    console.log("¡Base de datos está conectada!");
  }
});

module.exports = MySQLConnection;
