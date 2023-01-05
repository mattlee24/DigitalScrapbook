import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, query, where, deleteDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import PageCoil from '../Components/PageCoil';
import { useFonts } from 'expo-font';
import { TextInput } from "react-native-gesture-handler";

const ListScreen = () => {

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [ scrapbooks, setScrapbooks ] = useState({})
  const [ refresh, setRefresh ] = useState(false)

  let i = 0;

  const scrapbookRef = query(collection(db, "Users/"+currentUser.uid+"/Scrapbooks"));

  useEffect(() => {
    async function getScrapbooks() {
      const querySnapshot = await getDocs(scrapbookRef);
      const scrabooksUpdateList = {}
      if (querySnapshot.size > 0){
        querySnapshot.forEach((item) => {
          scrabooksUpdateList[item.id] = [item.id, item.data().image]
        })
        setScrapbooks(scrabooksUpdateList)
      } else {
        getScrapbooks()
      }
    }
    getScrapbooks()
  }, []);

if (fontsLoaded) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innercontainer}>
        <TextInput
          style={styles.textInputStyle}
          // onChangeText={(text) => handleSearch(text)}
          underlineColorAndroid="transparent"
          placeholder="Search by name..."
          placeholderTextColor={"grey"}
        />
        <FlatList
          style={styles.flatlist} 
          data={Object.values(scrapbooks)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.main}>
              <Image source={{ uri: item[1] }} style={styles.image}></Image>
              <View style={styles.card}>
                  <Text style={styles.texttitle}>{item[0]}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

}

export default ListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
  },
  innercontainer: {
    width: '100%',
    height: '100%',
  },
  textInputStyle: {
    alignSelf: 'center',
    paddingLeft: 10,
    fontFamily: 'Handwriting',
    fontSize: 30,
    backgroundColor: colors.grey,
    width: '95%',
    borderWidth: 1,
    borderRadius: 25,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: colors.navy,
    marginBottom: 10
  },
  flatlist: {
    marginHorizontal: 10,
    marginBottom: 70
  },
  image: {
    width: "100%",
    height: 150,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  main: {
    width: "100%",
    height: 'auto',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 25,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: colors.navy
  },
  card: {
    backgroundColor: colors.grey,
    height: 'auto',
    shadowColor: "black",
    width: "100%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    padding: 5,
  },
  texttitle: {
    fontFamily: 'Sketching-Universe',
    fontSize: 50,
    textAlign: 'center',
    color: colors.navy,
    letterSpacing: 1
  }
})