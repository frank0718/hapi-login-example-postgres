var test = require('tape');
// we display the file (name) in each test name for stack trace
var dir = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + ' -> ';

require('env2')('./config.env'); // see: https://github.com/dwyl/env2
var pg = require('pg');
var assert = require('assert');

function create_tables (callback) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    assert(!err);
    var file_path = require('path').resolve(__dirname + '/database_setup.sql');
    var query = require('fs').readFileSync(file_path, 'utf8').toString();
    // see: http://stackoverflow.com/a/13823560/1148249
    client.query(query, function(err, result) {
      done();       // call `done()` to release the client back to the pool
      client.end(); // close connection to database
      return callback(err, result);
    });
  });
}

test('Create "users" table in test databse', function (t) {
  create_tables(function (err, data) {
    // console.log(err);
    // console.log(data);
    t.equal(data.command, 'CREATE', 'Database Tables Created.');
    t.end();
  })
});
