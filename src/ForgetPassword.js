import { View, Text, TouchableOpacity, ImageBackground, Linking,} from 'react-native'
import React from 'react'
import { sendPasswordResetEmail , getAuth} from 'firebase/auth'
import app from './firebase'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';
import { AlertNotificationRoot ,ALERT_TYPE, Dialog} from 'react-native-alert-notification';
const auth = getAuth(app);
import { useState } from 'react'
import {Image} from 'expo-image'
import Modal from 'react-native-modal'
import { MaterialIcons } from '@expo/vector-icons';


const ForgetPassword = ({navigation}) => {

  const [visible, setvisible] = useState(false);
  const [email, setEmailAdd] = useState('');


  const openGoogleAccount = () => {
    const url = `mailto:${email}` || `https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(email)}` ;
    Linking.openURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
          setvisible(false);
        } else {
          console.log(`Cannot open URL: ${url}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };
  
    
    const handleChangePassword = () => {

      if(!email){
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Please input your email.',
          button: 'close',
        })
        return;
      }

     
        sendPasswordResetEmail(auth, email.trim())
  .then(() => {
    setvisible(true);
    setEmailAdd('')
  })
  .catch((error) => {
    switch(error.code) {
      case "auth/invalid-email":
        errorMessage = "These email is not valid, please try again.";
      break;
      case "auth/user-not-found":
        errorMessage = "User not found, please try again.";
      break;
      default:
    }

    if(errorMessage){
      setEmailAdd('');
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Oppps.',
        textBody: errorMessage,
        button: 'close',
      })
    }

  });
    };



  return (

    <AlertNotificationRoot theme='dark'>

 
    <SafeAreaView>
        <ImageBackground source={require('../assets/Image/FirstPage.png')} 
      style={{
        height:'100%',
      }}>

      
      <View
      style={{
        marginHorizontal:10,
      }}
      >
      <Text
      style={{
        fontWeight:'bold',
        fontSize:25,
        marginBottom:5,
        marginTop:20,
      }}
      >Forget Password</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >Enter your registered email address below</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >& we'll send an email with instructions to</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >reset your password.</Text>
      </View>
      <View style={{
        marginHorizontal:10,
        marginTop:5,
      }}>
      <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='coral'
      value={email}
      onChangeText={(val) => setEmailAdd(val)}
    />
    <TouchableOpacity style={{
        height:50,
        backgroundColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:10,
      }}
      onPress={handleChangePassword}
      >
        <Text
        style={{
          color:'white',
          fontSize:20,
        }} 
        >Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        height:50,
        borderColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:10,
        borderWidth:1,
      }} onPress={()=> navigation.navigate('LoginSignUp',{
        change:false,
      })}>
        <Text
        style={{
          color:'#FAB1A0',
          fontSize:20,
        }} 
        >Go back to Login</Text>
      </TouchableOpacity>
      </View>
      
      <Modal isVisible={visible} animationIn='bounceIn' animationOut='bounceOut'>
        <View style={{
            height:220,
            backgroundColor:'rgba(0,0,0,0.8)',
            borderRadius:10,
            justifyContent:'center',
            alignItems:'center',
            position:'relative'
        }}>
            <View style={{
              position:'absolute',
              zIndex:1,
              right:10,
              top:-25,
            }}>
              <Image source={require('../assets/petss.png')} />
            </View>
             <View style={{
              paddingHorizontal:20,
              marginBottom:20,
              justifyContent:'center',
              alignItems:'center'
             }}>
             <View style={{
              flexDirection:'row',
              gap:5,
              justifyContent:'center',
          
             }}> 
             <MaterialIcons name="email" size={20} color="white" />
              <Text style={{
              color:'white',
              fontSize:20,
              fontWeight:'bold',
              marginBottom:5,
             }}>Check your email</Text>

             </View>
            
             <Text style={{
                color:'white',
                opacity:0.7,
                marginTop:5,
             }}>We have sent a password recover instructions to your email.</Text>
             </View>
          
             <TouchableOpacity style={{
                backgroundColor:'coral',
                width:307,
                marginBottom:10,
                borderRadius:10,
                justifyContent:'center',
                alignItems:'center',
                padding:15,
                
             }} onPress={openGoogleAccount}>
                <Text style={{
                    color:'white',
                    fontWeight:'bold',
                    fontSize:15,
                }}>Open email app</Text>
             </TouchableOpacity>

             <TouchableOpacity style={{
              marginTop:10,
              opacity:0.7,
             }} onPress={()=> {
              setvisible(false);
              setEmailAdd('');
             }}>
              <Text style={{
                color:'white'
              }}>Skip, I'll comfirm later.</Text>
             </TouchableOpacity>
           
            
        </View>
      </Modal>
      </ImageBackground>
    </SafeAreaView>
         
    </AlertNotificationRoot>
  )
}

export default ForgetPassword