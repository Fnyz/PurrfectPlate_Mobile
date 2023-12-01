import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'; 

const PurrfectPlateLoadingScreen = ({message, fontSize}) => {
  return (
    <View style={{
        justifyContent: 'center',
        alignItems:'center',
        flex:1,
 
    }}>
     <LottieView style={{
        width:300,
       
     }} source={require("../../assets/Image/dsdds.json")} autoPlay loop/>
  
      <Text style={{
        color:'coral',
        fontSize:fontSize,
        opacity:0.8,
        fontWeight:'bold',
        marginTop:10,
     }}>{message}
     </Text>
 
  
    
    </View>
  )
}

export default PurrfectPlateLoadingScreen