import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import Book from "./BookLoading";
import colors from '../colors';
import { useFonts } from 'expo-font';

const CreateAccountLoading = () => {

  const [fontsLoaded] = useFonts({
    'Sketching-Universe': require('../assets/fonts/Sketching-Universe.otf'),
  });

  if (!fontsLoaded) {
    <View style={styles.containerLoading}>
        <Book />
        <ActivityIndicator size="large" color={colors.navy} style={styles.ActivityIndicator}/>
    </View>
  }

  return (
    <View style={styles.containerLoading}>
        <Book />
        <Text style={styles.loadingText}>
          Creating Account...
        </Text>
        <ActivityIndicator size="large" color={colors.navy} style={styles.ActivityIndicator}/>
    </View>
  )
}

export default CreateAccountLoading

const styles = StyleSheet.create({
    containerLoading: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: colors.baige,
      },
      loadingText: {
        color: colors.navy,
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 45,
        fontFamily: 'Sketching-Universe',
      },
})