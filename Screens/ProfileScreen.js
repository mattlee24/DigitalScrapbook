import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import AuthStack from '../Navigation/AuthStack';
import ProfileCard from '../Components/ProfileCard';

const ProfileScreen = ({ navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const userRef = doc(db, "users", currentUser.uid);

  const signOut = () => {
    auth.signOut()
    .then(() => {
      navigation.navigate(AuthStack)
      Alert.alert('Successfully Logged out')
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileCard>

      </ProfileCard>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
  },
})