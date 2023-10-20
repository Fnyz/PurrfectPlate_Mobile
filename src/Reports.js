import { View, Text, ImageBackground , ActivityIndicator, Keyboard} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { collection,getFirestore, doc, updateDoc, addDoc, getDocs} from "firebase/firestore"; 
import app from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
const db = getFirestore(app);

const Reports = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({})

  const getUserData = async () => {
    const jsonValue = await AsyncStorage.getItem('Credentials');
    const credential = JSON.parse(jsonValue);
    setDeviceName(credential.DeviceName);
    setData(credential)
  }

  useEffect(()=> {
    getUserData();
  },[])

  handleGoHome = () => {
    navigation.navigate('Homepage',
        {
          screen: 'Dashboard',
          params: { credentials: data },
        }
    )
  }

  const handleSubmitReports = async  () => {

    Keyboard.dismiss();

    setVisible(true)

    
    const initialMessages = [
      { message, timestamp: new Date() }
    ];

    const reports = {
      DeviceName: deviceName,
      Email:email,
      Username: username,
      Message:initialMessages,
      createdAt: new Date(),
   }
   
   const querySnapshot = await getDocs(collection(db, "Reports"));
      querySnapshot.forEach((docs) => {
      if(docs.data().DeviceName === deviceName) {
       
        const currentMessage  = docs.data().Message || [];
        const updatedMessages = [...currentMessage, ...initialMessages];
        const docRef = doc(db, 'Reports', docs.id);
        updateDoc(docRef, {
          Message:updatedMessages,
       }).then(()=>{
         setEmail('');
         setMessage('');
         setUsername('');
         Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'Reports is send successfully!',
          button: 'close',
        })
        setVisible(false)

       });
     
        return;
      }

      addDoc(collection(db, "Reports"),reports)
      .then((docs)=> {
        if(docs.id){
       
          setEmail('');
          setMessage('');
          setUsername('');
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'SUCCESS',
            textBody: 'Reports is send successfully!',
            button: 'close',
          })
          setVisible(false);
        }
      });

      return;
    
  })


 


  }


  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }
  
  return (

    <AlertNotificationRoot theme='dark'>

    <SafeAreaView>
      <ImageBackground source = {require('../assets/Image/FirstPage.png')}
      style={{
        width:'100%',
        height:'100%',
        position:'relative',
      }}><View
      style={{
        padding:15,
        
      }}
      >

        <View style={{
          flexDirection: 'row',
          justifyContent:'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginBottom:5
        }}>
        <View>
        <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
          
        }}><Text style={{
          color:'coral',
          fontSize:35,
        }}>| </Text>Reports</Text> 
        <Text style={{
          marginLeft: 15,
          opacity:0.5
        }}>Fill out this form</Text>
        </View>
        <View style={{
          padding:5,
          borderRadius:50,
          elevation:3,
          backgroundColor:'white'
        }}>
        <TouchableOpacity onPress={handleOpenDrawer}>
          {isDrawerOpen ? (
            <Ionicons name="close" size={24} color="black" />
          ): (
            <Entypo name="menu" size={24} color="black" />

          )}
        </TouchableOpacity>
        </View>

        </View>


        <View style={{
          gap:5,
          marginTop:10,
        }}>
        <TextInput
      label="Email address"
      mode='outlined'
      activeOutlineColor='coral'
      value={email}
      onChangeText={(val) => {
        setEmail(val);
      }}
    />
        <TextInput
      label="Username"
      mode='outlined'
      activeOutlineColor='coral'
      value={username}
      onChangeText={(val) => {
        setUsername(val);
      }}
    />
        <TextInput
      label="Message"
      mode='outlined'
      activeOutlineColor='coral'
      multiline
      value={message}
      onChangeText={(val) => {
        setMessage(val);
      }}
    />
        </View>
        
        <TouchableOpacity style={{
     
        marginTop:15,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#FAB1A0',
        opacity: 0.8,
        }} onPress={handleSubmitReports}>
          <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color:'white',
          }}>SEND</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          borderWidth:1,
          borderColor:'#FAB1A0',
     marginTop:15,
     height:50,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 10,

     opacity: 0.8,
     }} onPress={handleGoHome}>
       <Text style={{
       fontSize: 20,
       fontWeight: 'bold',
       color:'#FAB1A0',
       }}>BACK</Text>
     </TouchableOpacity>

   

      </View>
      <View 
      style={{
        position:'absolute',
        bottom:20,
        right:15,
      }}
      >
      <TouchableOpacity style={{
      width:70,
      height:70,
      justifyContent: 'center',
      alignItems: 'center',
       borderRadius: 50,
      backgroundColor: '#FAB1A0',
     }}>
     <AntDesign name="message1" size={27} color="white" />
     </TouchableOpacity>

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
            }}>Sending...</Text>
        </View>
      </Modal>

      <Modal isVisible={true} animationIn='slideInLeft'>
       <View style={{
        flex:1,
        backgroundColor:'white',
        padding:10,
       }}>
        <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:5,
          }}>
          <Text style={{
            fontSize:22,
            fontWeight:'bold',
            opacity:0.7
          }}><Text style={{
            color:'coral',
            fontSize:25,
            fontWeight:'bold'
          }}>|</Text> Message</Text>
          <TouchableOpacity onPress={()=> setVisible(false)}>
          <AntDesign name="close" size={24} color="red" />    
          </TouchableOpacity>
          </View>

          <View style={{
            flex:1,
            elevation:2,
            marginBottom:10,
            padding:10,
          }}>
            <View style={{
              flexDirection:'row',
              alignSelf:'flex-start',
              alignItems:'center',
              gap:10,
            }}>
              <Avatar.Image size={40} source={require('../assets/petss.png')} />
              <View>
                <Text style={{
                  fontSize:13,
                  opacity:0.6,
                }}>Admin / 10:23 pm : 10/20/30</Text>
                <Text style={{
                  fontWeight:'bold',
                  fontSize:17,
                }}>What can i do for you?</Text>
              </View>
            </View>
          </View>
          <View style={{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            gap:5,
          }}>
          <TextInput
      label="Input Message"
      mode='outlined'
      placeholder='Message here the admin'
      activeOutlineColor='coral'
      value={email}
      onChangeText={(val) => {
        setEmail(val);
      }}
      multiline
      style={{
        flex:1,
      }}
    />

          <TouchableOpacity style={{
            backgroundColor:'#FAB1A0',
            padding:15,
            flexDirection:'row',
            justifyContent:'center',
            alignItems: 'center',
            gap:10,
            marginTop:6,
            borderRadius:5,
          }}>
          <FontAwesome name="send" size={20} color="white" />
          <Text style={{
            fontWeight:'bold',
            color:'white',
          }}>SEND</Text>
          </TouchableOpacity>
          </View>
         
          
       </View>
      </Modal>

      </ImageBackground>
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default Reports