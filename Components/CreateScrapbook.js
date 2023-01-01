import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const currentUser = auth.currentUser

const CreateScrapbook = async (latitude, longitude, image) => {
    const newScrapbook = doc(db, 'Scrapbooks/New Scrapbook')
    const scrapbookData = {
      userID: currentUser.uid,
      longitude: longitude,
      latitude: latitude,
      image: image
    }
    setDoc(newScrapbook, scrapbookData)
}

export default CreateScrapbook
