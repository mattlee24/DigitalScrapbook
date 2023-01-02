import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from "react";
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

  const [ currentTitle, setCurrenttitle ] = useState("");

  const [title, setTitle] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const docRef = doc(db, "Users/" + currentUser.uid +"/Scrapbooks", route.params.id);

  useEffect(() => {
    const getCurrentTitle = async () => {
      const ScrabookTitle = await getDoc(docRef);
      setCurrenttitle(ScrabookTitle.id)
    }
    getCurrentTitle()
  }, [])

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
      Alert.alert(
        "!Error!",
        "No name given to update",
        [
          { 
            text: "OK", 
            style: "destructive"
          }
        ]
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.lgntitle}>Change Scrapbook Name:</Text>
          <View style={styles.blur}>
            <View style={styles.titleInput}>
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
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
              onPress={updateScrapbook}
              style={styles.button}
            >
              <Text style={styles.textColor}>Update Scrapbook Name</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.lgntitle}>Change Scrapbook Coordinates:</Text>
          <View style={styles.blur}>
            <View style={styles.titleInput}>
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="Longitude"
                autoCapitalize="none"
                value={title}
                onChangeText={(text) => {
                  setLongitude(text)
                }}
              />
            </View>
            <View style={styles.titleInput}>
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="Latitude"
                autoCapitalize="none"
                value={title}
                onChangeText={(text) => {
                  setLatitude(text)
                }}
              />
            </View>
            <TouchableOpacity
              onPress={updateScrapbook}
              style={styles.button}
            >
              <Text style={styles.textColor}>Update Scrapbook Coordinates</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.buttonView}>
            <Text style={styles.AddText}>Add Text Section</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView}>
            <Text style={styles.AddText}>Add Hand Written Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView}>
            <Text style={styles.AddText}>Add More Images</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.goBack()}}>
            <Text style={styles.DeleteText}>Delete Scrapbook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.goBack()}}>
            <Text style={styles.GoBackText}>Go Back</Text>
        </TouchableOpacity>
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
    marginBottom: 48,
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
    marginTop: 10
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
    fontSize: 30,
    marginLeft: 10,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy
  },
  GoBackText: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.green
  },
  DeleteText: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.red
  },
})