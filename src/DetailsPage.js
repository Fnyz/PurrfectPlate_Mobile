import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';
import { TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DetailsPage = ({route, navigation}) => {
  const {img, weight, gender, age, name, date} = route.params;

  

  const [w, setW] = useState(null);
  const [g, setG] = useState(null);
  const [a, setA] = useState(null);
  const [n, setN] = useState(null);

  useEffect(()=>{
   setW(weight);
   setG(gender),
   setA(age),
   setN(name);
  },[])
  
  
  return (
    <SafeAreaView>
       
  
        <ImageBackground source={require('../assets/Image/FirstPage.png')}>
        <View style={{
            height:'100%',
            width:'100%',
            padding:20,
        }} >
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:10,
            marginTop:30,
        }}>
        <View style={{
            borderWidth:2,
            borderColor:'#FAB1A0',
            borderRadius:100,
            padding:2,
        }}>
        <Image
        style={{
          width:150,
          height:150,
          opacity:0.9,
          borderRadius:100,
        }}
        source={{uri:img}}
        contentFit="cover"
        transition={1000}
      />
        </View>
        <View>
        <Text style={{
            fontSize:20,
            opacity:0.5,
        }}>Hi Im,</Text>
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          gap:5,
        }}>
        <Text style={{
            fontSize:35,
            fontWeight:'bold',
            opacity:0.7,
        }}>{n}</Text>
        <MaterialCommunityIcons name="hand-wave" size={27} color="coral" />
        </View>
        </View>
        </View>
        <View style={{
          gap:5,
          marginTop:20,
        }}>
        <TextInput
      label="Weight"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${w}`}
      
    />
    <TextInput
      label="Gender"
      mode='outlined'
      activeOutlineColor='coral'
      value={g}
    />
    <TextInput
      label="Goal Weight"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${15}`}
    />
    <TextInput
      label="Age"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${a}`}
    />
     <TextInput
      label="Date Added"
      mode='outlined'
      activeOutlineColor='coral'
      value={date}
    />


       <TouchableOpacity style={{
        marginTop:12,
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center',
        gap:6,
       }}>
       
       <Image
        style={{
          width:30,
          height:30,
          opacity:0.9,
          
        }}
        source={require('../assets/Image/dog-food.png')}
        contentFit="cover"
        transition={1000}
      />
        <Text style={{
          fontWeight:'bold',
          color:'red',
          opacity:0.6,
          fontSize:17,
        }}>FEED PET</Text>
       </TouchableOpacity>
        </View>
        <View style={{
          borderWidth:1,
          marginVertical:10,
          opacity:0.5,
        }}></View>
        <View style={{
          flexDirection:'row',
          alignSelf:'center',
          gap:10,
          marginTop:10,
        }}>
        <TouchableOpacity style={{
          borderWidth:1,
          width:150,
          height:45,
          borderRadius:5,
          justifyContent:'center',
          alignItems:'center',
          borderColor:'#FAB1A0',
          flexDirection:'row',
          gap:5,
        }}>
          <Entypo name="trash" size={20} color="#FAB1A0" />
          <Text style={{
            color:'#FAB1A0',
            fontWeight:'bold',
            fontSize:17,
          }}>DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width:150,
          height:45,
          borderRadius:5,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#FAB1A0',
          flexDirection:'row',
          gap:5,
        }}>
        <AntDesign name="edit" size={20} color="white" />
          <Text style={{
            color:'white',
            fontWeight:'bold',
            fontSize:17,
          }}>UPDATE</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity
        style={{
          marginTop:20,
          alignSelf:'center'
        }}
        onPress = {()=> {
          navigation.goBack();
        }}
        >
        <Text style={{
          fontWeight:'bold',
          opacity:0.6,
        }}>GO BACK TO HOME.</Text>
        </TouchableOpacity>
        </View>
        </ImageBackground> 
    
    </SafeAreaView>
  )
}

export default DetailsPage