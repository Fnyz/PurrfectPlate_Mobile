import { View, Text, ImageBackground , TouchableOpacity, ActivityIndicator, ScrollView, Button} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5, Entypo  } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather, Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, getFirestore, query, onSnapshot, serverTimestamp, setDoc, doc , where, updateDoc } from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import {  AlertNotificationRoot, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import { petsData } from '../animeData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PurrfectPlateLoadingScreen from './components/PurrfectPlateLoadingScreen';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
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







const db = getFirestore(app)

const AddPets= ({navigation}) => {

  const [loads, setloads] = useState(false)
  const [date1, setDate1] = useState(false);
  const [date2, setDate2] = useState(false)
  const [time1, setTime1] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [val, setVal] = useState("");
  const [val1, setVal1] = useState("");
  const [notSet, setNowGoalMonth] = useState(false)
  const [catData, setCatData] = useState([]);
  const [dogData, setDogData] = useState([]);
  const[petName, setPetname] = useState('');
  const[Gender, setGender] = useState('');
  const[Slot, setSLot] = useState('');
  const[click, setClick] = useState(false);
  const[Rfid, setRfid] = useState('');
  const[Weight, setWeight] = useState('');
  const[GoalWeight, setSetGoalWeight] = useState('');
  const[Age, setAge] = useState('');
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [datas, setAllData] = useState([]);
  const [genderOpen, setGenderOpen] = useState(false);
  const [slotOpen, setSlotOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [gender, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
  const [needSetGoalMonth, setNeedSetGoalMonth] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadingRf, setLoad1] = useState(false);
  const [loadingWth, setLoad2] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [userData, setUserData] = useState({});
  const [petType, setPetType] = useState('');
  const [changeType, setChangeForType] = useState(false);
  const typePet = [
    { label: "Dog", value: "dog" },
    { label: "Cat", value: "cat" },
    { label: "Specified pet type", value: "specified" },
  ]

  const slots = [
    { label: "Slot_one", value: 1 },
    { label: "Slot_two", value: 2 },

  ]
  const [recording, setRecording] = React.useState();
  const [recordsound, setSound] = React.useState("");
  const [play, setPlay] = React.useState(false)
  const [needRec, setNeedRec] = React.useState(false)
  const [petRecord, setPetRecord] = React.useState("");
  const [petId, setPetID] = React.useState('');

  const [openModal, setOpenModal] = React.useState(false);

  const getUserData = async () => {
    const jsonValue = await AsyncStorage.getItem('Credentials');
    const credential = JSON.parse(jsonValue);
    setDeviceName(credential.DeviceName);
    setUserData(credential)
  }

  useEffect(()=> {
    setloads(true);
    setTimeout(() => {
      setloads(false)
    }, 3000);
    getUserData();
  },[])

  

  const startdate1 = (event, selectedStart) => {
    setDate1(false);
    if (selectedStart !== undefined) {
      const formattedDate1 = moment(selectedStart).format('MM/D/YYYY');
      setVal(formattedDate1);
      setTime1(selectedStart);
    
    }

  }

  const startdate2 = (event, selectedEnd) => {
setDate2(false);


if (selectedEnd !== undefined) {
  const formattedDate2 = moment(selectedEnd).format('MM/D/YYYY');
  setVal1(formattedDate2);
  setTime(selectedEnd);

}
      }


  // const startRecording = async () => {
  //   try {
      

  //     const recording = new Audio.Recording();
  //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  //     await recording.startAsync();
  //     setRecording(recording);
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error('Failed to start recording', error);
  //   }
  // };

  // const stopRecording = async () => {
  //   try {
  //     if (!recording) {
  //       return;
  //     }

  //     await recording.stopAndUnloadAsync();
  //     const uri = recording.getURI();
  //     setRecording(undefined);
  //     setIsRecording(false);

  //     const fileInfo = await FileSystem.getInfoAsync(uri);
  //     if (fileInfo.exists) {
  //       const fileContent = await FileSystem.readAsStringAsync(uri, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  //      console.log(fileContent)
  //     } else {
  //       console.error('File does not exist:', uri);
  //     }
  //   } catch (error) {
  //     console.error('Failed to stop recording', error);
  //   }
  // };

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

  
    
  useEffect(()=> {
    const makeChange = async () => {
      const user = await AsyncStorage.getItem("Credentials")
      if(user){
          const datas = JSON.parse(user);
          const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
          onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
           if (change.type === "modified" && change.doc.data().Weight && change.doc.data().Token === 0) {
            setWeight(change.doc.data().Weight)
            setLoad2(false)
            return;
          }

        });
      
      });
  
  
      }
    }

    makeChange();
   
},[loadingWth, Weight])

