import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../UserContext';
import ScanBleModal from '../IoTApp/ScanBleModal';
import styles from './styles/styles';
import { userIpAddress, serverPort } from '../globals';

const HomeScreen = () => {
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    await fetch(`http://${userIpAddress}:${serverPort}/userDevices?userId=${user.userid}`, {
      method: 'GET',
      headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(response => {
      if (response.status === 200) {
        const devicesToAdd = response.message;
        console.log(devicesToAdd)
        setDevices(oldArray => [...oldArray, ...devicesToAdd]);
      } else {
        console.log('fail to get user devices')
      }
    });
  };

  const navigation = useNavigation();
  const [bleModalVisible, setBleModalVisible] = useState(false);
  const { user } = useContext(UserContext);

  const [devices, setDevices] = useState([]);

  const removeDevice = (deviceId) => {
    const newDevices = devices.filter(device => device.deviceid !== deviceId);
    setDevices(newDevices);
  };

  const openDeviceControl = (device) => {
    navigation.navigate("ControlDetail", { device, removeDevice });
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const renderDeviceItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => openDeviceControl(item)}>
          <Image source={{ uri: 'https://img.icons8.com/external-others-abderraouf-omara/256/external-Motherboard-technology-devices-others-abderraouf-omara.png' }} style={styles.imageBoard}/>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.devicename}</Text>
          <Text style={styles.subtitle}>{item.deviceid}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.homeView}>
      {devices.length === 0 && <Text>No device found</Text>}

      <FlatList data={devices} keyExtractor={item => item.deviceid} renderItem={renderDeviceItem} numColumns={2}/>

      <TouchableOpacity activeOpacity={0.7} onPress={() => setBleModalVisible(!bleModalVisible)} style={[styles.bluetoothButton, styles.homeFooter]} >
        <Image style={styles.bluetoothImg} source={{ uri: 'https://img.icons8.com/external-others-inmotus-design/256/external-Bluetooth-virtual-keyboard-others-inmotus-design.png' }}/>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.7} onPress={handleProfile} style={[styles.profileButton, styles.homeFooter]}>
        <Image style={ styles.profileImg } source={{ uri: 'https://img.icons8.com/ios/256/test-account.png' }}  />
      </TouchableOpacity>
      
      {bleModalVisible && <ScanBleModal toggleModal={() => setBleModalVisible(!bleModalVisible)} setDevices={setDevices} /> }
    </View>
  );
};
export default HomeScreen;