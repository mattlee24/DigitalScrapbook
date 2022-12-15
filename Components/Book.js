import { StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from '../colors';

const Book = () => {
  return (
    <MaterialCommunityIcons
        style={styles.bookstyle}
        name="book-open-variant"
        size={350}
        color={colors.navy}
    />
  )
}

export default Book

const styles = StyleSheet.create({
    bookstyle: { 
        textAlign: 'center',
        flex: 1
    },
})