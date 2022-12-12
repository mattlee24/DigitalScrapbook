import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { SafeAreaView } from 'react-native-safe-area-context'

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