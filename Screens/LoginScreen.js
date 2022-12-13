import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  Alert,
  TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import HomeStack from "../Components/HomeStack";
import { BlurView } from 'expo-blur';
import colors from "../colors";

export default function LoginScreen({ navigation }) {

  const uri = 'https://free4kwallpapers.com/uploads/originals/2020/10/25/colourful-light-refraction-wallpaper.jpg'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

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
    <View style={styles.container}>
      {/* <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/> */}
      <View style={styles.lightimage}>
        <BlurView intensity={100} style={styles.blur}>
          <Text style={styles.title}>Login</Text>
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
              placeholderTextColor={colors.lightBlue}
              placeholder="Email"
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
              placeholderTextColor={colors.lightBlue}
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
          <View style={styles.loginRow}>
            <TouchableOpacity
              onPress={onLogin}
              style={styles.button}
            ><Text style={styles.textColor}>Login</Text>
            </TouchableOpacity>
            <Text
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.lightforgotpassword}
            >
              Forgot Password
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={styles.button}
          ><Text style={styles.textColor}>Create Account</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  lightimage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    backgroundColor: colors.baige,
  },
  blur: {
    marginVertical: 100,
    paddingVertical: 40,
    width:"100%",
    alignSelf: "center",
    borderWidth: 3,
    borderColor: colors.navy
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginHorizontal: 100,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: colors.baige,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
  },
  loginRow: {

  },
  textColor: {
    color: colors.navy
  },
  title: {
    fontSize: 100,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    paddingBottom: (Platform.OS === 'ios') ? 10 : 10,
    textAlign: "center",
    textShadowColor: "grey",
    textShadowRadius: 10,
    textShadowOffset: {
      width: 3,
      height: 3
    },
    color: colors.navy
  },
  lightforgotpassword: {
    color: colors.navy,
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: 'center',
    marginTop: 20
  },
  lightInput: {
    flexDirection: "row",
    marginBottom: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.nacy,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.nacy,
    backgroundColor: colors.baige,
    paddingLeft: 20,
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
