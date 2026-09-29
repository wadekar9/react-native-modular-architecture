import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DineoutHomeScreen from '../screens/home';
import type { DineoutStackParamList } from './types';

const Stack = createNativeStackNavigator<DineoutStackParamList>();

const DineoutHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DineoutHome" component={DineoutHomeScreen} />
  </Stack.Navigator>
);

export default DineoutHomeStack;