import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListPet = ({navigation, dt, id, setVisible}) => {

  const {image,Petname, Weight, Gender, Age, DeviceName, GoalWeight} = dt

  return (
    <View style={{
        borderRadius:2,
        padding:10,
        margin:5,
        elevation:1,
        width:176,
        width:330,
        flexDirection:'row',
        gap:10,
    }}>
     
      <Image
        style={{
          width:100,
          height:'100%',
          opacity:0.9,
          objectFit:'contain'
        }}
        source={{uri:image}}
        contentFit="cover"
        transition={1000}
      />
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:200,
      }}>
      <View>
        <Text style={{
            color:'red',
            fontWeight:'bold',
            fontSize:20,
        }}>{Petname}</Text>
        <Text>Weight: {Weight}</Text>
        <Text>Age: {Age}</Text>
        <Text>Gender: {Gender}</Text>
      </View>
      <View style={{
        gap:10,
        justifyContent:'center',
        alignItems:'center',
      }}>
      <TouchableOpacity style={{
        backgroundColor:'#908EDF',
        width:52,
        justifyContent:'space-between',
        alignItems:'center',
        opacity:0.7,
      }} onPress={()=>
        {
            navigation.navigate('DetailsPage',{
            image,
            Weight,
            Gender,
            Age:Age,
            Petname,
            DeviceName,
            GoalWeight,
            date:'Today at 5 hours ago.',
            id:id
          })
          setVisible(false);
            
        }
      }>
      <MaterialCommunityIcons name="view-list" size={45} color="white" />
      </TouchableOpacity>
      <Text style={{
        fontSize:12,
        color:'red',
        fontWeight:'bold',
        opacity:0.5
      }} >06/19/2020</Text>
      </View>
      </View>
    
    
    
    </View>
  )
}

export default ListPet