import { View, Text, TouchableOpacity, ImageBackground} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';


const LoginSignUp = ({route, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(route.params.change);
  const [secureEntry, setSecureEntry] = useState(true);



  const handleChangeOpenPassword = () => {
    setSecureEntry(prev => !prev);
  }


  return (
    <SafeAreaView style={{
      flex:1,
    }}>
      <ImageBackground 
      source={require('../assets/Image/FirstPage.png')} 
      style={{
        height:'100%',
        justifyContent:'center',
        paddingHorizontal:15,
      }}
      >

    
      <View>
        {!isSignUp ? (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            marginBottom:15,
          }}
          >
            <Text
            style={{
              fontSize:30,
              opacity:0.7,
            }}
            >Hello there,</Text>
            <Text
            style={{
              fontSize:35,
              opacity:0.7,
            }}
            >Welcome User.</Text>
          </View>
        ): (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            gap:2,
            marginBottom:10,
          }}
          >
          <Text style={{
            fontSize:35,
            opacity:0.7,
          }}
          >Register</Text>
          <Text
           style={{
            fontSize:12,
            opacity:0.7,
          }}
          >Fill out this form</Text>
          </View>
        )}
      {isSignUp && (
        <View style={{
          gap:5,
          marginBottom:5,
        }}>
           <TextInput
      label="Firstname"
      mode='outlined'
      activeOutlineColor='coral'
    />
     <TextInput
      label="Lastname"
      mode='outlined'
      activeOutlineColor='coral'
    />
    <TextInput
      label="Username"
      mode='outlined'
      activeOutlineColor='coral'
    />

        </View>
      )}
      <View style={{
        gap:5,
      }}>
      <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='coral'
    />
     <TextInput
      label="Password"
      mode='outlined'
      activeOutlineColor='coral'
      secureTextEntry={secureEntry}
      right={<TextInput.Icon icon={!secureEntry? 'eye':'eye-off'} onPress={handleChangeOpenPassword} />}
      style={{
        marginBottom:10,
      }}

    />
      <TouchableOpacity style={{
        height:50,
        backgroundColor:'#FAB1A0',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
      }} onPress={()=> navigation.navigate('ConnectDevice')}>
        <Text
        style={{
          color:'white',
          fontSize:25,
        }} 
        >{isSignUp? 'SIGNUP' : 'LOGIN'}</Text>
      </TouchableOpacity>
      {!isSignUp && (
        <TouchableOpacity onPress={()=> navigation.navigate('ForgetPassword')}>
          <Text style={{
          alignSelf:'flex-end',
          fontWeight:'bold',
          opacity:0.7,
          color:'#2A5EAB',
          marginRight:5,
        }}>Forget Password</Text>
        </TouchableOpacity>
      )}
      <View>
        {!isSignUp? (
          <View style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:15,
          }}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={()=> setIsSignUp(true)}>
            <Text
            style={{
              color:'red',
              fontWeight:'bold',
              opacity:0.6
            }}
            >Register here.</Text>
          </TouchableOpacity>
          </View>
        ): (
          <View
          style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:20,
          }}
          >
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={()=> setIsSignUp(false)}>
            <Text
             style={{
              color:'red',
              fontWeight:'bold',
              opacity:0.6
            }}
            >Login here.</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>
      </View>
      </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default LoginSignUp