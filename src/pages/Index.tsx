import React, { useState } from 'react';
import IngredientInput from '@/components/IngredientInput';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleIngredientsChange = async (ingredients: string[]) => {
    if (ingredients.length === 0) {
      setRecipes([]);
      return;
    }

    setIsLoading(true);
    try {
      const suggestedRecipes = await fetchRecipes(ingredients);
      setRecipes(suggestedRecipes);
      if (suggestedRecipes.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try adding different ingredients",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suggest recipes. Please try again.",
        variant: "destructive",
      });
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipes = async (ingredients: string[]) => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }), // ingredients をそのまま送信
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await response.json();
    return data; // レシピを返す
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

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Finding recipes for you...
          </div>
        ) : recipes.length > 0 ? (
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
