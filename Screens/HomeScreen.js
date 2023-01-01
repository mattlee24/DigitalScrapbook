import { StyleSheet, Text, View, Pressable, Image, Button, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import React, {useState, useEffect} from 'react'
import colors from '../colors'
import MapView from 'react-native-map-clustering';
import { Callout, Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import INITIAL_REGION from '../Components/InitialRegion'
import CreateScrapbook from '../Components/CreateScrapbook';

const HomeScreen = ({ navigation }) => {

  const [ markersList, setMarkersList ] = useState({})  
  const [ refresh, setRefresh ] = useState(false)

  let i = 0;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const q = query(collection(db, "Markers"), where("userID", "==", currentUser.uid));

  useEffect(() => {
    async function getAllDocs(q) {
      const querySnapshot = await getDocs(q);
      const markersListUpdate = {};
      querySnapshot.forEach((doc) => {
        markersListUpdate[doc.id] = [doc.data().latitude, doc.data().longitude, doc.data().image]
      });
      setMarkersList(markersListUpdate)
    }
    getAllDocs(q)
  }, []);

  if (refresh) {
    const getAllDocs = async (q) => {
      const querySnapshot = await getDocs(q);
      const markersListUpdate = {}
      querySnapshot.forEach((doc) => {
        markersListUpdate[doc.id] = [doc.data().latitude, doc.data().longitude, doc.data().image]
      });
      setMarkersList(markersListUpdate)
      setRefresh(false)
    }
    getAllDocs(q)
  }

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
        const newMarker = doc(db, 'Markers/'+result.assets[0].fileName)
        const markerData = {
          userID: currentUser.uid,
          longitude: result.assets[0].exif.GPSLongitude,
          latitude: result.assets[0].exif.GPSLatitude,
          image: result.assets[0].uri
        }
        setDoc(newMarker, markerData)
        setRefresh(true)
      } else {
        Alert.alert("Image Error")
      }
    } else {
      Alert.alert("Image Error")
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
        <Text style={styles.Text}>
          Click here to add image, from camera roll, to scrapbook.
        </Text>
        <Text style={styles.TextImportant}>
          IMPORTANT make sure your location was on when you took the image, otherwise it will NOT work!
        </Text>
      </TouchableOpacity>
      <MapView 
        style={styles.map} 
        initialRegion={INITIAL_REGION} 
        mapType={"standard"}
        clusterColor={colors.navy}
      >
        {Object.values(markersList).map(index => {
          i = i+1
            return <Marker
            key={i} 
            coordinate={{
              longitude: index[1],
              latitude: index[0]
            }} 
            pinColor={colors.navy}
            onCalloutPress={() => {
              CreateScrapbook(index[0], index[1], index[2], currentUser.uid)
              navigation.push("ScrapbookScreen", {latitude: index[0], longitude: index[1], image: index[2]})}
            }
          >      
            <Image source={{ uri: index[2] }} style={styles.markerImage} />                                 
            <Callout style={styles.callout}>
              <Text style={styles.calloutTitle}>Click to Create, View or Edit Scrapbook</Text>
              <TouchableOpacity style={styles.calloutButton}>
                <Text style={styles.calloutTextImportant}>Create/Edit/View Scrapbook</Text>
              </TouchableOpacity>
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
  Text: {
    textAlign: "center",
    margin: 2,
    fontSize: 20,
    color: colors.navy
  },
  TextImportant: {
    textAlign: 'center',
    margin: 2,
    fontSize: 15,
    color: colors.red
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
  calloutTitle: {
    textAlign: 'center',
    margin: 2,
    fontSize: 20,
    color: colors.navy,
    borderRadius: 25
  },
  calloutTextImportant: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.baige,
  },
  calloutButton: {
    textAlign: 'center',
    margin: 1,
    marginTop: 5,
    fontSize: 15,
    color: colors.baige,
    backgroundColor: colors.navy,
    borderRadius: 25,
    padding: 5,
  },
  callout: {
    width: 150,
    height: 'auto',
  }
})