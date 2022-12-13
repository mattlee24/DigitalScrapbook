import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from '../Screens/LoginScreen'
import SignupScreen from "../Screens/SignupScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}