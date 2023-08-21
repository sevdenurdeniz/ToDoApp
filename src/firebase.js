import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, get, set, onChildAdded, off ,remove} from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBQEIjnyBWYxxAolgVAZs6ee_uOAd7lpkE",
    authDomain: "todoapp-c6fee.firebaseapp.com",
    databaseURL: "https://todoapp-c6fee-default-rtdb.firebaseio.com",
    projectId: "todoapp-c6fee",
    storageBucket: "todoapp-c6fee.appspot.com",
    messagingSenderId: "652020079561",
    appId: "1:652020079561:web:9101050aba373414baa618",
    measurementId: "G-QCB01RF9ZH"
  };
 
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);  
const storage = getStorage(app); 

export { db,  ref, push, set, get, onChildAdded, off, remove,storage };
export default app;
 
 