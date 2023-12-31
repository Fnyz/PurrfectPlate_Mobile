import { View, Text, FlatList, Dimensions, TouchableOpacity, Button} from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import NotificationList from './components/notificationList';
import PetList from './components/PetList';
import Swiper from 'react-native-swiper'
import { useDrawerStatus } from '@react-navigation/drawer';
import { doc,  getFirestore, collection, query, where, onSnapshot , orderBy, updateDoc} from "firebase/firestore";
import app from './firebase';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import ListPet from './components/ListPet';
import PurrfectPlateLoadingScreen from './components/PurrfectPlateLoadingScreen';
import {useForm, Controller, set} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import NotifComponent from './components/NotifComponent';
import { useTimer } from './GlobalContext';
import { AlertNotificationRoot } from 'react-native-alert-notification';




const db = getFirestore(app);
const auth = getAuth(app);



const DashBoard = ({navigation,route: {params: { credentials }}}) => {
  const { setCredentials } = useTimer();
  const [profile, setProfileData] = useState({});
  const [listOfPet, setListOfPet] = useState([]);
  const [listOfPet1, setListOfPet1] = useState([]);
  const [search, setSearchData] = useState('');
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [loading, setLoading ] =useState(false)
  const [visible, setVisible] = useState(false)
  const [forFilter, setForFilter] = useState(false)
  const [forSeach, setForSeach] = useState(false)
  const [hide, setHidden] = useState(true)
  const [gender, setGenders] = useState([
    { label: "", value: "" },
  ]);

  const [showNotif, setShowNotif] = useState(false)
  const [notif, setNotifications] = useState([]);
  const [notifAll, setNotificationsAll] = useState([]);


  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("deviceName", "==", credentials.DeviceName.trim()),
      where("type", "==", "User"),
      where("hasSeen", "==", false),
      orderBy("createdAt", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotificationsData = new Map();
  
      querySnapshot.forEach((doc) => {
        const petName = doc.data().pet_name;
        const createdAt = doc.data()?.createdAt?.toDate();
        const hasSeen = doc.data().hasSeen;
  
        if (!petName) {
          const usersQuery = query(
            collection(db, "users"),
            where("username", "==", "Admin")
          );
  
          onSnapshot(usersQuery, (usersQuerySnapshot) => {
            usersQuerySnapshot.forEach((userDoc) => {
              newNotificationsData.set(doc.id, {
                name: userDoc.data().username,
                weight: null,
                deviceName:credentials.DeviceName.trim(),
                message: doc.data().Messages,
                image: userDoc.data().image,
                hasSeen,
                id: doc.id,
                createdAt,
              });
            });
  
            // Update state
            setNotifications([...newNotificationsData.values()]);
            AsyncStorage.setItem("notifications", JSON.stringify([...newNotificationsData.values()]));
          });
        }
  
        const listOfPetsQuery = query(
          collection(db, "List_of_Pets"),
          where("DeviceName", "==", credentials.DeviceName.trim()),
          where("Petname", "==", petName || null)
        );
  
        onSnapshot(listOfPetsQuery, (petsQuerySnapshot) => {
          petsQuerySnapshot.forEach((petDoc) => {
            newNotificationsData.set(doc.id, {
              name: petDoc.data().Petname,
              weight: petDoc.data().Weight,
              deviceName:credentials.DeviceName.trim(),
              message: doc.data().Messages,
              image: petDoc.data().image,
              hasSeen,
              id: doc.id,
              createdAt,
            });
          });
          
          // Update state
          setNotifications([...newNotificationsData.values()]);
          AsyncStorage.setItem("notifications", JSON.stringify([...newNotificationsData.values()]));
        });
      });
    });
  
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("deviceName", "==", credentials.DeviceName.trim()),
      where("type", "==", "User"),
      where("hasSeen", "==", true),
      orderBy("createdAt", "desc")
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotificationsData = new Map();
  
      querySnapshot.forEach((doc) => {
        const petName = doc.data().pet_name;
        const createdAt = doc.data()?.createdAt?.toDate();
        const hasSeen = doc.data().hasSeen;
  
        if (!petName) {
          const usersQuery = query(
            collection(db, "users"),
            where("username", "==", "Admin")
          );
  
          onSnapshot(usersQuery, (usersQuerySnapshot) => {
            usersQuerySnapshot.forEach((userDoc) => {
              newNotificationsData.set(doc.id, {
                name: userDoc.data().username,
                weight: null,
                deviceName:credentials.DeviceName.trim(),
                message: doc.data().Messages,
                image: userDoc.data().image,
                hasSeen,
                id: doc.id,
                createdAt,
              });
            });
  
            // Update state
            setNotificationsAll([...newNotificationsData.values()]);
          
          });
        }
  
        const listOfPetsQuery = query(
          collection(db, "List_of_Pets"),
          where("DeviceName", "==", credentials.DeviceName.trim()),
          where("Petname", "==", petName || null)
        );
  
        onSnapshot(listOfPetsQuery, (petsQuerySnapshot) => {
          petsQuerySnapshot.forEach((petDoc) => {
            newNotificationsData.set(doc.id, {
              name: petDoc.data().Petname,
              weight: petDoc.data().Weight,
              deviceName:credentials.DeviceName.trim(),
              message: doc.data().Messages,
              image: petDoc.data().image,
              hasSeen,
              id: doc.id,
              createdAt,
            });
          });
          
          // Update state
          setNotificationsAll([...newNotificationsData.values()]);
        
        });
      });
    });
  
    return unsubscribe;
  }, []);


 

    
  
  
  const [genderOpen, setGenderOpen] = useState(false);
  const[Gender, setGender] = useState('all');

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }




  const handleSeeAllNotification = () => {
    
    if(notif.length){
 const updateNotifications = async (notif) => {
  try {
    const updatePromises = notif.map(a => {
      const docRef = doc(db, 'notifications', a.id);

      // Update the document with the new data
      return updateDoc(docRef, { hasSeen: true })
        .then(() => {
          console.log(`Document updated successfully: ${a.id}`);
        })
        .catch((error) => {
          console.error(`Error updating document: ${a.id}`, error);
        });
    });

    // Wait for all promises to resolve
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating documents:', error);
  }
};

updateNotifications(notif);

    }
  
  setNotifications([]);
   
    setShowNotif(true);

  }
  getUserProfile = async () => {

    onSnapshot(doc(db, "users", credentials.userId), (doc) => {
       setProfileData(doc?.data());
     });
  }

  onLogOut = async () => {
    await AsyncStorage.removeItem('Credentials')
    signOut(auth).then(() => {
      navigation.replace('LoginSignUp',{
        change:false
      } )
      setCredentials({});
    }).catch((error) => {
      console.log('there was an error');
    });

    
  }

  useEffect(()=>{
    getUserProfile();
  },[])


  useEffect(()=> {
    const getPettypes = async () => {
      const user = await AsyncStorage.getItem("Credentials");
     
      const datas = JSON.parse(user);
      setCredentials(datas);
      if(user){
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas?.DeviceName.trim()));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach((docs) => {
           data.push({dt:docs.data(), id: docs.id});
       });
       
       setListOfPet1(data);
       const a = [ "All", ...Array.from(new Set(data.map(d => d.dt.petType)))];
       const b = a.map(c => {
        return {
          label:c.toUpperCase(),
          value: c.toLowerCase()
        }
       })       

       setGenders(b);
       
     });
        return;
      }
    }

    getPettypes();
  }, [])






  useEffect(()=> {
  
    if(search.length === 0){
      
      if(Gender === "all"){
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", credentials.DeviceName?.trim()), orderBy("Created_at", "desc"));
        onSnapshot(q, (querySnapshot) => {
       const data = [];
       querySnapshot.forEach((docs) => {
           data.push({dt:docs.data(), id: docs.id});
       });
       
       setListOfPet(data);
       
     });
        return;
      }

      const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", credentials.DeviceName?.trim()),where("petType", "==", Gender.trim()) , orderBy("Created_at", "desc"));
      onSnapshot(q, (querySnapshot) => {
     const data = [];
     querySnapshot.forEach((docs) => {
         data.push({dt:docs.data(), id: docs.id});
    
     });
     
     setListOfPet(data);
     
   });
      return;
    };
    const pets = [...listOfPet];
    const result = pets.filter((ds) => {
      if(ds.dt.Petname.trim().toLowerCase().includes(search.toLowerCase().trim())){
        return ds;
      }
    })

    setListOfPet(result);
    
  },[search, Gender])

  

 

  useEffect(()=>{
     setLoading(true);
     setTimeout(() => {
      setLoading(false)
     }, 3000);
  const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", credentials.DeviceName.trim()), orderBy("Created_at", "desc"));
   onSnapshot(q, (querySnapshot) => {
  const data = [];
  querySnapshot.forEach((docs) => {
      data.push({dt:docs.data(), id: docs.id});
   
  });
  
  setListOfPet(data);
  
});
  },[])


  const onGenderOpen = useCallback(() => {

  }, []);

 


 


  const { control } = useForm();
 


  if(loading){
    return (
      <PurrfectPlateLoadingScreen message={"WELCOME TO PURRFECT PLATE"} fontSize={20} />
    )
  }





 


  return (
    <AlertNotificationRoot theme='dark'>

    <SafeAreaView style={{
      flex:1,
      position:'relative'
    }}>
      <View
      style={{
        marginHorizontal:15,
        paddingTop:15,
      }}
      >
        <View>
     
        </View>
        <View style={{
          justifyContent:'space-between',
          flexDirection:'row',
        }}>
        <View style={{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
       
      }}>

<View style={{
          position:'relative'
        }}>
          
    <View style={{
        borderRadius:50,
        padding:2,
        borderColor:'#FAB1A0',
        borderWidth:1,
    }}>
    <Image
        style={{
          width:75,
          height:75,
          opacity:0.9,
          borderRadius:50,
        }}
        source={{uri:profile.image}}
        contentFit="cover"
        transition={1000}
      />
    </View>


    <TouchableOpacity onPress={()=> navigation.navigate('UpdateProfile',{profile})}>
    <View style={{
      position:'absolute',
      bottom:1,
      right:0,
      height:24,
      backgroundColor:'#FAB1A0',
      padding:5,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:100,
      elevation:3,
    }}>
    <FontAwesome name="pencil-square-o" size={15} color="white"  />
    </View>
    </TouchableOpacity>

    </View>
     
      <View>
        <Text style={{
            opacity:0.6
        }}>Welcome user</Text>
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            gap:5,
           
        }}>
        <Text style={{
            fontWeight:'bold',
            fontSize:30,
            opacity:0.7
        }}>{profile.username}</Text>
        <MaterialCommunityIcons name="hand-wave" size={24} color="#FAB1A0" />
   
        </View>
        
      </View>
      
      </View>
      <View>

      </View>
      <View style={{
       flexDirection:'row',
       gap:5,
       justifyContent:'center',
       alignItems:'center',
      }}>
         <TouchableOpacity onPress={onLogOut}>
         <AntDesign name="logout" size={23} color="black" style={{
          opacity:0.6,
          fontWeight:'bold',
        }} />
       </TouchableOpacity>

        <Text style={{
          fontSize:35,
          color:'#FAB1A0',
          fontWeight:'bold',
        }}>/</Text>
        <TouchableOpacity onPress={()=> 
        handleOpenDrawer()
       
        }>
        {isDrawerOpen ? (
          <Ionicons name="close" size={30} color="black"  style={{
            opacity:0.7,
            backgroundColor:'white',
            borderRadius:50,
            width:40,
            height:40,
            paddingLeft:5,
            paddingTop:3,
            elevation:3,
          }} />
        ): (
          <Ionicons name="md-menu" size={30} color="black" 
          style={{
          opacity:0.7,
          backgroundColor:'white',
          borderRadius:50,
          width:40,
          height:40,
          paddingLeft:5,
          paddingTop:3,
          elevation:3,
   
        }}
        />
        )}
        </TouchableOpacity>
      
      </View>
        </View>
        {hide && (
   <View style={{
    width:'100%',
    padding:2,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:10,
    marginTop:15,
  }}>
    <TouchableOpacity style={{
 
      width:'50%',
      paddingHorizontal:20,
      paddingVertical:15,
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      borderTopLeftRadius:10,
      borderBottomLeftRadius:10,
      backgroundColor:'#FAB1A0',
      gap:6,
    }} onPress={()=> {
      setForFilter(true);
      setHidden(false);
    }}>
      <Ionicons name="filter" size={20} color="white" />
      <Text style={{
        color:'white',
        fontWeight:'bold',
      }}>FILTER BY TYPE</Text>
    </TouchableOpacity>
    <TouchableOpacity  style={{
 
 width:'50%',
 paddingHorizontal:20,
 paddingVertical:15,
 justifyContent:'center',
 alignItems:'center',
 flexDirection:'row',
 borderTopRightRadius:10,
 borderBottomRightRadius:10,
 backgroundColor:'#FAB1A0',
 gap:6,
}} onPress={()=> {
  setForSeach(true);
  setHidden(false);
}}><AntDesign name="search1" size={20} color="white" />
      <Text  style={{
        color:'white',
        fontWeight:'bold',
      }}>SEARCH PET</Text>
    </TouchableOpacity>
  </View>
        )}



         
      {forFilter && (
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
          padding:2,
          gap:8,
          marginTop:10,
        }}>
  <Controller
        name="gender"
        defaultValue=""
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={{ 
            width: "88%",
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
              placeholder="Filter by type"
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

  <TouchableOpacity style={{
    width:'12%',
    elevation:2,
    paddingVertical:12,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:'#FAB1A0'
  }} onPress={()=>{
    setHidden(true);
    setForFilter(false);
  }}>
  <AntDesign name="close" size={24} color="white" />
  </TouchableOpacity>
        </View>
  )}
    



     
      {forSeach && (
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          width:'100%',
          padding:2,
          gap:8,
          marginTop:10,
        }}>
  <Searchbar
  placeholder="Search"
  style={{

    width:'90%'
  }}
  value={search}
  onChangeText={(val) => setSearchData(val)}
