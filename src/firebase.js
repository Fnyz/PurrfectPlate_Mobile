
import { initializeApp, } from "firebase/app";
import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'


const firebaseConfig = {
  apiKey: "AIzaSyAswYUBVDRW-TQaMlXy2eCaq1VEQjDWk4Y",
  authDomain: "purrfectplatectu-20f2a.firebaseapp.com",
  projectId: "purrfectplatectu-20f2a",
  storageBucket: "purrfectplatectu-20f2a.appspot.com",
  messagingSenderId: "99238270028",
  appId: "1:99238270028:web:12be230132237d831c50e9"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;



