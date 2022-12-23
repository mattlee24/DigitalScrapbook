import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    justifyContent: 'center',
  },
})