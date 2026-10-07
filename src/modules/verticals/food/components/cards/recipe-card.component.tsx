import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Clock3, Plus, Star } from 'lucide-react-native';
import { ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import type { Recipe } from '../../types/recipe.types';
import { styling } from './recipe-card.styles';

type RecipeCardProps = {
  recipe: Recipe;
  demoPrice: number;
  quantity: number;
  onPress: () => void;
  onAdd: () => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, demoPrice, quantity, onPress, onAdd }) => {
  const { colors, theme } = useAppTheme();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const cookingTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open recipe ${recipe.name}`} onPress={onPress} style={styles.recipeButton}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <ThemeText variant="body4" numberOfLines={2} style={styles.name}>{recipe.name}</ThemeText>
            <View style={styles.rating}><Star size={13} color={colors['state-warning']} fill={colors['state-warning']} /><ThemeText variant="body5">{recipe.rating.toFixed(1)}</ThemeText></View>
          </View>
          <ThemeText variant="body5" numberOfLines={1} style={styles.metadata}>{recipe.cuisine} · {recipe.difficulty}</ThemeText>
          <View style={styles.tagRow}>
            {recipe.tags.slice(0, 2).map(tag => <ThemeText key={tag} variant="body5" numberOfLines={1} style={styles.tag}>{tag}</ThemeText>)}
          </View>
          <View style={styles.footer}>
            <View style={styles.time}>
              <Clock3 size={14} color={colors['icon-muted']} />
              <ThemeText variant="body5" style={styles.metadata}>{cookingTime} min</ThemeText>
            </View>
            <View style={styles.priceBlock}>
              <ThemeText variant="body4">₹{demoPrice}</ThemeText>
              <ThemeText variant="body5" style={styles.demoLabel}>DEMO</ThemeText>
            </View>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${recipe.name} to basket`}
        onPress={onAdd}
        style={styles.addButton}
      >
        <Plus size={16} color={colors['brand-primary']} />
        <ThemeText variant="body5" style={styles.addLabel}>{quantity ? `${quantity} added` : 'Add'}</ThemeText>
      </Pressable>
    </View>
  );
};

export default RecipeCard;