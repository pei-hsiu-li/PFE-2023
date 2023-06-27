const pool = require('./pool.js');

// Get a connection from the pool
function getConnection(callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    callback(null, conn);
  });
}

// Get all models from the database
function getModels(callback) {
  getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    const query = "SELECT * FROM models";
    conn.query(query, function (err, rows) {
      conn.release();
      if (err) {
        return callback(err);
      }
      callback(null, rows);
    });
  });
}

// Get a model by ID from the database
function getModelById(modelId, callback) {
  const sql = 'SELECT * FROM model WHERE modelid = ?';
  pool.query(sql, [modelId], (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
}

// Update a model in the database
function updateModel(modelId, modelNo, type, callback) {
  getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    const query = "UPDATE models SET modelno = ?, type = ? WHERE modelid = ?";
    const params = [modelNo, type, modelId];
    conn.query(query, params, function (err, result) {
      conn.release();
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}

// Delete a model from the database
function deleteModel(modelId, callback) {
  getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    const query = "DELETE FROM models WHERE modelid = ?";
    const params = [modelId];
    conn.query(query, params, function (err, result) {
      conn.release();
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  });
}

// Export the functions
module.exports = {
  getModels,
  getModelById,
  updateModel,
  deleteModel,
};

module.exports.addModel = function(req, callback) {
  const modelId = req.modelId;
  const modelNumber = req.modelNumber;
  const type = req.type;

  getModelById(modelId, (error, results) => {
    if (!results) {
      const query = "INSERT INTO model (modelid, modelno, type) VALUES (?, ?, ?)";
      const params = [modelId, modelNumber, type];
      pool.query(query, params, (error, results) => {
        if (error) {
          return callback({status: 400, message: error});
        }
        return callback({status: 200, modelId: modelId});
      });
    } else {
      return callback({status: 200, message: results.modelid});
    }
  });
}

