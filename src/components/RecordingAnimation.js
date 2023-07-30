import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const RecordingAnimation = () => {
  return (
    <View style={{
        alignItems:'center',
        flex:1,
      }}>
       <LottieView style={{
          width:200,
       }} source={require('../../assets/animation_lkp3pa8w.json')} autoPlay loop/>
      </View>
  )
}

export default RecordingAnimation