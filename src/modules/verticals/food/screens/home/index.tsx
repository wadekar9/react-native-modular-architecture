import { View, Text } from 'react-native'
import React from 'react'
import { FoodBottomBarScreenProps } from '../../types/navigation.types'
import { EFoodBottomScreens } from '../../constants/screens.constants'

const FoodHome : React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.FOOD_HOME>> = () => {
  return (
    <View>
      <Text>FoodHome</Text>
    </View>
  )
}

export default FoodHome