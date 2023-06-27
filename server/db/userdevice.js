const pool = require('./pool.js');

module.exports.getUserDevices = function(req, res) {
  const userId = req.query.userId;
  const sql = 'SELECT d.* FROM device d JOIN userdevice ud ON d.deviceid = ud.deviceid WHERE ud.userid = ?';
  pool.query(sql, [userId], (error, results, fields) => {
    if (error) {
      return res.send({status: 400, message: error});
    } else {
      return res.send({status: 200, message: results});
    }
  });
}

module.exports.createUserDevice = function(req, res) {  
  const deviceId = req.body.deviceId;
  const userId = req.body.userId;

  const sql = 'INSERT INTO userdevice (userid, deviceid) VALUES (?, ?)';
  pool.query(sql, [userId, deviceId], (error, results, fields) => {
    if (error) {
      return res.send({status: 400, message: error});
    } else {
      return res.send({status: 200, message: results});
    }
  });
}

module.exports.deleteUserDevice = function(req, res) {
  const deviceId = req.body.deviceId;
  const userId = req.body.userId;

  const sql = 'DELETE FROM userdevice WHERE userid = ? AND deviceid = ?';
  const values = [userId, deviceId];
  pool.query(sql, values, (error, results, fields) => {
    if (error) {
      return res.send({status: 400, message: error});
    } else {
      return res.send({status: 200, message: results.affectedRows});
    }
  });
}