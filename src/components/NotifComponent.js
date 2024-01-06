import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment/moment';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import app from '../firebase';
import { deleteDoc, getFirestore, doc } from 'firebase/firestore';

const db = getFirestore(app);
const NotifComponent = ({ 
    name,
    weight,
    message,
    image,
    createdAt,
    id,
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
            justifyContent:'space-between',
            alignItems:'center'
        }}>
          <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:5,
            width:170,
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
      <TouchableOpacity style={{
       marginLeft:10,
       opacity:0.6
      }} onPress={async()=>{
        await deleteDoc(doc(db, "notifications",id)).then(()=>{
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Success!',
            textBody: "Notification is remove successfully!",
            button: 'close',
          })
        });
      }}>
      <Entypo name="trash" size={17} color="red" />
      </TouchableOpacity>
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