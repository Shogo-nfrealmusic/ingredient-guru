import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();


const openaiInstance = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const analyzeRecipe = async (recipe) => {
  try {
    const response = await openaiInstance.chat.completions.create({
      model: "gpt-4-turbo", // Updated to use gpt-4-turbo
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

export const suggestRecipesFromIngredients = async (ingredients) => {
  try {
    const prompt = `I have the following ingredients: ${ingredients.join(', ')}.
    Please suggest three unique recipes that I can create using *only* these ingredients. 
    Ensure that the recipes are diverse and make good use of the provided ingredients. 
    Each recipe should include the following details:
    - A concise and appetizing title that reflects the dish.
    - A short, engaging description of the dish that highlights its flavor and appeal.
    - A comprehensive list of required ingredients, strictly using *only* the ingredients I provided.
    - Clear, step-by-step cooking instructions, each step clearly numbered for easy following.
    - Estimated preparation time (in minutes) and cooking time (in minutes) separately.
    - Total time required (the sum of preparation and cooking times).
    - Suggested serving size (e.g., "Serves 2").
    - A detailed breakdown of key nutritional information per serving, including:
      - Total calories (in kcal).
      - Protein content (in grams).
      - Carbohydrate content (in grams).
      - Fat content (in grams).

    Format the response as a JSON array with the following structure for each recipe:
    {
      "title": "Recipe Title",
      "description": "Short description highlighting flavor",
      "prepTime": number (in minutes),
      "cookTime": number (in minutes),
      "totalTime": number (in minutes),
      "servings": number,
      "ingredients": ["ingredient1", "ingredient2", ...],
      "steps": ["step1", "step2", ...],
      "nutrition": {
        "calories": number,
        "protein": "number of grams",
        "carbohydrates": "number of grams",
        "fat": "number of grams"
      }
    }`;


    const response = await openaiInstance.chat.completions.create({
      model: "gpt-4-turbo", // Updated to use gpt-4-turbo
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

    // Attempt to parse the JSON and handle any errors gracefully
    try {
      const recipes = JSON.parse(content);
      return recipes;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      console.error('Response content:', content);
      throw new Error('Failed to parse recipe suggestions. Please check the response format.');
    }
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    throw error;
  }
};
