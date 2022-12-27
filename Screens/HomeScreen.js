import { StyleSheet, Text, View, Pressable, Image, Button } from 'react-native'
import React, {useState} from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView from 'react-native-map-clustering';
import { Callout, Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage"

const HomeScreen = ({}) => {

  const [image, setImage] = useState(null);
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app);
  const currentUser = auth.currentUser

  // console.log(currentUser.uid)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setLatitude(result.assets[0].exif.GPSLatitude)
      setLongitude(result.assets[0].exif.GPSLongitude)
      // console.log(result.assets[0].uri)
      // console.log(result.assets[0].fileName)
      const newDoc = doc(db, 'markers/'+result.assets[0].fileName)
      const docData = {
        userID: currentUser.uid,
        longitude: result.assets[0].exif.GPSLongitude,
        latitude: result.assets[0].exif.GPSLatitude,
      }
      setDoc(newDoc, docData)
      const storageRef = ref(storage, 'MarkerPictures/' + email);
      const img = await fetch(result.assets[0].uri);
      const imgbytes = img.blob();
      console.log(imgbytes._z)
      uploadBytes(storageRef, imgbytes._z);
      // console.log(result.assets[0].exif.GPSLatitude);
      // console.log(result.assets[0].exif.GPSLongitude);
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
      <Button title="Add image, from camera roll, to add to scrapbook. (IMPORTANT make sure your location was on when you took the image otherwise it will NOT work!" onPress={pickImage} style={styles.imagePickerBtn}/>
      <MapView 
        style={styles.map} 
        initialRegion={INITIAL_REGION} 
        mapType={"standard"}
      >
        <Marker 
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          description={"This is a marker in React Natve"}
        >
          <Image source={{uri: image}} style={styles.markerImage} />
          <Callout style={styles.callout}>{/* displays when the marker is pressed */}
            <Pressable style={styles.calloutButton}>
            </Pressable>
          </Callout>
        </Marker>
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
    
  }
})