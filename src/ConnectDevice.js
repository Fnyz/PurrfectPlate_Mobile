import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Keyboard} from 'react-native'
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



   handleSubmitAuth = async () => {


    Keyboard.dismiss();

   

    const credentials = {
      DeviceName: deviceName,
      password: password,
      email:params.email,
      userId:params.id,
    }

    try {

      if(!deviceName || !password){
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
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Device not registered!',
          button: 'close',
        })

      }



      if(email.toLowerCase().trim() === credentials.email.toLowerCase().trim() && DeviceName.toLowerCase().trim() ===  deviceName.toLowerCase().trim()) {

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
  
    
const ipData = [
    {ip: '192.168.255.10'},
    {ip: '192.168.255.12'},
    {ip: '192.168.255.5'},
]



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
          marginTop:30,
        }}>
            <Text style={{
              fontWeight:'bold',
              fontSize:25,
            }}>
            Connect Via Wifi
            </Text>
            <Text style={{
              opacity:0.5
            }}>
            Please choose to connect device
            </Text>
        </View>
        <View style={{
          height:200,
          marginTop:15,
        }}>
            <ScrollView>
                {ipData.map((d,i)=> {
                  return (
                    <View key={i} style={{
                      marginTop:10,
                      flexDirection:'row',
                      justifyContent:'space-between'
                    }}>
                        <View style={{
                          flexDirection:'row',
                          justifyContent:'center',
                          alignItems:'center',
                          gap:10,
                        }}>
                        <View style={{
                          borderRadius:50,
                          width:50,
                          height:50,
                          justifyContent:'center',
                          alignItems:'center',
                          backgroundColor:'#FAB1A0'
                        }}>
                            <Text style={{
                              color:'white',
                              fontSize:20,
                            }}>IP</Text>
                        </View>
                        <Text style={{
                          fontSize:16,
                          opacity:0.7
                        }}>/ {d.ip}</Text>
                        </View>

                        <TouchableOpacity >
                        <View style={{
                          width:105,
                          flexDirection:'row',
                          justifyContent:'center',
                            alignItems:'center',
                            height:40,
                            borderRadius:10,
                            backgroundColor:'#6750A4',
                            gap:7,
                            opacity:0.9
                          }}>
                            <Ionicons name="send" size={18} color="white" />
                            <Text style={{
                              color:'white',
                              fontSize:13,
                            }}>Connect</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                   )
                })}
            </ScrollView>
        </View>
        <View style={{
          marginTop:15,
        }}>
            <Text style={{
              fontWeight:'bold',
              fontSize:25,
            }}>Connect Via Device</Text>
            <Text style={{
              opacity:0.5
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
      }} onPress={handleSubmitAuth}>
        <Text
        style={{
          color:'white',
          fontSize:15,
          fontWeight:'bold'
        }} 
        >CONNECT</Text>
      </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
        </AlertNotificationRoot>
  )
}

export default ConnectDevice