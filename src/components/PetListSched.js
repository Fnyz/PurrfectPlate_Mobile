import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { EvilIcons, FontAwesome, Ionicons  } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import {TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const PetListSched = ({data, handleUpdateTimeHere, updatingProccess, handleRemoveSchedTimeSched, handleRemoveSched, id}) => {
  const [visible, setVisible] = useState(false);
  const [time , setTime] = useState(new Date());
  const [cups, setCups] = useState("");
  const [currenTime, setCurrentime] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [warning, setWarning] = useState(false);
  const [time1, setTime1] = useState("");

  const handleOpenModal = (time, cups) => {
    setVisible(true)
    setFormattedTime(time);
    setCups(cups);
    setCurrentime(time)
    
  }

  const handleNeedWarningBeforeDelete = (time) => {
    setWarning(true)
    setTime1(time)
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
 
    }
  };

  const convertToMilitaryTime3 = (time) => {
    const date = new Date(`2000-01-01 ${time}`);
    const militaryTimeValue = date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    const ampm = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).slice(-2);
    return militaryTimeValue.split(' ')[0].trim();


 
  };  



 

  const handleCloseModal = () => {
    setVisible(false)

  }

  return (
    <View style={{
        marginHorizontal:10,
        marginVertical:5,
        padding:10,
        borderRadius:1,
        elevation:1,
        shadowColor: "#000",
        position:'relative',
    }}>
 
      <View style={{
        flexDirection:'row',
        justifyContent:'space-between', alignItems:'center',
        marginBottom:5,
        
      }}>
 
      <Text style={{
        color:'coral',
        fontWeight:'bold',
        fontSize:20,
      }}>{data.Days.toUpperCase()}</Text>
           <TouchableOpacity onPress={()=> handleRemoveSched(id)} style={{
            position:'absolute',
            right:-10,
            top:-10,
            paddingHorizontal:15,
            paddingVertical:5,
            backgroundColor:'coral',
            borderBottomLeftRadius:10,
           }}>
        <EvilIcons name="trash" size={24} color="white" />
            
        </TouchableOpacity>
      </View>
   
      <Text style={{
        marginBottom:5,
        fontWeight:'bold',
        opacity:0.5,
        fontSize:15,
      }}>List of schedule time for <Text style={{
        color: parseInt(data.Slot) === 1 ? "red":"blue",
        fontWeight:'bold',
        opacity:1,
      }}>{parseInt(data.Slot) === 1 ? "Slot_one.":"Slot_two."}</Text></Text>
       {data.ScheduleTime.map((d, i)=> {
        return (
      
      <View key={i} style={{
              flexDirection:'row',
              gap:10,
              alignItems:'center',
            }}>
                <Text style={{
                    fontWeight:'bold',
                    opacity:0.6,
                    fontSize:18,
                }}>{convertToMilitaryTime3(d.time).split(":")[0] < 10 ? `0${convertToMilitaryTime3(d.time)}`: convertToMilitaryTime3(d.time)} <Text style={{
                  color:d.parameters === "PM" ? "red" : "blue"
                }}>{d.parameters}</Text> / {d.cups} cups</Text>
                     <View style={{
                      flexDirection:'row',
                      alignItems:'center',
                      gap:4,
                     }}>
                     <TouchableOpacity>
                     <FontAwesome name="edit" size={15} color="blue" onPress={()=> handleOpenModal(`${d.time} ${d.parameters}`, d.cups)} />
                     </TouchableOpacity>
                     <Text>/</Text>
                     <TouchableOpacity onPress={()=> handleNeedWarningBeforeDelete(`${d.time} ${d.parameters}`)}>
                     <FontAwesome name="remove" size={17} color="red" style={{
                      opacity:0.7
                     }}/>
                     </TouchableOpacity>
                      </View>
        <Modal isVisible={visible} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
          width:'100%',
          backgroundColor:'#FFFFFF',
          height:310,
          padding:10,
          borderRadius:10,
        }}>
          <Text style={{
            fontSize:20,
            fontWeight:'bold',
          }}>Edit Time Schedule</Text>
          <Text style={{
            fontSize:12,
            marginBottom:10,
            opacity:0.5
          }}>Make changes to the schedule time here.</Text>
          <View style={{
            width:'100%',
            gap:5,
          }}
          >

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
      label="Time Schedule"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:'60%',
      }}
      value={formattedTime}
      outlineColor='#FAB1A0'
      selectionColor='#FAB1A0'
      disabled
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
      label="Cups"
      mode='outlined'
      activeOutlineColor='coral'
      style={{
        width:'100%',
      }}
      value={cups}
      outlineColor='#FAB1A0'
      selectionColor='#FAB1A0'     
      onChangeText={(val)=> setCups(val)}
      /> 

     <TouchableOpacity style={{
            borderRadius:5,
            elevation:3,
            marginTop:2,
            backgroundColor:'#FAB1A0',
            height:50,
            justifyContent:'center',
            alignItems:'center',
            width:'100%',
            flexDirection:'row',
            gap:5,
          }} onPress={()=>{
            handleUpdateTimeHere(data.Days, formattedTime, cups, currenTime)
          }}>
            {updatingProccess ? 
            <>
            <Text style={{
              color:'white',
              fontSize:15,
              fontWeight:'bold',
            }}>Please wait...</Text>
            </>: 
            <>
                  <Ionicons name="save" size={17} color="white" />
            <Text style={{
              color:'white',
              fontSize:15,
              fontWeight:'bold',
            }}>Save changes</Text>
            </>
            }
    
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderRadius:5,
            elevation:3,
            backgroundColor:'white',
            height:50,
            marginTop:2,
            justifyContent:'center',
            alignItems:'center',
            width:'100%',
            flexDirection:'row',
            gap:5
          }} onPress={handleCloseModal} >
          <FontAwesome name="close" size={17} color="#FAB1A0" />
            <Text style={{
              color:'#FAB1A0',
              fontSize:15,
              fontWeight:'bold',
            }}>Close</Text>
          </TouchableOpacity>
          </View>
        </View>
       </Modal>
       <Modal isVisible={warning} animationIn='slideInLeft' animationOut='fadeOut'>
        <View style={{
          width:'100%',
          backgroundColor:'#FFFFFF',
          height:150,
          padding:10,
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center',
          borderRadius:10,
          gap:5,
        }}>
          <Text style={{
           fontSize:15,
           fontWeight:'bold'
          }}>Do you want to delete this time schedule <Text style={{
            color:'red',
          }}>{convertToMilitaryTime3(time1.split(" ")[0])} {time1.split(" ")[1]}</Text></Text>
          <View style={{
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            gap:5,
            marginTop:10,
          }}>
          <TouchableOpacity style={{
            borderRadius:5,
            elevation:3,
            marginTop:2,
            backgroundColor:'#FAB1A0',
            height:50,
            justifyContent:'center',
            alignItems:'center',
            width:'50%',
            flexDirection:'row',
            gap:5,
          }} onPress={()=>{
            handleRemoveSchedTimeSched(time1, data.Days, setWarning)
            
          }}>
            {updatingProccess ? 
            <>
            <Text style={{
              color:'white',
              fontSize:15,
              fontWeight:'bold',
            }}>Please wait...</Text>
            </>: 
            <>
               
            <Text style={{
              color:'white',
              fontSize:15,
              fontWeight:'bold',
            }}>Yes, please</Text>
            </>
            }
    
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderRadius:5,
            elevation:3,
            backgroundColor:'white',
            height:50,
            marginTop:2,
            justifyContent:'center',
            alignItems:'center',
            width:'50%',
            flexDirection:'row',
            gap:5
          }} onPress={()=>{
            setWarning(false)
          }} >
          <FontAwesome name="close" size={17} color="#FAB1A0" />
            <Text style={{
              color:'#FAB1A0',
              fontSize:15,
              fontWeight:'bold',
            }}>Close</Text>
          </TouchableOpacity>
          </View>
        </View>
       </Modal>
     
            </View>

      
            
        )
       })}
   
    </View>
  )
}

export default PetListSched