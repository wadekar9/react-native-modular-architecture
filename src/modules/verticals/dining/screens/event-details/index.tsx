import { View, Text } from 'react-native'
import React from 'react'
import { EDiningStackScreens } from '../../constants/screens.constants'
import { DiningStackScreenProps } from '../../types/navigation.types'

const EventDetails : React.FC<DiningStackScreenProps<EDiningStackScreens.EVENT_DETAILS>> = () => {
  return (
    <View>
      <Text>EventDetails</Text>
    </View>
  )
}

export default EventDetails