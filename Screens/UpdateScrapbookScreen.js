import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { doc, getDoc, getFirestore, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import PageCoil from '../Components/PageCoil';

const ScrapbokScreen = ({ route, navigation }) => {

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [ currentTitle, setCurrenttitle ] = useState("");
  const [ markerToChange, setMarkerToChange ] = useState("");

  const [title, setTitle] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const scrapbookRef = doc(db, "Users/" + currentUser.uid +"/Scrapbooks", route.params.id);

  const markerRef = query(collection(db, "Users/"+currentUser.uid+"/Markers"), where("image", "==", route.params.image));

  useEffect(() => {
    const getCurrentTitle = async () => {
      const ScrabookTitle = await getDoc(scrapbookRef);
      setCurrenttitle(ScrabookTitle.id)
      const querySnapshot = await getDocs(markerRef);
      querySnapshot.forEach((marker) => {
        setMarkerToChange(marker.id)
      })
    }
    getCurrentTitle()
  }, [])

  const updateScrapbookName = async () => {
    if (title != "") {
      const ScrapbookData = await getDoc(scrapbookRef)
      const newScrapbook = doc(db, "Users/" + currentUser.uid +"/Scrapbooks/" + title)
      const scrapbookData = {
        userID: ScrapbookData.data().userID,
        longitude: ScrapbookData.data().longitude,
        latitude: ScrapbookData.data().latitude,
        image: ScrapbookData.data().image
      }
      setDoc(newScrapbook, scrapbookData)
      await deleteDoc(scrapbookRef)
      Alert.alert("Scrapbook Updated")
      navigation.push("ScrapbookScreen", {
        latitude: ScrapbookData.data().latitude, 
        longitude: ScrapbookData.data().longitude, 
        image: ScrapbookData.data().image
      })
    } else {
      Alert.alert("No name given to update");
    }
  }

  const updateCoordinates = async () => {
    if (latitude != "" && longitude != "") {
      const ScrapbookData = await getDoc(scrapbookRef)
      const newScrapbook = doc(db, "Users/" + currentUser.uid +"/Scrapbooks/" + ScrapbookData.id)
      const scrapbookData = {
        userID: ScrapbookData.data().userID,
        longitude: longitude,
        latitude: latitude,
        image: ScrapbookData.data().image
      }
      setDoc(newScrapbook, scrapbookData)
      const markerUpdate = doc(db, "Users/" + currentUser.uid +"/Markers/" + markerToChange)
      await setDoc(markerUpdate, {
        image: ScrapbookData.data().image,
        longitude: longitude,
        latitude: latitude,
        userID: currentUser.uid,
      });
      Alert.alert("Scrapbook and Marker Updated")
      navigation.push("HomeScreen")
    } else {
      Alert.alert("All coordinates must be given");
    }
  }

  const deleteScrapbookandMarker = async () => {
    await deleteDoc(doc(db, "Users/" + currentUser.uid +"/Scrapbooks", route.params.id));
    const markersRef = await getDocs(markerRef)
    markersRef.forEach(async(marker) => {
      await deleteDoc(doc(db, "Users/" + currentUser.uid +"/Markers", marker.id))
    })
    Alert.alert("Scrapbook and Marker Deleted")
    navigation.push("HomeScreen", {refresh: true})
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
        const newImage = doc(db, 'Users/' + currentUser.uid + '/Scrapbooks/'+route.params.id+'/Images', result.assets[0].fileName)
        const imageData = {
          image: result.assets[0].uri,
        }
        setDoc(newImage, imageData)
        Alert.alert("Image Added to Scrapbook")
      } else {
      Alert.alert("Image Error")
    }
  };

  if (fontsLoaded){
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <PageCoil />
            <Text style={styles.lgntitle}>Change Scrapbook Name:</Text>
            <View style={styles.blur}>
              <View style={styles.titleInput}>
                <TextInput
                  style={styles.inputStyle}
                  fontSize={20}
                  color={colors.navy}
                  placeholderTextColor={colors.lightnavy}
                  placeholder={currentTitle}
                  autoCapitalize="none"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text)
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={updateScrapbookName}
                style={styles.button}
              >
                <Text style={styles.updateScrapbookNameText}>Update Scrapbook Name</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            <PageCoil />
            <Text style={styles.lgntitle}>Change Scrapbook Coordinates:</Text>
            <View style={styles.blur}>
              <View style={styles.titleInput}>
                <TextInput
                  style={styles.inputStyle}
                  fontSize={25}
                  color={colors.navy}
                  placeholderTextColor={colors.lightnavy}
                  placeholder="Longitude"
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                  value={longitude}
                  onChangeText={(text) => {
                    setLongitude(text)
                  }}
                />
              </View>
              <View style={styles.titleInput}>
                <TextInput
                  style={styles.inputStyle}
                  fontSize={25}
                  color={colors.navy}
                  placeholderTextColor={colors.lightnavy}
                  placeholder="Latitude"
                  keyboardType="numbers-and-punctuation"
                  autoCapitalize="none"
                  value={latitude}
                  onChangeText={(text) => {
                    setLatitude(text)
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={updateCoordinates}
                style={styles.button}
              >
                <Text style={styles.updateSrapbookCoordsText}>Update Scrapbook Coordinates</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.buttonView} onPress={() => {
              navigation.push("AddTextSectionScreen", {id: route.params.id, userID: currentUser.uid})
            }}
            >
              <Text style={styles.AddText}>Add Text Section</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonView} onPress={pickImage}>
              <Text style={styles.AddText}>Add Another Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonView} 
            onPress={async() => {
              deleteScrapbookandMarker()
            }}
          >
            <Text style={styles.DeleteText}>Delete Scrapbook and Corrosponding Marker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.push("ScrapbookScreen", {refresh: true, image: route.params.image})}}>
              <Text style={styles.GoBackText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default ScrapbokScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    marginLeft: 2,
  },
  ScrollViewcontainer: {
    width: "100%",
    marginBottom: 80,
  },
  formContainer: {
    width: "95%",
    backgroundColor: colors.grey,
    borderRadius: 25,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    alignSelf: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  blur: {
    marginVertical: 5,
    width:"90%",
    alignSelf: "center",
  },
  lgntitle: {
    fontSize: 40,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "90%",
    alignSelf: 'center',
    textAlign: "center",
    color: colors.navy,
    marginBottom: 5,
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
    marginTop: 10
  },
  titleInput: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.lightBlue,
    paddingLeft: 15,
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    backgroundColor: colors.grey,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
  buttonView: {
    width: "95%",
    backgroundColor: colors.grey,
    borderRadius: 50,
    paddingVertical: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    marginTop: 10,
  },
  AddText: {
    fontSize: 50,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy,
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
  },
  GoBackText: {
    fontSize: 50,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.green,
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
  },
  DeleteText: {
    fontSize: 40,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.red,
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
  },
  updateSrapbookCoordsText: {
    fontSize: 25,
    fontFamily: 'Sketching-Universe',
    color: colors.navy
  },
  updateScrapbookNameText: {
    fontSize: 35,
    fontFamily: 'Sketching-Universe',
    color: colors.navy
  },
  inputStyle: {
    fontFamily: 'Handwriting',
  }
})