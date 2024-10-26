import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { type Recipe } from '@/lib/recipeUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { analyzeRecipe } from '@/lib/openai';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RecipeDetailProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const recipeText = `
        Recipe: ${recipe.title}
        Description: ${recipe.description}
        Ingredients: ${recipe.ingredients.join(', ')}
        Steps: ${recipe.steps.join(' ')}
      `;
      
      const result = await analyzeRecipe(recipeText);
      setAnalysis(result);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please make sure you've set your OpenAI API key.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{recipe.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-sage-500" />
              <span>Prep: {recipe.prepTime} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-sage-500" />
              <span>Cook: {recipe.cookTime} mins</span>
            </div>
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <span>Serves: {recipe.servings}</span>
              </div>
            )}
          </div>

          {recipe.nutritionalInfo && (
            <div className="bg-sage-50 p-4 rounded-lg">
              <h3 className="font-display text-lg mb-2">Nutritional Information (per serving)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-medium">{recipe.nutritionalInfo.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="font-medium">{recipe.nutritionalInfo.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="font-medium">{recipe.nutritionalInfo.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="font-medium">{recipe.nutritionalInfo.fat}g</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-display text-lg mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-muted-foreground">{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={index} className="text-muted-foreground">{step}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Get AI Analysis"}
            </Button>
            
            {analysis && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-display text-lg mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">{analysis}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetail;