import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const PetList = ({navigation, dt, id}) => {

  const {image,Petname, Weight, Gender, Age, DeviceName, GoalWeight, Created_at, Slot, petType, StartGoalMonth, EndGoalMonth} = dt


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
        <View style={{
marginVertical:10, 
justifyContent:'center',
alignItems:'center',
flexDirection:'row',
gap:2,
opacity:0.7,
        }}>
        {petType === "dog" &&  <MaterialCommunityIcons name="dog" size={20} color="black" />}
        {petType === "cat" &&  <MaterialCommunityIcons name="cat" size={20} color="black" />}
        {petType !== "cat" || petType !== "dog" &&  <MaterialCommunityIcons name="pets" size={20} color="black" />}
       
      <Text style={{
       
        textAlign:'center',
        fontWeight:'bold',
        fontSize:17,
        textTransform:'capitalize'
      }}>
        {Petname}
      </Text>
        </View>
        
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
                textTransform:'capitalize',
                opacity:0.8,
                color:Gender === "male" ? "blue" : "red",
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
        <Text
         style={{
            fontSize:12,
            opacity:0.6
        }}>
            PetSlot: <Text
            style={{
                fontWeight:'bold',
                opacity:0.8,
                color:parseInt(Slot) === 1 ? "red" : "blue",
            }}
            >{Slot}</Text>
              
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
        StartGoalMonth,
        EndGoalMonth,
        Slot,
        id:id
      })}>
      <MaterialCommunityIcons name="view-list" size={42} color="#908EDF" />
      </TouchableOpacity>
   
      </View>
    
    </View>
  )
}

export default PetList