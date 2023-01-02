import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Alert } from "react-native";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const CreateScrapbook = async (latitude, longitude, image, userID) => {
  const docRef = query(collection(db, "Scrapbooks"), where("image", "==", image));
  const querySnapshot = await getDocs(docRef)
  if (querySnapshot.size > 0){
    querySnapshot.forEach((item) => {
      if (item.exists()){
        Alert.alert("Existing Scrapbook Found")
      } else {
        console.log("Error")
      }
    })
  } else {
    const ScrapbookID = genRanHex(32)
    const newScrapbook = doc(db, 'Users/' + userID + '/Scrapbooks/New Scrapbook')
    const scrapbookData = {
      userID: userID,
      longitude: longitude,
      latitude: latitude,
      image: image,
      scrapbookID: ScrapbookID,
    }
    await setDoc(newScrapbook, scrapbookData)
    Alert.alert("Scrapbook Created")
  }
}

export default CreateScrapbook
