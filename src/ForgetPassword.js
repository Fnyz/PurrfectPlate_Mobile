import { View, Text, TouchableOpacity, ImageBackground} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';

const ForgetPassword = ({navigation}) => {
  return (
    <SafeAreaView>
        <ImageBackground source={require('../assets/Image/FirstPage.png')} 
      style={{
        height:'100%',
      }}>

      
      <View
      style={{
        marginHorizontal:10,
      }}
      >
      <Text
      style={{
        fontWeight:'bold',
        fontSize:25,
        marginBottom:5,
        marginTop:20,
      }}
      >Forget Password</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >Enter your registered email address below</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >& we'll send an email with instructions to</Text>
      <Text
      style={{
        opacity:0.7,
      }}
      >reset your password.</Text>
      </View>
      <View style={{
        marginHorizontal:10,
        marginTop:5,
      }}>
      <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='coral'
    />
    <TouchableOpacity style={{
        height:50,
        backgroundColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:10,
      }}>
        <Text
        style={{
          color:'white',
          fontSize:20,
        }} 
        >Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        height:50,
        borderColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:10,
        borderWidth:1,
      }} onPress={()=> navigation.navigate('LoginSignUp',{
        change:false,
      })}>
        <Text
        style={{
          color:'#FAB1A0',
          fontSize:20,
        }} 
        >Go back to Login</Text>
      </TouchableOpacity>
      </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ForgetPassword