import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'

const InformationScreen = () => {
  return (
    <View style={styles.container}>
      <Text>InformationScreen</Text>
    </View>
  )
}

export default InformationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.baige,
    alignItems: 'center',
    justifyContent: 'center',
  },
})