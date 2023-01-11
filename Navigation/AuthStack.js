import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreenStack from './LoginScreenStack'
import SignupScreen from "../Screens/SignupScreen";

/**
* 
* @return The Auth stack, includes loginScreenStack and SignupScreen
* 
*/

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreenStack} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
}