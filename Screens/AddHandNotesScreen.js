import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../colors';

const AddHandNotesScreen = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <Text>AddHandNotesScreen</Text>
    </View>
  )
}

export default AddHandNotesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.baige,
        alignItems: 'center',
        justifyContent: 'center',
      },
})