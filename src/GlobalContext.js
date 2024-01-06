// TimerContext.js
import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { doc,  getFirestore, collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import app from './firebase';

const db = getFirestore(app);



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
  
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

const GlobalContext = createContext();

export const TimerProvider = ({ children }) => {
  const [mess,setDataMessage] = useState([]);
  const [notif1, setNotifications1] = useState([]);
  const [showTimer, setShowTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState(180);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [nowRun, setNowrun] = useState(false);
  const previousNotificationsLength = useRef(null);
  const [credentials, setCredentials] = useState({});
 
  const [hasLoggedChange, setHasLoggedChange] = useState(false);

  const dataMessage = (m, email) => {
    const a = m.find(d => d?.dt?.sender === email);
    const b = a?.dt?.message.sort((msg1, msg2) => msg2.messagedate - msg1.messagedate).filter(d => d?.unseen === false);
    return b;
  }

  const unseenMessages = useMemo(() => dataMessage(mess, credentials.email), [mess, credentials.email]);
  

   

  useEffect(() => {
    // Declare intervalId outside the useEffect
    let intervalId;
  
    const fetchNotifications = async () => {
      try {
        const storedNotifications = await AsyncStorage.getItem("notifications");
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const sortedNotifications = parsedNotifications.sort((a, b) => b.createdAt - a.createdAt);
          setNotifications1(sortedNotifications);
    
          // Log only if new data is added
          if (previousNotificationsLength.current !== null && parsedNotifications.length > previousNotificationsLength.current) {
            // Clear the interval after logging
            await sendPushNotification(expoPushToken, `${sortedNotifications[0].deviceName ? sortedNotifications[0].deviceName : "Admin"}`, sortedNotifications[0].message);
            clearInterval(intervalId);
          }
  
          // Update the previous length
          previousNotificationsLength.current = parsedNotifications.length;
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    // Fetch notifications initially
    fetchNotifications();
    console.log(credentials);
    if (credentials.DeviceName) {
      // Set up automatic refresh every 3 seconds (adjust the interval as needed)
      intervalId = setInterval(() => {
        fetchNotifications().catch(error => console.error('Error during automatic refresh:', error));
      }, 3000);
    }else{
    
      clearInterval(intervalId)
    }
  
    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [credentials]); // Empty dependency array to run only once on mount
  
 

//getMessageNotification
  
useEffect(() => {
  
    if(unseenMessages && unseenMessages.length > 0){
      console.log('Unseen messages changed:', unseenMessages && unseenMessages?.length);
       sendPushNotification(expoPushToken, "Admin", unseenMessages[0]?.message);
    }else{
      console.log("null")
    }
  

}, [unseenMessages?.length]);




  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(calculateRemainingTime, 1000);

    function calculateRemainingTime() {
      (async () => {
        const storedStartTime = await AsyncStorage.getItem('startTime');
        if (storedStartTime !== null) {
          const startTime = parseInt(storedStartTime, 10);
          const currentTime = Date.now();
          const elapsedTime = Math.floor((currentTime - startTime) / 1000);
          const newRemainingTime = Math.max(0, 180 - elapsedTime);

          setRemainingTime(newRemainingTime);

          if (newRemainingTime <= 0 && showTimer) {
            setShowTimer(false);
            await sendPushNotification(expoPushToken, 'Livestream', 'Live is now ready. Please check it now!');
            clearInterval(timerInterval);
          }
        } else {
          clearInterval(timerInterval);
        }
      })();
    }

    // Clean up the timer when the component unmounts
    return () => clearInterval(timerInterval);
  }, [showTimer]);


  useEffect(()=> {
  


    const q = query(collection(db, "Messages"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
   const data = [];
   querySnapshot.forEach((docs) => {
       data.push({dt:docs.data(), id: docs.id});
    
   });
   setDataMessage(data);
   

 });
   
 
  }, [credentials])

  
  

  return (
    <GlobalContext.Provider value={{ setShowTimer, showTimer, remainingTime , notif1, setNowrun, setCredentials}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
