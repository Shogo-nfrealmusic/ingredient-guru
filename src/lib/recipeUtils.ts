import { suggestRecipesFromIngredients } from './openai';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
  servings?: number;
}

export const suggestRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const suggestions = await suggestRecipesFromIngredients(ingredients);
    return suggestions.map((recipe: Recipe, index: number) => ({
      ...recipe,
      id: String(index + 1)
    }));
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    return [];
  }
};