import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Firestore } from "firebase/firestore";
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import HomeStack from "../Navigation/HomeStack";
import { BlurView } from 'expo-blur';
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen({ navigation }) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [profilePic, setprofilePic] = useState(null);

  const onChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const uploadImage = async (uri, imageName) => {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const ref = firebase.storage().ref().child(`ProfilePictures/${imageName}`);
      await ref.put(blob);
      const donwloadURL = await ref.getDownloadURL();
      return setprofilePic(donwloadURL);
    };

    if (!result.canceled) {
      uploadImage(result.assets.uri, email)
        .then(() => {
          console.log("It works!");
        })
        .catch((error) => {
          console.log("it does not work");
          console.error(error);
        });
    }
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  const onHandleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
      const user = userCredential.user;
      const db = Firestore(auth);
      db.collection("users").doc(user.uid).set({
        email: currentUser.email,
        lastName: lastName,
        firstName: firstName,
        password: password,
        profilePic: profilePic
      });
      Alert.alert('New user created with the email: ', user.email)
      navigation.navigate("Login")
    }) 
    .catch(error => {
      Alert.alert(error.message)
    })
  };

  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Alert.alert('Logged in with the email: ', user.email)
      navigation.navigate(HomeStack)
    })
    .catch(error => {
      Alert.alert(error.message)
    })
  };

  return (
    <KeyboardAvoidingView style={styles.container1}  behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>Welcome to Your Digital Scrapbook</Text>
      <View style={styles.container}>
        {/* <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/> */}
        <View style={styles.lightimage}>
          <Text style={styles.lgntitle}>Create Account</Text>
          <BlurView intensity={0} style={styles.blur}>
            <StatusBar style="dark-content" />
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
                leftIcon="email"
                placeholderTextColor={colors.grey}
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
                placeholderTextColor={colors.grey}
                leftIcon="lock"
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
            <Text
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotpassword}
            >
              Forgot Password?
            </Text>
            <TouchableOpacity
              onPress={onLogin}
              style={styles.button}
            ><Text style={styles.textColor}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.button}
              ><Text style={styles.textColor}>Create Account</Text>
              </TouchableOpacity>
          </BlurView>
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
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  lightimage: {
    width: "100%",
    backgroundColor: colors.grey,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingVertical: 10,
    
  },
  blur: {
    marginVertical: 10,
    paddingVertical: 10,
    width:"90%",
    alignSelf: "center",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 15,
    elevation: 3,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20
  },
  textColor: {
    color: colors.navy
  },
  title: {
    fontSize: 50,
    paddingHorizontal: 15,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    marginTop: 100,
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
    color: colors.navy
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
    backgroundColor: colors.baige,
    paddingLeft: 20,
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
