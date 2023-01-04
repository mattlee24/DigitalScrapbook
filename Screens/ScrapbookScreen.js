import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

const ScrapbookScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [ title, setTitle ] = useState("");
  const [ refresh, setRefresh ] = useState(false)
  const [ textSections, setTextSections ] = useState("");

  let i = 0;

  const scrapbookRef = query(collection(db, "Users/"+currentUser.uid+"/Scrapbooks"), where("image", "==", route.params.image));

  useEffect(() => {
    async function getScrapbook() {
      const querySnapshot = await getDocs(scrapbookRef);
      if (querySnapshot.size > 0){
        querySnapshot.forEach((item) => {
          if (item.exists()){
            setTitle(item.id)
            setRefresh(true)
          } else {
            console.log("Error")
          }
        })
      } else {
        getScrapbook()
      }
    }

    getScrapbook()
  }, []);

  if (refresh) {
    async function getTextSections() {
      if (title == "") {
        console.log("Title has not been set yet");
      } else {
        const textSectionsRef = query(collection(db, "Users/"+currentUser.uid+"/Scrapbooks/"+title+"/TextSections"));
        const textSectionsListUpdate = {}
        const querySnapshot = await getDocs(textSectionsRef);
        if ( querySnapshot.size > 0 ) {
          querySnapshot.forEach((item) => {
            textSectionsListUpdate[item.id] = [item.data().text]
          })
          setTextSections(textSectionsListUpdate)
          setRefresh(false)
        }
      }
    }
    getTextSections()
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.titleView} >
            <TouchableOpacity style={styles.buttonback}>
                <Ionicons name={"arrow-back-circle"} size={45} color={colors.navy} onPress={() => navigation.navigate("HomeScreen")}/>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.ImageOuterView} >
          <Image source={{ uri: route.params.image }} style={styles.Image} />  
        </View>
        <View style={styles.TextSectionOuterView} >
          {Object.values(textSections).map(index => {
              i = i+1
                return 
            })}
        </View>
        <TouchableOpacity style={styles.editView} onPress={() => navigation.push("UpdateScrapbookScreen", {id: title, image: route.params.image})}>
            <Text style={styles.edittitle}>Edit Scrapbook</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ScrapbookScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    marginLeft: 2
  },
  ScrollViewcontainer: {
    width: "100%",
    marginBottom: 80
  },
  buttonEdit: {
    alignSelf: "center",
    marginRight: 15,
    position: "absolute",
    bottom: 0,
    right: 0,
    marginTop: 20,
  },
  buttonback: {
    alignSelf: "center",
    position: "relative",
  },
  titleView: {
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
    paddingHorizontal: 28,
    flexDirection: 'row'
  },
  editView: {
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
  title: {
    fontSize: 30,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy,
    alignSelf: 'center',
    marginLeft: -20,
    letterSpacing: 1
  },
  edittitle: {
    fontSize: 30,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy,
    alignSelf: 'center',
    letterSpacing: 1
  },
  ImageOuterView: {
    width: "95%",
    height: 200,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 30,
    overflow: (Platform.OS === "ios") ? "visible" : "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.lightBlue,
    borderRightWidth: 5,
    borderBottomWidth: 5
  },
  Image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  TextSectionOuterView: {
    width: "95%",
    height: 200,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 30,
    overflow: (Platform.OS === "ios") ? "visible" : "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5
  },
})