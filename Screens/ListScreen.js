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
})