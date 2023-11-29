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
import { getFirestore, collection, addDoc, query, where, onSnapshot, getDocs,updateDoc, doc, deleteDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';




const db = getFirestore(app);



const Live = ({navigation}) => {

  const [recording, setRecording] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const [load, setloading] = React.useState(false);
  const [youTubeId, setYoutubeId] = React.useState('');
  const [prompt, setPrompt] = React.useState(false);
  const [deviceName, setDeviceName] = React.useState('');
  const [videoEnded, setVideoEnded] = React.useState(false)
  const [message, setMessage] = React.useState('');
  const [loading2, setLoading2] = React.useState(false);

  const [userData, setUserData] = React.useState({});
  const [apiKey1, setApiKey] = React.useState('');
  const [channel, setChannel] = React.useState('');
  const [liveiD, setLiveId] = React.useState("");
  

  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }

 
  const handleRefetch =async () => {

    
    try {
      // Step 1: Get live broadcasts associated with the channel
      const liveBroadcastsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey1}&channelId=${channel}&eventType=live&type=video&part=snippet,id`
      );
  
      const liveBroadcastsData = await liveBroadcastsResponse.json();
    
      // Step 2: Extract video IDs from the live broadcasts
      const videoIds = liveBroadcastsData.items.map((item) => item.id.videoId);
      console.log(videoIds);

        if(!videoIds[0]){
          setVisible(true);
          return;
        }
       
        setVisible(false);
        const url = `https://www.youtube.com/watch?v=${videoIds[0]}`;
        setYoutubeId(videoIds[0]);

        const docRef = doc(db, 'Livestream', liveiD);
          updateDoc(docRef, {
            Youtube_Url:url,
         }).then(()=>{
           console.log("Updated Database");
         });

      // You can use the video IDs for further processing
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }

  }





  const fetchLiveStreams = async (apiKey, channelId, id) => {
    setApiKey(apiKey);
    setChannel(channelId);
    setLiveId(id);

    try {
      // Step 1: Get live broadcasts associated with the channel
      const liveBroadcastsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&eventType=live&type=video&part=snippet,id`
      );
  
      const liveBroadcastsData = await liveBroadcastsResponse.json();
    
      // Step 2: Extract video IDs from the live broadcasts
      const videoIds = liveBroadcastsData.items.map((item) => item.id.videoId);

        if(!videoIds[0]){
          setVisible(true);
          return;
        }
        setVisible(false);
        const url = `https://www.youtube.com/watch?v=${videoIds[0]}`;
        setYoutubeId(videoIds[0]);

        const docRef = doc(db, 'Livestream', id);
          updateDoc(docRef, {
            Youtube_Url:url,
         }).then(()=>{
           console.log("Updated Database");
         });
    
  
      
      
      // You can use the video IDs for further processing
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }

   


  };
  




  
  useEffect(()=> {

    
    const q = query(collection(db, "Livestream"), where("DeviceName", "==", deviceName));
    onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    
    if (change.type == "modified" && change.doc.data().isliveNow=== true) {
        setMessage('Please wait for a minute, proccessing youtube url.');
        fetchLiveStreams(change.doc.data().ApiKey,change.doc.data().ChannelID, change.doc.id);
       
    }
   
  });

});


  },[])



  exitThisComponent = async () => {

    setLoading2(true);
    if(videoEnded){
      const querySnapshot = await getDocs(collection(db, "Livestream"));
      querySnapshot.forEach((docs) => {
        const {DeviceName} = docs.data();
        if(DeviceName.trim() === deviceName.trim()){
          deleteDoc(doc(db, "Livestream", docs.id));
          setMessage('Please wait to exit.');
          setYoutubeId('');
          setTimeout(() => {
            setLoading2(false)
            setVisible(false);
            navigation.navigate('Homepage',
            {
             screen: 'Dashboard',
             params: {credentials: userData },
           }
           );
          }, 3000);
         
          return;
        }
    })

   

    }

    setVisible(false);
    navigation.replace('Homepage',
    {
     screen: 'Dashboard',
     params: {credentials: userData },
   }
   );

 

 

  
  }


 

  continueWatching = () => {

    if(videoEnded){
      setYoutubeId('');
      const q = query(collection(db, "Livestream"), where("DeviceName", "==", deviceName));
      onSnapshot(q, (snapshot) => {
     snapshot.docChanges().forEach((change) => {  
           const youId = extractYouTubeVideoId(change.doc.data().Youtube_Url);
           setYoutubeId(youId);
     });
  
   });


    }
    setloading(true);
    setTimeout(() => {
      setloading(false)
      setVisible(false);
    }, 3000);

    return;
    
  }


  const handleVideoEnd = (event) => {
    if(event === 'ended'){
      setVisible(true);
      setMessage('The live has ended do you want to watch it again? or exit.');
      setVideoEnded(true)
      setloading(false);
    }
  };
  

  startVideoLive = async () => {

    setloading(true)
    const request = {
      DeviceName:deviceName.trim(),
      isliveNow: false,
      Youtube_Url:"",
      ApiKey:"",
      ChannelID:"",
      jsonKeyFile:{}
    }

    const docRef = await addDoc(collection(db, "Livestream"),request);
    if(docRef.id) {
      await addDoc(collection(db, "Task"),{
        type:'Livestream',
        deviceName:deviceName.trim(),
        document_id: docRef.id,
        request:'Start',
      });

        playSound();      
      console.log('Sending request to live video!');
      const jsonValue = await AsyncStorage.getItem('Credentials');
      const credential = JSON.parse(jsonValue);
      setDeviceName(credential.DeviceName);
     return;
    }
  }

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require("../assets/WelcometoPurfectPlate3.wav")
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }





  


  const getData = async () => {
   
    try {
      
      setVisible(true);
      setMessage('Hello, do you want to watch the live video?');
      const jsonValue = await AsyncStorage.getItem('Credentials');
      const credential = JSON.parse(jsonValue);
   
      setDeviceName(credential.DeviceName);
      setUserData(credential)


      const q = collection(db, "Livestream");
      onSnapshot(q, (snapshot) => {
     snapshot.docChanges().forEach((change) => {
      const {DeviceName,Youtube_Url, isliveNow } = change.doc.data()

      if(!isliveNow && !Youtube_Url){
        setloading(true);
        setMessage('Please wait a minute to see the live?');
        return;
      }
 
      if(DeviceName == credential.DeviceName.trim() && isliveNow == true && Youtube_Url){
        setMessage('Do you want to continue watching the live?');
        setPrompt(true);
        setVisible(false);
       const youId = extractYouTubeVideoId(Youtube_Url);
        setYoutubeId(youId);
        return;
      }
  
     });
  
   });


    } catch (e) {
      // error reading value
    }
  };


  useEffect(()=> {
  
    getData();
    setMessage('Hello, do you want to watch the live video?')

 
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

   

    const blobToBase64 = (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
  
    const audioURI = recording.getURI();
    console.log(audioURI)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", audioURI, true);
      xhr.send(null);
    });
  
    const audioBase64 = await blobToBase64(blob);



  

  

   
        const request = {
          DeviceName:deviceName.trim(),
          RecordingFile:audioBase64,
          response: false,
        }
      
     
     

    const docRef = await addDoc(collection(db, "Speak_To_Device"),request);
    if(docRef.id) {
      await addDoc(collection(db, "Task"),{
        type:'Speak_to_pet',
        deviceName: deviceName.trim(),
        document_id: docRef.id,
        request:null,
      });
    }
 
    
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
        play={true}
        onChangeState={handleVideoEnd}
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
            height: videoEnded ? '35%' : '33%',
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
              fontWeight:'700',
              textAlign:'center',
              marginHorizontal:videoEnded ? 70 : 0,
            }}>{message}</Text>
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
            }}>{videoEnded ? 'Rewatch' : 'Continue'}</Text>
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
            }} disabled={load? true: false} onPress={startVideoLive}>
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
              }} onPress={exitThisComponent}>
                {loading2 ? <View style={{
                flexDirection:'row',
                gap:5,
                justifyContent:'center',
                alignItems:'center',
              }}>
                <ActivityIndicator animating={true} color='#FAB1A0' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/> 
                <Text style={{
                  color:'#FAB1A0',
                  fontWeight:'bold'
                }}>Wait...</Text>
              </View> : 
              
              <Text style={{
                color:'#FAB1A0',
                fontWeight:'bold',
                fontSize:15,
              }}>{videoEnded ? 'EXIT' : 'GO BACK'}</Text>
              
              }
              </TouchableOpacity>
              
              
            
             
            </View>
          </View>
        
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Live