useEffect(()=> {
  const makeChange = async () => {
    const user = await AsyncStorage.getItem("Credentials")
    if(user){
        const datas1 = JSON.parse(user);
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas1.DeviceName));
        onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {

        if (change.type === "modified" && change.doc.data().Rfid && change.doc.data().Token === 0) {
        

          const a = datas.find(d => d?.Rfid == change.doc.data().Rfid && d.Petname.trim() !== change.doc.data().Petname.trim());      
          if(!a){
        
            setRfid(change.doc.data().Rfid)
            setLoad1(false)
            return;
          }
          
  
           
         
              setRfid("")
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'SUCCESS',
                textBody: `RFID is already taken on pet ${a?.Petname}; please try to generate a new RFID.`,
                button: 'close',
              })
              setLoad1(false)
          return;
        }

      });
    
    });


    }
  }

  makeChange();
 
},[loadingRf, Rfid])
  
  


  
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


  


  handleFakeRFID = async () => {
    setLoad1(true);

    const petRrfid = doc(db, "List_of_Pets", petId);
      await updateDoc(petRrfid, {
        requestRfid: true,
        Rfid:"",
      }).then( async()=>{
        setLoad1(true);
        await  addDoc(collection(db, "Task"), {
          type:'request_rfid',
          deviceName:deviceName.trim(),
          document_id:petId,
          request:null,
        });
      })

  }

  handleFakeWeight = async () => {
    setLoad2(true);
    const petWeightss = doc(db, "List_of_Pets", petId);
      await updateDoc(petWeightss, {
        requestWeight: true,
        Weight:"",
      }).then(async()=>{
        setLoad2(true);
        await  addDoc(collection(db, "Task"), {
          type:'request_weight',
          deviceName:deviceName.trim(),
          document_id:petId,
          request:null,
        });
  
      })

  }

  const handleUpdateChange = async () => {
    setOpenModal(false)
    setShow(true);
    const petWeightss = doc(db, "List_of_Pets", petId);
    await updateDoc(petWeightss, {
      Token: 1,
      requestWeight:false,
      requestRfid:false,
      GoalWeight:GoalWeight,
      StartGoalMonth:val === "" ? "Invalid Date" : val,
      EndGoalMonth:val1 === "" ? "Invalid Date":val1,
    }).then( async()=>{
      const a =  await addDoc(collection(db, "Petbackup_data"),  {
        DeviceName:deviceName.trim(),
        Petname: petName,
        Gender,
        Rfid,
        Weight,
        GoalWeight,
        Age,
        Slot,
        petType:petType.toLowerCase().trim(),
        image,
        synced:false,
        RecordingFile:petRecord,
        requestWeight:false,
        requestRfid:false,
        Created_at:Date.now(),
        Updated_at: Date.now(),
      });
     const b = await  addDoc(collection(db, "Task"), {
        type:'refresh_pet',
        deviceName:deviceName.trim(),
        document_id:a.id,
        request:null,
      });

     Promise.all([a, b]).then(() => {
        setShow(false);
        setPetname('');
        setGender('');
        setSetGoalWeight('');
        setAge('');
        setRfid('');
        setWeight('');
        setPetType('')
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'Add pet successfully.',
          button: 'close',
        })
      });

    })

  }


 
 

  handleSubmit = async () => {
    setShow(true);
    if(!petName || !Gender || !Age || !petType){
      setShow(false)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: 'Please input all fields.',
        button: 'close',
      })
      return;
    }

    if(!petRecord){
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: 'Please provide the recording file for the pet.',
        button: 'close',
      })
      return;
    }


     const res = datas.find(d => d?.Petname.toLowerCase().trim() === petName.toLowerCase().trim() && d?.DeviceName.toLowerCase().trim() === deviceName.toLowerCase().trim());
    
     if(!res){
      
      const addListPet = await addDoc(collection(db, "List_of_Pets"), {
        DeviceName:deviceName.trim(),
        Petname: petName,
        Gender,
        Rfid,
        Weight,
        GoalWeight,
        Age,
        petType:petType.toLowerCase().trim(),
        image,
        synced:false,
        RecordingFile:petRecord,
        requestWeight:false,
        requestRfid:false,
        StartGoalMonth:val === "" ? "Invalid Date" : val,
        EndGoalMonth:val1 === "" ? "Invalid Date":val1,
        Token:0,
        Slot,
        Created_at:Date.now(),
        Updated_at: Date.now(),
      });

      if(addListPet.id){
        setShow(false);
        setOpenModal(true);
         setPetID(addListPet.id);
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

  useEffect(()=>{
    if(petType === "specified"){
      setChangeForType(true);
      setPetType("");
      return;
    }
  },[petType])

  
  
  const onSlotOpen = useCallback(() => {

  }, []);

 
  const onGenderOpen = useCallback(() => {

  }, []);

  const onTypeOpen = useCallback(() => {

  }, []);


  const { control } = useForm();
 

  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = useCallback(() => {
    navigation.openDrawer();
  },[navigation])


  async function startRecording() {
    setSound('');
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
     
      setRecording(recording);
      console.log('Recording started');
    } catch (err) { 
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setSound(uri)
  
   

    try {
      const audioURI = recording.getURI();
  
      // Read the MP3 file
      const fileContent = await FileSystem.readAsStringAsync(audioURI, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setPetRecord(fileContent);
      // Set the Base64 representation of the MP3 file to state
    
    } catch (error) {
      console.error('Error converting MP3 to Base64:', error);
    }



 
    
  }





  async function playRecording() {
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: recordsound },
        { shouldPlay: true, isLooping: false },
        onPlaybackStatusUpdate
      );
      
      console.log('Playing recorded sound');
      setPlay(true);
    } catch (error) {
      console.error('Error playing recorded sound', error);
    }
  }

  function onPlaybackStatusUpdate(status) {
    if (status.didJustFinish) {
      // The playback has finished
      setPlay(false);
   
      console.log('Playback finished');
   
    }
  }
  

  



  if(loads){
    return (
      <PurrfectPlateLoadingScreen message={"Please wait.."} fontSize={25} />
    )
  }



  

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
      width:'100%',
  

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
      width:'100%',
  
    
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

