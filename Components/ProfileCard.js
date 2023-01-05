import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'

const ProfileCard = () => {
  return (
    <View style={styles.profileCard}/>
  )
}

export default ProfileCard

const styles = StyleSheet.create({
    profileCard: {
        width: '90%',
        height: '90%',
        backgroundColor: colors.grey,
        borderRadius: 25,
        borderWidth: 1,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        borderColor: colors.navy
        }
})