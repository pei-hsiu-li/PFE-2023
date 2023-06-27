import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Modal, Alert, ScrollView } from 'react-native';
import UserContext from '../UserContext';
import styles from './styles/styles';
import { userIpAddress, serverPort } from '../globals';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPasswordView, setResetPasswordView] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { user } = useContext(UserContext);

  const deleteUser = async () => {
    await fetch(`http://${userIpAddress}:${serverPort}/deleteUser`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: user.userid,
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          navigation.navigate("Login");
          console.log(response.message)
        } else {
          console.log(response.message)
        }
      });
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match');
      return;
    }

    await fetch(`http://${userIpAddress}:${serverPort}/updateUser`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        password: newPassword,
        userid: user.userid,
        phone: user.phone,
        email: user.email
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          setResetPasswordView(false)
          console.log(response.message)
        } else {
          console.log(response.message)
        }
      });
  };

  return (
    <View >
      <ScrollView>
        <Image source={{ uri: 'https://img.icons8.com/ios/256/test-account.png' }} style={styles.imgProfile}/>
        <Text style={styles.title}>Profile</Text>
        
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={user.username} />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={user.phone} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={user.email} keyboardType="email-address" />

        {!resetPasswordView &&
          <TouchableOpacity
            visible={!resetPasswordView}
            style={styles.buttonResetPassword}
            onPress={() => {
              setResetPasswordView(true)
            }}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        }

        {resetPasswordView &&
          <View>
            <Text style={styles.label}>New password</Text>
            <TextInput style={styles.input} onChangeText={(value) => setConfirmNewPassword(value)} />

            <Text style={styles.label}>Confirm new password</Text>
            <TextInput style={styles.input} onChangeText={(value) => setNewPassword(value)} />

            <View style={{ flexDirection: "row", placeContent: "space-between" }}>
              <TouchableOpacity style={styles.buttonConfirm} onPress={() => { resetPassword() }}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => { setResetPasswordView(false) }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        }

        <TouchableOpacity
          style={styles.buttonDeleteAccount}
          onPress={() => {
            setModalVisible(!modalVisible)
          }}>
          <Text style={styles.buttonText}>Delete account</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalViewDelUser}>
          <Text style={styles.label}>Confirm to delete your account ?</Text>
          <View style={{ flexDirection: "row" }}>
            <Pressable style={styles.buttonConfirm} onPress={() => { deleteUser(); Alert("Deleted") }}>
              <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={styles.buttonCancel} onPress={() => { setModalVisible(false) }}>
              <Text style={styles.buttonText}>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
