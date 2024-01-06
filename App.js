
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FrontPage from './src/components/Frontpage';
import LoginSignUp from './src/LoginSignUp';
import ForgetPassword from './src/ForgetPassword';
import ConnectDevice from './src/ConnectDevice';
import DashBoard from './src/DashBoard';
import AddPets from './src/Addpet'
import DetailsPage from './src/DetailsPage';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Schedule from './src/Schedule';
import Live from './src/Live';
import { MaterialIcons } from '@expo/vector-icons';
import Reports from './src/Reports';
import ProfileUpdate from './src/ProfileUpdate';
import UpdatePassword from './src/UpdatePassword';
import { TimerProvider } from './src/GlobalContext';



function NavDrawer() {
  return (
      <Drawer.Navigator  
      screenOptions={{
        headerShown: false
     }}>
      <Drawer.Screen name="Dashboard" component={DashBoard} options={{
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome name="home" size={size} color={color} style={{
                position:'relative',
                left:15,
              }}/>
            ),
            drawerActiveBackgroundColor:'#FAB1A0',
            drawerInactiveTintColor:'#FAB1A0',
            drawerActiveTintColor:'white',
            title:'HOMEPAGE',
          }}/>
      <Drawer.Screen name="AddPet" component={AddPets} 
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} style={{
            position:'relative',
            left:15,
          }}/>
          
        ),
        title:'ADD PET',
        drawerActiveBackgroundColor:'#FAB1A0',
        drawerInactiveTintColor:'#FAB1A0',
        drawerActiveTintColor:'white',
        drawerStatusBarAnimation:{
          screenX:10
        },
      }}
      />
      <Drawer.Screen name="Sched" component={Schedule} 
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <MaterialIcons name="schedule" size={size}color={color} style={{
            position:'relative',
            left:15,
          }} />   
        ),
        title:'SCHEDULE',
        drawerActiveBackgroundColor:'#FAB1A0',
        drawerInactiveTintColor:'#FAB1A0',
        drawerActiveTintColor:'white',
        drawerStatusBarAnimation:{
          screenX:10
        },
      }}
      />
      <Drawer.Screen name="Live" component={Live} 
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <MaterialIcons name="live-tv" size={size} color={color} style={{
            position:'relative',
            left:15,
          }}/>
        ),
        title:'Live',
        drawerActiveBackgroundColor:'#FAB1A0',
        drawerInactiveTintColor:'#FAB1A0',
        drawerActiveTintColor:'white',
        drawerStatusBarAnimation:{
          screenX:10
        },
      }}
      />
        <Drawer.Screen name="Report" component={Reports} 
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <MaterialIcons name="report"size={size} color={color} style={{
            position:'relative',
            left:15,
          }} />
        ),
        title:'REPORT',
        drawerActiveBackgroundColor:'#FAB1A0',
        drawerInactiveTintColor:'#FAB1A0',
        drawerActiveTintColor:'white',
        drawerStatusBarAnimation:{
          screenX:10
        },
      }}
      />
      </Drawer.Navigator>
  )
}

const AppStack = () => (
  <TimerProvider>
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="FrontPage" component={FrontPage} />
      <Stack.Screen name="LoginSignUp" component={LoginSignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="DetailsPage" component={DetailsPage} />
      <Stack.Screen name="Homepage" component={NavDrawer} />
      <Stack.Screen name="ConnectDevice" component={ConnectDevice} />
      <Stack.Screen name="UpdateProfile" component={ProfileUpdate} />
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
    </Stack.Navigator>
  </TimerProvider>
);

export default function App() {
  return (
    
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
   
  );
}

