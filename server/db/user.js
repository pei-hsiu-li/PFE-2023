const mysql = require('mysql');
const bcrypt = require('bcrypt');

const pool = require('./pool.js');

function getAllUsers(callback) {
  const query = 'SELECT * FROM user';
  pool.query(query, (error, results) => {
    if (error) {
      return callback(error, null);
    }
    return callback(null, results);
  });
}

function getUserById(id, callback) {
  const query = 'SELECT * FROM user WHERE userid = ?';
  pool.query(query, [id], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    if (results.length === 0) {
      return callback(new Error('User not found'), null);
    }
    return callback(null, results[0]);
  });
}

module.exports = {
  getAllUsers,
  getUserById
};
  
module.exports.createUser = function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      return callback(error, null);
    }
    const query = 'INSERT INTO user (username, password, email, phone) VALUES (?, ?, ?, ?)';
    pool.query(query, [username, hash, email, phone], (error, results) => {
      if (error) {
        return res.send({status: 400, message: error});
      }
      return res.send({status: 200, message: results.insertId});
    });
  }); 
}

module.exports.authenticateUser = function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const query = 'SELECT * FROM user WHERE username = ?';
  pool.query(query, [username], (error, results) => {
    if (error) {
      return res.send({status: 400, message: error});
    }
    if (results.length === 0) {
      return res.send({status: 400, message: 'User not found'});
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        return res.send({status: 400, message: error});
      }
      if (!result) {
        return res.send({status: 400, message: 'Invalid password'});
      }
      return res.send({status: 200, message: user});
    });
  });  
}

module.exports.updateUser = function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;
  const userid = req.body.userid;

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {
      return res.send({status: 400, message: error});
    }
    const query = 'UPDATE user SET username = ?, password = ?, email = ?, phone = ? WHERE userid = ?';
    pool.query(query, [username, hash, email, phone, userid], (error, results) => {
      if (error) {
        return res.send({status: 400, message: error});
      }
      return res.send({status: 200, message: 'User Password has been changed'});
    });
  });
}

module.exports.deleteUser = function(req, res) {
  const userid = req.body.userid;

  const query = 'Delete FROM user WHERE userid = ?';
  pool.query(query, [userid], (error, results) => {
    if (error) {
      return res.send({status: 400, message: error});
    }
    return res.send({status: 200, message: 'User has been deleted'});
  });

}
