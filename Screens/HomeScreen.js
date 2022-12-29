import { StyleSheet, Text, View, Pressable, Image, Button, TouchableOpacity, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import colors from '../colors'
import MapView from 'react-native-map-clustering';
import { Callout, Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs,query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const HomeScreen = ({}) => {

  const [image, setImage] = useState(null);
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [markerPicBlob, setMarkerPicBlob] = useState(null);
  const [ markersList, setMarkersList ] = useState({})

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app);
  const currentUser = auth.currentUser

  const q = query(collection(db, "markers"), where("userID", "==", currentUser.uid));

  useEffect(() => {
    async function getAllDocs(q) {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setMarkersList({...markersList, [doc.id] : [doc.data().latitude, doc.data().longitude]})
        });
    }
    getAllDocs(q)
    console.log(markersList)
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true
    });

    if (!result.canceled) {
      if ( result.assets[0].exif.GPSLatitude ){
        setImage(result.assets[0].uri)
        setLatitude(result.assets[0].exif.GPSLatitude)
        setLongitude(result.assets[0].exif.GPSLongitude)
        const newDoc = doc(db, 'markers/'+result.assets[0].fileName)
        const docData = {
          userID: currentUser.uid,
          longitude: result.assets[0].exif.GPSLongitude,
          latitude: result.assets[0].exif.GPSLatitude,
        }
        setDoc(newDoc, docData)
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        await setMarkerPicBlob(blob)
        if (markerPicBlob) {
          const storageRef = ref(storage, 'MarkerPictures/' + result.assets[0].fileName);
          uploadBytes(storageRef, blob);
        } else {
          Alert.alert("Unable to upload pic to storage")
        }
      } else {
        Alert.alert("Image Error")
      }
    } else {
      Alert.alert("Image Error")
    }
  };

  const INITIAL_REGION = {
    latitude: 55.378051,
    longitude: -3.435973,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity title={`Click here to add image, from camera roll, to scrapbook. \n\n IMPORTANT make sure your location was on when you took the image otherwise it will NOT work!`} />
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
        <Text style={styles.imagePickerBtnText}>
          Click here to add image, from camera roll, to scrapbook. {'\n'} {'\n'} IMPORTANT make sure your location was on when you took the image otherwise it will NOT work!
        </Text>
      </TouchableOpacity>
      <MapView 
        style={styles.map} 
        initialRegion={INITIAL_REGION} 
        mapType={"standard"}
      >
        {Object.values(markersList).map(index => {
          console.log(index[0])
            return <Marker
              key={index.id} 
              coordinate={{
                latitude :index[0],
                longitude :index[1]
              }} 
              width={20}
              height={20}
              pinColor="#007A3B"                                     
            >                                       
              <Callout style={styles.callout}>
                <Text style={styles.calloutTitle}>{index.title}</Text>
                <Pressable style={styles.calloutButton}>
                  <Text style={styles.calloutText}>Find More</Text>
                </Pressable>
              </Callout>
            </Marker>
          })}
      </MapView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: colors.grey,
  },
  map: {
    width: '100%',
    height: '100%',
  }, 
  markerImage: {
    width: 35,
    height: 35,
    borderRadius: 50
  },
  imagePickerBtn: {
    color: colors.black,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  imagePickerBtnText: {
    textAlign: 'center',
    margin: 10
  }
})