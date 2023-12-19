import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator, FlatList, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';
import { TextInput } from 'react-native-paper';
import { Entypo , MaterialIcons, FontAwesome5, EvilIcons, FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import { doc, updateDoc, getFirestore,  deleteDoc,  collection, query, where, onSnapshot} from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import moment from 'moment';
import PurrfectPlateLoadingScreen from './components/PurrfectPlateLoadingScreen';
import PetListSched from './components/PetListSched';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { petsData } from '../animeData';
import DateTimePicker from '@react-native-community/datetimepicker';

const db = getFirestore(app);

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


const DetailsPage = ({route, navigation}) => {
  const {image, Weight, Gender, Age, Petname, date, DeviceName, id, GoalWeight, StartGoalMonth, EndGoalMonth, Slot, Rfid} = route.params;
  const [visible2, setVisible2] = useState(false)
  const [rfid, setRFID] = useState("")
  const [catData, setCatData] = useState([]);
  const [dogData, setDogData] = useState([]);
  const [date1, setDate1] = useState(false);
  const [date2, setDate2] = useState(false)
  const[click, setClick] = useState(false);
  const [loads, setloads] = useState(false)
  const [w, setW] = useState(null);
  const [a, setA] = useState(null);
  const [n, setN] = useState(null);
  const [img, setImg] = useState(null);
  const [gW, setGw] = useState(null)
  const [visible, setVisible] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [isChange, setChange] = useState(false);
  const[genders, setGender] = useState('');
  const[show, setShow] = useState(false);
  const [time1, setTime1] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [val, setVal] = useState("");
  const [val1, setVal1] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
  const [slotOpen, setSlotOpen] = useState(false);
  const [slot, setSlot] = useState([
    { label: "Slot_one", value: 1 },
    { label: "Slot_two", value: 2 },
  ]);

  const[slotnumber, setSlotNumber] = useState('');
  
  const [loadingWth, setLoad2] = useState(false);
  const [loadingRf, setLoad3] = useState(false);
  const [petSchesData, setPetSchedDataset] = useState([]);


  useEffect(()=> {
    const makeChange = async () => {
      const user = await AsyncStorage.getItem("Credentials")
      if(user){
          const datas = JSON.parse(user);
          const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
          onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach( async(change) => {
           if (change.doc.data().Weight && change.doc.data().Petname === Petname && change.doc.data().Token === 0) {
            setW(change.doc.data().Weight)
            setLoad2(false)
          
            return;
          }

          if (change.doc.data().Rfid && change.doc.data().Petname === Petname && change.doc.data().Token === 0) {
            setRFID(change.doc.data().Rfid)
            setLoad3(false)
            return;
          }
      
      
  
        });
      
      });
  
  
      }
    }

    makeChange();
   
},[loadingWth])

  useEffect(()=>{
    setloads(true);
    setTimeout(() => {
      setloads(false)
    }, 3000);
   setW(Weight);
   setGender(Gender),
   setA(Age),
   setN(Petname);
   setImg(image)
   setGw(GoalWeight);
   setSlotNumber(Slot)
   setRFID(Rfid)
   setVal(StartGoalMonth === "Invalid Date" ? null: StartGoalMonth);
   setVal1(EndGoalMonth  === "Invalid Date" ? null: EndGoalMonth);
  },[])
  const [updatingProccess, setUpdatingProccess] = useState(false);
  const onGenderOpen = useCallback(() => {

  }, []);
  const onSlotOpen = useCallback(() => {

  }, []);

  const handleRemoveSchedTimeSched = async (time, days) => {
    setUpdatingProccess(true)
    const a = petSchesData.find((d) => d.data.Days === days && d.data.DeviceName === DeviceName)
    const b = a?.data.ScheduleTime.filter((d) => d.time !== time );
   
    if(a.data.ScheduleTime.length - 1 === 0){
      setUpdatingProccess(false)
      await deleteDoc(doc(db, "feeding_schedule",a.id)).then(()=>{
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Success!',
          textBody: "Time is successfully removed from the schedule.",
          button: 'close',
        })
      });
      return;
    }
    const docRef = doc(db, 'feeding_schedule', a.id);
    updateDoc(docRef, {
     ScheduleTime:b,
  }).then(()=>{
    setUpdatingProccess(false)
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Success!',
      textBody: "Time is successfully removed from the schedule.",
      button: 'close',
    })
  });
    
  }

  const handleRemoveSched = async (id) => {
    await deleteDoc(doc(db, "feeding_schedule",id));
  }

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


   
  const handleUpdateTimeHere = (days, time, cups, currenTime) => {
    setUpdatingProccess(true)
    const a = petSchesData.find((d) => d.data.Days === days && d.data.DeviceName === DeviceName)
    const b = a?.data.ScheduleTime.find((d) => d.time === currenTime.split(" ")[0].trim());
    const c = a?.data.ScheduleTime.find((d) => d.time === time.split(" ")[0].trim());

    if(c){
      setUpdatingProccess(false)
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Success!',
        textBody: `Time ${time.split(" ")[0].trim()} already set on the pet schedule, please choose other time.`,
        button: 'close',
      })
      return;
    }

    

    if(b){
     const res = a?.data.ScheduleTime.filter(d => d.time !== currenTime.split(" ")[0].trim());
     const newArray =  [
      {cups: cups,
       parameters:time.split(" ")[1].trim(),
       time:time.split(" ")[0].trim(),
      }
     ]

  
    
     const updateSched = [...res, ...newArray]
     const docRef = doc(db, 'feeding_schedule', a.id);
     updateDoc(docRef, {
      ScheduleTime:updateSched,
   }).then(()=>{
    setUpdatingProccess(false)
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Success!',
      textBody: 'TIME AND CUPS ARE UPDATED SUCCESSFULLY!',
      button: 'close',
    })
   });


    }
  
  
  
    
     
  }




  const getSchedule = () => {
    const q = query(collection(db, "feeding_schedule"), where("Petname", "==", Petname));
    onSnapshot(q, (querySnapshot) => {
      const schedDatas = [];
      querySnapshot.forEach((doc) => {
          schedDatas.push({data:doc.data(), id:doc.id});
      });
      setPetSchedDataset(schedDatas);
    
    });
    }
  
    const handleFakeRfid = async () => {
      setLoad3(true);
      setRFID("");
      const petWeightss = doc(db, "List_of_Pets", id);
        await updateDoc(petWeightss, {
          requestRfid: true,
          Rfid:"", 
          Token:0,
        }).then(async()=>{
          setLoad3(true);
          await  addDoc(collection(db, "Task"), {
          type:'request_rfid',
          deviceName:DeviceName.trim(),
          document_id:id,
          request:slot,
        });
        })
  
    }


  const handleFakeWeight = async () => {
      setLoad2(true);
      setW("");
      const petWeightss = doc(db, "List_of_Pets", id);
        await updateDoc(petWeightss, {
          requestWeight: true,
          Weight:"", 
          Token:0,
        }).then(async()=>{
          setLoad2(true);
          await  addDoc(collection(db, "Task"), {
          type:'request_weight',
          deviceName:DeviceName.trim(),
          document_id:id,
          request:slot,
        });
        })
  
    }

    handleShowModal=()=>{
      setVisible3(true);
    }
  
    handleCloseModal=()=>{
      setVisible3(false);
    }
  
    handlePickImage = (url) => {
     setImg(url);
     setClick(true);
    }
  
    handleSave = () => {
      setClick(false);
      setVisible3(false);
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
         setImg(result.assets[0].uri)
        }
  };
  


  handleUpdate = async () => {
    setVisible(true)
    setChange(true)
    const docUpdate = {
      Petname:n,
      Weight:w,
      Gender:genders,
      GoalWeight:gW,
      Age:a,
      image:img, 
      StartGoalMonth:val === null ? "Invalid Date":val,
      EndGoalMonth:val1 === null ? "Invalid Date": val1,
    }
    try {
      const collects = doc(db, "List_of_Pets", id);
      await updateDoc(collects, docUpdate);
      setVisible(false)
      setChange(false)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'SUCCESS',
        textBody: 'Pet info is Updated Successfully.',
        button: 'close',
      })
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    } catch (error) {
      console.log(error)
    }
  }



  const HandleDelete = () => {
    setVisible2(false)
    setVisible(true)
    setChange(true)
      deleteDoc(doc(db, "List_of_Pets", id)).then(()=>{
    const q = query(collection(db, "feeding_schedule"), where("Petname", "==", Petname.trim()), where("DeviceName", "==", DeviceName.trim()));
    onSnapshot(q, (querySnapshot) => {
     querySnapshot.forEach((docs) => {
      deleteDoc(doc(db, "feeding_schedule", docs.id));
     });
    
   });

      })
      setVisible(false)
      setChange(false)
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'SUCCESS',
        textBody: 'Pet is Delete Successfully.',
        button: 'close',
      })
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
 
  
  }

  useEffect(()=>{
    const Dog = petsData.filter(item => item.category === 'Dog');
    const Cat = petsData.filter(item => item.category === 'Cat');

    setDogData(Dog);
    setCatData(Cat);
  },[])



  const { control } = useForm();

  // if(loads){
  //   return (
  //     <PurrfectPlateLoadingScreen message={"Please wait.."} fontSize={25} />
  //   )
  // }

  
  
  return (

    <AlertNotificationRoot theme='dark'>

  
    <SafeAreaView>
        <ImageBackground source={require('../assets/Image/FirstPage.png')}>
        <View style={{
            height:'100%',
            width:'100%',
            padding:15,
        }} >
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:10,
           
        }}>
        <View style={{
            borderWidth:2,
            borderColor:'#FAB1A0',
            borderRadius:100,
            padding:2,
        }}>
        <Image
        style={{
          width:110,
          height:110,
          opacity:0.9,
          borderRadius:100,
        }}
        source={{uri:img}}
        contentFit="cover"
        transition={1000}
      />
        </View>
        <View>
        <Text style={{
            fontSize:15,
            opacity:0.5,
            marginLeft:10,
        }}>Hi Im,</Text>
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          gap:5,
        }}>
        <Text style={{
            fontSize:30,
            fontWeight:'bold',
            opacity:0.7,
            textTransform:'capitalize'
        }}>{n}</Text>
        <MaterialCommunityIcons name="hand-wave" size={27} color="coral" />
        </View>
        <TouchableOpacity style={{
      
          height:35,
          width:140,
          marginTop:4,
          borderRadius:10,
          backgroundColor:'white',
          flexDirection:'row',
          gap:2,
          justifyContent:'center',
          alignItems:'center',
          elevation:2,

        }} onPress={handleShowModal}>
                <AntDesign name="cloudupload" size={24} color="#FAB1A0" />
          <Text style={{
            textAlign:'center',
            fontWeight:'bold',
            color:'#FAB1A0',
            fontSize:12,
          }}>CHOOSE IMAGE</Text>
        </TouchableOpacity>
        </View>
        </View>
        <View style={{
          gap:5,
          marginTop:10,
        }}>
    <View style={{
      position:'relative'
    }}>
    <TextInput
      label="Rfid"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${rfid}`}
      disabled
      onChangeText={(val)=> setRFID(val) }
      
    />
    <TouchableOpacity style={{
      position:'absolute',
      right:7,
      fontWeight:'bold',
      top:-2,
      backgroundColor:'white',
      elevation:2,
      borderRadius:5,
      color:'red',
      opacity:0.9,
      gap:5,
      paddingHorizontal:10,
      paddingVertical:5,
    }} onPress={handleFakeRfid}>
     {loadingRf ? (
      <Text style={{
        color:'red',
        opacity:0.9,
        fontWeight:'bold',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
        gap:5,
      }}>Please wait..</Text>
     ): (
      <Text style={{
        color:'red',
        opacity:0.9,
        fontWeight:'bold'
      }}><AntDesign name="edit" size={15} color="red" /> CHANGE RFID</Text>
     )}

    </TouchableOpacity>
  
    </View>
  
      <TextInput
      label="PetName"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${n}`}
      onChangeText={(val)=> setN(val) }
      
    />
      
      <View style={{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
      }}>
      <Controller
        name="gender"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "50%",
            marginTop:5,
            }}>
            <DropDownPicker
              style={{borderColor: "#B7B7B7",
              height: 50, zIndex:100}}
              open={genderOpen}
              value={genders} 
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