{!changeType ? 
        <Controller
        name="petType"
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
              open={typeOpen}
              value={petType} 
              items={typePet}
              setOpen={setTypeOpen}
              setValue={setPetType}
              placeholder="Select type of pet"
              placeholderStyle={{
                color: "grey",
              }}
              onOpen={onTypeOpen}
              onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        )}
      />
    : 
    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
    }}>

    <TextInput
      label="Input type of pet here"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:'76%',
        opacity:0.7
      }}

      
      value={petType}
      onChangeText={(val) => setPetType(val)} 
    />
    <TouchableOpacity style={{
      elevation:5,
      backgroundColor:'#FAB1A0',
      width:'20%',
      height:50,
      marginTop:5,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5,
      flexDirection:'row',
      gap:10,
    }} onPress={()=> setChangeForType(false)}>
             <AntDesign name="close" size={20} color="white" />
             
    </TouchableOpacity>

    

    </View>
    
    }

<Controller
        name="petSlot"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "100%",
            marginTop:5,
            zIndex:20,
            }}>
            <DropDownPicker
              style={{borderColor: "#B7B7B7",
              height: 50}}
              open={slotOpen}
              value={Slot} 
              items={slots}
              setOpen={setSlotOpen}
              setValue={setSLot}
              placeholder="Select PetFeeding Slot"
              placeholderStyle={{
                color: "grey",
              }}
              onOpen={onSlotOpen}
              onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
        )}
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

