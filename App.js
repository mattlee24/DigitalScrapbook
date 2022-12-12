import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet, ScrollView, TouchableOpacity, LogBox } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {

  LogBox.ignoreAllLogs();

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{alignItems: "center"}}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <TouchableOpacity style={styles.imageView}>
          {image && <Image source={{ uri: image }} style={styles.imageStyle} />}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageView: {
    backgroundColor: "orange",
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
});
