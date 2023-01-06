import { Alert, Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import AuthStack from '../Navigation/AuthStack';
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { useFonts } from 'expo-font';

const ProfileScreen = ({ navigation }) => {

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const currentUser = auth.currentUser;
  const storage = getStorage(app);

  const [ userData, setUserData ] = useState({});
  const [ refresh, setRefresh ] = useState(false);
  const [ profilePic, setProfilePic ] = useState(null);
  const [ markerNumber, setMarkerNumber ] = useState(null)
  const [ scrabookNumber, setScrapbookNumber ] = useState(null)
  const [ getMarkerandScrapbookNumbers, setGetMarkerandScrapbookNumbers ] = useState(false)

  const userRef = doc(db, "Users", currentUser.uid);
  const ScrapbooksRef =  query(collection(db, "Users/" + currentUser.uid + "/Scrapbooks"));
  const MarkersRef =  query(collection(db, "Users/" + currentUser.uid + "/Markers"));

  useEffect(() => {
    async function getUserData() {
      const querySnapshot = await getDoc(userRef);
      if (querySnapshot.exists()) {
        setUserData(querySnapshot.data())
        setRefresh(true)
      };
    }
    getUserData()
  }, []);

  if (refresh) {
    async function getUserProfilePic() {
      getDownloadURL(ref(storage, 'ProfilePictures/' + userData.email)).then((url) => {
        setProfilePic(url);
        setRefresh(false)
        setGetMarkerandScrapbookNumbers(true)
      })
    }
    getUserProfilePic()
  }

  if (getMarkerandScrapbookNumbers) {
    async function getMakerNumber() {
      const querySnapshot = await getDocs(MarkersRef);
      const markerSnapshot = await getDocs(ScrapbooksRef);
      let i = 0;
      let x = 0;
      querySnapshot.forEach(() => {
        i = i + 1
      })
      markerSnapshot.forEach(() => {
        x = x + 1
      })
      setMarkerNumber(i)
      setScrapbookNumber(x)
      setGetMarkerandScrapbookNumbers(false)
    }
    getMakerNumber()
  }

  const signOut = () => {
    auth.signOut()
    .then(() => {
      navigation.navigate(AuthStack)
      Alert.alert('Successfully Logged out')
    })
  };

  if (fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.imageView}>
            <Image
              source={{ uri: profilePic }}
              style={styles.imageProfilePic}
            />
          </View> 
          <View style={styles.nameView}>
            <Text style={styles.nameText}>
              {userData.firstName} {userData.lastName}
            </Text>
            <Text style={styles.countryText}>
              {userData.country}
            </Text>
          </View>
          <View style={styles.infoOuterView}>
            <View style={styles.infoView}>
              <Text style={styles.infoNumber}>{markerNumber}</Text>
              <Text style={styles.infoText}>Markers</Text>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.textSeparator}>|</Text>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.infoNumber}>{scrabookNumber}</Text>
              <Text style={styles.infoText}>Scrapbooks</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.buttonEdit}
          ><Text style={styles.EditText}>Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={signOut}
            style={styles.button}
          ><Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
  },
  profileCard: {
    width: '90%',
    height: '90%',
    backgroundColor: colors.grey,
    borderRadius: 25,
    borderWidth: 1,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: colors.navy,
    alignItems: 'center'
  },
  imageView: {
    width: 200,
    height: 200,
    marginTop: 30,
    borderRadius: 100,
    borderColor: colors.navy,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageProfilePic: {
    width: 185,
    height: 185,
    borderRadius: 100,
  },
  nameView:{
    marginTop: 5,
    width: '100%',
    height: 'auto',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
  },
  countryText: {
    fontSize: 30,
    color: colors.navy,
    fontFamily: 'Handwriting',
  },
  infoOuterView: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 15
  },
  infoView: {
    alignItems: 'center',
    marginHorizontal: 10
  },
  textSeparator: {
    fontSize: 80,
    fontWeight: '100',
    color: colors.lightnavy,
  },
  infoNumber: {
    fontSize: 40,
    fontFamily: 'Handwriting',
    marginTop: 15,
    color: colors.navy
  },
  infoText: {
    fontSize: 25,
    fontFamily: 'Handwriting',
    color: colors.navy
  },
  button: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    backgroundColor: colors.grey,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    marginBottom: 10,
    width: '90%'
  },
  signOutText: {
    color: colors.red,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
  buttonEdit: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    backgroundColor: colors.grey,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    marginBottom: 80,
    width: '90%'
  },
  EditText: {
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
})
