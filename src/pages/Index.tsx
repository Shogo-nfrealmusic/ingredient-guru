import React, { useState } from 'react';
import IngredientInput from '@/components/IngredientInput';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import { suggestRecipes, type Recipe } from '@/lib/recipeUtils';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleIngredientsChange = (ingredients: string[]) => {
    const suggestedRecipes = suggestRecipes(ingredients);
    setRecipes(suggestedRecipes);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl md:text-5xl text-sage-700">
            Recipe Finder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your available ingredients and discover delicious recipes you can make right now.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <IngredientInput onIngredientsChange={handleIngredientsChange} />
        </div>

        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            Add some ingredients to discover recipes!
          </div>
        )}

        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            isOpen={!!selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;