import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ProfileScreen from '../Screens/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../colors';
import HomeScreenStack from './HomeScreenStack';
import ListScreenStack from './ListScreenStack';

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
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }  
                    return (
                        <Ionicons
                            name={iconName}
                            size={30}
                            color={focused? colors.navy : colors.lightnavy}
                            opacity={0.5}
                        />
                    );
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreenStack} />
            <Tab.Screen name="List" component={ListScreenStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
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
        borderTopColor: colors.navy,
        height: 80,
        paddingBottom: 0,
        marginBottom: 20,
        marginHorizontal: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colors.navy,
        borderRightWidth: 5,
        borderBottomWidth: 5,
        zIndex: 0,
    }
});