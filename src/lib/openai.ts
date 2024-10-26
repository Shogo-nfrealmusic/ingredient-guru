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
      "steps": ["step1", "step2", ...]
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
    return JSON.parse(content);
  } catch (error) {
    console.error('Error suggesting recipes:', error);
    throw error;
  }
};