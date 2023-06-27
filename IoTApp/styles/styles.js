import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    //Home
    homeView: {
        flex: 1
    },
    itemContainer: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    itemStatus: {
        alignItems: 'stretch',
        flexDirection: 'column'
    },
    imageBoard: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    textContainer: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
    },
    homeFooter: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        bottom: 10,
    },
    profileButton: {
        left: 10,
    },
    bluetoothButton: {
        right: 10,
    },
    bluetoothImg: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    profileImg: {
        width: 50, 
        height: 50, 
        marginTop: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
    },
    //Login
    inputInline: {
        flex: 1,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'black',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'black',
    },
    logo: {
        height: '40%',
        width: '100%'
    },
    btnLogin: {
        borderRadius: 30,
        backgroundColor: '#31B75D',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,

    },
    btnSignup: {
        borderRadius: 30,
        backgroundColor: '#615D5D',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    btnForgot: {
        borderRadius: 30,
        backgroundColor: '#9C9300',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    //SignUp
    buttonSignUp: {
        backgroundColor: '#184D94',
        width: '100%',
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    //Control
    controlContainer: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginTop: 16,
        marginRight: 16,
        color: 'black',
    },
    buttonDelete: {
        bottom: 10,
        backgroundColor: '#E32D2D',
        width: '100%',
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    date: {
        fontSize: 20,
        marginTop: 8,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    colorSlider: {
        marginTop: 20,
        height: 30,
        width: '65%'
    },
    inputColor: {
        height: 40,
        width: '15%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        marginRight: 10,
        padding: 8,
        color: 'black',
    },
    imgRotate: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    touchableOpacityStyle: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        top: 5,
        right: 10,
    },
    buttonPhy: {
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
        width: '50%',
        backgroundColor: 'black',
    },
    buttonConfirm: {
        width: '30%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: 'blue',
    },
    buttonCancel: {
        width: '30%',
        borderRadius: 20,
        padding: 10,
        backgroundColor: 'gray',
    },
    //Profile
    imgProfile: {
        alignSelf: 'center',
        width: 50,
        height: 50,
        marginTop: 20
    },
    buttonDeleteAccount: {
        backgroundColor: '#E32D2D',
        width: '100%',
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    buttonResetPassword: {
        backgroundColor: 'gray',
        width: '100%',
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
    modalViewDelUser: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    //ScanBLE
    bleNameID: {
        fontWeight: "bold",
        color: "black",
        margin: 10,
    },
    modalViewBLE: {
        width: '70%',
        height: '60%',
        margin: '15%',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewWIFI: {
        width: '80%',
        height: 250,
        margin: '50%',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    //ResetPassword
    description: {
        fontSize: 13,
        color: '#414757',
        paddingTop: 8,
    },
    error: {
        fontSize: 13,
        color: '#f13a59',
        paddingTop: 8,
    },

    btnSendReset: {
        backgroundColor: '#184D94',
        width: '100%',
        borderRadius: 30,
        padding: 10,
        elevation: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        borderRadius: 30,
    },
});

export default styles;