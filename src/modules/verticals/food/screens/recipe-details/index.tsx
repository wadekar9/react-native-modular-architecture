import React from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { ArrowLeft, Clock3, Flame, Plus, Star, Users } from 'lucide-react-native';
import { IconButton, ThemedView, ThemeText } from '@shared/components/ui';
import { useAppTheme } from '@shared/hooks';
import { EFoodStackScreens } from '../../constants/screens.constants';
import type { FoodStackScreenProps } from '../../types/navigation.types';
import { useFoodTranslation, useRecipeDetails } from '../../hooks';
import RecipeDetailsSkeleton from './recipe-details-skeleton.component';
import { styling } from './styles';

const RecipeDetails: React.FC<FoodStackScreenProps<EFoodStackScreens.RECIPE_DETAILS>> = ({ route }) => {
  const { colors, theme } = useAppTheme();
  const { food_t } = useFoodTranslation();
  const styles = React.useMemo(() => styling(theme), [theme]);
  const {
    recipe,
    isLoading,
    isError,
    retry,
    goBack,
    demoPrice,
    cartQuantity,
    addToBasket,
  } = useRecipeDetails(route.params.recipeId);

  if (isLoading) {
    return <RecipeDetailsSkeleton />;
  }

  if (isError || !recipe) {
    return (
      <ThemedView style={styles.state}>
        <ThemeText variant="h3">{food_t('RECIPE_UNAVAILABLE')}</ThemeText>
        <ThemeText variant="body5" style={styles.secondary}>{food_t('RECIPE_UNAVAILABLE_SUBTITLE')}</ThemeText>
        <Pressable onPress={retry} style={styles.retryButton}>
          <ThemeText variant="body5" style={styles.retryLabel}>{food_t('RETRY')}</ThemeText>
        </Pressable>
        <Pressable onPress={goBack} style={styles.backLink}>
          <ThemeText variant="body5" style={styles.linkLabel}>{food_t('GO_BACK')}</ThemeText>
        </Pressable>
      </ThemedView>
    );
  }

  const cookingTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: recipe.image }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroShade} />
          <IconButton accessibilityRole="button" accessibilityLabel={food_t('GO_BACK')} onPress={goBack} style={styles.backButton}>
            <ArrowLeft size={20} color="#FFFFFF" />
          </IconButton>
          <View style={styles.heroCaption}>
            <ThemeText variant="body5" style={styles.cuisine}>{recipe.cuisine}</ThemeText>
            <ThemeText variant="h1" style={styles.title}>{recipe.name}</ThemeText>
            <View style={styles.ratingLine}>
              <Star size={15} color="#F8D28A" fill="#F8D28A" />
              <ThemeText variant="body5" style={styles.heroMeta}>
                {food_t('REVIEWS_COUNT', { rating: recipe.rating.toFixed(1), count: recipe.reviewCount })}
              </ThemeText>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Clock3 size={18} color={colors['brand-primary']} />
            <ThemeText variant="h4">{cookingTime} min</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>{food_t('TOTAL_TIME')}</ThemeText>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Users size={18} color={colors['brand-primary']} />
            <ThemeText variant="h4">{recipe.servings}</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>{food_t('SERVINGS')}</ThemeText>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Flame size={18} color={colors['brand-primary']} />
            <ThemeText variant="h4">{recipe.caloriesPerServing}</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>{food_t('KCAL_PER_SERVING')}</ThemeText>
          </View>
        </View>

        <View style={styles.metaLine}>
          <ThemeText variant="body5" style={styles.difficulty}>{recipe.difficulty}</ThemeText>
          <ThemeText variant="body5" style={styles.secondary}>
            {food_t('PREP_COOK', { prep: recipe.prepTimeMinutes, cook: recipe.cookTimeMinutes })}
          </ThemeText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <ThemeText variant="h3">{food_t('INGREDIENTS')}</ThemeText>
            <ThemeText variant="body5" style={styles.secondary}>
              {food_t('INGREDIENTS_COUNT', { count: recipe.ingredients.length })}
            </ThemeText>
          </View>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={`${recipe.id}-ingredient-${index}`} style={styles.ingredientRow}>
              <View style={styles.bullet} />
              <ThemeText variant="body5" style={styles.ingredient}>{ingredient}</ThemeText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemeText variant="h3">{food_t('METHOD')}</ThemeText>
          {recipe.instructions.map((instruction, index) => (
            <View key={`${recipe.id}-step-${index}`} style={styles.instructionRow}>
              <View style={styles.stepNumber}><ThemeText variant="body5" style={styles.stepLabel}>{index + 1}</ThemeText></View>
              <ThemeText variant="body5" style={styles.instruction}>{instruction}</ThemeText>
            </View>
          ))}
        </View>

        <View style={styles.tags}>
          {recipe.tags.map(tag => <ThemeText key={tag} variant="body5" style={styles.tag}>{tag}</ThemeText>)}
          {recipe.mealType.map(meal => <ThemeText key={meal} variant="body5" style={styles.mealTag}>{meal}</ThemeText>)}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <ThemeText variant="body5" style={styles.secondary}>{food_t('DEMO_PRICE')}</ThemeText>
          <ThemeText variant="h3">₹{demoPrice}</ThemeText>
        </View>
        <Pressable onPress={addToBasket} style={styles.addButton}>
          <Plus size={18} color="#FFFFFF" />
          <ThemeText variant="body4" style={styles.addLabel}>
            {cartQuantity ? food_t('ADD_ANOTHER', { count: cartQuantity }) : food_t('ADD_TO_BASKET')}
          </ThemeText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

export default RecipeDetails;
