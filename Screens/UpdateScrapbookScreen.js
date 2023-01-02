import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { doc, getDoc, getFirestore, setDoc, deleteDoc } from "firebase/firestore";

const ScrapbokScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [title, setTitle] = useState("");

  const docRef = doc(db, "Users/" + currentUser.uid +"/Scrapbooks", route.params.id);

  const updateScrapbook = async () => {
    if (title != "") {
      const ScrapbookData = await getDoc(docRef)
      const newScrapbook = doc(db, "Users/" + currentUser.uid +"/Scrapbooks/" + title)
      const scrapbookData = {
        userID: ScrapbookData.data().userID,
        longitude: ScrapbookData.data().longitude,
        latitude: ScrapbookData.data().latitude,
        image: ScrapbookData.data().image
      }
      setDoc(newScrapbook, scrapbookData)
      await deleteDoc(docRef)
      Alert.alert("Scrapbook Updated")
      navigation.push("ScrapbookScreen", {
        latitude: ScrapbookData.data().latitude, 
        longitude: ScrapbookData.data().longitude, 
        image: ScrapbookData.data().image
      })
    } else {
      Alert.alert("No name has been set for the scrapbook")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.formContainer}>
          <Text style={styles.lgntitle}>Name Scrapbook:</Text>
          <View style={styles.blur}>
            <View style={styles.titleInput}>
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                leftIcon="email"
                placeholderTextColor={colors.lightnavy}
                placeholder="Scrabook Name"
                cursorColor={colors.navy}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={title}
                onChangeText={(text) => {
                  setTitle(text)
                }}
              />
            </View>
            <TouchableOpacity
              onPress={updateScrapbook}
              style={styles.button}
            >
              <Text style={styles.textColor}>Update Scrapbook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ScrapbokScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
  },
  ScrollViewcontainer: {
    width: "100%",
  },
  formContainer: {
    width: "95%",
    backgroundColor: colors.grey,
    borderRadius: 50,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    alignSelf: 'center',
  },
  blur: {
    marginVertical: 5,
    width:"90%",
    alignSelf: "center",
  },
  lgntitle: {
    fontSize: 30,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "90%",
    alignSelf: 'center',
    textAlign: "center",
    color: colors.navy,
    marginBottom: 5,
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
    borderBottomWidth: 5
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    backgroundColor: colors.grey,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
})