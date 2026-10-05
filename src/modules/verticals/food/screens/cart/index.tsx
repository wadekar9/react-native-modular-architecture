import { View, Text } from 'react-native'
import React from 'react'
import { FoodStackScreenProps } from '../../types/navigation.types'
import { EFoodStackScreens } from '../../constants/screens.constants'

const FoodCart : React.FC<FoodStackScreenProps<EFoodStackScreens.FOOD_CART>> = () => {
  return (
    <View>
      <Text>FoodCart</Text>
    </View>
  )
}

export default FoodCart
