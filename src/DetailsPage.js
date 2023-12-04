import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';
import { TextInput } from 'react-native-paper';
import { Entypo , MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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


const db = getFirestore(app);


const DetailsPage = ({route, navigation}) => {
  const {image, Weight, Gender, Age, Petname, date, DeviceName, id, GoalWeight} = route.params;
  const [visible2, setVisible2] = useState(false)
  const [loads, setloads] = useState(false)
  const [w, setW] = useState(null);
  const [a, setA] = useState(null);
  const [n, setN] = useState(null);
  const [img, setImg] = useState(null);
  const [gW, setGw] = useState(null)
  const [visible, setVisible] = useState(false);
  const [isChange, setChange] = useState(false);
  const[genders, setGender] = useState('');
  const[show, setShow] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);
  
  const [loadingWth, setLoad2] = useState(false);
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
  },[])
  const [updatingProccess, setUpdatingProccess] = useState(false);
  const onGenderOpen = useCallback(() => {

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
      console.log(schedDatas);
    
    });
    }
  


    handleFakeWeight = async () => {
      setLoad2(true);
      setW("");
      const petWeightss = doc(db, "List_of_Pets", id);
        await updateDoc(petWeightss, {
          requestWeight: true,
          Weight:"", 
          Token:0,
        }).then(()=>{
          setLoad2(true);
        })
  
    }


  handleUpdate = async () => {
    setVisible(true)
    setChange(true)
    const docUpdate = {
      Petname:n,
      Weight:w,
      Gender:genders,
      GoalWeight:gW,
      Age:a,
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



  const { control } = useForm();

  if(false){
    return (
      <PurrfectPlateLoadingScreen message={"Please wait.."} fontSize={25} />
    )
  }

  
  
  return (

    <AlertNotificationRoot theme='dark'>

  
    <SafeAreaView>
        <ImageBackground source={require('../assets/Image/FirstPage.png')}>
        <View style={{
            height:'100%',
            width:'100%',
            padding:20,
        }} >
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:10,
            marginTop:30,
        }}>
        <View style={{
            borderWidth:2,
            borderColor:'#FAB1A0',
            borderRadius:100,
            padding:2,
        }}>
        <Image
        style={{
          width:150,
          height:150,
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
            fontSize:20,
            opacity:0.5,
        }}>Hi Im,</Text>
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          gap:5,
        }}>
        <Text style={{
            fontSize:35,
            fontWeight:'bold',
            opacity:0.7,
        }}>{n}</Text>
        <MaterialCommunityIcons name="hand-wave" size={27} color="coral" />
        </View>
        </View>
        </View>
        <View style={{
          gap:5,
          marginTop:20,
        }}>
      <TextInput
      label="PetName"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${n}`}
      onChangeText={(val)=> setN(val) }
      
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
        width:'60%',
      }}

      
      value={`${w}`}
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
     <TextInput
      label="Date Added"
      mode='outlined'
      activeOutlineColor='coral'
      value={moment(date.toDate()).calendar()}
      disabled
    />
    <View style={{
      flexDirection:'row',
            alignSelf:'center',
            gap:2,
            marginTop:10,
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
        <View style={{
          borderWidth:1,
          marginVertical:10,
          opacity:0.5,
        }}></View>
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
        <TouchableOpacity
        style={{
          marginTop:20,
          alignSelf:'center'
        }}
        onPress = {()=> {
          navigation.goBack();
        }}
        >
        <Text style={{
          fontWeight:'bold',
          opacity:0.6,
        }}>GO BACK TO HOME.</Text>
        </TouchableOpacity>
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
            color:'coral'
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