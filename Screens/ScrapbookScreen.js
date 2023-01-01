import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import AuthStack from '../Navigation/AuthStack';

const ScrapbokScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  console.log(route.params.latitude, route.params.longitude, route.params.image)

  return (
    <SafeAreaView style={styles.container}>
      <Text>Scrapbok Screen</Text>
    </SafeAreaView>
  )
}

export default ScrapbokScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    justifyContent: 'center',
  },
})