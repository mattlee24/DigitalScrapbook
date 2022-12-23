import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage"
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";
import Book from "../Components/BookCreate";

export default function SignupScreen({ navigation }) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app);

  const onChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri)
      console.log("It works!");
    } else {
      Alert.alert("Image Error")
    }
  };

  const onHandleSignup = async () => {
    if ( firstName != "" & lastName != "" & email != "" & password != ""){
      const storageRef = ref(storage, email);
      const img = await fetch(profilePic)
      const imgbytes = await img.blob();
      await uploadBytes(storageRef, imgbytes);
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>{
        const user = userCredential.user;
        const newDoc = doc(db, 'users/'+user.uid)
        const docData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }
        setDoc(newDoc, docData)
        Alert.alert('New user created with the email: ', user.email)
        navigation.navigate("Login")
      }) 
      .catch(error => {
        Alert.alert(error.message)
      })
    } else {
      Alert.alert("Don't leave fields empty!")
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Welcome to Your Digital Scrapbook</Text>
      {/* <Book /> */}
      <View style={styles.container}>
        {/* <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/> */}
        <View style={styles.lightimage}>
          <Text style={styles.lgntitle}>Create Account</Text>
          <View style={styles.blur}>
            <TouchableOpacity  onPress={onChooseImage}>
              <View style={styles.imagepicker}>
                <Image
                  source={{ uri: profilePic }}
                  style={styles.imageProfilePic}
                />
                { <MaterialCommunityIcons
                  name="camera"
                  size={35}
                  color="#fff"
                  style={{
                    opacity: 0.5,
                    alignSelf: "center",
                    position: "absolute",
                    marginTop: 40
                  }}
                  /> }
              </View>
            </TouchableOpacity>
            <View style={styles.lightInput}>
              <MaterialCommunityIcons
                style={styles.iconstyle}
                name="account"
                size={20}
                color={colors.navy}
              />
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="First Name"
                cursorColor={colors.navy}
                autoCapitalize="none"
                keyboardType="default"
                textContentType="givenName"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
              />
            </View>
            <View style={styles.lightInput}>
              <MaterialCommunityIcons
                style={styles.iconstyle}
                name="account"
                size={20}
                color={colors.navy}
              />
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="Last Name"
                cursorColor={colors.navy}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="familyName"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
              />
            </View>
            <View style={styles.lightInput}>
              <MaterialCommunityIcons
                style={styles.iconstyle}
                name="email"
                size={20}
                color={colors.navy}
              />
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="Email"
                cursorColor={colors.navy}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View style={styles.lightInput}>
              <MaterialCommunityIcons
                style={styles.iconstyle}
                name="lock"
                size={20}
                color={colors.navy}
              />
              <TextInput
                inputStyle={{
                  fontSize: 14,
                }}
                color={colors.navy}
                placeholderTextColor={colors.lightnavy}
                placeholder="Password"
                cursorColor={colors.navy}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <TouchableOpacity
              onPress={onHandleSignup}
              style={styles.button}
            ><Text style={styles.textColor}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.buttonLogin}
            ><Text style={styles.textColorLogin}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    justifyContent: "flex-end",
  },
  container1: {
    flex: 1,
    backgroundColor: colors.baige,
  },
  imageProfilePic: {
    flex: 0,
    width: (Platform.OS === 'ios') ? 150 : 120,
    height: (Platform.OS === 'ios') ? 150 : 120,
    borderRadius: 100,
    borderColor: colors.lightnavy,
    borderWidth: 1,
    alignSelf: 'center',
  },
  imagepicker: {
    width: (Platform.OS === 'ios') ? 150 : 120,
    height: (Platform.OS === 'ios') ? 150 : 120,
    borderRadius: 100,
    alignSelf: "center",
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    marginTop: -20
  },
  lightimage: {
    width: "100%",
    backgroundColor: colors.grey,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingVertical: 10,
    justifyContent: 'center'
  },
  blur: {
    marginVertical: 10,
    paddingVertical: 10,
    width:"90%",
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    backgroundColor: colors.grey,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
  },
  buttonLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    backgroundColor: colors.grey,
    marginTop: 10,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20
  },
  textColor: {
    color: colors.navy
  },
  textColorLogin: {
    color: colors.navy
  },
  title: {
    padding: 1,
    fontSize: 30,
    paddingHorizontal: 5,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    marginTop: 50,
    textAlign: "center",
    textShadowColor: "grey",
    textShadowRadius: 10,
    textShadowOffset: {
      width: 3,
      height: 3
    },
    color: colors.navy
  },
  lgntitle: {
    fontSize: 50,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    textAlign: "center",
    textShadowColor: "grey",
    textShadowRadius: 10,
    textShadowOffset: {
      width: 3,
      height: 3
    },
    color: colors.navy,
  },
  forgotpassword: {
    color: colors.navy,
    textAlign: "right",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: 'center',
    marginRight: 10
  },
  lightInput: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.lightBlue,
    paddingLeft: 5,
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
  iconstyle: { margin: 10 },
  textview: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  signupLight: {
    fontWeight: "600",
    textDecorationLine: 'underline'
  }
});
