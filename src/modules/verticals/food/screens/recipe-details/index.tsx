import { View, Text } from 'react-native'
import React from 'react'
import { FoodStackScreenProps } from '../../types/navigation.types'
import { EFoodStackScreens } from '../../constants/screens.constants'

const RecipeDetails : React.FC<FoodStackScreenProps<EFoodStackScreens.RECIPE_DETAILS>> = () => {
  return (
    <View>
      <Text>RecipeDetails</Text>
    </View>
  )
}

export default RecipeDetails
