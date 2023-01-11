import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import colors from '../colors';

const Loading = () => {

  /**
  * 
  * @returns Activity Indicator, to be used to signify loading throughout the app
  * 
  */

  return (
    <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color={colors.navy} style={styles.ActivityIndicator}/>
    </View>
  )
}

export default Loading

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