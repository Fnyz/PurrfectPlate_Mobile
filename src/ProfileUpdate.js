import { View, Text , ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateEmail } from "firebase/auth";

import {getFirestore, getDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import {Image} from 'expo-image'
import {  AlertNotificationRoot, ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { userPpl } from '../userProfileImage';


const db = getFirestore(app);
const auth = getAuth(app);



const Box = React.memo(({male, female, image, handleCloseModal, pickImage, handlePickImage, click, handleSave}) => {
  
  
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
          }}>Male</Text>
          <ScrollView horizontal={true}>
            {male.map((item, i)=> {
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
          }}>Female</Text>
          <ScrollView horizontal={true}>
            {female.map((item, i)=> {
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
  


const ProfileUpdate = ({route: {params:{profile}}, navigation}) => {
   const {firstname, lastname, image, email, userId } = profile; 
 
   const [fname, setFname] = useState('');
   const [lname, setLname] = useState('');
   const [img, setImg] = useState('');
   const [eml, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [visible, setVisible] = useState(false);
   const [emls, setEmls] = useState('');
   const [change, setChange] = useState(false);
   const [prof, setProfile] = useState([]);
   const [males, setMale] = useState([]);
   const [females, setFemale] = useState([]);
   const [active, setActive] = useState(false)
   const[click, setClick] = useState(false);
   const [onShow, setOnshow] = useState(false);


   handleShowModal=()=>{
    setActive(true);
  }

  handleCloseModal=()=>{
    setActive(false);
  }

  handlePickImage = (url) => {
   setImg(url);
   setClick(true);
  }

  handleSave = () => {
    setClick(false);
    setActive(false);
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

   handleUpdateProfile = async () => {
    setOnshow(true)
     const userDt = {
        email:eml,
        firstname: fname,
        lastname: lname,
        image: img,
        username,
     }

     const dt1 = doc(db, "users", userId );
     await updateDoc(dt1, userDt);
     setOnshow(false)

     Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Youhooooo!',
      textBody: 'Profile is updated Successfully.',
      button: 'close',
      onPressButton: ()=>{
          Dialog.hide();
      }
     })

   }


   useEffect(() => {
    const getAllUsers  = async () => {

       let data = [];
       onSnapshot(doc(db, "users", userId), (doc) => {
        data.push({id: doc.id, data: doc.data()})
        });
        setProfile(data);
    }

    getAllUsers();

    
   },[])



   useEffect(()=> {


   const userDataProfiles = async () => {
        
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

 if (docSnap.exists()) {
     setFname(firstname);
     setLname(lastname);
     setImg(image);
     setEmail(email);
     setUsername(docSnap.data().username)
} else {
 // docSnap.data() will be undefined in this case
 console.log("No such document!");
}
    }

    userDataProfiles();
   },[])


   useEffect(()=>{
    const Male = userPpl.filter(item => item.category === 'Male');
    const Female = userPpl.filter(item => item.category === 'Female');

    setMale(Male);
    setFemale(Female);
  },[])
  



   handleChangeEmail = () => {
    setChange(true);
    setVisible(true);
   }

   handleSubmitMe = () => {
    setVisible(false);
    if(!visible){
        const res = prof.find(dt => dt.data.email.trim().toLowerCase() === emls.trim().toLowerCase());
        if(!res){
            updateEmail(auth.currentUser, emls.trim()).then(() => {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Youhoooooo!',
                    textBody: 'Email is successfully changed.',
                    button: 'close',
                    onPressButton: ()=>{
                        Dialog.hide();
                        setVisible(false);
                        setChange(false);
                        setEmail(eml.trim());  
                    }
                })
              }).catch((error) => {
                console.log('Something went wrong!')
              });
        }else{
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Oppps.',
                textBody: 'This email address is already used.',
                button: 'close',
            })
        }

        return;
    }
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
      gap:10,
      justifyContent:'center',
      alignItems:'center',
      marginTop:30,

    }}>
<Avatar.Image size={130} source={!img ? {uri:'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1697696967~exp=1697697567~hmac=13887cbbd1565641891255cce0e3e290196741ab7efdcb66bd2f290a6223c7da'} : {uri: img}}
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
      label="Firstname"
      mode='outlined'
      activeOutlineColor='coral'
      value={fname}
      style={{
        opacity:0.7
      }}
      onChangeText={(val)=> setFname(val)}
    />



    <TextInput
      label="Lastname"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        opacity:0.7
      }}
      value={lname}
      onChangeText={(val) => setLname(val)} 

    />
     <TextInput
      label="Username"
      mode='outlined'
      activeOutlineColor='coral'
      value={username}
      style={{
        opacity:0.7
      }}
      onChangeText={(val) => setUsername(val)} 
    />

    <View style={{
        position:'relative',
        marginVertical:5,
    }}>
    <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='coral'
      value={eml}
      style={{
        opacity:0.7
      }}
      disabled
      onChangeText={(val) => setEmail(val)} 
    />
    
    <TouchableOpacity style={{
        flexDirection:'row',
        gap:5,
        position:'absolute',
        right:10,
        top:-2,
    }} onPress={handleChangeEmail}>
        <Feather name="edit" size={15} color="#FAB1A0" />
        <Text style={{
            color:'#FAB1A0',
            fontWeight:'bold',
        }}>Change email</Text>
    
    </TouchableOpacity>
    </View>


    <View style={{
    marginTop:9,
    flexDirection:'row',
    gap:5,
    marginLeft:10,
  }}>
  <Text style={{
    color:'black',
    opacity:0.8
  }}>Do you want to change your password?</Text>
  <TouchableOpacity onPress={()=> navigation.navigate('UpdatePassword')}>
  <Text style={{
    color:'coral',
    fontWeight:'bold',
    opacity:0.9,
  }}>Click here.</Text>
  </TouchableOpacity>
  </View>


  
    <View style={{
      marginTop:20,
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
      }} onPress={handleUpdateProfile}>
        <AntDesign name="edit" size={20} color="white" />
        <Text style={{
          color:'white',
          fontWeight:'bold',
          fontSize:17,
        }}>Update</Text>
      </TouchableOpacity>
    </View>
   
    </View>

        </View>

        <Modal isVisible={onShow} animationIn='slideInLeft'>
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
            }}>Updating Profile...</Text>
        </View>
      </Modal>


      


        <Modal isVisible={change} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
            width:'100%',
            backgroundColor:'white',
            height: visible ? '26%': 190,
            padding:15,
            alignItems: visible ? 'center' : null,
        }}>

            {visible ? 
            
            <>

         <Image
        style={{
          width:100,
          height:100,
          opacity:0.9,
        }}
        source={require('../assets/KawaiDog.png')}
        contentFit="cover"
        transition={1000}
      />

            <Text style={{
                fontWeight:'bold', 
                fontSize:15,
            }}>Do you want to change your email?</Text>
            </>
          : (

<>
<Text style={{
    fontWeight:'bold',
    opacity:0.8,
    fontSize:20,
}}>Change Email Address</Text>
<Text style={{
    opacity:0.5,
    marginBottom:5,
}}>Input the email below</Text>
<TextInput
label="Email"
mode='outlined'
activeOutlineColor='coral'
placeholder='noonenero@gmail.com'
value={emls}
style={{
opacity:0.7
}}
onChangeText={(val) => setEmls(val)} 
/>

</>

            )}
         
        
           <View style={{
            marginTop:10,
            flexDirection:'row',
            gap:5,
            paddingHorizontal:3,
           }}>

           <TouchableOpacity style={{
            borderWidth:1,
            width:'50%',
            padding:10,
            justifyContent:'center',
            alignItems:'center',
            borderColor:'#FAB1A0',
            borderBottomLeftRadius:5,
           }} onPress={()=> {
            setChange(false);
            setVisible(false);
           }}>
            <Text style={{
                color:'#FAB1A0',
                fontWeight:'bold',
            }}>CANCEL</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{
            width:'50%',
            padding:10,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#FAB1A0',
            borderBottomRightRadius:5,
           }} onPress={handleSubmitMe}>
            <Text style={{
                color:'white',
                fontWeight:'bold',
            }}>{visible ? 'YES': 'CHANGE'}</Text>
           </TouchableOpacity>
           </View>
          
            
        </View>
       </Modal>

       <Modal isVisible={active} animationIn='slideInLeft' animationOut='fadeOut'>
        <Box 
        image={img}
        handleCloseModal={handleCloseModal}
        handlePickImage={handlePickImage}
        pickImage={pickImage}
        male={males}
        female={females}
        handleSave={handleSave}
        click={click}
         />
       </Modal>
    

      </ImageBackground>
      
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default ProfileUpdate