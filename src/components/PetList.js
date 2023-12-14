import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PetList = ({navigation, dt, id}) => {

  const {image,Petname, Weight, Gender, Age, DeviceName, GoalWeight, Created_at} = dt


  return (
    <View style={{
        borderRadius:2,
        padding:10,
        margin:5,
        elevation:1,
        width:170,
    }}>
        <View style={{
            overflow:'hidden',
            height:150,
            borderRadius:5,
        }}>
        <Image
        style={{
          width:'100%',
          height:150,
          opacity:0.9,
          objectFit:'contain'
        }}
        source={{uri:image}}
        contentFit="cover"
        transition={1000}
      />
        </View>
      
      <Text style={{
        opacity:0.8,
        textAlign:'center',
        marginVertical:10,
        fontWeight:'bold',
        fontSize:17,
      }}>
        {Petname}
      </Text>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        gap:10,
      }}>
      <View>
        <Text style={{
            opacity:0.6
        }}>
            Weight: <Text style={{
                fontWeight:'bold',
            }}>{parseFloat(Weight).toFixed(2)}</Text>
        </Text>
        <Text
         style={{
            opacity:0.7,
            fontSize:12,
            opacity:0.6
        }}>
            Gender: <Text style={{
                fontWeight:'bold',
            }}>{Gender}</Text>
        </Text>
        <Text
         style={{
            fontSize:12,
            opacity:0.6
        }}>
            Age: <Text
            style={{
                fontWeight:'bold',
            }}
            >{Age}</Text>
        </Text>
      </View>
      <TouchableOpacity style={{
        width:42,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-end',
        opacity:0.7,
      }} onPress={()=>navigation.navigate('DetailsPage',{
        image,
        Weight,
        Gender,
        Age:Age,
        Petname,
        DeviceName,
        GoalWeight,
        date:Created_at,
        id:id
      })}>
      <MaterialCommunityIcons name="view-list" size={42} color="#908EDF" />
      </TouchableOpacity>
   
      </View>
    
    </View>
  )
}

export default PetList