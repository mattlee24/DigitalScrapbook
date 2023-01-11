import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import HomeStack from "../Navigation/HomeStack";
import colors from "../colors";
import Book from "../Components/Book";
import { useFonts } from 'expo-font';

export default function LoginScreen({ navigation }) {

  /**
  * 
  * All the variables needed for the page
  * 
  */

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const [email, setEmail] = useState("");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  /**
  * 
  * Uses the firebase @method sendPasswordResetEmail
  * to send email to the given email
  * 
  * @param auth
  * @param email
  * 
  */

  const onResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      Alert.alert("Password reset email sent. Please check your junk folder if you cannot find the email.")
      navigation.navigate("LoginScreen")
    })
    .catch((error) => {
      Alert.alert(error.code);
    });
  };

  if (fontsLoaded) {
    return (
      <KeyboardAvoidingView style={styles.container1}  behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={styles.title}>Welcome to Your Digital Scrapbook</Text>
        <Book />
        <View style={styles.container}>
          {/* <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/> */}
          <View style={styles.lightimage}>
            <Text style={styles.lgntitle}>Forgot Password</Text>
            <View style={styles.blur}>
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
              <TouchableOpacity
                onPress={onResetPassword}
                style={styles.button}
              >
                <Text style={styles.textColor}>Send Reset Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
                  style={styles.buttonCreate}
              >
                <Text style={styles.textColorCreate}>Remember? Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

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
    backgroundColor: colors.grey,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
    borderRightWidth: 5,
    borderBottomWidth: 5
  },
  buttonCreate: {
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
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 30
  },
  textColorCreate: {
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 25
  },
  title: {
    fontSize: Platform.OS === "ios" ? 80 : 30,
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
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
  },
  lgntitle: {
    fontSize: 60,
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
    fontFamily: 'Sketching-Universe',
  },
  forgotpassword: {
    color: colors.navy,
    textAlign: "right",
    fontWeight: "bold",
    textAlign: 'center',
    marginRight: 10,
    fontFamily: 'Sketching-Universe',
    fontSize: 25
  },
  lightInput: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: colors.lightBlue,
    paddingLeft: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.navy,
    borderRightWidth: 5,
    borderBottomWidth: 5
  },
  iconstyle: { margin: 10 },
  textview: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
});
