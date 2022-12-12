import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HomeScreen  from '../Screens/HomeScreen';
import ListScreen from '../Screens/ListScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../colors';

const HomeStack = () => {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
            initialRouteName='HomeScreen'
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: [{...styles.shadow},],
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "List") {
                        iconName = focused ? "list" : "list-outline";
                    }   
                    return (
                        <Ionicons
                            name={iconName}
                            size={30}
                            color={focused? colors.black : colors.lightBlack}
                            opacity={0.5}
                        />
                    );
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="List" component={ListScreen} />
        </Tab.Navigator>
    )
}

export default HomeStack
      
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.orange
    },
    shadow: {
        backgroundColor: colors.grey,
        position: "absolute",
        borderTopWidth: 1,
        borderTopColor: colors.black,
        height: 80,
        paddingBottom: 0,
    }
});