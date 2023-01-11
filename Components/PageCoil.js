import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../colors'
import { Ionicons } from '@expo/vector-icons';

/**
 * 
 * @returns Page Coil to be used throughout the app
 * 
 * with the use of Ionicons
 * 
 */

const PageCoil = () => {
  return (
    <View style={styles.pageCoil}>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
        <View>
            <Ionicons name={"reorder-two"} size={35} color={colors.navy} style={styles.pinIconLeft}/>
            <View style={styles.circle} />
        </View>
    </View>
  )
}

export default PageCoil

const styles = StyleSheet.create({
    pageCoil: {
        zIndex: 1,
        flexDirection: 'row',
        position: 'absolute'
    },
    pinIconLeft: {
        position: 'relative',
        marginTop: -18,
        zIndex: 1,
        transform: [{ rotate: "90deg" }],
    },
    circle: {
        width: 20,
        height: 20,
        backgroundColor: colors.baige,
        borderRadius: 100,
        position: 'relative',
        marginTop: -18,
        marginLeft: 8
    }
})