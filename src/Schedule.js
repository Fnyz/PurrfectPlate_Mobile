import { View, Text, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import {useForm, Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import { Divider} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';




const Schedule = ({navigation}) => {

  const [genderOpen, setGenderOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyValue, setCompanyValue] = useState(null);

  
  const isDrawerOpen = useDrawerStatus() === 'open';
  const handleOpenDrawer = () => {
    navigation.openDrawer();
  }
  


  const times = [
    {time: '8:30 AM', cups:10 },
    {time: '12:20 PM', cups:2 },
    {time: '7:25 AM', cups:5 },
    {time: '10:10 PM', cups:15 }
  ]

  const days = [
    {day: 'Mon'},
    {day: 'Tue'},
    {day: 'Wed'},
    {day: 'Thu'},
    {day: 'Fri'},
    {day: 'Sat'},
    {day: 'Sun'},
    {day:'Everyday'},
  ]
  const [company, setComapny] = useState([
    { label: "Kimmy", value: "Kimmy" },
    { label: "Fighter", value: "Fighter" },
    { label: "Snowy", value: "Snowy" },
  ]);
  const [loading, setLoading] = useState(false);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const onCompanyOpen = useCallback(() => {
    setGenderOpen(false);
  }, []);
  const {control } = useForm();


  return (
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
        }}>

          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            marginBottom:10,
            marginTop:10,
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
        marginVertical:10,
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
              }}
              open={companyOpen}
              value={companyValue} //companyValue
              items={company}
              setOpen={setCompanyOpen}
              setValue={setCompanyValue}
              setItems={setComapny}
              placeholder="Select pet"
              placeholderStyle={{
                color: "grey",
              }}
              loading={loading}
              activityIndicatorColor="#5188E3"
              searchable={true}
              searchPlaceholder="Search your pet here..."
              onOpen={onCompanyOpen}
              onChangeValue={onChange}
               zIndex={1000}
              zIndexInverse={3000}
            />
          </View>
        )}
      />

      <Text style={{
        marginVertical:10,
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
            opacity:0.8,
          }}
          >
            <Text style={{
              fontSize:20,
              fontWeight:'bold',
              color:'white',
              padding:10,
            }}>{item.day}</Text>
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
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            gap:10,
          }}>
          <Entypo name="plus" size={20} color="white"  style={{
            borderRadius:5,
            padding:2,
            backgroundColor:'#FAB1A0'
          }}/>
          <Text style={{
            opacity:0.5,
          }}>See all</Text>
          </View>
        </View>
        <View style={{
          marginTop:10,
          paddingHorizontal:10,
          height:200,
          borderRadius:5,
          elevation:3,
          backgroundColor:'white'
        }}>
        <FlatList
        data={times}
        renderItem={({ item, index })=> {
           return (
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between',
              alignItems:'center',
              margin:7,
              width:339,
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
                {item.time}
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
            </View>
           )
        }}
        keyExtractor={(_, i) => i.toString()}
      />
        </View>

        <View style={{
          marginTop:25,
          flexDirection:'row',
          gap:10,
          justifyContent:'center',
          alignItems:'center',
        }}>
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
            }}>GO BACK</Text>
          </TouchableOpacity>
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
          }}>
            <MaterialIcons name="schedule" size={20} color="white" />
            <Text style={{
              color:'white',
              fontWeight:'bold',
              fontSize:15,
            }}>SET</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default Schedule