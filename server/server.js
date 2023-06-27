'use strict';

const userManager = require('./db/user.js');
const deviceManager = require('./db/device.js');
const modelManager = require('./db/model.js');
const userDeviceManager = require('./db/userdevice.js');
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const WebSocket = require('ws');
const { EventHubConsumerClient } = require('@azure/event-hubs');
const Message = require('azure-iot-device').Message;
const Azure = require('azure-iothub');

const Client = Azure.Client;
const Registry = Azure.Registry;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// for prod, store it somewhere else and access it instead of hardcoding it
const HubConnectionString = 'Endpoint=sb://ihsuprodyqres006dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;HostName=TriborHubPFE019.azure-devices.net;SharedAccessKey=s1gYWjisrLTJQLd5lRAGS6djT8YIA323nrjZrkJAcSA=;EntityPath=iothub-ehub-triborhubp-24566515-92631040c6';
const registry = Registry.fromConnectionString(HubConnectionString);
const client = Client.fromConnectionString(HubConnectionString);
const eventHubName = 'iothub-ehub-triborhubp-24566515-92631040c6';
const consumerClient = new EventHubConsumerClient('$Default', HubConnectionString, eventHubName);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/setDeviceMotorState', (req, res) => {
  const motorSpeed =  req.body.speed;
  const motorRotation = req.body.rotation;
  const deviceId =  req.body.deviceId;

  const requestMsg = {
   'motor': { speed: motorSpeed, rotation: motorRotation}
  };
  sendToHub(requestMsg, deviceId);
  res.json(requestMsg);
});

app.post('/setLight', (req, res) => {
  const redValue =  req.body.red;
  const greenValue = req.body.green;
  const blueValue = req.body.blue;
  const deviceId =  req.body.deviceId;

  const requestMsg = {
    'light': { red: redValue, green: greenValue, blue: blueValue}
  };
  sendToHub(requestMsg, deviceId);
  res.json(requestMsg);
});

app.post('/setMotorPower', (req, res) => {
  const motorPowerValue =  req.body.motorPower;
  const deviceId =  req.body.deviceId;

  const requestMsg = {
    'motorPower': motorPowerValue
  };
  sendToHub(requestMsg, deviceId);
  res.json(requestMsg);
});

function sendToHub(requestMsg, deviceId) {
  const message = new Message(JSON.stringify(requestMsg));
  client.send(deviceId, message, (err, res) => {
    if (err) {
      console.error(`Error sending message: ${err.toString()}`);
    } else {
      //console.log("Message Sent");
    }
  });
} 

app.post('/createDevice', async (req, res) => {
  const deviceId = req.body.id;
  const deviceName = req.body.name;
  const modelId = req.body.modelId;
  const mac = req.body.mac;
  const modelNumber = req.body.modelNumber;
  const type = req.body.type;

  registry.get(deviceId, (err, deviceInfo) => {
    if (err) { //device does not already exist, we create it
      registry.create({ deviceId: deviceId }, (err, deviceInfo) => {
        if (err) {
            console.error('Failed to create azure device: ' + err.message);
        } else {
          addModelAndDevice(deviceId, modelId, mac, deviceName, modelNumber, type, deviceInfo, (results) => {
            if (results.status == 200) {
              res.send({status: 200, message: results.message, key: results.key});
            } else {
              res.send({status: 400, message: results.message});
            }
          });
        }
      });
    } else {
      addModelAndDevice(deviceId, modelId, mac, deviceName, modelNumber, type, deviceInfo, (results) => {
        if (results.status == 200) {
          res.send({status: 200, message: results.message, key: results.key});
        } else {
          res.send({status: 400, message: results.message});
        }
      });
    }
  });
});

function addModelAndDevice(deviceId, modelId, mac, deviceName, modelNumber, type, deviceInfo, callback) {
  const modelInput = {
    modelId: modelId,
    modelNumber: modelNumber,
    type: type
  };
  const deviceInput = {
    deviceId: deviceId,
    modelId: modelId,
    mac: mac,
    deviceName: deviceName
  };

  modelManager.addModel(modelInput, function(result) {
    if (result.status === 200) {
      deviceManager.addDevice(deviceInput, function(result) {
        if (result.status === 200) {
          return callback({status: 200, message: result.message, key: deviceInfo.authentication.SymmetricKey.primaryKey});
        }else {
          return callback({status: 400, message: 'add device failed'});
        }
      });
    } else {
      return callback({status: 400, message: 'add model crashed'});
    }
  });
}

// keep track of all connected clients
const clients = new Set();

// handler for iot hub events (reveiving event data)
consumerClient.subscribe({
  processEvents: events => {
    //since we only send 1 event at a time
    const event = events[0];
    if (event) {
      const deviceId = event.systemProperties['iothub-connection-device-id'];
      const temperature = event.body;
  
      const data = {
        deviceId: deviceId,
        temperature: temperature.temperature
      }
      clients.forEach((client) => {
        client.send(JSON.stringify(data));
      });
    }
  },
  processError: error => {
    console.log(`Error receiving events: ${error}`);
  }
});

const wss = new WebSocket.Server({ port: 8080 });

// handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // add the client to the set of connected clients
  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // remove the client from the set of connected clients
    clients.delete(ws);
  });
});

app.post('/signInUser', userManager.createUser);
app.post('/loginInUser', userManager.authenticateUser);
app.post('/updateUser', userManager.updateUser);
app.post('/deleteUser', userManager.deleteUser);
app.get('/userDevices', userDeviceManager.getUserDevices);
app.post('/createUserDevice', userDeviceManager.createUserDevice);
app.delete('/deleteUserDevice', userDeviceManager.deleteUserDevice);