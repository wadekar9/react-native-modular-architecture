import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FoodStackParamsList } from '../types/navigation.types';
import { EFoodStackScreens } from '../constants/screens.constants';
import { FoodCart, FoodPayment, FoodSearch, OrderConfirmation, OrderDetails, RecipeDetails } from '../screens';
import FoodBottomBar from './bottom-tabs.navigator';

const Stack = createNativeStackNavigator<FoodStackParamsList>();

const FoodStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={EFoodStackScreens.FOOD_BOTTOM_TAB} component={FoodBottomBar} />
    <Stack.Screen name={EFoodStackScreens.RECIPE_DETAILS} component={RecipeDetails} />
    <Stack.Screen name={EFoodStackScreens.FOOD_SEARCH} component={FoodSearch} />
    <Stack.Screen name={EFoodStackScreens.FOOD_CART} component={FoodCart} />
    <Stack.Screen name={EFoodStackScreens.FOOD_PAYMENT} component={FoodPayment} />
    <Stack.Screen name={EFoodStackScreens.ORDER_CONFIRMATION} component={OrderConfirmation} />
    <Stack.Screen name={EFoodStackScreens.ORDER_DETAILS} component={OrderDetails} />
  </Stack.Navigator>
);

export default FoodStack;
