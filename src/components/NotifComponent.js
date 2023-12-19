import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment/moment';
const NotifComponent = ({ 
    name,
    weight,
    message,
    image,
    createdAt,
}) => {

  const formattedDate = moment(createdAt).calendar();

  return (
    <View style={{
        borderRadius:2,
        paddingVertical:13,
        paddingHorizontal:10,
        margin:5,
        elevation:1,
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
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:5,
        }}>
        <Text style={{
            color:'red',
            fontWeight:'bold',
            fontSize:20,
        }}>{name}</Text>
        <Text>*</Text>
       <Text style={{
        fontSize:12,
        color:'red',
        fontWeight:'bold',
        opacity:0.5
      }} >{formattedDate}</Text>
        </View>
        {weight && (
            <Text>Weight: {parseFloat(weight).toFixed(2)}</Text>
        ) }
        <Text>{message}</Text>
      </View>
      <View style={{
        gap:10,
        justifyContent:'center',
        alignItems:'flex-end',
        width:100,
      }}>

     
      </View>
      </View>
    
    
    
    </View>
  )
}

export default NotifComponent