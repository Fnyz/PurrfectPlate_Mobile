import { View, Text, ImageBackground, TouchableOpacity, Keyboard,ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { getAuth, signOut } from "firebase/auth";
import app from './firebase';
import {collection, getFirestore, query, onSnapshot, updateDoc, doc, where} from 'firebase/firestore';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import Modal from "react-native-modal";






const auth = getAuth(app);
const db = getFirestore(app)

const ConnectDevice = ({navigation, route : {params}}) => {


  const [deviceName, setDeviceName] = useState('');
  const [password, setPassword] = useState('');
  const [deviceList, setDeviceList] = useState([]);
  const [email, setEmail] = useState(params.email);
  const [show, setShow] = useState(false);
  const [listUser, setUserList] = useState([]);
  const [click, setClick] = useState(false);
  const [visible, setVisible] = useState(false);







   
  const getListUser = () => {
    const q = query(collection(db, "users"));
   onSnapshot(q, (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push({data:doc.data(), id:doc.id});
  });
  setUserList(dt);

});

  }






  
  const getListDevice = () => {
    
    const q = query(collection(db, "Device_Authorization"));
   onSnapshot(q, async (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push({data:doc.data(), id:doc.id});
  });
      setDeviceList(dt);
      const res = dt.find(d => d.data.Email === params.email);
      if(!res) {
        setShow(true); 
        return;
      };
      setDeviceName(res?.data.DeviceName);
      
   });

  }




  useEffect(()=>{
    getListDevice();
    getListUser();
  },[])










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
          textBody: 'Please input all the password!',
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
          textBody: 'Password must be at least 4 to 6 characters long!',
          button: 'close',
        })
        return;
      }


      const res = deviceList.find(d => d.data.Email === params.email && d.data.DeviceName.trim() === deviceName.trim())
 
var hashPass = CryptoJS.SHA256(password, '').toString();
   

      if(!res){
        setClick(false);
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Oppps.',
          textBody: 'Email is dont have a device',
          button: 'close',
        })
         
        return;
      }

     
      if(res.data.Password.trim() !== hashPass.trim() || res.data.Email !== params.email) {
        setClick(false);
                Dialog.show({
                  type: ALERT_TYPE.DANGER,
                  title: 'Oppps.',
                  textBody: 'Invalid Credentials, please try again!.',
                  button: 'close',
                })
                setPassword('');
                return;
        
      }


      if(res.data.Password.trim() === hashPass.trim() && res.data.Email === params.email) {
        const a = listUser.find(d => d.data.email === res.data.Email);
       
        if(!a) return;

        const devicesss = doc(db, "users", a.id);
        await updateDoc(devicesss, {
          isActive:true
        }).then(()=> {
        setClick(false);
        console.log(a.id);
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
            
          }
        };
        storeData();
        })
       
      }

      

  





      
    } catch (error) {
      
    }
    

    



   
   }

   const handleNewDevice = async () => {
    setClick(true);
    const res = deviceList.find(d => d.data.Email === '' && d.data.Token === 0);
   
const devicess = doc(db, "Device_Authorization", res.id);

await updateDoc(devicess, {
Email: email.trim(),
Token:1,
}).then(async()=>{

const q = query(collection(db, "users"), where("email", "==", email.trim()));
const querySnapshot = await getDocs(q);
querySnapshot.forEach(async (docss) => {
 
const devicesss = doc(db, "users", docss.id);
await updateDoc(devicesss, {
  hasDevice: true,
  Devicename:res.data.DeviceName,
}).then(()=> {
  setClick(false);
  setDeviceName(res.data.DeviceName);
  setVisible(false)
})

});



});
 

  }



  const handleOpenAddDevice = () => {
setVisible(true);
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
            }}>{show ? "Please click the button below to add device.": "Please input fields to connect."}</Text>
          {!show && (
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
disabled
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
          )}

          {show && (
            <TouchableOpacity style={{
              height:50,
              backgroundColor:'#FAB1A0',
              justifyContent:'center',
              alignItems:'center',
              borderRadius:5,
              flexDirection:'row',
              marginTop:10,
              gap:10,
              }} onPress={handleOpenAddDevice}>
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
              >{click ? 'PLEASE WAIT...': 'ADD DEVICE'}</Text>
              </TouchableOpacity>
             
          )}

<Modal isVisible={visible} animationIn='slideInLeft'>
        <View style={{ height:"27%",
        borderColor:'red',
        marginHorizontal:20,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:20,
        backgroundColor:'rgba(0,0,0,0.9)',
        gap:5,
        position:'relative'
        }}>
         
       

            <View style={{
              width:'100%',
              paddingHorizontal:20,
            }}>
              <View style={{
                flexDirection:'row',
                justifyContent:"space-between",
                alignItems:'center'
              }}>
              <Text style={{
                color:'white', 
                fontSize:20,
                fontWeight:"bold",
                opacity:0.8
              }}>Bind Device</Text>
              <TouchableOpacity onPress={()=> setVisible(false)}>
              <Text style={{
                color:'white', 
                fontSize:20,
                fontWeight:"bold",
                opacity:0.8
              }}>x</Text>
              </TouchableOpacity>
               
              </View>
             
              <Text style={{
                color:'white',
                fontSize:15,
                opacity:0.5

              }}>Please click sumbit to bind a device.</Text>
              <TextInput

mode='outlined'
activeOutlineColor='coral'
value={email}
disabled
style={{

marginTop:10,
}}
/>
<TouchableOpacity style={{
              height:50,
              backgroundColor:'#FAB1A0',
              justifyContent:'center',
              alignItems:'center',
              borderRadius:5,
              flexDirection:'row',
              marginTop:10,
              gap:10,
              }} onPress={handleNewDevice}>
              {click &&   <ActivityIndicator animating={true} color='white' size={24} style={{
                    position:'relative',
                    left:0,
                }}/>}
              <Text
              style={{
                color:'white',
                fontSize:15,
                fontWeight:'bold'
              }} 
              >{click ? 'PLEASE WAIT...': 'SUBMIT'}</Text>
              </TouchableOpacity>
             </View>
        </View>
      </Modal>
      
        </View>
      </ImageBackground>
    </SafeAreaView>
        </AlertNotificationRoot>
  )
}

export default ConnectDevice