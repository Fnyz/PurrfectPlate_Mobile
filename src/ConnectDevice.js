import { View, Text, ImageBackground, TouchableOpacity, Keyboard,ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { getAuth, signOut } from "firebase/auth";
import app from './firebase';
import {collection, getFirestore, getDocs } from 'firebase/firestore';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';







const auth = getAuth(app);
const db = getFirestore(app)

const ConnectDevice = ({navigation, route : {params}}) => {


  const [deviceName, setDeviceName] = useState('');
  const [password, setPassword] = useState('');
  const [click, setClick] = useState(false);



   handleSubmitAuth = async () => {


    Keyboard.dismiss();
    setClick(true);

   

    const credentials = {
      DeviceName: deviceName.trim(),
      password: password,
      email:params.email,
      userId:params.id,
    }

    try {

      if(!deviceName || !password){
        setClick(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Please input all fields!',
          button: 'close',
        })
  
       return;
      }

      if(password.length < 4) {
        setPassword('');
        setClick(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Password must be at least 6 characters long!',
          button: 'close',
        })
        return;
      }

      const querySnapshot = await getDocs(collection(db, "Device_Authorization"));
     querySnapshot.forEach((doc) => {
  
     

      const {email, DeviceName, password: pass } = doc.data();

      if(password !== pass) {
        setClick(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Password is incorrect, please try again.',
          button: 'close',
        })
        setPassword('');
        return;
      }


      if(email.toLowerCase().trim() !== credentials.email.toLowerCase().trim() || DeviceName.toLowerCase().trim() !==  deviceName.toLowerCase().trim()) {
        setClick(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Device not registered!',
          button: 'close',
        })

      }



      if(email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && DeviceName.toLowerCase().trim() ===  deviceName.toLowerCase().trim()) {
        setClick(false);
        const storeData = async () => {
          try {
            await AsyncStorage.setItem('Credentials', JSON.stringify(credentials));
            navigation.replace('Homepage',
        {
          screen: 'Dashboard',
          params: { credentials },
        }
        );
          } catch (e) {
            // saving error
          }
        };
        storeData();
        
      }

      
});




      
    } catch (error) {
      
    }
    

    



   
   }



  

    const [secureEntry, setSecureEntry] = useState(true);



    const handleChangeOpenPassword = () => {
      setSecureEntry(prev => !prev);
    }
  


  return (
    <AlertNotificationRoot theme='dark'>

    <SafeAreaView>
      <ImageBackground 
       source={require('../assets/Image/FirstPage.png')} 
       style={{
         height:'100%',
         paddingHorizontal:15,
        }}
        >
        <TouchableOpacity onPress={()=> {
          signOut(auth).then(() => {
            navigation.replace('LoginSignUp',{
              change:false
            } )
          }).catch((error) => {
            console.log('there was an error');
          });
        }}>
      <Ionicons name="md-log-out" size={27} color="black" style={{
        alignSelf:'flex-end',
        marginTop:15,
        opacity:0.8
      }} />
        </TouchableOpacity>
      
        <View style={{
          marginTop:10,
        }}>
            <Text style={{
              fontWeight:'bold',
              fontSize:25,
            }}>Connect Via Device</Text>
            <Text style={{
              opacity:0.5,
              marginBottom:5,
            }}>Please input fields to connect</Text>
        <View style={{
            marginTop:10,
            gap:5,
            
          }}>

      <TextInput
      label="Device name"
      mode='outlined'
      activeOutlineColor='coral'
      value={deviceName}
      onChangeText={(val) =>  setDeviceName(val)}
      style={{
        opacity:0.8
      }}
      />
     <TextInput
      label="Password"
      mode='outlined'
      activeOutlineColor='coral'
      secureTextEntry={secureEntry}
      value={password}
      onChangeText={(val) =>  setPassword(val)}
      right={<TextInput.Icon icon={!secureEntry? 'eye':'eye-off'} onPress={handleChangeOpenPassword} />}
      style={{
        marginBottom:10,
        opacity:0.8
      }}
      
      />
    <TouchableOpacity style={{
      height:50,
        backgroundColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        flexDirection:'row',
        gap:10,
      }} onPress={handleSubmitAuth}>
        {click &&   <ActivityIndicator animating={true} color='white' size={24} style={{
              opacity:0.8,
              position:'relative',
              left:0,
          }}/>}
        <Text
        style={{
          color:'white',
          fontSize:15,
          fontWeight:'bold'
        }} 
        >{click ? 'PLEASE WAIT...': 'CONNECT'}</Text>
      </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
        </AlertNotificationRoot>
  )
}

export default ConnectDevice