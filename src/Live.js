import { View, Text, ImageBackground, TouchableOpacity} from 'react-native'
import React, { useRef } from 'react'
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



const Live = ({navigation}) => {

  const [recording, setRecording] = React.useState();

  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
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
        videoId={'B_Pd4EvwpQY'}
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
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Live