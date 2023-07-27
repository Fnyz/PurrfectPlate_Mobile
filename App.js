import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FrontPage from './src/components/Frontpage';
import LoginSignUp from './src/LoginSignUp';
import ForgetPassword from './src/ForgetPassword';
import ConnectDevice from './src/ConnectDevice';
import DashBoard from './src/DashBoard';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FrontPage"  
      screenOptions={{
      headerShown: false
   }}>
        <Stack.Screen name="FrontPage" component={FrontPage} />
        <Stack.Screen name="LoginSignUp" component={LoginSignUp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="ConnectDevice" component={ConnectDevice} />
        <Stack.Screen name="Dashboard" component={DashBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

