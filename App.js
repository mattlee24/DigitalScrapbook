import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RouteNavigator from './Navigation/RouteNavigator';
import { LogBox } from 'react-native';

export default function App() {

  LogBox.ignoreAllLogs();

  /**
  * 
  * @return The main navigator for the application
  * 
  */

  return (
    <NavigationContainer>
       <RouteNavigator />
    </NavigationContainer>
  );

}