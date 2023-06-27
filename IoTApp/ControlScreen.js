import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, TextInput, Switch, TouchableOpacity, Pressable, Modal, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../UserContext';
import styles from './styles/styles';
import { serverPort, webSocketPort, userIpAddress } from '../globals';

const ControlScreen = ({ route }) => {
  const { device, removeDevice } = route.params;

  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [motorPower, setMotorPower] = useState(false);
  const [motorState, setMotorState] = useState({
    speed: 50,
    rotation: true,
    icon: "https://img.icons8.com/ios-filled/256/rotate-right.png"
  });
  const [colorSlider, setColorSlider] = useState({
    red: 0,
    green: 0,
    blue: 0,
  });

  useEffect(() => {
    console.log(device)
    collectRealTimeData();
  }, []);

  useEffect(() => {
    toogleMotorState();
  }, [motorPower]);

  useEffect(() => {
    sendDeviceMotorState();
  }, [motorState]);

  useEffect(() => {
    setRGBLight();
  }, [colorSlider]);

  const updateRed = (value) => {
    if (/^\d+$/.test(value)) {
      setColorSlider(prevState => ({
        ...prevState,
        red: Number(value)
      }));
    }
  };
  const updateGreen = (value) => {
    if (/^\d+$/.test(value)) {
      setColorSlider(prevState => ({
        ...prevState,
        green: Number(value)
      }));
    }
  };
  const updateBlue = (value) => {
    if (/^\d+$/.test(value)) {
      setColorSlider(prevState => ({
        ...prevState,
        blue: Number(value)
      }));
    }
  };

  const collectRealTimeData = () => {
    // Connect to the server using WebSocket
    const socket = new WebSocket(`ws://${userIpAddress}:${webSocketPort}`);
    // Listen for incoming messages from the server
    socket.onopen = () => {
      console.log('Connected to the server');
    };
    socket.onmessage = (event) => {
      if (event.data) {
        const object = JSON.parse(event.data);
        if (object.deviceId == device.deviceid) {
          setTemperature(object.temperature.toString())
        }
      }
    };
    return () => {
      socket.close();
    };
  };

  const removeDeviceFromUser = async () => {
    await fetch(`http://${userIpAddress}:${serverPort}/deleteUserDevice`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId: device.deviceid,
        userId: user.userid
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          removeDevice(device.deviceid);
          setModalVisible(false);
          navigation.goBack();
        } else {
          console.log('fail to remove device from db')
        }
      });
  };

  const setDeviceMotorSpeed = (value) => {
    setMotorState(prevState => ({
      ...prevState,
      speed: value
    }));
  };

  const setDeviceMotorRotation = (value) => {
    setMotorState(prevState => ({
      ...prevState,
      rotation: value,
      icon: value ? "https://img.icons8.com/ios-filled/256/rotate-right.png" : "https://img.icons8.com/ios-filled/256/rotate-left.png"
    }));
  };

  const sendDeviceMotorState = async () => {
    await fetch(`http://${userIpAddress}:${serverPort}/setDeviceMotorState`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speed: motorState.speed, rotation: motorState.rotation, deviceId: device.deviceid }) // true = clockwise
    })
  };

  const setRGBLight = () => {
    fetch(`http://${userIpAddress}:${serverPort}/setLight`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ red: colorSlider.red, green: colorSlider.green, blue: colorSlider.blue, deviceId: device.deviceid })
    })
  };

  const toogleMotorState = () => {
    fetch(`http://${userIpAddress}:${serverPort}/setMotorPower`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motorPower: motorPower, deviceId: device.deviceid })
    })
  };

  return (
    <View style={styles.controlContainer}>
      <ScrollView>
        <Text style={styles.title}>Device Info : </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>Id</Text>
          <TextInput
            style={styles.inputInline}
            value={device.deviceid ? device.deviceid.toString() : ''}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.inputInline}
            value={device.devicename}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>Model Id</Text>
          <TextInput
            style={styles.inputInline}
            value={device.modelid ? device.modelid.toString() : ''}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.label}>Created at</Text>
          <TextInput
            style={styles.inputInline}
            value={device.createddate}
          />
        </View>

        <Text style={styles.title}>Actions : </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Motor</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.touchableOpacityStyle}
            onPress={() => setDeviceMotorRotation(!motorState.rotation)}>
            <Image source={{ uri: motorState.icon }} style={styles.imgRotate}/>
          </TouchableOpacity>
          <Slider
            style={styles.colorSlider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={motorState.speed}
            onValueChange={setDeviceMotorSpeed}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Red</Text>
          <TextInput
            style={styles.inputColor}
            value={colorSlider.red.toString()}
            onChangeText={value => updateRed(value)}
          />
          <Slider
            style={styles.colorSlider}
            thumbStyle={{ backgroundColor: "red" }}
            minimumTrackTintColor="red"
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={colorSlider.red}
            onValueChange={value => updateRed(value)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Green</Text>
          <TextInput
            style={styles.inputColor}
            value={colorSlider.green.toString()}
            onChangeText={value => updateGreen(value)}
          />
          <Slider
            style={styles.colorSlider}
            thumbStyle={{ backgroundColor: "green" }}
            minimumTrackTintColor="green"
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={colorSlider.green}
            onValueChange={value => updateGreen(value)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Blue</Text>
          <TextInput
            style={styles.inputColor}
            value={colorSlider.blue.toString()}
            onChangeText={value => updateBlue(value)}
          />
          <Slider
            style={styles.colorSlider}
            thumbStyle={{ backgroundColor: "blue" }}
            minimumTrackTintColor="blue"
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={colorSlider.blue}
            onValueChange={value => updateBlue(value)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={{ backgroundColor: "rgb(" + colorSlider.red + ',' + colorSlider.green + ',' + colorSlider.blue + ')', width: '70%' }}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Thermostat</Text>
          <TextInput
            style={styles.inputColor}
            editable={false}
            value={temperature}
          />
        </View>
        
          <Pressable
            style={styles.buttonPhy}
            onPress={() => { setMotorPower(!motorPower) }}>
            <Text style={styles.buttonText}>{motorPower ? 'Turn off' : 'Turn on'}</Text>
          </Pressable>
       
        <TouchableOpacity
          style={styles.buttonDelete}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Disconnect this device</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalView}>
            <Text style={styles.label}>Confirm to disconnect</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable style={styles.buttonConfirm} onPress={() => removeDeviceFromUser()}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
              <Pressable
                style={styles.buttonCancel}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView >
    </View>
  );
};
export default ControlScreen;