import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PetList = ({img,name, weight, gender, Age}) => {
  return (
    <View style={{
        borderRadius:2,
        padding:10,
        margin:5,
        elevation:1,
    }}>
        <View style={{
            overflow:'hidden',
            height:100,
            borderRadius:5,
        }}>
        <Image
        style={{
          width:150,
          height:100,
          opacity:0.9,
          objectFit:'contain'
        }}
        source={{uri:img}}
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
        {name}
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
            }}>{weight}kg</Text>
        </Text>
        <Text
         style={{
            opacity:0.7,
            fontSize:12,
            opacity:0.6
        }}>
            Gender: <Text style={{
                fontWeight:'bold',
            }}>{gender}</Text>
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
        backgroundColor:'#908EDF',
        width:60,
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomRightRadius:5,
        opacity:0.7,
      }}>
      <MaterialCommunityIcons name="view-list" size={45} color="white" />
      </TouchableOpacity>
      </View>
    
    </View>
  )
}

export default PetList