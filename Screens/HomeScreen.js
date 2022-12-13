import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth, signOut } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import AuthStack from '../Components/AuthStack';

const HomeScreen = ({ navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  const signOut = () => {
    auth.signOut()
    .then(() => {
      navigation.navigate(AuthStack)
      Alert.alert('Successfully Logged out')
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Home Screen</Text>
      <Button
          onPress={signOut}
          type="outline"
          raised
          buttonStyle={{
            backgroundColor: "#4169E1",
            borderColor: "#4169E1",
            borderRadius: 15
          }}
          titleStyle={{
            color:  "white",
          }}
          title="Sign Out"
          titleSize={20}
          containerStyle={{
            marginBottom: 20,
            borderRadius: 15
          }}
        />
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    justifyContent: 'center',
  },
})