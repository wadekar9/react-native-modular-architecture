import React from 'react';
import { ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { styling } from './styles';
import { EDiningBottomScreens } from '../../constants/screens.constants';
import { DiningBottomBarScreenProps } from '../../types/navigation.types';

const Events : React.FC<DiningBottomBarScreenProps<EDiningBottomScreens.EVENTS>> = () => {

  const { theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <ThemedView style={styles.container}>
      <ThemeText variant="h2">
        Welcome to the Dining Module Events Section
      </ThemeText>
    </ThemedView>
  );
};

export default Events;
