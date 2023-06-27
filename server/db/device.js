const pool = require('./pool.js');

// Function to get all devices
function getAllDevices(callback) {
  const sql = 'SELECT * FROM device';
  pool.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
}

// Function to get a device by id
function getDeviceById(deviceId, callback) {
  const sql = 'SELECT * FROM device WHERE deviceid = ?';
  pool.query(sql, [deviceId], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
}

// Function to update a device
function updateDevice(deviceid, devicename, modelid, mac, createddate, callback) {
  const sql = 'UPDATE device SET devicename = ?, modelid = ?, mac = ?, createddate = ? WHERE deviceid = ?';
  pool.query(sql, [devicename, modelid, mac, createddate, deviceid], (error) => {
    if (error) {
      return callback(error);
    }
    callback(null);
  });
}

// Function to delete a device by id
function deleteDevice(id, callback) {
  const sql = 'DELETE FROM device WHERE deviceid = ?';
  pool.query(sql, [id], (error) => {
    if (error) {
      return callback(error);
    }
    callback(null);
  });
}

// Export the functions
module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice
};

module.exports.addDevice = function(req, callback) {
  const deviceId = req.deviceId;
  const deviceName = req.deviceName;
  const modelId = req.modelId;
  const mac = req.mac;
  const createdDate = new Date();

  getDeviceById(deviceId, (error, results) => {
    // if the device does not already exist in the database, create it
    if (!results) {
      const sql = 'INSERT INTO device (deviceid, devicename, modelid, mac, createddate) VALUES (?, ?, ?, ?, ?)';
      pool.query(sql, [deviceId, deviceName, modelId, mac, createdDate], (error, results) => {
        if (error) {
          return callback({status: 400, message: error});
        }
        const newDevice = {
          deviceid: deviceId,
          devicename: deviceName,
          modelid: modelId,
          mac: mac,
          createddate: createdDate
        }
        return callback({status: 200, message: newDevice});
      });
    } else {
      return callback({status: 200, message: results});
    }
  });
}

