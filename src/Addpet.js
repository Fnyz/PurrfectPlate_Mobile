import { View, Text, ImageBackground , TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
import { collection, addDoc, getFirestore, query, onSnapshot } from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import {  AlertNotificationRoot, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import { petsData } from '../animeData';


const Box = React.memo(({Cat, Dog, image, handleCloseModal, pickImage, handlePickImage, click, handleSave}) => {
  
  
  return (
    <View style={{
      backgroundColor:'rgba(0,0,0,0.8)',
      height:400,
      padding:15,
    }}>
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
      <Text style={{
        color:'white',
        fontWeight:'bold',
        marginTop:5,
      }}><Text style={{
        color:'coral',
        fontWeight:'bold',
        fontSize:20,
      }}>|</Text> Choose your favorite image</Text>
      {click && (
        <TouchableOpacity onPress={handleSave}>
        <Text style={{
          color:'coral',
          fontWeight:'bold',
          marginRight:10,
          paddingTop:10,
        }}>SAVE</Text>
        </TouchableOpacity>
      )}
  
      </View>
    
      <View style={{
        marginTop:15,
      }}>
        <Text style={{
          color:'white',
          opacity:0.8,
          marginBottom:10,
        }}>Dog</Text>
        <ScrollView horizontal={true}>
          {Dog.map((item, i)=> {
            return (
             <TouchableOpacity key={item.id} style={{
              marginRight:10,
             }} onPress={()=> handlePickImage(item.image)}>
          <View style={{
            borderWidth:image === item.image ? 1 : null,
            borderColor:image === item.image ? 'coral': null,
            padding:2,
            borderRadius:50,
          }}>
          <Image
        style={{ width: 70, height: 70, resizeMode:'cover', borderRadius:50}}
        source= {{uri:item.image}}
        contentFit="cover"
        transition={1000}
      />
          </View>
         
             </TouchableOpacity>
             
            )
          })}
        </ScrollView>

        <Text style={{
          color:'white',
          opacity:0.8,
          marginBottom:10,
          marginTop:15,
        }}>Cat</Text>
        <ScrollView horizontal={true}>
          {Cat.map((item, i)=> {
            return (
             
             <TouchableOpacity key={item.id} style={{
              marginRight:10,
             }} onPress={()=> handlePickImage(item.image)} >
               <View style={{
                borderWidth:image === item.image ? 1 : null,
                borderColor:image === item.image ? 'coral': null,
                padding:2,
                borderRadius:50,
              }}>
          <Image
        style={{ width: 70, height: 70, resizeMode:'cover', borderRadius:50}}
        source= {{uri:item.image}}
        contentFit="cover"
        transition={1000}
      />
        </View>
             </TouchableOpacity>
           
            )
          })}
        </ScrollView>

  
        <TouchableOpacity style={{
         borderWidth:1,
         marginTop:20,
         borderColor:'coral',
         paddingVertical:15,
         justifyContent:'center',
         alignItems:'center',
         borderRadius:5,
        }} onPress={pickImage}>
          <Text style={{
            color:'coral',
          }}>Choose image from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> handleCloseModal()}>
          <Text style={{
            color:'white',
            textAlign:'center',
            marginTop:15,
            opacity:0.6,
            fontWeight:'bold'
          }}>Skip from now</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
})





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
  return `${fakeWeight} kg`;
}


const db = getFirestore(app)

const AddPets= ({navigation}) => {


  const [catData, setCatData] = useState([]);
  const [dogData, setDogData] = useState([]);
  const[petName, setPetname] = useState('');
  const[Gender, setGender] = useState('');
  const[click, setClick] = useState(false);
  const[Rfid, setRfid] = useState('');
  const[Weight, setWeight] = useState('');
  const[GoalWeight, setSetGoalWeight] = useState('');
  const[Age, setAge] = useState('');
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [datas, setAllData] = useState([]);
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);

  const [visible, setVisible] = useState(false);



  const [loadingRf, setLoad1] = useState(false);
  const [loadingWth, setLoad2] = useState(false);




  

  const getAllDatas = () => {
    const q = query(collection(db, "List_of_Pets"));
   onSnapshot(q, (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push(doc.data());
  });

  setAllData(dt);
 
});

  }

  useEffect(()=>{
    getAllDatas();
  },[])

  useEffect(()=>{
    const Dog = petsData.filter(item => item.category === 'Dog');
    const Cat = petsData.filter(item => item.category === 'Cat');

    setDogData(Dog);
    setCatData(Cat);
  },[])
  
  


  
  handleShowModal=()=>{
    setVisible(true);
  }

  handleCloseModal=()=>{
    setVisible(false);
  }

  handlePickImage = (url) => {
   setImage(url);
   setClick(true);
  }

  handleSave = () => {
    setClick(false);
    setVisible(false);
  }
  

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
    setLoad1(true);

    setTimeout(() => {
      setLoad1(false);
      const fakePassword = generateFakePassword(20);
      setRfid(fakePassword)
    }, 3000);

  }

  handleFakeWeight = () => {
    setLoad2(true);
    setTimeout(() => {
      setLoad2(false);
      const fakeWeight = generateFakeWeight(15, 25);
      setWeight(fakeWeight)
    }, 3000);

  }

  handleSubmit = async () => {

    
    setShow(true);


    if(!petName || !Gender || !Rfid || !Weight || !GoalWeight || !Age){
      setShow(false)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: 'Please input all fields.',
        button: 'close',
      })
      return;
    }

     const res = datas.find(d => d?.Petname.toLowerCase().trim() === petName.toLowerCase().trim());
    
     if(!res){
      const docRef = await addDoc(collection(db, "List_of_Pets"), {
        Petname: petName,
        Gender,
        Rfid,
        Weight,
        GoalWeight,
        Age,
        image
      });

      if(docRef.id){
        setShow(false);
        setPetname('');
        setGender('');
        setSetGoalWeight('');
        setAge('');
        setRfid('');
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'Add pet successfully.',
          button: 'close',
        })
      }
      return;
     }

     if(res.Petname.toLowerCase().trim() === petName.toLowerCase().trim()){
      setShow(false);
      setPetname('');
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Oppps.',
        textBody: 'Pet is already exists.',
        button: 'close',
      })
     }
      
  }

  

 
  const onGenderOpen = useCallback(() => {

  }, []);


  const { control } = useForm();
 

  
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
       }} onPress={handleShowModal}>
       <AntDesign name="cloudupload" size={24} color="#FAB1A0" />
        <Text style={{
          color:'#FAB1A0'
        }}>Choose image</Text>
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
      style={{
        opacity:0.7
      }}
      onChangeText={(val)=> setPetname(val)}
    />

     <Controller
        name="gender"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "100%",
            marginTop:5,
            }}>
            <DropDownPicker
              style={{borderColor: "#B7B7B7",
              height: 50}}
              open={genderOpen}
              value={Gender} 
              items={gender}
              setOpen={setGenderOpen}
              setValue={setGender}
              placeholder="Select Gender"
              placeholderStyle={{
                color: "grey",
              }}
              onOpen={onGenderOpen}
              onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        )}
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

     {loadingRf ? 
      <>
        <ActivityIndicator animating={true} color='white' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/>
            <Text style={{
              color:'white',
              fontWeight:'bold',
            }}>Please wait..</Text>
      </>
     : (
              <>
             <AntDesign name="scan1" size={20} color="white" />
      <Text style={{
        color:'white',
        fontWeight:'bold'
      }}>Set RFID</Text>
              </>
            
            ) }


     
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
        opacity:0.7
      }}

      
      value={`${Weight}`}
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
      {loadingWth ? 
      <>
        <ActivityIndicator animating={true} color='white' size={20} style={{
              opacity:0.8,
              position:'relative',
              left:0,
            }}/>
            <Text style={{
              color:'white',
              fontWeight:'bold',
            }}>Please wait..</Text>
      </>
     : (
              <>
             <FontAwesome5 name="weight" size={20} color="white" />
              <Text style={{
                color:'white',
                fontWeight:'bold'
              }}>Weight Pet</Text>
              </>
            
            ) }
  
    </TouchableOpacity>

    </View>
    <TextInput
      label="Goal Weight"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        opacity:0.7
      }}
      value={GoalWeight}
      onChangeText={(val) => setSetGoalWeight(val)} 

    />
     <TextInput
      label="Age"
      mode='outlined'
      activeOutlineColor='coral'
      value={Age}
      style={{
        opacity:0.7
      }}
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

        <Modal isVisible={show} animationIn='slideInLeft'>
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


      
      <Modal isVisible={visible} animationIn='slideInLeft' animationOut='fadeOut'>
        <Box 
        image={image}
        handleCloseModal={handleCloseModal}
        handlePickImage={handlePickImage}
        pickImage={pickImage}
        Dog={dogData}
        Cat={catData}
        handleSave={handleSave}
        click={click}
         />
       </Modal>
    

      </ImageBackground>
      
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default AddPets