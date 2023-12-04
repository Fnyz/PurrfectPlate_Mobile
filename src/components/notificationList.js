import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
const NotificationList = ({dt, navigation, createdAt}) => {
    
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
      
      <View>
        <Text style={{
            color:'white',
            textTransform:'uppercase',
            fontSize:25,
            fontWeight:'bold',
            opacity:0.8
        }}>{dt.Messages.split(" ")[1]}</Text>
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
            color:'white'
        }}>
            <Text style={{
                fontWeight:'bold',
                color:'white',
               
            }}>" </Text>{dt.Messages} <Text
            style={{
                color:'white',
            }}
            >. "</Text>
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
    }}>*{moment(dt.createdAt.toDate()).calendar()} </Text>
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