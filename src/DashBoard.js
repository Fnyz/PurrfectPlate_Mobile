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
import { doc,  getFirestore, collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import app from './firebase';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import ListPet from './components/ListPet';




const db = getFirestore(app);
const auth = getAuth(app);

const petNotification = [
    {
        image: 'https://images.hindustantimes.com/img/2022/02/10/550x309/dog_thumb_1644498337052_1644498346070.jpg',
        name:'Puppy',
        weight:'100kg',
        message:'is over weight please do something about it',
        date:'Yesterday 150 hours ago',
    },
    {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqR4Yu6ha1FRU3v5YSyqtgKOKs1zsV_j_ssxZOQu7hAkRoUF2TZ0Q3YwZqjMzXcfZpqNk&usqp=CAU',
        name:'Saddy',
        weight:'50kg',
        message:'is over weight please do something about it',
        date:'Today 15 mins. ago',
    },
    {
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmiy9Y2-1yqILJ2wQO-5esy9mBqOK-ZkUrGA&usqp=CAU',
        name:'Pitty',
        weight:'120kg',
        message:'is over weight please do something about it',
        date:'1 hour ago',
    }
]


const DashBoard = ({navigation,route: {params: { credentials }}}) => {

  const [profile, setProfileData] = useState({});
  const [listOfPet, setListOfPet] = useState([]);
  const [search, setSearchData] = useState('');
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [visible, setVisible] = useState(false)
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }




  getUserProfile = async () => {

    onSnapshot(doc(db, "users", credentials.userId), (doc) => {
       setProfileData(doc.data());
     });
  }

  onLogOut = async () => {
    await AsyncStorage.removeItem('Credentials')
    signOut(auth).then(() => {
      navigation.replace('LoginSignUp',{
        change:false
      } )
    }).catch((error) => {
      console.log('there was an error');
    });

    
  }

  useEffect(()=>{
    getUserProfile();
  },[])




  useEffect(()=> {

    if(search.length === 0){
      
      const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", credentials.DeviceName.trim()), orderBy("Created_at", "desc"));
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
    
  },[search])

  

 

  useEffect(()=>{
   
  const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", credentials.DeviceName.trim()), orderBy("Created_at", "desc"));
   onSnapshot(q, (querySnapshot) => {
  const data = [];
  querySnapshot.forEach((docs) => {
      data.push({dt:docs.data(), id: docs.id});
      console.log(docs.data());
  });
  
  setListOfPet(data);
  
});
  },[])




  


  return (
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
     
      <Searchbar
      placeholder="Search"
      style={{
        marginTop:10,
      }}
      value={search}
      onChangeText={(val) => setSearchData(val)}
    />
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
      <TouchableOpacity >
      <Text style={{
        opacity:0.5
      }}>See all</Text>
      </TouchableOpacity>
  
    </View>
    <View style={{
        marginTop:7,
        height:230,
    }}>
       
<Button title="Play Sound" onPress={playSound} />
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

         {petNotification.map((item, i)=> {
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
            gap:5
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
    </SafeAreaView>
  )
}



export default DashBoard