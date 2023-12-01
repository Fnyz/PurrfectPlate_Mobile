import { View, Text, ImageBackground , ActivityIndicator, Keyboard, TouchableOpacity, FlatList} from 'react-native'
import React, { useCallback, useEffect, useMemo, useState , useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { collection,getFirestore, doc, updateDoc, addDoc, getDocs, serverTimestamp, query, orderBy, onSnapshot, getDoc, where} from "firebase/firestore"; 
import app from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { FontAwesome } from '@expo/vector-icons';
import { Badge } from 'react-native-paper';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import PurrfectPlateLoadingScreen from './components/PurrfectPlateLoadingScreen';
const db = getFirestore(app);

const Reports = ({navigation}) => {

  const flatListRef = useRef();

  const [email, setEmail] = useState('');
  const [loads, setloads] = useState(false)
  const [message, setMessage] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [visible, setVisible] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [data, setData] = useState({})
  const [messageSend, setSendMessage] = useState('');
  const [messageData, setDataMessage] = useState([]);
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [mess1, setMess1] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sendLoading, setSendLoading] = useState(false);




  const getUserData = async () => {
    const jsonValue = await AsyncStorage.getItem('Credentials');
    const credential = JSON.parse(jsonValue);
    setDeviceName(credential.DeviceName);
    setData(credential)

    const docRef = doc(db, "users", credential.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserImage(docSnap.data().image);
      setUserName(docSnap.data().username);
      setEmail(docSnap.data().email);
    } 

  }

  useEffect(()=> {
    setloads(true);
    setTimeout(() => {
      setloads(false)
    }, 3000);
    getUserData();
  },[])

  useEffect(()=> {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
   const data = [];
   querySnapshot.forEach((docs) => {
       data.push({dt:docs.data(), id: docs.id});
    
   });
   setDataMessage(data);
 });
   
 
  }, [])


  

  
 
 


  const handleSendMessage = useCallback (() => {
    setSendLoading(true)
    if(!messageSend){
      setSendLoading(false)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning',
        textBody: 'Please enter you message before sending!',
        button: 'close',
      })
    }
    const initialMessage = [
      {
        message: messageSend,
        username: userName,
        image: userImage,
        type: 'User',
        messagedate: new Date(),
      }
    ]


    
    const notification = {
      User:data.email,
      Messages: `${userName} is send you a message please check it to chat.`,
      image: userImage,
      createdAt: serverTimestamp(),
      type:"User",
      hasSeen:false,
    }





    const message = {
      hasDevice:true,
      Image:userImage,
      deviceName: deviceName.trim(),
      sender: data.email,
      message:initialMessage,
      createdAt: serverTimestamp(),
      hasSeen: false,
    }

 

    
    const dts = messageData.find((d) => d.dt.deviceName === deviceName && d.dt.sender === data.email);
    
    if(!dts){

      addDoc(collection(db, "Messages"),message)
      .then((docs)=> {
        setSendLoading(false)
        setSendMessage('')
        if(docs.id){
          addDoc(collection(db, "Notifications"),notification)
        }
      });

      return;
    }
       
        const currentMessage  = dts.dt.message || [];
        const updatedMessages = [...currentMessage, ...initialMessage];
        const docRef = doc(db, 'Messages', dts.id);
        updateDoc(docRef, {
          message:updatedMessages,
       }).then(()=>{
        setSendLoading(false)
        setSendMessage('')
        let pushPage = Math.ceil(mess1?.dt.message.length / itemsPerPage );
        setCurrentPage(pushPage);
         console.log('update send message success')
         addDoc(collection(db, "Notifications"),notification);
       });


       return;

    
  },[messageSend])

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
      Username: userName,
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
         setUserName('');
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
          setUserName('');
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


 const handleAutoPages =() => {
     
    if(mess1.dt.message.length -1 > 0){
      let pushPage = Math.ceil( mess1.dt.message.length  / itemsPerPage );
      setCurrentPage(pushPage);
      console.log(pushPage);
      return;
    }else{
      setCurrentPage(1);
    }
    
  }


 const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevState) => prevState - 1)
    }
  };

 const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevState) => prevState + 1)
    }
  };


