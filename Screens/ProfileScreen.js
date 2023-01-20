import { Alert, Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {

  /**
  * 
  * All the variables needed for the page
  * 
  */

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

  /**
  * 
  * useEffect
  * 
  * Runs once each time page is loaded
  * 
  */

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

  /**
  * 
  * Refreshes the page
  * 
  * @param refresh
  * 
  */

  if (refresh) {
    async function getUserProfilePic() {
      getDownloadURL(ref(storage, 'ProfilePictures/' + userData.email)).then(async (url) => {
        setProfilePic(url);
        const querySnapshot = await getDoc(userRef);
        if (querySnapshot.exists()) {
          setUserData(querySnapshot.data())
        };
        setRefresh(false)
        setGetMarkerandScrapbookNumbers(true)
      })
    }
    getUserProfilePic()
  }

  /**
  * 
  * Gets number of markers and scrapbooks
  * 
  * @param getMarkerandScrapbookNumbers
  * 
  */

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

  /**
  * 
  * Signs user out and redirects to Login
  * 
  */

  const signOut = () => {
    auth.signOut()
    .then(() => {
      navigation.navigate("Login")
      Alert.alert('Successfully Logged out')
    })
  };

  if (fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.iconRefreshView} onPress={() =>{setGetMarkerandScrapbookNumbers(true)}}>
            <Ionicons name={"refresh-circle"} size={50} color={colors.navy}/>
          </TouchableOpacity>
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
            <View style={styles.iconView}>
              <Ionicons name={"pin"} size={25} color={colors.navy}/>
            </View>
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
            <View style={styles.iconView}>
              <Ionicons name={"book-outline"} size={25} color={colors.navy}/>
            </View>
          </View>
          <View style={styles.infoView}>
            <Text style={styles.emailText}>{userData.email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => { navigation.push("UpdateAccountScreen")}}
            style={styles.editbutton}
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
    alignItems: 'center',
    paddingVertical: 50
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
  editbutton: {
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
  signOutText: {
    color: colors.red,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
  EditText: {
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
  iconView: {
    marginTop: 20
  },
  iconRefreshView: {
    position: 'absolute',
    right: 0,
    marginTop: 10,
    marginRight: 10
  },
   emailText: {
    marginTop: 10,
    fontFamily: 'Handwriting',
    color: colors.navy,
    fontSize: 30,
    textDecorationLine: 'underline'
   }
})

