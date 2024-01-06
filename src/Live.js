import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator ,Button, Linking, Platform } from 'react-native'
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
import { getFirestore, collection, addDoc, query, where, onSnapshot, getDocs,updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useTimer } from './GlobalContext';


const db = getFirestore(app);


const Live = ({navigation}) => {
  const [endlive, setEndLive] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [recording, setRecording] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const [load, setloading] = React.useState(false);
  const [youTubeId, setYoutubeId] = React.useState('');
  const [prompt, setPrompt] = React.useState(false);
  const [deviceName, setDeviceName] = React.useState('');
  const [message, setMessage] = React.useState('Hello, do you want to watch the live video?');
  const [credential, setCredential] = React.useState({});
  const [userData, setUserData] = React.useState({});
  const [apiKey1, setApiKey] = React.useState('');
  const [channel, setChannel] = React.useState('');
  const [liveiD, setLiveId] = React.useState("");
  const [liveStreamList, setLiveStreamList] = useState([]);
  const [visible1, setVisible1] = useState(false);
  const [load1, setloading1] = React.useState(false);
  const [qouta, setqoutaWarning] = useState(false);
  const [message2, setMessage2] = React.useState('Something went wrong, please click the bottom to request again to see the live video.');
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { showTimer, setShowTimer,  remainingTime} = useTimer()


  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes} mins ${seconds < 10 ? '0' : ''}${seconds} secs`;
  };

 

  useEffect(()=>{
    const trackthis = async () => {
      const storedStartTime = await AsyncStorage.getItem('startTime');

      if (storedStartTime !== null) {
        
        if (remainingTime <= 0) {
          fetchLiveStreams(apiKey1, channel, liveiD)
        }
      }
    }
    trackthis();
   
  },[])


  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }

  const handleRefetch = async () => {
    setloading1(true);
  
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey1}&channelId=${channel}&eventType=live&type=video&part=snippet,id`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        const docRef = doc(db, 'Livestream', liveiD);
        updateDoc(docRef, {
          isliveNow: false,
          ended: true,
        }).then(() => {
          setMessage2("Video quota exceeded! Please contact the administrator!");
          setloading(false);
          setqoutaWarning(true);
          setVisible1(true);
        });
        return;
      }
  
      const data = await response.json();
  
      console.log('API Response:', data); // Log the entire API response
      const liveVideo = data.items && data.items[0]; // Check if items array exists
      if (!data.items.length) {
        setVisible(false);
        setloading1(false);
        setVisible1(true);
        setloading1(false);
        return;
      }
  
      if (liveVideo) {
        const videoId = liveVideo.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const docRef = doc(db, 'Livestream', liveiD);
        updateDoc(docRef, {
          Youtube_Url: url,
        }).then(() => {
          setYoutubeId(videoId);
          setVisible(false);
          setVisible1(false);
          setloading(false);
          setloading1(false);
          console.log("Updated Database");
        });
        // // You can use the video IDs for further processing
      } else {
        // Handle the case when liveVideo is falsy
      }
    } catch (error) {
      console.log('Error fetching live stream data:', error);
      setloading1(false);
    }
  };
  
  
 





  const fetchLiveStreams = async (apiKey, channelId, id) => {
   
    setVisible(false);
  
    // Step 1: Get live broadcasts associated with the channel
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&eventType=live&type=video&part=snippet,id`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        const docRef = doc(db, 'Livestream', id);
        updateDoc(docRef, {
          isliveNow: false,
          ended: true,
        }).then(() => {
          setMessage2("Video quota exceeded! Please contact the administrator!");
          setloading(false);
          setqoutaWarning(true);
          setVisible1(true);
        });
        return;
      }
  
      const data = await response.json();
  
      console.log('API Response:', data); // Log the entire API response
  
      if (!data.items.length) {
        setShowTimer(false);
        setVisible(false);
        setVisible1(true);
        setloading1(false);
        return;
      }
  
      const liveVideo = data.items[0]; // Check if items array exists
      if (liveVideo) {
        setShowTimer(false);
        const videoId = liveVideo.id.videoId;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const docRef = doc(db, 'Livestream', id);
        updateDoc(docRef, {
          Youtube_Url: url,
        }).then(() => {
          setYoutubeId(videoId);
          setVisible(false);
          setloading(false);
          setVisible1(false);
          console.log("Updated Database");
        });
  
        // You can use the video IDs for further processing
      }
    } catch (error) {
      console.log('Error fetching live stream data:', error);
      setVisible1(true);
      setVisible(false);
    }
  };
  


  useEffect(()=> {
          const q = query(collection(db, "Livestream"));
          onSnapshot(q, (snapshot) => {
            const data = [];
          snapshot.docChanges().forEach((change) => {
  
            data.push({data: change.doc.data(), id: change.doc.id})
        });
        setLiveStreamList(data);
      });
},[])


  
  useEffect(()=> {
    const q = query(collection(db, "Livestream"), where("DeviceName", "==", deviceName));
    onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach(async(change) => {
    setLiveId(change.doc.id)
    if (change.type == "modified" && change.doc.data().isliveNow) {
        setMessage('Please wait for a minute, proccessing youtube url.');
          const startTime = Date.now();
          await AsyncStorage.setItem('startTime', startTime.toString());
          const storeData = async (value) => {
            try {
              setTimeout(() => {
                setShowTimer(true);
                setApiKey(change.doc.data().ApiKey)
                setChannel(change.doc.data().ChannelID)
                setLiveId(change.doc.id)
                setVisible(false);
              }, 5000);
            } catch (e) {
              // saving error
            }
          };
          storeData();
          
          
          
     
       
    }
   
  });

});


  },[])


  const handleShowCredData =  async () => {
    const user = await AsyncStorage.getItem("Credentials")
    if(user){
        const datas = JSON.parse(user);
        setCredential(datas);
    }
}



  const continueWatching = () => {
    const res = liveStreamList.find(e => e.data.DeviceName.trim() === credential.DeviceName.trim())
    const youId = extractYouTubeVideoId(res.data.Youtube_Url);
    if(youId){
      setYoutubeId(youId);
      setVisible(false);
    }
    
    
    
  }


  const handleVideoEnd = (event) => {
    if(event === 'ended'){
      const docRef = doc(db, 'Livestream', liveiD);
      updateDoc(docRef, {
        Youtube_Url:'',
        isliveNow:false,
        ended:true,
     }).then(()=>{
       console.log("Updated Database");
       setYoutubeId("");
       setMessage("Live video ended, do you want to watch live again?");
       setVisible(true);
       setloading(false);
     });
   
    }


  };

  useEffect(()=>{
    if(!showTimer){
      setVisible(true);
    }
    

    handleShowCredData();
   },[])
  

  startVideoLive = async () => {

    setloading(true)

    if(!youTubeId){
     
      const res = liveStreamList.find(e => e.data.DeviceName.trim() === credential.DeviceName.trim())
      if(!res){
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Warning',
          textBody: 'Please contact administrator to set up your live video, thank you!',
          button: 'close',
        })
      return;
      }

      const docRef = doc(db, 'Livestream', res.id);
      updateDoc(docRef, {
        ended:false,
     }).then(async()=>{
      //  console.log("Updated Database");
      //  await addDoc(collection(db, "Task"),{
      //    type:'Livestream',
      //    deviceName:deviceName.trim(),
      //    document_id: docRef.id,
      //    request:'Start',
      //  });
      //  console.log('Sending request to live video!');
      //  setloading(true);
      })


    return;
   
    }

    setVisible(false);

    
 
    
  }




  



  useEffect(()=> {

   

  const getData = async () => {

    try {
   
      const jsonValue = await AsyncStorage.getItem('Credentials');
      const credential = JSON.parse(jsonValue);
   
      setDeviceName(credential.DeviceName);
      setUserData(credential)


      const q = collection(db, "Livestream");
      onSnapshot(q, (snapshot) => {
     snapshot.docChanges().forEach((change) => {
      const {DeviceName,Youtube_Url, isliveNow, ApiKey, ChannelID, ended} = change.doc.data()

      
      if(DeviceName == credential.DeviceName.trim() && isliveNow == true && !Youtube_Url && !ended){
        setloading(true);
        setVisible(false);
        setMessage('Please wait for a minute, proccessing youtube url.');
        if(remainingTime !== 0){
          setShowTimer(true);
        }
        
        setApiKey(ApiKey)
        setChannel(ChannelID)
        setLiveId(change.doc.id)
        
        return;
      }

      if(DeviceName == credential.DeviceName.trim()  && !Youtube_Url && !isliveNow && !ended){
        setloading(true);
        setMessage('Please wait a minute to see the live?');
        return;
      }

 
 
      if(DeviceName == credential.DeviceName.trim() && isliveNow == true && Youtube_Url){
        setMessage('Do you want to continue watching the live?');
        setPrompt(true);
        setShowTimer(false);
        return;
      }
  
     });
  
   });


    } catch (e) {
      // error reading value
    }
  };

  
    getData();
   

 
  },[visible])






  



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
          marginBottom:100,
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


       <View style={{
        gap:10
       }}>
       <TouchableOpacity style={{
          width:'90%',
          alignSelf:'center',
          height:50,
          elevation:3,
          backgroundColor:'white',
          borderRadius:10,
          justifyContent:'center',
          alignItems:'center',
          marginTop:recording ? 230 :0,
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
        <TouchableOpacity style={{
          width:'90%',
          alignSelf:'center',
          height:50,
          elevation:3,
          backgroundColor:'#FAB1A0',
          borderRadius:10,
          justifyContent:'center',
          alignItems:'center',
          flexDirection:'row',
          gap:8
        }} onPress={()=> setEndLive(true)}>
        <FontAwesome name="square" size={15} color="white" />
          <Text style={{
            color:'white',
            fontWeight:'bold',
            fontSize:15,
            marginLeft:recording ?5:0,
          }}>Stop live stream</Text>
        </TouchableOpacity>
       </View>
       
      </View>

         

   

        </View>


        <Modal isVisible={visible} animationIn='slideInLeft' >
          <View style={{
            width:'100%',
            backgroundColor:'white',
            height: '35%',
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
              marginHorizontal:70,
              width:170,
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
           
              {prompt  ? 
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
              }} onPress={()=>{
               
                setShowTimer(false);
                if(!load){
                  navigation.replace('Homepage',
                  {
                   screen: 'Dashboard',
                   params: {credentials: userData },
                 }
                 );
                 return;
                }
                setCancel(true);
                setloading(false);
                addDoc(collection(db, "Task"),{
                  type:'Livestream',  
                  deviceName:credential.DeviceName.trim(),
                  document_id: liveiD,
                  request:'Stop',
                }).then(()=>{
                  const docRef = doc(db, 'Livestream', liveiD);
                  updateDoc(docRef, {
                    isliveNow: false,
                    ended:true,
          
                  }).then(async() => {
                    console.log("here")
                 
                    await AsyncStorage.removeItem('startTime');
                    setCancel(false);
                    setVisible(false);
                    setVisible1(false);
                    navigation.replace('Homepage',
                    {
                     screen: 'Dashboard',
                     params: {credentials: userData },
                   }
                   );
                  });
                });
                
            
               
              }} disabled={cancel}>

{load && (
<View>
{cancel ? (
  <View style={{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  }}>
<ActivityIndicator animating={true} color='#FAB1A0' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/> 
    <Text style={{
      color:'#FAB1A0',
      fontWeight:'bold',
      fontSize:15,
    }}>Wait</Text>
  </View>
):(
<Text style={{
  color:'#FAB1A0',
  fontWeight:'bold',
  fontSize:15,
}}>CANCEL</Text>

)}

</View>
  
)}

{!load && (
  <Text style={{
    color:'#FAB1A0',
    fontWeight:'bold',
    fontSize:15,
  }}>GO HOME</Text>
)}
            
               
              </TouchableOpacity>
              
              
            
             
            </View>
          </View>
        
      </Modal>

      <Modal isVisible={visible1} animationIn='slideInLeft'>
          <View style={{
            width:'100%',
            backgroundColor:'white', 
            height:qouta ? '38%': '43%',
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
              marginHorizontal:70 ,
              width:220
            }}>{message2}</Text>
            <View style={{
              width:'100%',
              padding:10,
              justifyContent:'center',
              alignItems:'center',
              flexDirection:'column',
              gap:10,
              marginTop:10,
            }}>
           {!qouta && (
            <TouchableOpacity style={{
              width:'99%',
              height:40,
              justifyContent:'center',
              alignItems:'center',
              borderTopLeftRadius:10,
              borderTopRightRadius:10,
              backgroundColor:'#FAB1A0'
            }} disabled={load1? true: false} onPress={handleRefetch}>
              {load1 ?
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
          }}>REQUEST</Text>
          }
            
            </TouchableOpacity>

           )}
            

              <View style={{
                flexDirection:'row',
                justifyContent: 'center',
                alignItems:'center',
                gap:10,
                paddingHorizontal:6,
                marginLeft:2,
              }}>
              {!qouta && (
              <TouchableOpacity style={{
                
                width: !qouta? '40%': '50%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                borderBottomLeftRadius:10,
                backgroundColor:'white',
                borderWidth:1,
                borderColor:'#FAB1A0',
              }} onPress={async()=>{
                await AsyncStorage.removeItem('startTime');
                setShowTimer(false);
                setCancel(true);
                setloading1(false);
                addDoc(collection(db, "Task"),{
                  type:'Livestream',  
                  deviceName:credential.DeviceName.trim(),
                  document_id: liveiD,
                  request:'Stop',
                }).then(()=>{
                  const docRef = doc(db, 'Livestream', liveiD);
                  updateDoc(docRef, {
                    isliveNow: false,
                    ended:true,
          
                  }).then(async() => {
                  
                    setCancel(false);
                    setVisible(false);
                    setVisible1(false);
                    navigation.replace('Homepage',
                    {
                     screen: 'Dashboard',
                     params: {credentials: userData },
                   }
                   );
                  });
                });

               
              }} disabled={cancel}>
               
                 
               {cancel ? (
  <View style={{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  }}>
<ActivityIndicator animating={true} color='#FAB1A0' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/> 
    <Text style={{
      color:'#FAB1A0',
      fontWeight:'bold',  
      fontSize:15,
      fontStyle:'italic'
    }}>Wait</Text>
  </View>
):(
<Text style={{
  color:'#FAB1A0',
  fontWeight:'bold',
  fontSize:15,
  fontStyle:'italic'
}}>CANCEL</Text>

)}
            
              </TouchableOpacity>

              )}


              <TouchableOpacity style={{
                
                width: !qouta? '60%': '100%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'white',
                borderWidth:1,
                borderBottomRightRadius:qouta ? 0:10,
                borderColor:'#FAB1A0',
              }} onPress={()=>{
                setShowTimer(false);
                addDoc(collection(db, "Task"),{
                  type:'Livestream',  
                  deviceName:credential.DeviceName.trim(),
                  document_id: liveiD,
                  request:'Stop',
                }).then(()=>{
                  const docRef = doc(db, 'Livestream', liveiD);
                  updateDoc(docRef, {
                    isliveNow: false,
                    ended:true,
          
                  }).then(async() => {
                    await AsyncStorage.removeItem('startTime');
                    setCancel(false);
                    setVisible(false);
                    setVisible1(false);
                    navigation.replace('Homepage',
                    {
                     screen: 'Dashboard',
                     params: {credentials: userData },
                   }
                   );
                  });
                });
              }}>
               
                 
 
<Text style={{
  color:'#FAB1A0',
  fontWeight:'bold',
  fontSize:15,
}}>GO HOME</Text>


            
              </TouchableOpacity>
              </View>
              
              
            
             
            </View>
          </View>
        
      </Modal>

      <Modal isVisible={endlive} animationIn='slideInLeft' >
          <View style={{
            width:'100%',
            backgroundColor:'white',
            height: '35%',
            alignItems:'center',
            borderRadius:10,
          }}>
              <Image
        style={{
          width:150,
          height:150,
          opacity:0.9,
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      />
            <Text style={{
              fontSize:15,
              fontWeight:'700',
              textAlign:'center',
              marginHorizontal:70,
              width:170,
            }}>Are you sure you want to end the Livestream?</Text>
                 
            <View style={{
              width:'100%',
              padding:10,
              justifyContent:'center',
              alignItems:'center',
              flexDirection:'row',
              gap:10,
              marginTop:10,
            }}>
           
             
              <TouchableOpacity style={{
                
                width:'30%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                borderTopLeftRadius:10,
                borderBottomLeftRadius:10,
                backgroundColor:'#FAB1A0'
              }} onPress={async()=>{
                console.log("just press");
                await AsyncStorage.removeItem('startTime');
                addDoc(collection(db, "Task"),{
                  type:'Livestream',  
                  deviceName:credential.DeviceName.trim(),
                  document_id: liveiD,
                  request:'Stop',
                }).then(()=>{
                  const docRef = doc(db, 'Livestream', liveiD);
                  updateDoc(docRef, {
                    isliveNow: false,
                    ended:true,
          
                  }).then(() => {
                    navigation.replace('Homepage',
                    {
                     screen: 'Dashboard',
                     params: {credentials: userData },
                   }
                   );
                  });
                });
              }}>
            
          <Text style={{
            color:'white',
            fontWeight:'bold',
            fontSize:18,
          }}>YES</Text>
        
            
            </TouchableOpacity>
            
            
         


              
              
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
              }} onPress={()=>{
               setEndLive(false);
              }}>


    <Text style={{
      color:'#FAB1A0',
      fontWeight:'bold',
      fontSize:15,
    }}>CANCEL</Text>
  
            
               
              </TouchableOpacity>
              
              
            
             
            </View>
          </View>
        
      </Modal>

      <Modal isVisible={showTimer} animationIn='slideInLeft' >
          <View style={{
       
            backgroundColor:'white',
            height: '40%',
            justifyContent:'center',
            borderRadius:10,
            alignItems:'center',
            padding:10,
          }}>
              <Image
        style={{
          width:150,
          height:150,
          opacity:0.9,
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      /> 
          
           <Text style={{
              fontSize:15,
              fontWeight:'700',
              textAlign:'center',
            }}>Livestreaming is not ready yet; please wait until 3 minutes to see the livestream.</Text>
                 
       
           
                 <View>

     
      <Text style={{ fontSize: 15, marginTop:10, fontWeight:'bold', textAlign:'center'}}>Time Remaining: <Text style={{
        color:'red',
      }}>{formatTime(remainingTime)}.</Text></Text>

      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', gap:5, marginTop:15,}}>

      <TouchableOpacity style={{
                width: '45%',
                height:40,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'white',
                borderWidth:1,
                borderRadius:5,
                borderColor:'#FAB1A0',
              }} onPress={ async()=>{
                console.log("heyhey");
                setShowTimer(false);
                await AsyncStorage.removeItem('startTime');
                setCancel(true);
                setloading1(false);
                addDoc(collection(db, "Task"),{
                  type:'Livestream',  
                  deviceName:credential.DeviceName.trim(),
                  document_id: liveiD,
                  request:'Stop',
                }).then(()=>{
                  const docRef = doc(db, 'Livestream', liveiD);
                  updateDoc(docRef, {
                    isliveNow: false,
                    ended:true,
                  }).then(() => {
                  
                    setCancel(false);
                    setVisible(false);
                    setVisible1(false);
                    navigation.replace('Homepage',
                    {
                     screen: 'Dashboard',
                     params: {credentials: userData },
                   }
                   );
                  });
                });

              }} disabled={cancel}>
               
                 
               {cancel ? (
  <View style={{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:5
  }}>
<ActivityIndicator animating={true} color='#FAB1A0' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/> 
    <Text style={{
      color:'#FAB1A0',
      fontWeight:'bold',  
      fontSize:15,
      fontStyle:'italic'
    }}>Wait</Text>
  </View>
):(
<Text style={{
  color:'#FAB1A0',
  fontWeight:'bold',
  fontSize:15,
  fontStyle:'italic'
}}>CANCEL</Text>

)}
            
              </TouchableOpacity>
      <TouchableOpacity style={{
                height:40,
                width:'50%',
                padding:10,
                borderRadius:5,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#FAB1A0',
              }} onPress={()=>{
                navigation.replace('Homepage',
                {
                 screen: 'Dashboard',
                 params: {credentials: userData },
               });
              }}>
 
<Text style={{
  color:'white',
  fontWeight:'bold',
  fontSize:15,
}}>GO HOME</Text>


            
              </TouchableOpacity>
      </View>
           
    </View>
          </View>
        
      </Modal>

     
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Live


