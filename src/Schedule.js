import { View, Text, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, TextInput} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { AntDesign, Feather} from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, getFirestore, query, onSnapshot, where, doc, updateDoc, deleteDoc} from "firebase/firestore"; 
import app from './firebase';
import {  AlertNotificationRoot, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import Modal from 'react-native-modal';
import {Image} from 'expo-image'
import PetListSched from './components/PetListSched';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dimensions} from 'react-native';




const db  = getFirestore(app);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Schedule = ({navigation}) => {

  
  const [openPetName, setPetOpen] = useState(false);
  const [petNameVal, setPetnameValue] = useState(null);
  const [day, setDay] = useState('Everyday');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [caps, setCaps] = useState('');
  const [petData, setPetData] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showModal, setModal] = useState(false);
  const [petSchesData, setPetSchedDataset] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [timeOnly, setTimeOnly] = useState('');
  const [company, setComapny] = useState([]);
  const [updatingProccess, setUpdatingProccess] = useState(false);
  const [click, setClick] = useState(false);



  
  


  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }

  const getAllDatas = () => {
    const q = query(collection(db, "feeding_schedule"));
   onSnapshot(q, (querySnapshot) => {
  const dt = [];
  querySnapshot.forEach((doc) => {
      dt.push({data:doc.data(), id: doc.id});
  });
  
  setPetData(dt);
});
  }

  const getAllNameOfPets = () => {
    const q = query(collection(db, "List_of_Pets"));
   onSnapshot(q, (querySnapshot) => {
  const forPetName = [];
  querySnapshot.forEach((doc) => {
    forPetName.push({label:doc.data().Petname, value: doc.data().Petname});
  });
  
  setComapny(forPetName)
});
  }


  useEffect(()=>{
    getAllDatas();
    getAllNameOfPets();
  },[])


  const closeModals = () => {
    setModal(false);
    
  }


  handleSeePetSchedule = () => {
   setModal(true);
   getSchedule(petNameVal);
  }

  const getUserData = async () => {
    const jsonValue = await AsyncStorage.getItem('Credentials');
    const credential = JSON.parse(jsonValue);
    setDeviceName(credential.DeviceName.trim());
  }

  useEffect(()=> {
    getUserData();
  },[])





  const handleRemoveSchedTimeSched = async (time, days) => {
    setUpdatingProccess(true)
    const a = petSchesData.find((d) => d.data.Days === days && d.data.DeviceName === deviceName)
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


   
  const handleUpdateTimeHere = (days, time, cups, currenTime) => {
    setUpdatingProccess(true)
    const a = petSchesData.find((d) => d.data.Days === days && d.data.DeviceName === deviceName)
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



  handleSetPetSched = async () => {
   
    const petSchedule = {
      Petname: petNameVal,
      Days: day,
      DeviceName: deviceName.trim(),
      ScheduleTime: foodItems,
      synced:false,
    }

    setVisible(true);

    if(!petNameVal || !day || !foodItems.length){
      setVisible(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: 'Please provide all fields.',
        button: 'close',
      })
      return;
    }


    const res = petData.find(d => d.data.Days.toLowerCase().trim() === day.toLowerCase().trim() && d.data.DeviceName.toLowerCase().trim() === deviceName.toLowerCase().trim());

       if(!res){
        const docRef = await addDoc(collection(db, "feeding_schedule"), petSchedule);
        if(docRef.id){
          setPetnameValue('');
          setVisible(false);
          setDay('Everyday');
          setFoodItems([])
          await addDoc(collection(db, "Task"),{
            type:'Schedule',
            deviceName: deviceName,
            document_id: docRef.id,
            request:null,
          });
          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'SUCCESS',
            textBody: 'Schedule is added successfully.',
            button: 'close',
          })
        }
        return;
       }


       const currentSched  = res.data.ScheduleTime || [];
       const updatedSched = [...currentSched, ...foodItems];
       const docRef = doc(db, 'feeding_schedule', res.id);
       updateDoc(docRef, {
         ScheduleTime:updatedSched,
      }).then(()=>{
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'SUCCESS',
          textBody: 'Schedule on that day is updated successfully.',
          button: 'close',
        })
        setPetnameValue('');
        setVisible(false);
        setDay('Everyday');
        setFoodItems([])
      });
      return;    
  }

  
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime !== undefined) {
      // Handle the selected time, for example, update state with the selected time.
      setTime(selectedTime);
     


      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      // Create the formatted time string
      const formattedTimeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      setFormattedTime(formattedTimeString);
      setTimeOnly(formattedTimeString.split(" ")[0]);


 
    }
  };


  const addFoodItem = () => {
    if (!caps|| !formattedTime) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: 'Please provide the time or the cups, thank you!',
        button: 'close',
      })
      // Prevent adding empty entries
      return;
    }

    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
   
  
  

   //trace if that schedule is already exists
    const res  = petData.find(d => d.data.Days === day.trim() && d.data.DeviceName === deviceName);
      const exist = res.data.ScheduleTime.find(a => timeToMinutes(a.time) === timeToMinutes(timeOnly) && a.parameters.toLowerCase().trim() ===  formattedTime.split(" ")[1].toLowerCase().trim() );
  
    if(exist){
    
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Warning!',
            textBody: `Time ${formattedTime} already set on the pet schedule, please choose other time.`,
            button: 'close',
          })
          return;
  
    }

    // Check if the time already exists in the list
    const existingItem = foodItems.find((item) => item.time.split(' ')[0] === formattedTime.split(' ')[0]);
    if (existingItem) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Warning!',
        textBody: `Time ${formattedTime} already exists. Remove the existing entry first.`,
        button: 'close',
      })
      return;
    }

    // Add the new food item and time to the list
    setFoodItems([...foodItems, { time: formattedTime.split(' ')[0], cups: caps, parameters: formattedTime.split(' ')[1].trim() }]);
    setCaps('');  
    setFormattedTime('');
  };


  const removeFoodItem = (selectedTime, parameters) => {

    setFoodItems(foodItems.filter((item) => `${item.time} ${item.parameters}` !== `${selectedTime.trim()} ${parameters}`));
    setFormattedTime("");
  };








  const days = [
    {day: 'Monday'},
    {day: 'Tuesday'},
    {day: 'Wednesday'},
    {day: 'Thursday'},
    {day: 'Friday'},
    {day: 'Saturday'},
    {day: 'Sunday'},
    {day:'Everyday'},
  ]


 const getSchedule = (name) => {
  const q = query(collection(db, "feeding_schedule"), where("Petname", "==", name));
  onSnapshot(q, (querySnapshot) => {
    const schedDatas = [];
    querySnapshot.forEach((doc) => {
        schedDatas.push({data:doc.data(), id:doc.id});
    });
    setPetSchedDataset(schedDatas);
  });
  }

 
  useEffect(()=> {

    const isSchedule = () => {
    const res = petData.find(d => d?.data.Petname?.toLowerCase().trim() === petNameVal?.toLowerCase().trim());
    if(!res){
      setShow(false);
      return;
    }
    setShow(true);
    
    }

    isSchedule();

  },[petNameVal])


  handleSetDays = (day) => {
    setDay(day);
  }
 
  const [loading, setLoading] = useState(false);


  const {control } = useForm();




  
  


  return (

    <AlertNotificationRoot theme='dark'>

    <SafeAreaView>
      <ImageBackground source = {require('../assets/Image/FirstPage.png')}
      style={{
        width:'100%',
        height:'100%',
        
      }}
      >
        <View style={{
          padding:10,
          height:'100%',
          width:'100%',          
        }}>

          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            marginBottom:10,
            marginTop:10,
            width:'100%',
          }}>
            <Text style={{
              fontSize:30,
              fontWeight:'bold',
              color:'black',
            }}><Text style={{
              color:'coral',
              fontSize:35,
            }}>|</Text> Scheduler</Text>
            <View style={{
              padding:2,
              marginRight:5,
              borderRadius:50,
              width:35,
              height:35,
              justifyContent:'center',
              alignItems:'center',
              backgroundColor:'white',
              elevation:3,
            }}>
            <TouchableOpacity onPress={handleOpenDrawer}>
              {isDrawerOpen ? (
                <AntDesign name="close" size={20} color="black" />
                ): (
                  <Entypo name="menu" size={24} color="black" />
                  )}
            </TouchableOpacity>
            </View>
          </View>
          
      <Text style={{
        marginVertical:3,
        marginLeft:5,
        opacity:0.5,
        fontWeight:'bold',
      }}>Pet name</Text>
      <Controller
        name="company"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{
            marginBottom: 15,
          }}>
            <DropDownPicker
              style={{
                borderColor: "#FAB1A0",
                height: 50,
                width:'100%'
              }}
              open={openPetName}
              value={petNameVal} //petNameVal
              items={company}
              setOpen={setPetOpen}
              setValue={setPetnameValue}
              setItems={setComapny}
              placeholder="Select pet"
              placeholderStyle={{
                color: "grey",
              }}
              loading={loading}
              activityIndicatorColor="#5188E3"
              searchable={true}
              searchPlaceholder="Search your pet here..."
              
              onChangeValue={onChange}
              zIndex={1000}
              zIndexInverse={3000}
              />
          </View>
        )}
        />

      <Text style={{
        marginVertical:5,
        marginLeft:5,
        fontWeight:'bold',
        fontSize:25,
      }}>Set schedule</Text>
      <Text
      style={{
        marginLeft:5,
        opacity:0.5,
      }}
      >Days:</Text>
      <View style={{
        alignSelf: 'center',
        marginTop:5,
        height:180,
      }}>
       <FlatList
        data={days}
        renderItem={({ item, index })=> {
          return (
            <TouchableOpacity
            style={{
              justifyContent:'center',
              alignItems:'center',
              margin:7,
              width:100,
              width:index === days.length -1 ? 212: 100,
              borderRadius:5,
              elevation:5,
              backgroundColor:'#FAB1A0',
              opacity:item.day === day ? 1:0.5,
            }}
            
            onPress={()=> handleSetDays(item.day)}
            >
            <Text style={{
              fontSize:20,
              fontWeight:'bold',
              color:'white',
              padding:10,
            }}>{item.day === "Everyday" ? item.day : item.day.slice(0,3).trim()}</Text>
          </TouchableOpacity>
           )
          }}
          numColumns={3}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{
            justifyContent:'space-between',
            
          }}
          />
      </View>
      <Divider style={{
        borderWidth:1,
        borderColor:'gray',
        marginTop:10,
        width:'95%',
        alignSelf:'center',
        opacity:0.5,
      }} />

        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center',
          marginHorizontal:10,
          marginTop:10,
          
        }}>


          <Text style={{
            opacity:0.6,
          }}>Time:</Text>
          {show && (
          <TouchableOpacity onPress={handleSeePetSchedule}>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            gap:3,
          }}>
          <AntDesign name="eye" size={22} color="#FAB1A0" />
          <Text style={{
            opacity:0.5,
          }}>Pet Schedule</Text>
          </View>
          </TouchableOpacity>
          )}
        </View>

        <View style={{
          padding:5,
          width:'100%',
          height:windowHeight,
          alignItems:'center',
          flexDirection:'column',
        }}>
    
      <View style={{
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        gap:5,
        marginTop:2,
      
        
      }}>
      <TouchableOpacity style={{
        width:'40%',
        height:49,
        backgroundColor:'#FAB1A0',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        alignItems:'center',
        justifyContent:'center',
        marginTop:6,
        flexDirection:'row',
        gap:5,
      }} 
      onPress={() => setShowTimePicker(true)}
      >
        <Ionicons name="time-outline" size={24} color="white" />
        <Text style={{
          fontWeight:'bold',
          fontSize:20,
          color:'white',
        }}>Time</Text>
      </TouchableOpacity> 
      <TextInput
      label="Time selected"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:'60%',
        fontWeight:'bold',
      }}
      disabled
      outlineColor='#FAB1A0'
      selectionColor='#FAB1A0'
      value={formattedTime}
      /> 
      
      </View>

      {showTimePicker && (
        <DateTimePicker
        testID="timePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onTimeChange}
        />
      )}

    <TextInput
      label="Input food cups"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:'100%',
      }}
      outlineColor='#FAB1A0'
      selectionColor='#FAB1A0'
      value={caps}
      onChangeText={(val)=> setCaps(val)}
      /> 

      <TouchableOpacity style={{
        marginTop:5,
        backgroundColor:'#FAB1A0',
        borderRadius:5,
        elevation:3,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        flexDirection:'row',
        alignSelf:'center',
        gap:5
      }} onPress={addFoodItem}>
            <Text style={{
              color:'white',
              fontWeight:'bold',
              fontSize:15,
            }}>SET TIME & CUPS</Text>
          </TouchableOpacity>
          <View style={{
          marginTop:10,
          paddingHorizontal:10,
          height:'15%',
          borderRadius:5,
          elevation:3,
          backgroundColor:'white',
          width:'100%',
          alignSelf:'center',
        }}>
        {!foodItems.length ?
        <View style={{
          justifyContent:'center',
          height:'100%',
          alignItems:'center',
        }}>
          <Text style={{
            fontWeight:'bold',
            fontSize:15,
            opacity:0.5,
          }}>Add pet Time and Cups now!</Text>
        </View> 
        
        : 
        <FlatList
        data={foodItems}
        renderItem={({ item, index })=> {
          return (
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
              margin:7,
              width:322,
              height:50,
              paddingHorizontal:20,
              borderRadius:5,
              elevation:5,
              backgroundColor:'#9998CB',
              opacity:0.8,
            }}>
              <Text style={{
                fontSize:17,
                color:'white'   
              }}>
                {`${item.time} ${item.parameters}`}
              </Text>
              <Text style={{
                fontSize:30, 
                fontWeight:'bold',
                color:'white'
              }}>
                /
              </Text>
              <Text
              style={{
                fontSize:17, 
                color:'white'
              }}
              >
                {item.cups} cups
              </Text>
              <TouchableOpacity onPress={()=>removeFoodItem(item.time, item.parameters)}>
              <Feather name="x" size={24} color="white"/>
              </TouchableOpacity>
            </View>
           )
          }}
          keyExtractor={(_, i) => i.toString()}
          />
          
          
          
        }
        </View>

        <View style={{
          marginTop:15,
          flexDirection:'row',
          gap:10,
          justifyContent:'center',
          alignItems:'center',
        }}>

        <TouchableOpacity style={{
          backgroundColor:'#FAB1A0',
          borderRadius:5,
          elevation:3,
          height:50,
          justifyContent:'center',
            alignItems:'center',
            width:'40%',
            flexDirection:'row',
            gap:5
          }} onPress={handleSetPetSched}>
           
            <MaterialIcons name="schedule" size={20} color="white" />
            <Text style={{
              color:'white',
              fontWeight:'bold',
              fontSize:15,
            }}>SET</Text>
         
          
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderRadius:5,
            elevation:3,
            backgroundColor:'white',
            height:50,
            justifyContent:'center',
            alignItems:'center',
            width:'40%',
            flexDirection:'row',
            gap:5
          }}>
            <Ionicons name="arrow-back-outline" size={20} color="#FAB1A0" />
            <Text style={{
              color:'#FAB1A0',
              fontSize:15,
              fontWeight:'bold',
            }}>Go back</Text>
          </TouchableOpacity>
         
        </View>

    </View>


       
        </View>

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
            }}>Add pet schedule .</Text>
        </View>
      </Modal>

      <Modal isVisible={showModal} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
          width:'100%',
          backgroundColor:'#FFFFFF',
          height:'80%',
          padding:5,
        }}>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between'
          }}>
          <Text style={{
            marginTop:10,
            marginBottom:10,
            marginLeft:10,
          }}><Text style={{
            color:'coral',
            fontWeight:'bold',
            fontSize:25,
          }}>/</Text> <Text style={{
            fontWeight:'bold',
            fontSize:25,
          }}>{petNameVal}'s</Text> set schedules</Text>
          <TouchableOpacity onPress={closeModals}>
            <Feather name="x" size={25} color="red" style={{
              marginRight:7,
              marginTop:10,
              marginBottom:5,
          
            }}/>
          </TouchableOpacity>
          </View>
         
          <View>
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
        </View>
       </Modal>
      </ImageBackground>
    </SafeAreaView>
  </AlertNotificationRoot>
  )
}

export default Schedule