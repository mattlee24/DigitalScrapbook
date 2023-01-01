import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RouteNavigator from './Navigation/RouteNavigator';
import { LogBox } from 'react-native';

export default function App() {

  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer>
       <RouteNavigator />
    </NavigationContainer>
  );

}