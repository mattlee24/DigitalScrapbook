import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'

const ListScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>My Scrapbooks</Text>
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