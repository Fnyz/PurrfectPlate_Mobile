import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

const Reports = ({navigation}) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }
  
  return (
    <SafeAreaView>
      <ImageBackground source = {require('../assets/Image/FirstPage.png')}
      style={{
        width:'100%',
        height:'100%',
        position:'relative',
      }}><View
      style={{
        padding:15,
        
      }}
      >

        <View style={{
          flexDirection: 'row',
          justifyContent:'space-between',
          alignItems: 'center',
          marginTop: 10,
          marginBottom:5
        }}>
        <View>
        <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
          
        }}><Text style={{
          color:'coral',
          fontSize:35,
        }}>| </Text>Reports</Text> 
        <Text style={{
          marginLeft: 15,
          opacity:0.5
        }}>Fill out this form</Text>
        </View>
        <View style={{
          padding:5,
          borderRadius:50,
          elevation:3,
          backgroundColor:'white'
        }}>
        <TouchableOpacity onPress={handleOpenDrawer}>
          {isDrawerOpen ? (
            <Ionicons name="close" size={24} color="black" />
          ): (
            <Entypo name="menu" size={24} color="black" />

          )}
        </TouchableOpacity>
        </View>

        </View>


        <View style={{
          gap:5,
          marginTop:10,
        }}>
        <TextInput
      label="Email address"
      mode='outlined'
      activeOutlineColor='coral'
    />
        <TextInput
      label="Username"
      mode='outlined'
      activeOutlineColor='coral'
    />
        <TextInput
      label="Message"
      mode='outlined'
      activeOutlineColor='coral'
      multiline
    />
        </View>
        
        <TouchableOpacity style={{
     
        marginTop:15,
        height:50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#FAB1A0',
        opacity: 0.8,
        }}>
          <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color:'white',
          }}>SEND</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          borderWidth:1,
          borderColor:'#FAB1A0',
     marginTop:15,
     height:50,
     justifyContent: 'center',
     alignItems: 'center',
     borderRadius: 10,

     opacity: 0.8,
     }}>
       <Text style={{
       fontSize: 20,
       fontWeight: 'bold',
       color:'#FAB1A0',
       }}>BACK</Text>
     </TouchableOpacity>

   

      </View>
      <View 
      style={{
        position:'absolute',
        bottom:20,
        right:15,
      }}
      >
      <TouchableOpacity style={{
      width:70,
      height:70,
      justifyContent: 'center',
      alignItems: 'center',
       borderRadius: 50,
      backgroundColor: '#FAB1A0',
     }}>
     <AntDesign name="message1" size={27} color="white" />
     </TouchableOpacity>

      </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Reports