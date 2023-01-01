import { Alert, Button, Pressable, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

const ScrapbookScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)

  const [title, setTitle] = useState("");

  const docRef = doc(db, "Scrapbooks", "New Scrapbook");

  const getScrapbook = async () => {
    const ScrapbookData = await getDoc(docRef)
    setTitle(ScrapbookData.id)
  }

  getScrapbook()

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.lightimage} onPress={() => navigation.goBack()}>
          <TouchableHighlight style={styles.buttonback}>
              <Ionicons name={"arrow-back-circle"} size={45} color={colors.navy}/>
          </TouchableHighlight>
          <Text style={styles.lgntitle}>{title}</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default ScrapbookScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
  },
  buttonback: {
    alignSelf: "center",
    marginLeft: 5,
    position: "absolute",
    left: 0,
  },
  lightimage: {
    width: "80%",
    backgroundColor: colors.grey,
    borderRadius: 50,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  lgntitle: {
    fontSize: 30,
    marginLeft: 10,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy
  },
})