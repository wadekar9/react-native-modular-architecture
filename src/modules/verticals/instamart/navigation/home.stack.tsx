import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstamartHomeScreen from '../screens/home';
import type { InstamartStackParamList } from './types';

const Stack = createNativeStackNavigator<InstamartStackParamList>();

const InstamartHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="InstamartHome" component={InstamartHomeScreen} />
  </Stack.Navigator>
);

export default InstamartHomeStack;