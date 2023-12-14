import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
const NotificationList = ({image, name, message, weight, navigation, createdAt}) => {
    
  return (
    <>
     <View
    style={{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        paddingHorizontal:20,
        marginVertical:10,
    }}
    >
      <View style={{
     
        borderRadius:50,
        padding:2,
        backgroundColor:'white'
      }}>
      <Image
        style={{
          width:75,
          height:75,
          opacity:0.9,
          borderRadius:50,
        
        }}
        source={{uri:image}}
        contentFit="cover"
        transition={1000}
      />
      </View>
      <View>
        <Text style={{
            color:'white',
            textTransform:'uppercase',
            fontSize:25,
            fontWeight:'bold',
            opacity:0.8
        }}>{name}</Text>
        <Text style={{
            color:'white',
            opacity:0.9
        }}>Weight: {parseFloat(weight).toFixed(2)}.</Text>
      </View>
    </View>
    <View style={{
        flexDirection:'row',
        marginHorizontal:20,
        width:250,
        gap:10,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:20,
        alignSelf:'center',
        marginTop:5,
       
    }}>
    <Ionicons name="notifications" size={40} color="white"
    style={{
        elevation:2,
    }}
    />
        <Text style={{
            flexWrap:'wrap',
            fontSize:15,
        }}>
            <Text
            style={{
                color:'white',
            }}
            >{message}."</Text>
        </Text>
    </View>
    <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:15,
        marginTop:25,
        alignItems:'center'
    }}>
    <Text style={{
        color:'white',
        fontSize:12,
        marginTop:15,
        opacity:0.7
    }}>* {moment(createdAt).calendar()}</Text>
    <TouchableOpacity style={{
        flexDirection:'row',
        alignItems:'center',
        borderRadius:5,
        width:90,
        height:35,
        justifyContent:'center',
        backgroundColor:'#908EDF',
        gap:10,
        opacity:0.9,
        elevation:1,
    }} onPress={()=>navigation.navigate('DetailsPage',{
      img:image,
      weight:20,
      gender:'male',
      age:5,
      name,
      date
    })}>
  <MaterialCommunityIcons name="view-list" size={24} color="white" />
        <Text style={{
            color:'white',
            fontWeight:'bold'
        }}>VIEW</Text>
    </TouchableOpacity>

    </View>
   
   

    </>
  )
}

export default NotificationList