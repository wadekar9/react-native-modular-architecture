import { View, Text } from 'react-native'
import React from 'react'
import { EFoodBottomScreens } from '../../constants/screens.constants'
import { FoodBottomBarScreenProps } from '../../types/navigation.types'

const MyOrders : React.FC<FoodBottomBarScreenProps<EFoodBottomScreens.MY_ORDERS>> = () => {
  return (
    <View>
      <Text>MyOrders</Text>
    </View>
  )
}

export default MyOrders
