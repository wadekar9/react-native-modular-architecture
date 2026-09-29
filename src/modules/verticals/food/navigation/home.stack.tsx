import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodHomeScreen from '../screens/home';
import type { FoodStackParamList } from './types';

const Stack = createNativeStackNavigator<FoodStackParamList>();

const FoodHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FoodHome" component={FoodHomeScreen} />
  </Stack.Navigator>
);

export default FoodHomeStack;