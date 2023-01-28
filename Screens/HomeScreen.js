import { StyleSheet, Text, View, Pressable, Image, Button, TouchableOpacity, Alert, RefreshControl, Platform } from 'react-native'
import React, {useState, useEffect} from 'react'
import colors from '../colors'
import MapView from 'react-native-map-clustering';
import { Callout, Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import CreateScrapbook from '../Components/CreateScrapbook';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Loading from '../Components/Loading';
import * as Location from 'expo-location';

const HomeScreen = ({ route, navigation }) => {

  /**
  * 
  * All the variables needed for the page
  * 
  */

  const [ location, setLocation ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState(null);
  const [ getLocation, setGetLocation ] = useState(false)
  const [ initialRegion, setInitialRegion] = useState(null)

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
  });

  const [ markersList, setMarkersList ] = useState({})  
  const [ refresh, setRefresh ] = useState(false)

  let i = 0;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const q = query(collection(db, "Users/" + currentUser.uid + "/Markers"), where("userID", "==", currentUser.uid));

  /**
  * 
  * useEffect
  * 
  * Runs once each time page is loaded
  * 
  */

  useEffect(() => {
    async function getAllDocs(q) {
      const querySnapshot = await getDocs(q);
      const markersListUpdate = {};
      querySnapshot.forEach((doc) => {
        markersListUpdate[doc.id] = [doc.data().latitude, doc.data().longitude, doc.data().image]
      });
      setMarkersList(markersListUpdate)
      setGetLocation(true)
    }
    getAllDocs(q)
  }, []);

  /**
  * 
  * Function to get the users location, used for displaying correct mapView
  *  
  * @param getLocation
  * 
  */

  if (getLocation) {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied! Region defaulted to UK');
        setInitialRegion({
          latitude: 55.578051,
          longitude: -2.435973,
          latitudeDelta: 11,
          longitudeDelta: 11,
        })
        setGetLocation(false)
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        })
      setGetLocation(false)
      }
    }
    getLocation()
  }

  /**
  * 
  * Both functions below used to refresh page incase of changes
  * 
  * @param refresh
  * @param route.params.refresh
  * 
  */

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

  try {
    if (route.params.refresh) {
      const getAllDocs = async (q) => {
        const querySnapshot = await getDocs(q);
        const markersListUpdate = {}
        querySnapshot.forEach((doc) => {
          markersListUpdate[doc.id] = [doc.data().latitude, doc.data().longitude, doc.data().image]
        });
        setMarkersList(markersListUpdate)
      }
      getAllDocs(q)
    }
  } catch {
    console.log("Running Correctly")
  }

  /**
  * 
  * Gets image from camer roll
  * 
  * Adds resulting URI to firestore
  * 
  */

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
        const newMarker = doc(db, 'Users/' + currentUser.uid + '/Markers/'+result.assets[0].fileName)
        const markerData = {
          userID: currentUser.uid,
          longitude: result.assets[0].exif.GPSLongitude,
          latitude: result.assets[0].exif.GPSLatitude,
          image: result.assets[0].uri
        }
        setDoc(newMarker, markerData)
        setRefresh(true)
      } else {
        Alert.alert("Image Error, no location found!")
      }
    } else {
      Alert.alert("Image Error, image selection cancelled!")
    }
  };

  if (fontsLoaded) {
    if (initialRegion != null) {
      return (
        <View style={styles.container}>
          <View style={styles.imagePickerView}>
            <Text style={styles.TextImportant}>
              IMPORTANT: Make sure your location was on when you took the image, otherwise it will NOT work!
            </Text>
          </View>
          <View style={styles.buttonaddView}>
            <TouchableOpacity style={styles.buttonadd}>
              <Ionicons name={"add-circle"} size={100} color={colors.grey} onPress={pickImage}/>
            </TouchableOpacity>
          </View>
          <MapView 
            style={styles.map} 
            initialRegion={initialRegion} 
            mapType={"standard"}
            clusterColor={colors.navy}
          >
            {Object.values(markersList).map(index => {
              i = i+1
                return <Marker
                style={styles.marker}
                key={i} 
                coordinate={{
                  longitude: index[1],
                  latitude: index[0]
                }} 
                pinColor={colors.navy}
                onCalloutPress={() => {
                  CreateScrapbook(index[0], index[1], index[2], currentUser.uid)
                  navigation.push("ScrapbookScreen", {image: index[2]})}
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
    } else {
      return(
        <Loading />
      )
    }
  } else {
    return(
      <Loading />
    )
  }
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonaddView: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    zIndex: 1,
    right: 0,
    marginTop: 85,
    marginRight: 10,
    borderWidth: 12,
    borderRadius: 100,
    borderColor: colors.navy,
    backgroundColor: colors.navy
  },
  buttonadd: {
    zIndex: 1,
    elevation: 3,
    margin: -20,
    marginLeft: -14,
  },
  TextImportant: {
    textAlign: 'center',
    fontSize: Platform.OS === 'ios' ? 25 : 20,
    color: colors.red,
    marginTop: 0,
    padding: 20,
    fontWeight: 'bold',
    fontFamily: 'Sketching-Universe',
  }, 
  markerImage: {
    width: 35,
    height: 35,
    borderRadius: 50
  },
  imagePickerView: {
    position: 'absolute',
    marginTop: 60,
    marginLeft: 10,
    width: '80%',
    height: 'auto',
    backgroundColor: colors.grey,
    zIndex: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
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
    color: colors.navy,
  },
  calloutButton: {
    textAlign: 'center',
    margin: 1,
    marginTop: 5,
    fontSize: 15,
    backgroundColor: colors.grey,
    borderRadius: 25,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.navy,
    borderBottomWidth: 5,
    borderRightWidth: 5
  },
  callout: {
    width: 150,
    height: 'auto',
  },
})