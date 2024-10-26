import React from 'react';
import { Clock } from 'lucide-react';
import { type Recipe } from '@/lib/recipeUtils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="font-display text-xl">{recipe.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Clock size={16} className="text-sage-500" />
          <span>{totalTime} mins</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;