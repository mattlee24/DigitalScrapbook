import React, { useState, useEffect, useContext } from 'react';
import { Button, Image, View, Platform, StyleSheet, ScrollView, TouchableOpacity, LogBox, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from './colors';
import HomeStack from './Components/HomeStack';
import AuthStack from './Components/AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from "./Config/firebase";
import { initializeApp } from 'firebase/app';
import { createStackNavigator } from '@react-navigation/stack';

function OverallStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
      <Stack.Screen name="AuthStack" component={AuthStack}/>
      <Stack.Screen name="HomeStack" component={HomeStack} />
    </Stack.Navigator> 
  )
}

export default function App() {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  onAuthStateChanged(auth, (user) => {
    if (user){
      Alert.alert('Logged in with the email: ', user.email)
    } else{
      Alert.alert('Successfully Logged out')
    }
  })

  return (
    <NavigationContainer>
       <OverallStack />
    </NavigationContainer>
  );

 

  // const [image, setImage] = useState(null);

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

  // return (
  //   <SafeAreaView>
  //     <ScrollView contentContainerStyle={{alignItems: "center"}}>
  //       <Button title="Pick an image from camera roll" onPress={pickImage} />
  //       <TouchableOpacity style={styles.imageView}>
  //         {image && <Image source={{ uri: image }} style={styles.imageStyle} />}
  //       </TouchableOpacity>
  //     </ScrollView>
  //   </SafeAreaView>
  // );

}

const styles = StyleSheet.create({
  // imageView: {
  //   backgroundColor: colors.orange,
  //   width: "98%",
  //   height: 200,
  //   borderWidth: 5,
  //   borderRadius: 20,
  //   justifyContent: "center",
  // },
  // imageStyle: {
  //   width: "90%", 
  //   height: "90%",
  //   color: "orange",
  //   borderRadius: 20,
  //   alignSelf: "center",
  // }
});