<Controller
        name="gender"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "100%",
            marginTop:5,
            zIndex:1,
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
      justifyContent: 'center',
      alignItems:'center',
      gap:5,
      marginVertical:5,
    }}>
    <Text style={{
      fontWeight:'bold',
      opacity:0.7
    }}>Record voice on how you call your pet.</Text>
    <TouchableOpacity onPress={()=> setNeedRec(true)}>
    <Text style={{
      color:'red',
      fontWeight:'bold',
      fontStyle:'italic',
      opacity:0.8
    }}>Click here.</Text>
    </TouchableOpacity>
    </View>
 

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

      <Modal isVisible={openModal} animationIn='slideInLeft'>
        <View style={{ height:Rfid ? 320 : 300,
        borderColor:'red',
        marginHorizontal:2,
        borderRadius:5,
        flexDirection:'column',
        justifyContent:'center',        
        backgroundColor:'white',
        gap:5,
        position:'relative',
        paddingHorizontal:20,
        }}>
          
          <Text style={{fontWeight:'bold', fontSize:20}}>Add pet Weight and RFID</Text>
         <Text className='text-[12px] mb-3 opacity-40 font-bold'style={{
          fontSize:12,
          marginBottom:3,
          opacity:0.5,
          fontWeight:'bold'
         }} >Click the button to provide the weight and rfid.</Text>
       
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
        width:170,
      }}
    />
    <TouchableOpacity style={{
      elevation:5,
      width:120,
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
    {Rfid && (
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
        width:170,
      }}

      
      value={`${Weight}`}
      onChangeText={(val) => setWeight(val)} 
    />
    <TouchableOpacity style={{
      elevation:5,
      backgroundColor:'#FAB1A0',
      width:120,
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

    )}
    <TextInput
      label="Goal Weight"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        opacity:0.7,
        marginHorizontal:3,
      }}
      value={GoalWeight}
      onChangeText={(val) => setSetGoalWeight(val)} 

    />
   
    <View style={{
      flexDirection:'row',
      gap:4,
     marginTop:5,
    }}>
      <Text style={{
        fontWeight:'bold',
        opacity:0.7
      }}>Do you want to set the goal month?</Text>
      <TouchableOpacity onPress={()=> setNeedSetGoalMonth(true)}>
      <Text style={{
        fontStyle:'italic',
        fontWeight:'bold',
        color:'red'
      }}>Click here</Text>
      </TouchableOpacity>
    </View>
      
  
     
    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
      marginVertical:10,
      marginHorizontal:10,
    }}>
    <TouchableOpacity style={{
   
   width:'50%',
   padding:10,
   backgroundColor:'#FAB1A0',
   borderRadius:3,
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
 


 }} onPress={handleUpdateChange} >
      <Text style={{
        color:'white',
        fontWeight:'bold',
        
      }}>SUBMIT</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
   width:'50%',
   padding:10,
   borderColor:'#FAB1A0',
   borderRadius:3,
   borderWidth:1,

 }} onPress={()=>{
        if(!Rfid){
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'WARNING',
            textBody: 'Please provide RFID!',
            button: 'close',
          })
          return;
        }
        setOpenModal(false);
        setPetname('');
        setGender('');
        setSetGoalWeight('');
        setAge('');
        setRfid('');
        setWeight('');
        setPetType('')
 }}>
      <Text style={{
        color:'#FAB1A0',
        fontWeight:'bold'
      }}>CLOSE</Text>
    </TouchableOpacity>
    </View>
  
        </View>
      </Modal>

      <Modal isVisible={needSetGoalMonth} animationIn='slideInLeft'>
        <View style={{ height:!notSet ? 160: 270,
        borderColor:'red',
        marginHorizontal:2,
        borderRadius:5,
        flexDirection:'column',
        justifyContent:'center',        
        backgroundColor:'white',
        gap:5,
        position:'relative',
        paddingHorizontal:20,
        }}>
          {!notSet && (
            <>
  <Text style={{fontWeight:'bold', fontSize:20}}>Warning!</Text>
  <Text className='text-[12px] mb-3 opacity-40 font-bold'style={{
   fontSize:15,
   marginBottom:3,
   opacity:0.5,
   fontWeight:'bold'
  }} >Please make sure you have already consulted the professional before setting the goal for the month.</Text>

   
            </>

          )}
          {notSet && (
              <View>
             <Text style={{fontWeight:'bold', fontSize:20}}>Select Goal Month</Text>
  <Text className='text-[12px] mb-3 opacity-40 font-bold'style={{
   fontSize:12,
   marginBottom:3,
   opacity:0.5,
   fontWeight:'bold'
  }} >Click the button on the right to choose the date.</Text>
              <View style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              gap:10,
            }}>
        
            <TextInput
              label="Start date"
              mode='outlined'
              activeOutlineColor='coral'
              style={{
                width:'77%',
              }}
              disabled
        
              
              value={val}
          
            />
            
            
            <TouchableOpacity style={{
              elevation:5,
              backgroundColor:'#FAB1A0',
              width:'20%',
              height:50,
              marginTop:5,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:5,
              flexDirection:'row',
              gap:10,
            }} onPress={()=>{
              setDate1(true);
            }}>
             
             <Fontisto name="date" size={20} color="white" />
             {date1 && (
         <DateTimePicker
                testID="timePicker"
                value={time1}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={startdate1}
                
                /> 
             )}
            </TouchableOpacity>
            
            </View>
            <View style={{
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              gap:10,
            }}>
        
            <TextInput
              label="End date"
              mode='outlined'
              activeOutlineColor='coral'
              style={{
                width:'77%',
              }}
              disabled
        
              
              value={val1}
            
            />
            
           
            <TouchableOpacity style={{
              elevation:5,
              backgroundColor:'#FAB1A0',
              width:'20%',
              height:50,
              marginTop:5,
              justifyContent:'center',
              alignItems:'center',
              borderRadius:5,
              flexDirection:'row',
              gap:10,
            }} onPress={()=>{
              setDate2(true);
            }}>
             
                <Fontisto name="date" size={20} color="white" />
                {date2 && (
         <DateTimePicker
                testID="timePicker"
                value={time}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={startdate2}
                /> 
             )}
                   
          
            </TouchableOpacity>
            
            </View>
            </View>
          )}
        
    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:10,
      marginVertical:10,
      marginHorizontal:10,
    }}>
    {notSet ? (
        <TouchableOpacity style={{
   
          width:'50%',
          padding:10,
          backgroundColor:'#FAB1A0',
          borderRadius:3,
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
        
       
       
        }} onPress={()=>{
         
         if(val === "" || val1 === ""){
           Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Warning!',
            textBody: 'Please input the start and end date.',
            button: 'close',
          })
          return;
         }
         setNeedSetGoalMonth(false);
         setNowGoalMonth(false);
        }} >
             <Text style={{
               color:'white',
               fontWeight:'bold',
               
             }}>SAVE</Text>
           </TouchableOpacity>
    ): (
    <TouchableOpacity style={{
   
   width:'50%',
   padding:10,
   backgroundColor:'#FAB1A0',
   borderRadius:3,
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
 


 }} onPress={()=>{
  setNowGoalMonth(true);
 }} >
      <Text style={{
        color:'white',
        fontWeight:'bold',
        
      }}>SET NOW</Text>
    </TouchableOpacity>

    )}
    <TouchableOpacity style={{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
   width:'50%',
   padding:10,
   borderColor:'#FAB1A0',
   borderRadius:3,
   borderWidth:1,

 }} onPress={()=>{
        setNeedSetGoalMonth(false);
        setNowGoalMonth(false);
        setVal("");
        setVal1("");
 }}>
      <Text style={{
        color:'#FAB1A0',
        fontWeight:'bold'
      }}>CLOSE</Text>
    </TouchableOpacity>
    </View>
  
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

       <Modal isVisible={needRec} animationIn='slideInLeft' animationOut='fadeOut'>
       <View style={{
        width:'100%',
        borderRadius:10,
        height:recordsound ? 230 : 130,
        backgroundColor:'white',
        padding:10,
        flexDirection:'column',
        gap:15,
       }}>
        <View>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems: 'center',
          }}>
          <Text style={{
          fontSize:20,
          fontWeight:'bold',
        }}>Add Recording</Text>
        <TouchableOpacity onPress={()=>{
setNeedRec(false);

}}>
        <AntDesign name="close" size={20} color="red" />
        </TouchableOpacity>
          </View>
      
        <Text style={{
          opacity:0.5
        }}>Click the button below to start recording.</Text>
        </View>
      
        <TouchableOpacity style={{
          width:'100%',
          paddingVertical:12,
          backgroundColor:'#FAB1A0',
          alignItems:'center',
          borderRadius:5,
          justifyContent:'center',
          flexDirection:'row',
          gap:10
        }} disabled={play ? true: false}  onPress={recording ? stopRecording : startRecording}>
          {recording ? <>
            <FontAwesome name="pause" size={17} color="white" />
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
            color:'white'
          }}>Stop Recording</Text>
          </>: <>
          <Entypo name="controller-record" size={17} color="white" />
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
            color:'white'
          }}>Start Recording</Text>
          </>}
        </TouchableOpacity>
        {recordsound && (
          <>
           <Text style={{
          fontWeight:'bold',
          opacity:0.5
        }}>Listen your recording here:</Text>
        <TouchableOpacity style={{
          width:'100%',
          paddingVertical:12,
          borderWidth:1,
          borderColor:'#FAB1A0',
          alignItems:'center',
          borderRadius:5,
          justifyContent:'center',
          flexDirection:'row',
          gap:10
        }} disabled={play ? true: false}   onPress={playRecording}>
          {play ? <>
            <ActivityIndicator animating={true} color='#FAB1A0' size={20} />
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
            color:'#FAB1A0'
          }}> Sound Playing...</Text>
          </>: <>
          <FontAwesome name="play" size={17} color="#FAB1A0" />
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
            color:'#FAB1A0'
          }}>Play Recording</Text>
          </>}
        </TouchableOpacity>
          </>

        )}
       

        <View>
    
    </View>
  

       </View>
       </Modal>
    

      </ImageBackground>
      
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default AddPets