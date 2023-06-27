const mysql = require('mysql');
const config = require('../config.json');

describe('MySQL connection test', () => {
  let connection;

  beforeAll((done) => {
    connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });

    connection.connect((error) => {
      if (error) {
        console.error('Error connecting to MySQL server: ' + error.stack);
        done.fail(error);
      } else {
        console.log('Connected to MySQL server as id ' + connection.threadId);
        done();
      }
    });
  });

  afterAll(() => {
    connection.end();
  });

  test('MySQL server should be connected', () => {
    expect(connection.state).toBe('authenticated');
  });
});