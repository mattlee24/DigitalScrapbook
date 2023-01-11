import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  PixelRatio,  
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
import CreateAccountLoading from "../Components/CreateAccountLoading";
import { useFonts } from 'expo-font';
import CountryPicker from 'react-native-country-picker-modal';

export default function SignupScreen({ navigation }) {

  /**
  * All the variables needed for the page
  */

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
    'Handwriting': require('../assets/fonts/Handwriting.ttf'),
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicBlob, setProfilePicBlob] = useState(null);
  const [country, setCountry] = useState("");
  const [ isLoading, setIsLoading ] = useState(false)

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app);

  /**
  * Gets image from camer roll,
  * sets @param profilePicBlob to the resulting uri
  */

  const onChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri)
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      setProfilePicBlob(blob)
    } else {
      Alert.alert("Image Error")
    }
  };

  /**
  * Uploads to firestore 
  * @param firstName
  * @param lastName
  * @param email
  * @param password
  * @param country
  * 
  * Uploads to firebase storage
  * @param profilePicBlob
  */

  const onHandleSignup = async () => {
    if ( firstName != "" & lastName != "" & email != "" & password != "" & country != ""){
      createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) =>{
        setIsLoading(true)
        const user = userCredential.user;
        const newDoc = doc(db, 'Users/'+user.uid)
        const docData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          country: country,
        }
        setDoc(newDoc, docData)
        const storageRef = ref(storage, 'ProfilePictures/' + email);
        await uploadBytes(storageRef, profilePicBlob).then(() => {
          setIsLoading(false)
        })
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

  if (isLoading){
    return(
      <CreateAccountLoading />
    )
  } else {
    if (fontsLoaded) {
      return (
        <KeyboardAvoidingView style={styles.container1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Text style={styles.title} Keyboard>Welcome to Your Digital Scrapbook</Text>
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
                <View style={styles.countryPickerView}>
                  <CountryPicker
                    onSelect={(value)=> setCountry(value.name)}
                    translation='eng'
                    withFilter={true}
                    withFlagButton={true}
                    withCountryNameButton={true}
                  />
                </View>
                <View style={styles.countryPickerTextView}>
                  <Text style={styles.countryText}>
                    {country}
                  </Text>
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
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    justifyContent: "flex-end",
    zIndex: 0
  },
  container1: {
    flex: 1,
    backgroundColor: colors.baige,
    zIndex: 0
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
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute'
  },
  blur: {
    marginVertical: 10,
    paddingVertical: 10,
    width:"90%",
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    zIndex: 1
  },
  countryPickerView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.grey,
    margin: 10,
  },
  countryPickerTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.grey,
    borderColor: colors.navy,
    borderWidth: 1,
    marginTop: 10,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    paddingVertical: 5
  }, 
  countryText: {
    fontFamily: 'Sketching-Universe',
    fontSize: 30,
    color: colors.navy
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
    borderBottomWidth: 5,
    borderRightWidth: 5
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
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
  textColorLogin: {
    color: colors.navy,
    fontFamily: 'Sketching-Universe',
    fontSize: 18
  },
  title: {
    fontSize: 60,
    paddingHorizontal: 15,
    fontWeight: (Platform.OS === 'ios') ? "900" : "bold",
    width: "100%",
    marginTop: 60,
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
    fontSize: 70,
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
    borderWidth: 1,
    borderColor: colors.navy,
    borderBottomWidth: 5,
    borderRightWidth: 5
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
