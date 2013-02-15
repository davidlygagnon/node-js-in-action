// code to connect to postgres db
var pg = require('pg');
var conString = "tcp://myuser:mypassword@localhost:5432/mydatabase";

var client = new pg.Client(conString);
client.connect();

// inserting a row into a database table
client.query(
  'INSERT INTO users ' +
  "(name) VALUES ('Mike')");

// example of preventing SQL injections
client.query(
  "INSERT INTO users " +
  "(name, age) VALUES ($1, $2)",
  ['Mike', 39]
  );

// Returning id to client
client.query(
  "INSERT INTO users " +
  "(name, age) VALUES ($1, $2) " +
  "RETURNING id",
  ['Mike', 39], 
  function (err, result) {
    if (err) throw err;
    console.log('Insert ID is ' + result.rows[0].id);
  });

// creating a query that returns results
var query = client.query(
  "SELECT * FROM users WHERE age > $1",
  [40]
  );

query.on('row', function(row) {
  console.log(row.name);
})

query.on('end', function () {
  client.end();
})