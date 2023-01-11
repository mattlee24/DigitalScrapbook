import { Alert, Button, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import colors from '../colors';
import { doc, getDoc, getFirestore, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import PageCoil from '../Components/PageCoil';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

const AddTextSectionScreen = ({ route, navigation }) => {

    /**
     * 
     * All the variables needed for the page
     * 
     */

    const [fontsLoaded] = useFonts({
        'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
        'Handwriting': require('../assets/fonts/Handwriting.ttf'),
      });

    const [ name, setName ] = useState("")
    const [ text, setText ] = useState("")

    /**
     * 
     * Function used to create and add text section to firestore
     * To be displayed on the 'ScrabookScreen'
     * 
     */

    const AddTextSection = async () => {
        if ( name != "" && text != ""){
            const newTextSection = doc(db, "Users/" + route.params.userID +"/Scrapbooks/"+route.params.id+"/TextSections/" + name)
            const textData = {
                text: text
            };
            setDoc(newTextSection, textData)
            Alert.alert("New Text Section Added")
            navigation.goBack()
        } else {
            Alert.alert("Please provide all the required information")
        }
    }

    if (fontsLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.formContainer}>
                        <PageCoil />
                        <Text style={styles.title}>Add Text Section:</Text>
                        <Text style={styles.subtitle}>Setting the same name will result in overwritng a section.</Text>
                        <View style={styles.blur}>
                            <View style={styles.titleInput}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color={colors.navy}
                                    fontSize={30}
                                    placeholderTextColor={colors.lightnavy}
                                    placeholder={'Name...'}
                                    autoCapitalize="none"
                                    value={name}
                                    onChangeText={(name) => {
                                    setName(name)
                                    }}
                                />
                            </View>
                            <View style={styles.titleInput}>
                                <TextInput
                                    style={styles.inputStyle}
                                    color={colors.navy}
                                    multiline={true}
                                    fontSize={30}
                                    placeholderTextColor={colors.lightnavy}
                                    placeholder={'Start Typing...'}
                                    autoCapitalize="none"
                                    value={text}
                                    onChangeText={(text) => {
                                    setText(text)
                                    }}
                                />
                                <TouchableOpacity style={styles.buttonDone} onPress={() => Keyboard.dismiss}>
                                    <Ionicons name={"checkmark-circle"} size={35} color={colors.navy}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonView} onPress={() => {AddTextSection()}}>
                        <Text style={styles.AddText}>Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.goBack()}}>
                        <Text style={styles.GoBackText}>Go Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }

}

export default AddTextSectionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.baige,
        marginLeft: 2,
    },
    ScrollViewcontainer: {
        width: "100%",
        marginBottom: 80,
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
        marginTop: 10,
        alignItems: 'center'
    },
    blur: {
        marginVertical: 5,
        width:"90%",
        alignSelf: "center",
    },
    title: {
        fontSize: 60,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "90%",
        alignSelf: 'center',
        textAlign: "center",
        color: colors.navy,
        marginBottom: 5,
        letterSpacing: 1,
        fontFamily: 'Sketching-Universe',
        marginTop: 10
      },
      subtitle: {
        fontSize: 25,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "90%",
        alignSelf: 'center',
        textAlign: "center",
        color: colors.red,
        marginBottom: 5,
        letterSpacing: 1,
        fontFamily: 'Sketching-Universe',
      },
      titleInput: {
        flexDirection: "row",
        marginBottom: 10,
        backgroundColor: colors.lightBlue,
        paddingRight: 40,
        paddingLeft: 10,
        paddingVertical: 10,
        borderRadius: 15,
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
      buttonDone: {
        position: 'absolute',
        right: 0,
        alignSelf: 'center',
      },
      AddText: {
        fontSize: 60,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "100%",
        textAlign: "center",
        color: colors.green,
        letterSpacing: 1,
        fontFamily: 'Sketching-Universe',
      },
      GoBackText: {
        fontSize: 60,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "100%",
        textAlign: "center",
        color: colors.navy,
        letterSpacing: 1,
        fontFamily: 'Sketching-Universe',
      },
      inputStyle: {
        fontFamily: 'Handwriting'
      }
})