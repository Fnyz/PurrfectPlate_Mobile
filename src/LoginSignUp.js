import { View, Text, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Keyboard, ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';
import app from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, getAuth, signOut} from 'firebase/auth';
import { setDoc , doc, getFirestore} from 'firebase/firestore';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import * as Application from 'expo-application'
import * as Device from 'expo-device';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import Modalism from './components/ModalVerification';

const auth = getAuth(app);
const db = getFirestore(app);






const LoginSignUp = ({route, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(route.params.change);
  const [secureEntry, setSecureEntry] = useState(true);
  const [image, setImage] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);





  getPhoneId = async () => {
      
    if (Platform.OS === 'android') {
    const AndriodId =  Device.deviceName.split(' ').join('').toLowerCase().trim() + Application.androidId.trim();
    setDeviceId(AndriodId);
    } else if (Platform.OS === 'ios') {
      const iosId = await Application.getIosIdForVendorAsync()
      iosId.then(id => {
        const iosId = Device.deviceName.split(' ').join('').toLowerCase().trim() + id.trim();
        setDeviceId(iosId)
      })
    }
    
  }


  handlecloseModalism = () => {
    signOut(auth).
    then(()=> {
      setVisible1(false);
      email('')
      password('')
    });
    
  }
  handleVerifyModalism =() => {
    const user = auth.currentUser;
    sendEmailVerification(user)
   .then(() => {
    setVisible1(false);
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success',
      textBody: 'Successfully send email verification, please check your email immediately!',
      button: 'close',
      onPressButton: ()=> {
        setEmail('');
        setPassword('');
        Dialog.hide();
      }
    })
   }).catch((err) => {
    console.log('error');
   })
  
  }


  useEffect(()=>{
    getPhoneId();
  },[deviceId])


  const handleSubmit = () => {

    Keyboard.dismiss();

    

    if(!email || !password){
      setVisible(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Oppps.',
        textBody: 'Please input all required fields.',
        button: 'close',
      })
      return;
    }


    setVisible(true);

  
      if(isSignUp){
     
        if(!firstName || !lastName){
          setVisible(false);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Oppps',
            textBody: 'Please input all required fields',
            button: 'close',
          })
          return;
        }

        createUserWithEmailAndPassword(auth,
          email,
          password
        ).then((users) => {

          const user = auth.currentUser;
            sendEmailVerification(user)
           .then(() => {
           const ref = doc(db, 'users', users.user.uid)
           setDoc(ref,{
              firstname: firstName,
              lastname: lastName,
              username: username,
              email:email,
              userId: users.user.uid,
              image: image,
              deviceId: deviceId,
              registered: false,
              created_at: Date.now(),
           }).catch((error) => {
          console.log('network error', error);
          });

          setFirstname('')
          setLastname('')
          setEmail('')
          setUsername('')
          setPassword('')
          setDeviceId('')
          setVisible(false)

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'SUCCESS!',
            textBody: 'Account created successfully, please check your email to verify immediately.',
            button: 'close',
            onPressButton:()=> {
              Dialog.hide();
              setTimeout(() => {
                setIsSignUp(false)
              }, 2000);   
            }

          })

        })

          
    
      }).catch((error) => {

        let errorMessage = null;
    
          switch(error.code) {
            case "auth/missing-password":
              errorMessage = "Password is missing, please try again!";
            break;
            case "auth/invalid-email":
              errorMessage = "Email is in valid format, please try again!";
            break;
            case "auth/weak-password":
              errorMessage = "Password must be at least 6 characters long.";
            break;
            case 'auth/email-already-in-use':
              errorMessage = "User email already exists.";
            break;
            default:
          }

          if(errorMessage){
            setVisible(false)
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Oppps.',
              textBody: errorMessage,
              button: 'close',
            })
          }
    
     
          
      })

      return;

      }




 
    

        signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {



 
    
      const user = userCredential.user;

           
      if(!user.emailVerified){
      
        setVisible(false)
        setVisible1(true)
        return;
      }

      
 

      const profile = {
        email: user.email,
        id: user.uid,
        deviceId: deviceId,
       
      }
      setVisible(false);
      setEmail('')
      setPassword('');
      navigation.replace('ConnectDevice', profile);
      
      return;
 
 
  })
  .catch((error) => {

    let errorMessage = null;


    switch(error.code) {
      case "auth/missing-password":
        errorMessage = "Password is missing, please try again!";
      break;
      case "auth/invalid-email":
        errorMessage = "Email is in valid format, please try again!";
      break;
      case "auth/weak-password":
        errorMessage = "Password must be at least 6 characters long.";
      break;
      case "auth/wrong-password":
        errorMessage = "Password is incorrect!";
      break;
      case 'auth/user-not-found':
        errorMessage = "Email is not registered!";
      break;
      case 'auth/invalid-login-credentials':
        errorMessage = "Account is not registered yet.";
      break;
      case 'auth/too-many-requests':
        errorMessage = "Access to this account is temporarily disabled due to many failed login attemps. You can immediately restore it by resetting your password or you can try again later.";
      break;
      default:
       
    }

    if(errorMessage){
      setVisible(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Oppps.',
        textBody: errorMessage,
        button: 'close',
      })

    }


  });
  

     

    
  }



  const handleChangeOpenPassword = () => {
    setSecureEntry(prev => !prev);
  }


  return (
    <AlertNotificationRoot theme='dark'>
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

    <SafeAreaView style={{
      flex:1,
    }}>
      <ImageBackground 
      source={require('../assets/Image/FirstPage.png')} 
      style={{
        height:'100%',
        justifyContent:'center',
        paddingHorizontal:15,
      }}
      >

    
      <View>
        {!isSignUp ? (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            marginBottom:15,
          }}
          >
            <Text
            style={{
              fontSize:30,
              opacity:0.7,
            }}
            >Hello there,</Text>
            <Text
            style={{
              fontSize:35,
              opacity:0.7,
            }}
            >Welcome User.</Text>
          </View>
        ): (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            gap:2,
            marginBottom:10,
          }}
          >
          <Text style={{
            fontSize:35,
            opacity:0.7,
          }}
          >Register</Text>
          <Text
           style={{
             fontSize:12,
             opacity:0.7,
            }}
            >Fill out this form</Text>
          </View>
        )}
      {isSignUp && (
        <View style={{
          gap:5,
          marginBottom:5,
        }}>
           <TextInput
      label="Firstname"
      mode='outlined'
      activeOutlineColor='coral'
      value={firstName}
      onChangeText={(val)=> setFirstname(val)}
      />
     <TextInput
      label="Lastname"
      mode='outlined'
      activeOutlineColor='coral'
      value={lastName}
      onChangeText={(val)=> setLastname(val)}
      />
    <TextInput
      label="Username"
      mode='outlined'
      activeOutlineColor='coral'
      value={username}
      onChangeText={(val)=> setUsername(val)}
      />

        </View>
      )}
      <View style={{
        gap:5,
      }}>
      <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='coral'
      value={email}
      onChangeText={(val)=> setEmail(val)}
      />
     <TextInput
      label="Password"
      mode='outlined'
      activeOutlineColor='coral'
      secureTextEntry={secureEntry}
      right={<TextInput.Icon icon={!secureEntry? 'eye':'eye-off'} onPress={handleChangeOpenPassword} />}
      style={{
        marginBottom:10,
      }}
      value={password}
      onChangeText={(val)=> setPassword(val)}
      
      />
      <TouchableOpacity style={{
        height:50,
        backgroundColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
      }} onPress={()=> handleSubmit()}>
        <Text
        style={{
          color:'white',
          fontSize:25,
        }} 
        >{isSignUp? 'SIGNUP' : 'LOGIN'}</Text>
      </TouchableOpacity>
      {!isSignUp && (
        <TouchableOpacity onPress={()=> navigation.navigate('ForgetPassword')}>
          <Text style={{
            alignSelf:'flex-end',
            fontWeight:'bold',
            opacity:0.7,
            color:'#2A5EAB',
            marginRight:5,
          }}>Forget Password</Text>
        </TouchableOpacity>
      )}
      <View>
        {!isSignUp? (
          <View style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:15,
          }}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={()=> setIsSignUp(true)}>
            <Text
            style={{
              color:'red',
              fontWeight:'bold',
              opacity:0.6
            }}
            >Register here.</Text>
          </TouchableOpacity>
          </View>
        ): (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:20,
          }}
          >
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={()=> setIsSignUp(false)}>
            <Text
             style={{
               color:'red',
               fontWeight:'bold',
               opacity:0.6
              }}
              >Login here.</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>
      </View>
      </View>
      <Modal isVisible={visible} animationIn='slideInLeft'>
        <View style={{ height:70,
        borderColor:'red',
        marginHorizontal:20,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.9)',
        gap:5,
        position:'relative'
        }}>
          <View style={{
              position:'absolute',
              zIndex:1,
              right:10,
              top:-50,

            }}>
             <Image source={require('../assets/petss.png')} style={{
              width:75,
              height:140,
             }} />
            </View>
          <ActivityIndicator animating={true} color='coral' size={25} style={{
              opacity:0.8,
              position:'relative',
              left:-10,
            }}/>

          <Text style={{
              fontSize:25,
              opacity:0.9,
              position:'relative',
              left:-5,
              color:'white',
              fontWeight:'bold',
            }}>{!isSignUp ? 'Loggin in ..' : 'Registering ..'}</Text>
        </View>
      </Modal>
      <Modalism visible={visible1} handlecloseModalism={handlecloseModalism} handleVerifyModalism={handleVerifyModalism} email={email}/>
      </ImageBackground>
    </SafeAreaView>
        </TouchableWithoutFeedback>
        </AlertNotificationRoot>
  )
}

export default LoginSignUp