import {View,Text, TouchableOpacity, ImageBackground, Dimensions} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';



const FrontPage = ({navigation}) => {

  return (
    <SafeAreaView>
     
      <ImageBackground source={require('../../assets/Image/FirstPage.png')} 
      style={{
        width:Dimensions.get('window').width,
        height: Dimensions.get('window').height
      }}
      >
        <View style={{
          justifyContent:'center',
          alignItems:'center',
          flex:1,
          position:'relative'
        }}>
        
          <Image
        style={{
          width:'100%',
          height:550,
          marginBottom:70,
          opacity:0.9,
        }}
        source={require('../../assets/Image/pet-removebg-preview.png')}
        contentFit="cover"
        transition={1000}
      />


         <View style={{
            flexDirection:'row',
            justifyContent:'center',
            gap:10,
            position:'absolute',
            top:550,
            opacity:0.9,
          }}>
          <TouchableOpacity style={{
            backgroundColor:'#FAB1A0',
            width:150,
            height:60,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:5,
          }} onPress={()=> navigation.navigate('LoginSignUp', {
            change:false,
          })}>
            <Text style={{
          color:'white',
          fontSize:25,
        }}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width:150,
            height:60,
            justifyContent:'center',
            alignItems:'center',
            borderRadius:5,
            borderColor:'#FAB1A0',
            borderWidth:1,
          }} onPress={()=> navigation.navigate('LoginSignUp', {
            change:true
          })}>
            <Text style={{
          color:'#FAB1A0',
          fontSize:25,
        }}>SIGNUP</Text>
          </TouchableOpacity>

          </View>
        </View>
          
         
     
      
      </ImageBackground>
    
    </SafeAreaView>

  )
}

export default FrontPage