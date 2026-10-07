import React from 'react';
import { TextInput, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { IconButton } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { styling } from './recipe-search-field.styles';

type RecipeSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
};

const RecipeSearchField: React.FC<RecipeSearchFieldProps> = ({ value, onChangeText, autoFocus = false }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);

  return (
    <View style={styles.searchField}>
      <Search size={19} color={colors['icon-muted']} />
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search recipes, ingredients, cuisines"
        placeholderTextColor={colors['text-muted']}
        returnKeyType="search"
        autoCorrect={false}
        style={styles.searchInput}
        accessibilityLabel="Search recipes"
      />
      {value.length > 0 ? (
        <IconButton accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText('')} style={styles.clearButton}>
          <X size={17} color={colors['icon-default']} />
        </IconButton>
      ) : null}
    </View>
  );
};

export default RecipeSearchField;