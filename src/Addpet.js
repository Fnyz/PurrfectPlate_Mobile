import { View, Text, ImageBackground , TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, getFirestore, getDocs,where, query, onSnapshot } from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';


function generateFakePassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}


function generateFakeWeight(min, max) {
  const fakeWeight = (Math.random() * (max - min) + min).toFixed(2); // Generates a random weight between min and max with 2 decimal places
  return `${fakeWeight}`;
}


const db = getFirestore(app)

const AddPets= ({navigation}) => {


  const[petName, setPetname] = useState('');
  const[Gender, setGender] = useState('');
  const[Rfid, setRfid] = useState('');
  const[Weight, setWeight] = useState('');
  const[GoalWeight, setSetGoalWeight] = useState('');
  const[Age, setAge] = useState('');
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if(result.canceled){
        return null;
      }
      if (!result.canceled) {
       setImage(result.assets[0].uri)
      }
};


  


  handleFakeRFID = () => {

    setTimeout(() => {

      const fakePassword = generateFakePassword(8);
      setRfid(fakePassword)
    }, 3000);

  }

  handleFakeWeight = () => {

    setTimeout(() => {
      const fakeWeight = generateFakeWeight(15, 25);
      setWeight(fakeWeight)
    }, 3000);

  }

  handleSubmit = async () => {

    //Add new pet here
    setShow(true);
   
  const q = collection(db, "List_of_Pets");
  onSnapshot(q, (querySnapshot) => {
  const petList = [];
  querySnapshot.forEach((doc) => {
      petList.push(doc.data());
  });
  const result = petList.find(data => data.Petname === petName);
 
  //validate if it is exist or not.
  if(result){
    setShow(false);
    Dialog.show({
      type: ALERT_TYPE.ERROR,
      title: 'Oppps.',
      textBody: 'Pet is already EXIST.',
      button: 'close',
    })
    setPetname('')
  }else{
     addDoc(q, {
    Petname:petName,
    Gender:Gender,
    RFID:Rfid,
    Weight,
    GoalWeight,
    Age,
    Image:image
  }).then(()=>{
    setShow(false);
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success.',
      textBody: 'Yeahy pet is successfully added.',
      button: 'close',
    })
    setPetname('')
    setGender('')
    setRfid('')
    setWeight('')
    setSetGoalWeight('')
    setAge('')
    setImage('');  
  })
  }
  
});
  }

  

 
  
  
  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = useCallback(() => {
    navigation.openDrawer();
  },[navigation])
  
 
  return (
    <AlertNotificationRoot theme='dark'>

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
  padding:2,
  borderRadius:40,
  alignSelf:'flex-end',
  marginRight:5,
  width:40,
  height:40,
  justifyContent:'center',
  alignItems:'center',
  elevation:3,
  backgroundColor:'white'
}}>
  <TouchableOpacity onPress={handleOpenDrawer}>
    {isDrawerOpen ? (
      <Ionicons name="close" size={20} color="black" />
    ): (
<FontAwesome name="bars" size={20} color="black" 
/>
    )}
  </TouchableOpacity>
</View>

        <View style={{
      gap:10,
      justifyContent:'center',
      alignItems:'center',
      marginTop:30,

    }}>
<Avatar.Image size={130} source={!image ? require('../assets/Image/dog.png') : {uri: image}}
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
       }} onPress={pickImage}>
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
      value={petName}
      onChangeText={(val)=> setPetname(val)}
    />
    <TextInput
      label="Gender"
      mode='outlined'
      activeOutlineColor='coral'
      value={Gender}
      onChangeText={(val)=> setGender(val)}
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
      value={Rfid}
      style={{
        width:220,
      }}
      disabled
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
    }} onPress={handleFakeRFID}>
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
      style={{s
        width:220,
      }}
      
      value={`${Weight} kg`}
      onChangeText={(val) => setWeight(val)} 
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
    }} onPress={handleFakeWeight}>
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
      value={GoalWeight}
      onChangeText={(val) => setSetGoalWeight(val)} 

    />
     <TextInput
      label="Age"
      mode='outlined'
      activeOutlineColor='coral'
      value={Age}
      onChangeText={(val) => setAge(val)} 
    />

    <View style={{
      marginTop:10,
      flexDirection:'row',
      gap:10,
      justifyContent:'center'
    }}>
      <TouchableOpacity style={{
        
        width:'45%',
        padding:15,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        borderColor:'#FAB1A0',
        elevation:3,
        flexDirection:'row',
        backgroundColor:'white',
        gap:5
      }}
      
      onPress={()=>   navigation.goBack()}
      >
      <Ionicons name="arrow-back" size={20} color="#FAB1A0" />
        <Text style={{
          color:'#FAB1A0',
          fontSize:17,
          fontWeight:'bold'
        }}>Go back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        
        width:'45%',
        padding:15,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        backgroundColor:'#FAB1A0',
        elevation:3,
        flexDirection:'row',
        gap:5,
      }} onPress={handleSubmit}>
        <Feather name="plus" size={20} color="white" />
        <Text style={{
          color:'white',
          fontWeight:'bold',
          fontSize:17,
        }}>Add pet</Text>
      </TouchableOpacity>
    </View>
   
    </View>

        </View>

        <Modal isVisible={false} animationIn='slideInLeft'>
        <View style={{ height:70,
        borderColor:'red',
        marginHorizontal:20,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.9)',
        gap:5,
        position:'relative'
        }}>
          <View style={{
              position:'absolute',
              zIndex:1,
              right:10,
              top:-98,

            }}>
             <Image source={require(`../assets/Doggy.png`)} style={{
              width:115,
              height:140,
             }} />
            </View>
          <ActivityIndicator animating={true} color='coral' size={25} style={{
              opacity:0.8,
              position:'relative',
              left:-10,
            }}/>

          <Text style={{
              fontSize:22,
              opacity:0.9,
              position:'relative',
              left:-5,
              color:'white',
              fontWeight:'bold',
            }}>Add new pet .</Text>
        </View>
      </Modal>
    

      </ImageBackground>
      
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default AddPets