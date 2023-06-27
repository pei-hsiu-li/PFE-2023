import React, { useEffect, useState, useContext } from 'react';
import { Text, Pressable, TextInput, View, FlatList, PermissionsAndroid, TouchableOpacity, Modal } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import UserContext from '../UserContext';
import styles from './styles/styles';
import { userIpAddress, serverPort } from '../globals';

const ScanBleModal = ({ toggleModal, setDevices }) => {
  const [manager, setManager] = useState(new BleManager());
  const [deviceConnected, setDeviceConnected] = useState({});
  const [scannedDevices, setScannedDevices] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [wifiConfig, setWifiConfig] = useState(false);
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPW, setWifiPW] = useState('');
  const { user } = useContext(UserContext);

  // same uuids as the board
  const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

  useEffect(() => {
    requestPermissions();
    scanBluetooth();
  },[]);

  const scanBluetooth = async () => {
    const handleDeviceFound = (error, deviceFound) => {
      if (error) {
        console.log(error);
        return;
      }
      if (deviceFound.name) {
        const newDevice = {
          id: deviceFound.id,
          name: deviceFound.name
        };
        setTimeout(() => {
          setScannedDevices(prevDevices => {
            if (!prevDevices.some(device => device.id === newDevice.id)) {
              return [...prevDevices, newDevice];
            }
            return prevDevices;
          });
        }, 1000);
      }
    };
    if (manager) {
      manager.startDeviceScan([SERVICE_UUID], null, handleDeviceFound);
    }
    // Stop scanning after 5 seconds
    const timeoutId = setTimeout(() => {
      manager.stopDeviceScan();
    }, 5000);

    return () => {
      manager.stopDeviceScan();
      clearTimeout(timeoutId);
    };
  };

  const connectToWiFiButton = async (deviceSelected) => {
    manager.stopDeviceScan();
    if (!isConnected) {
      try {
        await manager.connectToDevice(deviceSelected.id)
          .then(async device => {
            setDeviceConnected(device);
            setIsConnected(true);
            setWifiConfig(true);
          });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => connectToWiFiButton(item)}>
        <Text style={styles.bleNameID}>{`${item.name} (${item.id})`}</Text>
      </TouchableOpacity>
    );
  };

  const addDevice = async (device) => {
    await fetch(`http://${userIpAddress}:${serverPort}/createDevice`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(device)
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          const dataForBoard = { "wifiSSID": wifiSSID, "wifiPW": wifiPW, "key": response.key };
          const device = response.message;

          manager.writeCharacteristicWithResponseForDevice(deviceConnected.id, SERVICE_UUID, CHARACTERISTIC_UUID, base64.encode(JSON.stringify(dataForBoard)))
          .then(() => {
            console.log('data sent successful via ble');
          })
          .catch((error) => {
          });
          addUserDevice(device);
        } else {
          console.log('fail to create device')
        }
      });
  };

  const addUserDevice = async (device) => {
    await fetch(`http://${userIpAddress}:${serverPort}/createUserDevice`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: Number(device.deviceid),
        userId: user.userid,
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          setDevices(oldArray => [...oldArray, ...[device]]);
        } else {
          console.log('fail to create user device : ', response.message)
        }
      });
  };

  const connectWiFi = () => {
    try {
      manager.connectToDevice(deviceConnected.id)
        .then(() => manager.discoverAllServicesAndCharacteristicsForDevice(deviceConnected.id))
        .then(() => {
          manager.monitorCharacteristicForDevice(deviceConnected.id, SERVICE_UUID, CHARACTERISTIC_UUID, (error, characteristic) => {
            if (characteristic?.value != null) {
              //stop monitoring
              manager.cancelTransaction('messagetransaction');

              const deviceBoard = JSON.parse(base64.decode(characteristic?.value));
              const device = {
                id: deviceBoard.id,
                name: 'Unknown',
                modelId: '32',
                mac: deviceConnected.id,
                type: 'dual',
                modelNumber: '55'
              };
              addDevice(device);
            }
          }, 'messagetransaction');
        })
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const requestPermissions = async () => {
    try {
      const bluetoothScanPermission = PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN;
      const bluetoothPermission = PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT;
      const locationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
      const granted = await PermissionsAndroid.requestMultiple([bluetoothPermission, bluetoothScanPermission, locationPermission]);
      const bluetoothScanStatus = granted[bluetoothScanPermission] || PermissionsAndroid.RESULTS.DENIED;
      const bluetoothStatus = granted[bluetoothPermission] || PermissionsAndroid.RESULTS.DENIED;
      const locationStatus = granted[locationPermission] || PermissionsAndroid.RESULTS.DENIED;
      if (bluetoothStatus === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothScanStatus === PermissionsAndroid.RESULTS.GRANTED &&
        locationStatus === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Bluetooth and location permissions granted');
      } else {
        console.log('Bluetooth and/or location permissions denied');
      }
    } catch (error) {
      console.warn(error);
      throw error;
    }
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <View style={styles.modalViewBLE} >
        <Text style={styles.title}>Devices ({scannedDevices.length})</Text>
        <FlatList
          data={Object.values(scannedDevices)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={true}
        />
        {error && <Text>Error: {error}</Text>}
        <Pressable style={[styles.buttonCancel]} onPress={toggleModal}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </View>

      <Modal animationType="slide" transparent={true} visible={wifiConfig} onRequestClose={() => { setWifiConfig(!wifiConfig); }}>
        <View style={styles.modalViewWIFI}>
          <Text style={styles.title}>Setup board</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>WiFi SSID</Text>
            <TextInput style={styles.inputInline} onChangeText={setWifiSSID} autoCapitalize="none" value={wifiSSID} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.inputInline} onChangeText={setWifiPW} autoCapitalize="none" value={wifiPW} secureTextEntry/>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable style={styles.buttonConfirm} onPress={() => {
              connectWiFi();
              setTimeout(() => {
                setWifiConfig(!wifiConfig);
                toggleModal();
              }, 2000);
            }}>
              <Text style={styles.buttonText}>Connect</Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={() => { setWifiConfig(!wifiConfig); }}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
export default ScanBleModal;