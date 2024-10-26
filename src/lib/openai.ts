import OpenAI from 'openai';

const openaiInstance = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

const GOOGLE_API_KEY = 'AIzaSyDrwudY9_89Pz7tfbu5n0FXH2lph4c0GyM';
const SEARCH_ENGINE_ID = '017576662512468239146:omuauf_lfve';

const getRecipeImage = async (recipeName: string, ingredients: string[]) => {
  try {
    const searchQuery = `${recipeName} recipe with ${ingredients[0]}`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=1&safe=high`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data = await response.json();
    return data.items?.[0]?.link || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
  } catch (error) {
    console.error('Error fetching image:', error);
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
  }
};

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
    
    // Fetch images for each recipe
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe: any) => ({
        ...recipe,
        imageUrl: await getRecipeImage(recipe.title, recipe.ingredients)
      }))
    );

    return recipesWithImages;
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    throw error;
  }
};
