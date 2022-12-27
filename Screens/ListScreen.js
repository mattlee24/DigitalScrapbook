import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'

const ListScreen = () => {

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      console.log(result.assets[0].exif.GPSLatitude);
      console.log(result.assets[0].exif.GPSLongitude);
    } else {
      Alert.alert("Image Error")
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>My Scrapbooks</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <TouchableOpacity style={styles.imageView}>
        {image && <Image source={{ uri: image }} style={styles.imageStyle} />}
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    backgroundColor: colors.orange,
    width: "98%",
    height: 200,
    borderWidth: 5,
    borderRadius: 20,
    justifyContent: "center",
  },
  imageStyle: {
    width: "90%", 
    height: "90%",
    color: "orange",
    borderRadius: 20,
    alignSelf: "center",
  }
})