<Controller
        name="petslot"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "50%",
            marginTop:5,
            }}>
            <DropDownPicker
              style={{borderColor: "#B7B7B7",
              height: 50}}
              open={slotOpen}
              value={slotnumber} 
              items={slot}
              setOpen={setSlotOpen}
              setValue={setSlotNumber}
              placeholder="Select PetSlot"
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

      </View>
     
    <TextInput
      label="Goal Weight"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${gW}`}
      onChangeText={(val)=> setGw(val) }
    />
    <TextInput
      label="Age"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${a}`}
      onChangeText={(val)=> setA(val) }
    />
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
        width:'57%',
      }}

      
      value={`${parseFloat(w).toFixed(2)}`}
      onChangeText={(val) => setW(val)} 
    />
    
  
    <TouchableOpacity style={{
      elevation:5,
      backgroundColor:'#FAB1A0',
      width:'40%',
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
    <View>
      <Text>Select Goal month:</Text>
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
     <TextInput
      label="Date Added"
      mode='outlined'
      activeOutlineColor='coral'
      value={moment(date).calendar()}
      disabled
    />
    <View style={{
     
      gap:2,
      justifyContent:'space-between',
      flexDirection:'row-reverse',
      marginTop:5,
      marginBottom:10,
      paddingHorizontal:10,
    }}>
     <TouchableOpacity
        style={{
          alignSelf:'center',
          flexDirection:'row',
          justifyContent:'center',
          gap:5,
        }}
        onPress = {()=> {
          navigation.goBack();
        }}
        >
         
        <Text style={{
          fontWeight:'bold',
          opacity:0.6,
          color:'red'
        }}>GO BACK TO HOME</Text>
        </TouchableOpacity>
    <View style={{
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      gap:5,
    }}>
    <Text style={{
      fontWeight:'bold',
      opacity:0.5,
    }}>See pet schedule?</Text>
    <TouchableOpacity onPress={()=>{
      setShow(true);
      getSchedule();
    }}>
    <Text style={{
      fontWeight:'bold',
      opacity:0.5,
      fontStyle:'italic',
      color:'red',
      fontWeight:'bold',
      opacity:0.7
    }}>Click here</Text>
    </TouchableOpacity>
      </View> 
   
   
    </View>


  
        </View>
     
        <View style={{
          flexDirection:'row',
          alignSelf:'center',
          gap:10,
          marginTop:10,
        }}>
        <TouchableOpacity style={{
          borderWidth:1,
          width:150,
          height:45,
          borderRadius:5,
          justifyContent:'center',
          alignItems:'center',
          borderColor:'#FAB1A0',
          flexDirection:'row',
          gap:5,
        }} onPress={()=>{
          setVisible2(true)
        }}>
          <Entypo name="trash" size={20} color="#FAB1A0" />
          <Text style={{
            color:'#FAB1A0',
            fontWeight:'bold',
            fontSize:17,
          }}>DELETE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          width:150,
          height:45,
          borderRadius:5,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#FAB1A0',
          flexDirection:'row',
          gap:5,
        }} onPress={handleUpdate}>
        <AntDesign name="edit" size={20} color="white" />
          <Text style={{
            color:'white',
            fontWeight:'bold',
            fontSize:17,
          }}>UPDATE</Text>
        </TouchableOpacity>
        </View>
        
        </View>

        <Modal isVisible={visible3} animationIn='slideInLeft' animationOut='fadeOut'>
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

        <Modal isVisible={visible} animationIn='slideInLeft'>
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
              top:-50,

            }}>
             <Image source={require('../assets/petss.png')} style={{
              width:75,
              height:140,
             }} />
            </View>
          <ActivityIndicator animating={true} color='coral' size={25} style={{
              opacity:0.8,
              position:'relative',
              left:-10,
            }}/>

          <Text style={{
              fontSize:25,
              opacity:0.9,
              position:'relative',
              left:-5,
              color:'white',
              fontWeight:'bold',
            }}>{isChange? 'Updating...':'Deleting...'}</Text>
        </View>
      </Modal>

      
      <Modal isVisible={visible2} animationIn='slideInLeft'>
        <View style={{ height:310,
        borderColor:'red',
        marginHorizontal:20,
        borderRadius:10,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.9)',
        gap:10,
        position:'relative',
        paddingBottom:20,
        paddingHorizontal:20,
        }}>
            <Image
        style={{
          width:170,
          height:170,
          opacity:0.9,
       
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      />
          <Text style={{
            fontWeight:'bold',
            color:'white',
            textAlign:'center'
          }}>Are you sure you want to delete this pet? This will also remove the feeding schedule.</Text>
          <View style={{
            flexDirection:'row',
                        justifyContent:'center',
                        alignItems:'center',
                        gap:10,
                        marginTop:10,
          }}>
          <TouchableOpacity style={{
            width:'50%',
            height:45,
            padding:10,
            borderRadius:5,
            justifyContent:'center',
            alignItems:'center',
           backgroundColor:'#FAB1A0',
          
          }} onPress={HandleDelete}>
            <Text style={{
              color:'white',
              fontWeight:'bold',
            }}>
              Yes, please
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            width:'50%',
            height:45,
            padding:10,
            borderRadius:5,
            justifyContent:'center',
            alignItems:'center',
            borderWidth:1,
           borderColor:'#FAB1A0',
          
          }} onPress={()=>{
            setVisible2(false)
          }}>
            <Text style={{
              color:'#FAB1A0',
              fontWeight:'bold',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
          </View>
         
        
        </View>
      </Modal>

      <Modal isVisible={show} animationIn='slideInLeft'>
        <View style={{ height: !petSchesData.length ? 350: 500,
        borderColor:'red',
        marginHorizontal:20,
        borderRadius:10,
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:'white',
        gap:10,
        position:'relative',
        padding:15,
        }}>
          <View style={{
            width:'100%',
            flexDirection:'row',
                justifyContent:'space-between',
                        alignItems:'center',
                        gap:10,

          }}>
          <Text style={{
          fontWeight:'bold',
          color:'black',
          textAlign:'center',
          fontSize:20,
          marginLeft:50,
         }}>
          <Text style={{
            color:'coral',
            textTransform:'capitalize'
          }}>{Petname}</Text> list of schedule.</Text>
          <TouchableOpacity onPress={()=>{
            setShow(false)
          }}>
          <AntDesign name="close" size={20} color="red" />
          </TouchableOpacity>
          </View>
     
        
         
          {!petSchesData.length ? (
            <View>
                <Image
        style={{
          width:170,
          height:170,
          opacity:0.9,
          marginLeft:30,
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      />
              <Text style={{
                fontWeight:'bold',
                color:'black',
                textAlign:'center',
                fontSize:20,
                opacity:0.5
              }}>No schedule found!</Text>

              <TouchableOpacity style={{
                marginTop:25,
                paddingHorizontal:60,
                paddingVertical:15,
                borderRadius:10,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#FAB1A0',
                flexDirection:'row', gap:5,
              }} onPress={()=>{
                navigation.replace('Sched', {petnames: Petname});
              }}>
                <MaterialIcons name="schedule" size={20} color="white" />
                               <Text style={{
                                  fontWeight:'bold',
                                  color:'black',
                                  textAlign:'center',
                                  color:'white'
                                }}>Add a schedule</Text>
              </TouchableOpacity>
            </View>
          ): (
            <>
            <View style={{
              width:'100%',
              height:370,
              paddingVertical:5,
              elevation:1,
              borderWidth:1,
            }}>

              <FlatList
              data={petSchesData}
              renderItem={({ item, index })=> {
                return ( 
                 <PetListSched {...item} handleUpdateTimeHere={handleUpdateTimeHere} updatingProccess={updatingProccess} handleRemoveSchedTimeSched={handleRemoveSchedTimeSched} handleRemoveSched={handleRemoveSched}/>
                 )
                }}
                keyExtractor={(_, i) => i.toString()}
                />

              
            </View>
             <TouchableOpacity style={{
              marginTop:5,
              paddingHorizontal:60,
              paddingVertical:15,
              borderRadius:10,
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:'#FAB1A0',
              flexDirection:'row', gap:5,
            }} onPress={()=>{
              navigation.navigate('Sched', {petnames: Petname});
            }}>
              <MaterialIcons name="schedule" size={20} color="white" />
                             <Text style={{
                                fontWeight:'bold',
                                color:'black',
                                textAlign:'center',
                                color:'white'
                              }}>Add a new schedule</Text>
            </TouchableOpacity>
            </>
          )}
      
        
        </View>
      </Modal>



        </ImageBackground> 
    
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default DetailsPage