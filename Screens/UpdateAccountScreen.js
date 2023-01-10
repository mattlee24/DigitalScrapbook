import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image, 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getAuth, deleteUser, updatePassword } from 'firebase/auth';
import { firebaseConfig } from "../Config/firebase";
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import colors from "../colors";
import * as ImagePicker from "expo-image-picker";
import UpdateAccountLoading from '../Components/UpdateAccountLoading';
import { useFonts } from 'expo-font';
import CountryPicker from 'react-native-country-picker-modal';
import AuthStack from '../Navigation/AuthStack';

export default function SignupScreen({ navigation }) {

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
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const currentUser = auth.currentUser;

  const userRef = doc(db, "Users/", currentUser.uid);
  const profilePicRef = ref(storage, 'ProfilePictures/' + currentUser.email)

  useEffect(() => {
    const getUserDetails = async () => {
      const userData = await getDoc(userRef);
      setFirstName(userData.data().firstName);
      setLastName(userData.data().lastName);
      setCountry(userData.data().country);
      setEmail(userData.data().email);
      setPassword(userData.data().password);
      getDownloadURL(ref(storage, 'ProfilePictures/'+userData.data().email)).then((url) => {
        setProfilePic(url);
      })
    }
    getUserDetails()
  }, [])

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

  const onHandleUpdate = async () => {
    if ( firstName != "" & lastName != "" & email != "" & password != "" & country != ""){
      await updateDoc(userRef, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        country: country,
      })
      .then( async () => {
        setIsLoading(true)
        const storageRef = ref(storage, 'ProfilePictures/' + email);
        await uploadBytes(storageRef, profilePicBlob).then(() => {
          updatePassword(currentUser, password).then(()=> {
            setIsLoading(false)
            Alert.alert('Account Updated')
            navigation.navigate("ProfileScreen")
          })
        })
      }) 
      .catch(error => {
        Alert.alert(error.message)
      })
    } else {
      Alert.alert("Don't leave fields empty!")
    }
  };

  const deleteuser = async () => {
    deleteUser(currentUser).then(async () => {
      deleteObject(profilePicRef).then(async () => {
        await deleteDoc(doc(db, "Users/", currentUser.uid)).then(() => {
          Alert.alert("User Successfully Deleted");
          navigation.navigate(AuthStack);
        })
      })
    })
  }

  if (isLoading){
    return(
      <UpdateAccountLoading />
    )
  } else {
    if (fontsLoaded) {
      return (
        <KeyboardAvoidingView style={styles.container1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {/* <Book /> */}
          <View style={styles.container}>
            {/* <Image source={{ uri }} style={[styles.image, StyleSheet.absoluteFill]}/> */}
            <View style={styles.lightimage}>
            <Text style={styles.title} Keyboard>Update Your Account</Text>
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
                    placeholder={"First Name"}
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
                  onPress={onHandleUpdate}
                  style={styles.button}
                ><Text style={styles.textColor}>Update Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deleteuser}
                  style={styles.button}
                ><Text style={styles.textColorDelete}>Delete Account</Text>
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
    marginTop: -100
  },
  lightimage: {
    width: "100%",
    backgroundColor: colors.baige,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    paddingVertical: 10,
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    paddingTop: 50
  },
  blur: {
    marginVertical: 100,
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
    backgroundColor: colors.baige,
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
  textColorDelete: {
    color: colors.red,
    fontFamily: 'Sketching-Universe',
    fontSize: 40
  },
  title: {
    fontSize: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 15,
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
