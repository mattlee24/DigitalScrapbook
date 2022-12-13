import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeStack from './HomeStack';
import AuthStack from './AuthStack';

const RouteNavigator = () => {
    const Stack = createStackNavigator();
  return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
        <Stack.Screen name="AuthStack" component={AuthStack}/>
        <Stack.Screen name="HomeStack" component={HomeStack} />
        </Stack.Navigator> 
    )
}

export default RouteNavigator