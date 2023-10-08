import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons';
import YoutubePlayer, {YoutubeIframeRef} from "react-native-youtube-iframe";
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import RecordingAnimation from './components/RecordingAnimation';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import app from './firebase';
import { getFirestore, collection, addDoc, query, where, onSnapshot, getDocs} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';



const db = getFirestore(app);



const Live = ({navigation}) => {

  const [recording, setRecording] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const [liveId, setLiveId] = React.useState('');
  const [load, setloading] = React.useState(false);
  const [youTubeId, setYoutubeId] = React.useState('');
  const [prompt, setPrompt] = React.useState(false);

  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }


  function generateFakeLiveId(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }


  continueWatching = () => {
    setloading(true);
    setTimeout(() => {
      setloading(false)
      setVisible(false);
    }, 3000);
    
  }
  

  startVideoLive = async () => {
    setloading(true)
    const request = {
      Request_Live_Id: liveId,
      DeviceId: 'aO4CA1LTusKgLijOJtLK',
      DeviceName:'Bornnomama',
      count:1,
      Youtube_Url:'',
      response:false,
    }

    const docRef = await addDoc(collection(db, "Request_Live_Video"),request);
    if(docRef.id) {
      console.log('Sending request to live video!');
     return;
    }
  }


  
  useEffect(()=>{
    setVisible(true);
    const fakeIdLive = generateFakeLiveId(20);
    setLiveId(fakeIdLive)
    
  },[])

  const getData = async () => {
   
    try {
      setVisible(true);
      const jsonValue = await AsyncStorage.getItem('DeviceName');
      

      const querySnapshot = await getDocs(collection(db, "Request_Live_Video"));

      querySnapshot.forEach((doc) => {

        const {DeviceName,Youtube_Url } = doc.data();

        if(DeviceName.trim() === jsonValue.trim()){
          setPrompt(true);
         const youId = extractYouTubeVideoId(Youtube_Url);
          setYoutubeId(youId);
          return;
        }
        setVisible(true);
      })
    } catch (e) {
      // error reading value
    }
  };


  useEffect(()=> {
    getData();
  },[])






  

  useEffect(()=> {

    setVisible(true);
    const q = query(collection(db, "Request_Live_Video"), where("DeviceName", "==", "Bornnomama"));
   const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    
    if (change.type === "modified") {
        setVisible(false);
        setloading(false)
        const youId = extractYouTubeVideoId(change.doc.data().Youtube_Url);
        setYoutubeId(youId);
        console.log('make change')
    }
   
   
  });

  return () => {
    unsubscribe();
  }

});


  },[])



  function extractYouTubeVideoId(url) {
    const youtubeUrlPattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;

    const match = url.match(youtubeUrlPattern);
    
   
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }


     


  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
     
      setRecording(recording);
      console.log('Recording started');
    } catch (err) { 
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }


  const playerRef = useRef();
  return (
    <SafeAreaView>
      <ImageBackground source = {require('../assets/Image/FirstPage.png')}
      style={{
        width:'100%',
        height:'100%',
      
      }}>
        <View
        style={{
          width:'100%',
          height:'100%',
          padding:15,
        }}
        > 
           <View style={{
            flexDirection:'row',
            gap:5,
            alignItems:'center',
            marginTop:10,
            marginBottom:15,
            justifyContent:'space-between',
           }}>
           <View style={{
            flexDirection:'row',
            gap:5,
            alignItems:'center',
            marginTop:10,
            marginBottom:10,
           }}>
            <MaterialIcons name="live-tv" size={24} color="red" />
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
          }}>Watch Live</Text> 
          <View style={{
            width:10,
            height:10,
            backgroundColor:'#B65F5F',
            borderRadius:50,
          }}></View>
           </View>
           <View style={{
            
            padding:5,
            borderRadius:50,
            elevation:3,
            backgroundColor:'white',
            alignItems:'center',
            justifyContent:'center',
           }}>
            <TouchableOpacity onPress={handleOpenDrawer}>
              {isDrawerOpen ? <Ionicons name="close" size={24} color="black" /> : 
           <Entypo name="menu" size={24} color="black" /> 
              }
            </TouchableOpacity>
           </View>
           </View>
           
           <YoutubePlayer
        ref={playerRef}
        width='100%'
        height={300}
        videoId={youTubeId}
      />
  
      <View style={{
        marginTop:70,
      }}>


      {recording ? (
        <RecordingAnimation />
      ): (
        <View style={{
          alignSelf:'center',
          marginBottom:120,
          height:130,
          width:130,
          justifyContent:'center',
          borderRadius:100,
          alignItems:'center',
          paddingTop:65,
        }}>

      <Image
        style={{
          width:100,
          height:100,
          marginBottom:70,
          opacity:0.9,
        }}
        source={require('../assets/Image/icons8-microphone-64.png')}
        contentFit="cover"
        transition={1000}
      />
        </View>

      )}


       
        <TouchableOpacity style={{
          width:'90%',
          alignSelf:'center',
          height:50,
          elevation:3,
          backgroundColor:'white',
          borderRadius:50,
          justifyContent:'center',
          alignItems:'center',
          marginTop:recording ? 250 :0,
          flexDirection:'row',
          gap:5
        }} onPress={recording ? stopRecording : startRecording}>
          {recording ? <FontAwesome name="square" size={15} color="#B65F5F" /> : 
          <Entypo name="controller-record" size={20} color="#B65F5F" style={{
            opacity:0.7
          }}/>
          }
          <Text style={{
            color:'#FAB1A0',
            fontWeight:'bold',
            fontSize:15,
            marginLeft:recording ?5:0,
          }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
      </View>

         

   

        </View>


        <Modal isVisible={visible} animationIn='slideInLeft'>
          <View style={{
            width:'100%',
            backgroundColor:'white',
            height:'33%',
            alignItems:'center',
            borderRadius:10,
          }}>
              <Image
        style={{
          width:150,
          height:150,
          opacity:0.9,
        }}
        source={require('../assets/KawaiDog.png')}
        contentFit="cover"
        transition={1000}
      />
            <Text style={{
              fontSize:15,
              fontWeight:'700'
            }}>Hello, Do you want to start the live video?</Text>
            <View style={{
              width:'100%',
              padding:10,
              justifyContent:'center',
              alignItems:'center',
              flexDirection:'row',
              gap:10,
              marginTop:10,
            }}>
              {prompt ? 
              <TouchableOpacity style={{
                
                width:'30%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                borderTopLeftRadius:10,
                borderBottomLeftRadius:10,
                backgroundColor:'#FAB1A0'
              }} onPress={continueWatching}>
                {load ?
                <View style={{
                  flexDirection:'row',
                  gap:5,
                  justifyContent:'center',
                  alignItems:'center',
                }}>
                  <ActivityIndicator animating={true} color='white' size={20} style={{
                opacity:0.8,
                position:'relative',
                left:0,
              }}/> 
                  <Text style={{
                    color:'white',
                    fontWeight:'bold'
                  }}>Wait...</Text>
                </View>
            : 
            <Text style={{
              color:'white',
              fontWeight:'bold',
              fontSize:18,
            }}>Continue</Text>
            }
              
              </TouchableOpacity>
            
            : 
            <TouchableOpacity style={{
                
              width:'30%',
              height:40,
              justifyContent:'center',
              alignItems:'center',
              borderTopLeftRadius:10,
              borderBottomLeftRadius:10,
              backgroundColor:'#FAB1A0'
            }} onPress={startVideoLive}>
              {load ?
              <View style={{
                flexDirection:'row',
                gap:5,
                justifyContent:'center',
                alignItems:'center',
              }}>
                <ActivityIndicator animating={true} color='white' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/> 
                <Text style={{
                  color:'white',
                  fontWeight:'bold'
                }}>Wait...</Text>
              </View>
          : 
          <Text style={{
            color:'white',
            fontWeight:'bold',
            fontSize:18,
          }}>YES</Text>
          }
            
            </TouchableOpacity>
            
            
            }
             
              <TouchableOpacity style={{
                
                width:'30%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                borderTopRightRadius:10,
                borderBottomRightRadius:10,
                backgroundColor:'white',
                borderWidth:1,
                borderColor:'#FAB1A0'
              }}>
                <Text style={{
                  color:'#FAB1A0',
                  fontWeight:'bold',
                  fontSize:15,
                }}>GO BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
        
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Live