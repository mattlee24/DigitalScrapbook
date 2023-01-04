import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity, AsyncStorage } from 'react-native'
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

const ScrapbookScreen = ({ route, navigation }) => {

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [ title, setTitle ] = useState("");
  const [ refresh, setRefresh ] = useState(false)
  const [ textSections, setTextSections ] = useState("")
  
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
            textSectionsListUpdate[item.id] = [item.id, item.data().text]
          })
          setTextSections(textSectionsListUpdate)
          setRefresh(false)
        }
      }
    }
    getTextSections()
  }

  const deleteTextSection = async (sectionName) => {
    await deleteDoc(doc(db, "Users/" + currentUser.uid +"/Scrapbooks/" + title + "/TextSections", sectionName));
    Alert.alert("Section Deleted");
    setRefresh(true)
  }

  // console.log(textSections)

  if (fontsLoaded) {
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
            <PageCoil />
            <Image source={{ uri: route.params.image }} style={styles.Image} />  
          </View>
          {Object.values(textSections).map(index => {
              i = i+1
                return (
                  <View key={i} style={styles.TextSectionOuterView} >
                    <PageCoil />
                    <Image source={{ uri: "https://img.freepik.com/free-vector/blank-white-notepaper-design-vector_53876-161340.jpg" }} style={styles.ImageBackroundTextSection} /> 
                    <Text style={styles.textSectionTitle}>
                      {index[0]}{'\n'}
                    </Text>
                    <Text style={styles.textSectionContent}>
                      {index[1]}{'\n'}{'\n'}
                    </Text>
                    <TouchableOpacity style={styles.buttonBin} onPress={() => {deleteTextSection(index[0])}}>
                      <Ionicons name={"trash-bin"} size={35} color={colors.red}/>
                    </TouchableOpacity>
                  </View>
                )
          })}
          <View style={styles.ScrollViewOuter}>
            <ScrollView horizontal={true} style={styles.horizontalScrollView} showsHorizontalScrollIndicator={false}>
              <View style={styles.outerImageViewScrollView}>
                <Image source={{ uri: route.params.image }} style={styles.ScrollImage} /> 
              </View>
              <View style={styles.outerImageViewScrollView}>
                <Image source={{ uri: route.params.image }} style={styles.ScrollImage} /> 
              </View>
              <View style={styles.outerImageViewScrollView}>
                <Image source={{ uri: route.params.image }} style={styles.ScrollImage} /> 
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.editView} onPress={() => navigation.push("UpdateScrapbookScreen", {id: title, image: route.params.image})}>
              <Text style={styles.edittitle}>Edit Scrapbook</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }
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
    flexDirection: 'row',
    marginBottom: 10,
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
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy,
    alignSelf: 'center',
    marginLeft: -20,
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
  },
  edittitle: {
    fontSize: 50,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy,
    alignSelf: 'center',
    letterSpacing: 1,
    fontFamily: 'Sketching-Universe',
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
    position: 'absolute'
  },
  TextSectionOuterView: {
    width: "95%",
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 30,
    overflow: (Platform.OS === "ios") ? "visible" : "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
  },
  textSectionTitle: {
    color: colors.navy,
    fontWeight: 'bold',
    fontSize: 35,
    letterSpacing: 1,
    marginBottom: -20,
    marginTop: 10,
    fontFamily: 'Sketching-Universe',
  },
  textSectionContent: {
    color: colors.navy,
    fontSize: 20,
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 45,
    fontFamily: 'Handwriting'
  },
  buttonBin: {
    position: "absolute",
    right: 0,
    bottom: 0,
    paddingRight: 10,
    paddingBottom: 10
  },
  ImageBackroundTextSection: {
    width: "100%",
    height: '100%',
    borderRadius: 25,
    position: 'absolute',
  },
  horizontalScrollView: {
    marginHorizontal: 10,
    width: '100%',
    height: '100%'
  },
  ScrollViewOuter: {
    width: "95%",
    height: 200,
    alignItems: "center",
    marginTop: 10,
    borderRadius: 30,
    overflow: (Platform.OS === "ios") ? "visible" : "hidden",
    alignSelf: "center",
  },
  ScrollImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  outerImageViewScrollView: {
    width: 350,
    height: '100%',
    marginRight: 10
  }
})