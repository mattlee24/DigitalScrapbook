import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const CreateScrapbook = async (latitude, longitude, image, userID) => {
    const newScrapbook = doc(db, 'Scrapbooks/New Scrapbook')
    const scrapbookData = {
      userID: userID,
      longitude: longitude,
      latitude: latitude,
      image: image
    }
    setDoc(newScrapbook, scrapbookData)
}

export default CreateScrapbook
