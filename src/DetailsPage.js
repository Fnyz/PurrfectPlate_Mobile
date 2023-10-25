import { View, Text, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image';
import { TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, updateDoc, getFirestore,  deleteDoc} from "firebase/firestore";
import app from './firebase';
import Modal from "react-native-modal";
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import moment from 'moment';



const db = getFirestore(app);


const DetailsPage = ({route, navigation}) => {
  const {image, Weight, Gender, Age, Petname, date, DeviceName, id, GoalWeight} = route.params;

  const [w, setW] = useState(null);
  const [a, setA] = useState(null);
  const [n, setN] = useState(null);
  const [img, setImg] = useState(null);
  const [gW, setGw] = useState(null)
  const [visible, setVisible] = useState(false);
  const [isChange, setChange] = useState(false);
  const[genders, setGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGenders] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer Not to Say", value: "neutral" },
  ]);

  useEffect(()=>{
   setW(Weight);
   setGender(Gender),
   setA(Age),
   setN(Petname);
   setImg(image)
   setGw(GoalWeight);
  },[])

  const onGenderOpen = useCallback(() => {

  }, []);


 


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

  HandleDelete = async () => {
    setVisible(true)
    setChange(true)
    try {
      await deleteDoc(doc(db, "List_of_Pets", id));
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
    } catch (error) {
      console.log('Something went wrong!');
      
    }
  }

  const { control } = useForm();
  
  
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
        <TextInput
      label="Weight"
      mode='outlined'
      activeOutlineColor='coral'
      value={`${w}`}
      onChangeText={(val)=> setW(val) }
      
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
     <TextInput
      label="Date Added"
      mode='outlined'
      activeOutlineColor='coral'
      value={moment(date.toDate()).calendar()}
      disabled
    />


       <TouchableOpacity style={{
        marginTop:12,
        marginLeft:5,
        flexDirection:'row',
        alignItems:'center',
        gap:6,
       }}>
       
       <Image
        style={{
          width:30,
          height:30,
          opacity:0.9,
          
        }}
        source={require('../assets/Image/dog-food.png')}
        contentFit="cover"
        transition={1000}
      />
        <Text style={{
          fontWeight:'bold',
          color:'red',
          opacity:0.6,
          fontSize:17,
        }}>FEED PET</Text>
       </TouchableOpacity>
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

        </ImageBackground> 
    
    </SafeAreaView>
    </AlertNotificationRoot>
  )
}

export default DetailsPage