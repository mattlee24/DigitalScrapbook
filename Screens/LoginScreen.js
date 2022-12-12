import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  ImageBackground,
  Image,
  Dimensions, 
  Button,
  Alert
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import HomeStack from "../Components/HomeStack";

export default function LoginScreen({ navigation }) {
  const colourScheme = useColorScheme();
  const isDarkMode = colourScheme === "dark";
  const containerStyle =
    colourScheme === "dark" ? styles.darkcontainer : styles.lightcontainer;
  const imageStyle =
    colourScheme === "dark" ? styles.darkimage : styles.lightimage;
  const titleStyle =
    colourScheme === "dark" ? styles.darktitle : styles.lighttitle;
  const orStyle = colourScheme === "dark" ? styles.darkOr : styles.lightOr;
  const inputStyle =
    colourScheme === "dark" ? styles.darkInput : styles.lightInput;
  const forgotpasswordStyle =
    colourScheme === "dark"
      ? styles.darkforgotpassword
      : styles.lightforgotpassword;
  const signupStyle =
  colourScheme === "dark"
    ? styles.darkSignUp
    : styles.lightSignUp;
  const buttonStyle = colourScheme === "dark" ? styles.darkLogin : styles.lightLogin;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const onLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      navigation.navigate(HomeStack)
    })
    .catch(error => {
      Alert.alert(error.message)
    })
  };

  return (
    <View style={[containerStyle, {
      height: windowHeight,
      width: windowWidth
    }]}>
      <Text style={[titleStyle, styles.title]}>Login</Text>
      <ImageBackground style={imageStyle}>
        <StatusBar style="dark-content" />
        <View style={inputStyle}>
          <MaterialCommunityIcons
            style={styles.iconstyle}
            name="email"
            size={20}
            color={isDarkMode ? "white" : "#4169E1"}
          />
          <TextInput
            inputStyle={{
              fontSize: 14,
            }}
            color={isDarkMode ? "white" : "#4169E1"}
            selectionColor={isDarkMode ? "white" : "#4169E1"}
            leftIcon="email"
            placeholderTextColor={isDarkMode ? "white" : "#4169E1"}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={inputStyle}>
          <MaterialCommunityIcons
            style={styles.iconstyle}
            name="lock"
            size={20}
            color={isDarkMode ? "white" : "#4169E1"}
          />
          <TextInput
            inputStyle={{
              fontSize: 14,
            }}
            color={isDarkMode ? "white" : "#4169E1"}
            selectionColor={isDarkMode ? "white" : "#4169E1"}
            placeholderTextColor={isDarkMode ? "white" : "#4169E1"}
            leftIcon="lock"
            placeholder="Password"
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
          style={forgotpasswordStyle}
        >
          Forgot/Change Password
        </Text>
        <Button
          onPress={onLogin}
          type="outline"
          raised
          buttonStyle={{
            backgroundColor: isDarkMode ? "white" : "#4169E1",
            borderColor: isDarkMode ? "white" : "#4169E1",
            borderRadius: 15
          }}
          titleStyle={{
            color: isDarkMode ? "#4169E1" : "white",
          }}
          title="Login"
          titleSize={20}
          containerStyle={{
            marginBottom: 20,
            borderRadius: 15
          }}
        />
        <View style={styles.textview}>
          <Text style={signupStyle}> Dont have an account?</Text>
          <Text
            onPress={() => navigation.navigate("Signup")}
            style={[signupStyle, styles.signupLight]}
          >
            Create New One
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  lightcontainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: (Platform.OS === 'ios') ? 100 : 50,
    paddingHorizontal: 20
  },
  darkcontainer: {
    flex: 1,
    backgroundColor: "#4169E1",
    paddingBottom: 100,
    paddingTop: (Platform.OS === 'ios') ? 100 : 50,
    paddingHorizontal: 20,
  },
  lightimage: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 100,
  },
  darkimage: {
    flex: 1,
    padding: 10,
    backgroundColor: "#4169E1",
    borderRadius: 100,
  },
  title: {
    fontSize: 100,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    paddingTop: (Platform.OS === 'ios') ? 100 : 50,
    paddingBottom: (Platform.OS === 'ios') ? 10 : 10,
    textAlign: "center",
    textShadowColor: "grey",
    textShadowRadius: 10,
    textShadowOffset: {
      width: 3,
      height: 3
    }
    
  },
  darktitle: { color: "white" },
  lighttitle: { color: "#4169E1" },
  lightforgotpassword: {
    color: "#4169E1",
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  darkforgotpassword: {
    color: "white",
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  darkInput: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "#4169E1",
    backgroundColor: "#4169E1",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  lightInput: {
    flexDirection: "row",
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: "white",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  iconstyle: { margin: 10 },
  textview: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  lightSignUp: {
    color: "#4169E1",
    margin: 5,
  },
  darkSignUp: {
    color: "white",
    margin: 5,
  },
  signupLight: {
    fontWeight: "600",
    textDecorationLine: 'underline'
  }
});
