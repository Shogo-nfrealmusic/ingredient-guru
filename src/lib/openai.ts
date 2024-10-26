import OpenAI from 'openai';

const openaiInstance = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export const analyzeRecipe = async (recipe: string) => {
  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and food critic. Analyze the recipe and provide a brief, constructive critique."
        },
        {
          role: "user",
          content: `Please analyze this recipe: ${recipe}`
        }
      ],
    });

    return response.choices[0]?.message?.content || "No analysis available";
  } catch (error) {
    console.error('Error analyzing recipe:', error);
    throw error;
  }
};

const RECIPE_IMAGES = {
  eggs: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
  noodles: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327',
  salad: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352',
  fruits: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  breakfast: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
};

const findRelevantImage = (ingredients: string[]) => {
  const lowerIngredients = ingredients.map(i => i.toLowerCase());
  
  // Check for specific ingredients
  for (const ingredient of lowerIngredients) {
    if (ingredient.includes('egg')) return RECIPE_IMAGES.eggs;
    if (ingredient.includes('pasta') || ingredient.includes('spaghetti')) return RECIPE_IMAGES.pasta;
    if (ingredient.includes('noodle')) return RECIPE_IMAGES.noodles;
    if (ingredient.includes('lettuce') || ingredient.includes('salad')) return RECIPE_IMAGES.salad;
    if (ingredient.includes('fruit') || ingredient.includes('apple') || ingredient.includes('banana')) return RECIPE_IMAGES.fruits;
  }
  
  return RECIPE_IMAGES.default;
};

export const suggestRecipesFromIngredients = async (ingredients: string[]) => {
  try {
    const prompt = `I have the following ingredients: ${ingredients.join(', ')}.
    Please suggest three unique recipes I can make using these ingredients. 
    Each recipe should include:
    - A short description
    - A list of ingredients required
    - Step-by-step cooking instructions
    - Estimated preparation and cooking time
    - Suggested serving size

    Format the response as a JSON array with the following structure for each recipe:
    {
      "title": "Recipe Title",
      "description": "Short description",
      "prepTime": number (in minutes),
      "cookTime": number (in minutes),
      "servings": number,
      "ingredients": ["ingredient1", "ingredient2", ...],
      "steps": ["step1", "step2", ...],
      "imageUrl": null
    }`;

    const response = await openaiInstance.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef who creates recipes based on available ingredients. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const content = response.choices[0]?.message?.content || "[]";
    const recipes = JSON.parse(content);
    
    // Assign relevant images based on ingredients
    return recipes.map((recipe: any) => ({
      ...recipe,
      imageUrl: findRelevantImage(recipe.ingredients)
    }));
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    throw error;
  }
};