/>
  <TouchableOpacity style={{
    width:'12%',
    elevation:2,
    paddingVertical:12,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:'#FAB1A0'
  }} onPress={()=>{
    setHidden(true);
    setForSeach(false);
  }}>
  <AntDesign name="close" size={24} color="white" />
  </TouchableOpacity>
        </View>
  )}
    
    <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:15,
        alignItems:'center'
    }}>
      <Text style={{
        fontSize:20,
        fontWeight:'bold',
        opacity:0.6
      }}>
        Notification
      </Text>
      <TouchableOpacity onPress={()=> handleSeeAllNotification()}>
      <Text style={{
        opacity:0.5
      }} >See all</Text>
      </TouchableOpacity>
  
    </View>
    <View style={{
        marginTop:7,
        height:230,
    }}>
       
        {!notif.length ? (
          <View style={{
            justifyContent:'center',
            alignItems:'center',
            marginTop:10,
          }}>
             <Image
        style={{
          width:150,
          height:150,
          opacity:0.9,
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      />
            <Text style={{
              fontWeight:'bold',
              fontSize:15,
            }}>No notification found!</Text>
          </View>
        ): (
         <Swiper 
          autoplay 
          loop
          showsButtons
        
          activeDot={
            <View
              style={{
                backgroundColor: '#908EDF',
                width: 8,
                height: 8,
                borderRadius: 4,
                marginLeft: 3,
                marginRight: 3,
                marginTop: 3,
                marginBottom: 3
              }}
            />
          }
          >

         {notif.slice(0, 3).map((item, i)=> {
            return (
<View style={{
                    width:360,
                    marginRight:15,
                    height:220,
                    borderRadius:10,
                    backgroundColor:'#FAB1A0',
                    position:'relative',
                    elevation:1
                }} key={i}>
                    <NotificationList {...item} navigation={navigation}/>
                    <View
                    style={{
                       
                        width:20,
                        height:20,
                        borderRadius:50,
                        position:'absolute',
                        top:10,
                        right:13,
                        backgroundColor:'white',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.30,
                        shadowRadius: 4.65,
    
    elevation: 8,
                    }}
                    ></View>
                </View>
            )
         })}
         
  </Swiper>
        )}
   
    </View>

    <View style={{
        width:'100%',
        borderWidth:1,
        opacity:0.2,
        marginTop:5,
    }}></View>
    <View style={{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:5,
        marginTop:7,
        alignItems:'center',
        marginBottom:5,
    }}>
        <Text
        style={{
            fontSize:20,
            fontWeight:'bold',
            opacity:0.6
        }} 
        >List of Pet</Text>
        <TouchableOpacity onPress={()=> setVisible(true)}>
        <Text style={{
            opacity:0.5
        }}>See all</Text>
          </TouchableOpacity>
    </View>
       <View style={{
       height:330,
       }}>

        

        {!listOfPet.length  && 
        <View style={{
          justifyContent:'center',
          alignItems:'center',
        }}>
          <Image
        style={{
          width:250,
          height:250,
          opacity:0.9,
          borderRadius:50,
        }}
        source={require('../assets/Doggy1.png')}
        contentFit="cover"
        transition={1000}
      />
      <Text style={{
        fontSize:20,
        fontWeight:'bold',
      }}>No pets found!</Text>
        </View>
        }
        {listOfPet && 
        <FlatList
        data={listOfPet}
        renderItem={({item})=> {
           return (
            <PetList {...item} navigation={navigation}/>
           )
        }}
        numColumns={2}
        contentContainerStyle={{
            justifyContent:'space-between',
            alignItems:'center',
            gap:5,
            width:'100%',
       
        }}
      />
      
        }
       
       </View>
      </View>

      <Modal isVisible={visible} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
          flex:1,
          backgroundColor:'white',
          padding:'auto',
        }}>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:5,
          }}>
          <Text style={{
            fontSize:22,
            fontWeight:'bold',
            opacity:0.7
          }}><Text style={{
            color:'coral',
            fontSize:25,
            fontWeight:'bold'
          }}>|</Text> List of Pets</Text>
          <TouchableOpacity onPress={()=> setVisible(false)}>
          <AntDesign name="close" size={24} color="red" />    
          </TouchableOpacity>
          </View>
          <FlatList
        data={listOfPet}
        renderItem={({item})=> {
           return (
            <ListPet {...item} navigation={navigation} setVisible={setVisible}/>
           )
        }}
        numColumns={1}
        contentContainerStyle={{
            justifyContent:'space-between',
            alignItems:'center',
            gap:5
        }}
      />
        </View>
       </Modal>

       <Modal isVisible={showNotif} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
          flex:1,
          backgroundColor:'white',
          padding:10,
        }}>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            padding:5,
          }}>
          <Text style={{
            fontSize:22,
            fontWeight:'bold',
            opacity:0.7
          }}><Text style={{
            color:'coral',
            fontSize:25,
            fontWeight:'bold'
          }}>|</Text> List of Notifications</Text>
          <TouchableOpacity onPress={()=> {
            setShowNotif(false);
            setNotifications([]);
          }}>
          <AntDesign name="close" size={24} color="red" />    
          </TouchableOpacity>
          </View>
          <FlatList
        data={notifAll}
        renderItem={({item})=> {
           return (
            <NotifComponent {...item} navigation={navigation} setVisible={setVisible}/>
           )
        }}
        numColumns={1}
        contentContainerStyle={{
            justifyContent:'space-between',
            alignItems:'center',
            gap:5,
            paddingBottom:10,
        }}
      />
        </View>
       </Modal>
    </SafeAreaView>
    
    </AlertNotificationRoot>
  )
}



export default DashBoard