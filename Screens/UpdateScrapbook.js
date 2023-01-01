import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const ScrapbokScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)

  const [title, setTitle] = useState("");

  const docRef = doc(db, "Scrapbooks", "New Scrapbook");

  const updateScrapbook = async (id) => {
    const ScrapbookData = await getDoc(docRef)
    const newScrapbook = doc(db, 'Scrapbooks/'+id)
    const scrapbookData = {
      userID: ScrapbookData.data().userID,
      longitude: ScrapbookData.data().longitude,
      latitude: ScrapbookData.data().longitude,
      image: ScrapbookData.data().image
    }
    setDoc(newScrapbook, scrapbookData)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lightimage}>
          <Text style={styles.lgntitle}>Name Scrapbook:</Text>
          <View style={styles.blur}>
            <View style={styles.lightInput}>
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
        </View>
      </View>
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
  lightimage: {
    width: "80%",
    backgroundColor: colors.grey,
    borderRadius: 50,
    paddingVertical: 10,
  },
  blur: {
    marginVertical: 5,
    width:"90%",
    alignSelf: "center",
  },
  lgntitle: {
    fontSize: 30,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy
  },
  lightInput: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.lightBlue,
    paddingLeft: 15,
    padding: 10,
    borderRadius: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5
  },
})