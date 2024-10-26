export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  ingredients: string[];
  steps: string[];
  imageUrl: string;
}

export const suggestRecipes = (ingredients: string[]): Recipe[] => {
  // This is a simple mock implementation
  // In a real app, this would be connected to a backend API
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      title: "Classic Pasta Carbonara",
      description: "A creamy Italian pasta dish with eggs and cheese",
      prepTime: 10,
      cookTime: 20,
      ingredients: ["pasta", "eggs", "cheese", "bacon", "black pepper"],
      steps: [
        "Boil pasta in salted water",
        "Cook bacon until crispy",
        "Mix eggs and cheese",
        "Combine all ingredients",
      ],
      imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    {
      id: "2",
      title: "Simple Vegetable Stir-Fry",
      description: "Quick and healthy vegetable stir-fry",
      prepTime: 15,
      cookTime: 10,
      ingredients: ["vegetables", "soy sauce", "garlic", "ginger", "oil"],
      steps: [
        "Chop vegetables",
        "Heat oil in wok",
        "Stir-fry vegetables",
        "Add sauce and serve",
      ],
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
  ];

  return mockRecipes.filter(recipe =>
    ingredients.some(ingredient =>
      recipe.ingredients.some(recipeIngredient =>
        recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  );
};