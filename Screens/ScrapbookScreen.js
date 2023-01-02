import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from "react";
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';

const ScrapbookScreen = ({ route, navigation }) => {

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const currentUser = auth.currentUser

  const [title, setTitle] = useState("");

  let i = 0;

  const docRef = query(collection(db, "Users/"+currentUser.uid+"/Scrapbooks"), where("image", "==", route.params.image));

  useEffect(() => {
    async function getScrapbook() {
      const querySnapshot = await getDocs(docRef);
      if (querySnapshot.size > 0){
        querySnapshot.forEach((item) => {
          if (item.exists()){
            setTitle(item.id)
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.titleView} >
            <TouchableOpacity style={styles.buttonback}>
                <Ionicons name={"arrow-back-circle"} size={45} color={colors.navy} onPress={() => navigation.goBack()}/>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.mapOuterView} >
            <MapView
                mapType={"mutedStandard"}
                style={styles.map}
                region={{
                    latitude: route.params.latitude,
                    longitude: route.params.longitude,
                    latitudeDelta: 0.9,
                    longitudeDelta: 0.5,
                }}
                scrollEnabled={false}
                >
                <Marker
                    key={1}
                    coordinate={{
                      longitude: route.params.longitude,
                      latitude: route.params.latitude
                    }} 
                    width={"auto"}
                    height={"auto"}
                    pinColor={colors.navy}
                >
                  <Image source={{ uri: route.params.image }} style={styles.markerImage} />  
                </Marker>
            </MapView>
        </View>
        <TouchableOpacity style={styles.editView} onPress={() => navigation.push("UpdateScrapbookScreen", {id: title})}>
            <Text style={styles.title}>Edit Scrapbook</Text>
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
  },
  ScrollViewcontainer: {
    width: "100%",
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
    marginLeft: 15,
    position: "absolute",
    left: 0,
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
    paddingHorizontal: 28
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
    marginLeft: 10,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    color: colors.navy
  },
  mapOuterView: {
    width: "95%",
    height: 200,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 25,
    overflow: (Platform.OS === "ios") ? "visible" : "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5,
},
map: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
},
markerImage: {
  width: 35,
  height: 35,
  borderRadius: 50
},
})