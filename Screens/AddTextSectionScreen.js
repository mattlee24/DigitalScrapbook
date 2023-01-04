import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import colors from '../colors';
import { doc, getDoc, getFirestore, setDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const currentUser = auth.currentUser

const AddTextSectionScreen = ({ route, navigation }) => {

    const [ text, setText ] = useState("")

    const scrapbookRef = doc(db, "Users/" + currentUser.uid +"/Scrapbooks", route.params.id);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollViewcontainer} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Add Text Section:</Text>
                    <View style={styles.blur}>
                        <View style={styles.titleInput}>
                        <TextInput
                            color={colors.navy}
                            multiline={true}
                            fontSize={25}
                            placeholderTextColor={colors.lightnavy}
                            placeholder={'Start Typing'}
                            autoCapitalize="none"
                            value={text}
                            onChangeText={(text) => {
                            setText(text)
                            }}
                        />
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.buttonView}>
                    <Text style={styles.AddText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonView} onPress={() => {navigation.goBack()}}>
                    <Text style={styles.GoBackText}>Go Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
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
    },
    blur: {
        marginVertical: 5,
        width:"90%",
        alignSelf: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "90%",
        alignSelf: 'center',
        textAlign: "center",
        color: colors.navy,
        marginBottom: 5,
        letterSpacing: 1
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
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "100%",
        textAlign: "center",
        color: colors.green,
        letterSpacing: 1
      },
      GoBackText: {
        fontSize: 30,
        fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
        width: "100%",
        textAlign: "center",
        color: colors.navy,
        letterSpacing: 1
      },
})