import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'


const PetListSched = ({data}) => {
  return (
    <View style={{
        marginHorizontal:10,
        marginVertical:5,
        padding:10,
        borderRadius:1,
        elevation:1,
        shadowColor: "#000",
    }}>
      <Text>Day: <Text style={{
        color:'red',
        fontWeight:'bold',
      }}>{data.Days}</Text>  </Text>
      <Text>Schedule Time: </Text>
       {data.ScheduleTime.map((d, i)=> {
        return (
            <View key={i}>
                <Text style={{
                    fontWeight:'bold',
                    opacity:0.6
                }}>* {d.time} / {d.cups} Cups</Text>
            </View>
        )
       })}
       <Text style={{
        alignSelf:'flex-end',
        marginRight:5,
        fontStyle:'italic'
       }}>01/10/20</Text>
    </View>
  )
}

export default PetListSched