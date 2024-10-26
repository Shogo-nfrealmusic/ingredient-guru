import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiInstance = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const getOpenAIInstance = () => {
  if (!openaiInstance) {
    throw new Error('OpenAI not initialized. Please set your API key first.');
  }
  return openaiInstance;
};

export const analyzeRecipe = async (recipe: string) => {
  const openai = getOpenAIInstance();
  
  try {
    const response = await openai.chat.completions.create({
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