const renderItems = () => {
   
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    const items = [];
    const {message} = mess1?.dt || []
    for (let i = startIndex; i < endIndex; i++) {

      items.push(

        <View style={{
          flexDirection:'row',
          alignSelf:message[i].type === "User" ? 'flex-end': 'flex-start',
          justifyContent: 'center',
          gap:10,
          marginVertical:10,
          width:220,
          paddingLeft:10,
        }}>
          <Avatar.Image size={40} source={{uri:message[i]?.image}} />
          <View>
            <Text style={{
              fontSize:13,
              opacity:0.6,
            }}>{message[i]?.username} * {moment(message[i]?.messagedate.toDate()).calendar()}
            </Text>
           
            <View style={{
              width:160, flexDirection:'row',
            }}>
            <Text style={{
              fontWeight:'bold',
              fontSize:17,
              flexWrap: 'wrap', color:'black', opacity:0.7,
              marginTop:5,
            }}>{message[i]?.message}</Text>
            </View>
  
         
          </View>
        </View>


      );
    
    }
    
   
    return items.map((item, index) => <View key={index}>{item}</View>);
  };

  



  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }


  const dataMessage = (m, email) => {
    setTotalItems(m.find(d => d?.dt.sender === email)?.dt.message.length)
    setTotalPages(Math.ceil(m.find(d => d?.dt.sender === email)?.dt.message.length / itemsPerPage))
    return setMess1(m.find(d => d?.dt.sender === email));
  }

  


useMemo(()=> dataMessage(messageData, data.email), [messageData, data.email]);


if(loads){
  return (
    <PurrfectPlateLoadingScreen message={"Please wait.."} fontSize={25} />
  )
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
      disabled
      value={email}
      onChangeText={(val) => {
        setEmail(val);
      }}
    />
        <TextInput
      label="Username"
      mode='outlined'
      disabled
      activeOutlineColor='coral'
      value={userName}
      onChangeText={(val) => {
        setUserName(val);
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
     }} onPress={()=> {
      setOpenMessage(true)
      handleAutoPages();
      const b = mess1?.dt.message.map(d =>{
        return d.unseen === false ? { ...d, unseen: true } : d
       })
   
   const dts = messageData.find((d) => d?.dt.deviceName === deviceName && d?.dt.sender === data.email);
      if(dts?.dt.adminSend === false){
              const docRef = doc(db, 'Messages', dts.id);
        updateDoc(docRef, {
        adminSend:true,
        message:b
    }).then(()=>{
      console.log('seen now!')
      
    });
 
    return;
      }
 
    
      
      }}>
      {mess1?.dt?.adminSend === false && (
 <Badge style={{
  position:'absolute',
  right:12,
  zIndex:10,
  top:15,
  fontWeight:'bold'
 }}>{ mess1?.dt.message.filter(a => a.type === "Admin" && a.unseen === false).length}</Badge>
      )}
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

      <Modal isVisible={openMessage} animationIn='slideInLeft'>
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
            <View style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
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
          <View style={{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            gap:4,
            marginLeft:10,
          }}>
          <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
          <AntDesign name="left" size={20} color="coral" style={{
            opacity: currentPage === 1? 0.5 : 0.8,
           
          }} />
          </TouchableOpacity>
         
          <Text style={{
            fontSize:20,
            fontWeight:'bold'
          }}>/</Text>
          <TouchableOpacity onPress={handleNextPage}    disabled={currentPage === totalPages}>
          <AntDesign name="right" size={20} color="coral" style={{
             opacity:currentPage === totalPages ? 0.5 : 0.8
          }} />
            </TouchableOpacity>
          </View>
          
         
          <View>
           
          </View>
            </View>
  
          <TouchableOpacity onPress={()=> {
             setOpenMessage(false)
             const dts = messageData.find((d) => d?.dt.deviceName === deviceName && d?.dt.sender === data.email);
             const docRef = doc(db, 'Messages', dts.id);
             updateDoc(docRef, {
               adminSend:true,
            }).then(()=>{
              console.log('update send message success')
            });
          }}>
          <AntDesign name="close" size={24} color="red" />    
          </TouchableOpacity>
          </View>


          <View style={{
            flex:1,
            elevation:2,
            marginBottom:10,
            padding:10,
            borderWidth:1,
          }}>

            

          <FlatList
           ref={flatListRef}
        data={renderItems()}
        renderItem={({item})=><View>{item}</View>}
       onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
       onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        keyExtractor={(item, i) => i.toString()}
      />
           
        

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
      value={messageSend}
      onChangeText={(val) => {
        setSendMessage(val);
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
          }} onPress={handleSendMessage} disabled={sendLoading}>
            {sendLoading ? (
                 <ActivityIndicator animating={true} color='white' size={20} style={{
                  opacity:0.8,
                }}/>
            ): (
              <>
                <FontAwesome name="send" size={20} color="white" />
              <Text style={{
                fontWeight:'bold',
                color:'white',
              }}>SEND</Text>
              </>
            )}
        
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