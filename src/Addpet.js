import { View, Text, ImageBackground , TouchableOpacity} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const AddPets= () => {
 
  return (
    <SafeAreaView>
      <ImageBackground source={require('../assets/Image/FirstPage.png')}
      style={{
        width:'100%',
        height:'100%',
       
      }}
      >

        <View style={{
          padding:10,
        }}>

        <View style={{
      gap:10,
      justifyContent:'center',
      alignItems:'center',

    }}>
<Avatar.Image size={130} source={require('../assets/Image/dog.png')}
       />
       <TouchableOpacity style={{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:160,
        height:50,
        borderRadius:10,
        gap:5,
        borderColor:'#FAB1A0',
        elevation:1,
        backgroundColor:'white',
       }}>
       <AntDesign name="cloudupload" size={24} color="#FAB1A0" />
        <Text style={{
          color:'#FAB1A0'
        }}>Choose Image</Text>
       </TouchableOpacity>

    </View>

    <View style={{
      marginTop:20,
      gap:5,
    }}>
    <TextInput
      label="Pet name"
      mode='outlined'
      activeOutlineColor='coral'
    />
    <TextInput
      label="Gender"
      mode='outlined'
      activeOutlineColor='coral'
    />

    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
    }}>

    <TextInput
      label="RFID"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:220,
      }}
    />
    <TouchableOpacity style={{
      elevation:5,
      width:142,
      height:50,
      marginTop:5,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5,
      flexDirection:'row',
      gap:10,
      backgroundColor:'#FAB1A0'
    }}>
      <AntDesign name="scan1" size={20} color="white" />
      <Text style={{
        color:'white',
        fontWeight:'bold'
      }}>Set RFID</Text>
    </TouchableOpacity>

    </View>

    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
    }}>

    <TextInput
      label="Weight"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:220,
      }}
      
    />
    <TouchableOpacity style={{
      elevation:5,
      backgroundColor:'#FAB1A0',
      width:142,
      height:50,
      marginTop:5,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5,
      flexDirection:'row',
      gap:10,
    }}>
     <FontAwesome5 name="weight" size={20} color="white" />
      <Text style={{
        color:'white',
        fontWeight:'bold'
      }}>Weight Pet</Text>
    </TouchableOpacity>

    </View>
    <TextInput
      label="Goal Weight"
      mode='outlined'
      activeOutlineColor='coral'
    />
     <TextInput
      label="Age"
      mode='outlined'
      activeOutlineColor='coral'
    />

    <View style={{
      marginTop:10,
    }}>
      <TouchableOpacity style={{
        
        width:'50%',
        padding:15,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderColor:'#FAB1A0',
        elevation:3,
        backgroundColor:'white'
      }}>
        <Text style={{
          color:'#FAB1A0',
        }}>Go back</Text>
      </TouchableOpacity>
    </View>
   
    </View>

        </View>
    

      </ImageBackground>
      
    </SafeAreaView>
  )
}

export default AddPets