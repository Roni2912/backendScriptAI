const axios = require('axios');

exports.generateScript = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY.trim().replace(/^["']|["']$/g, '');
    
    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API key is not configured" });
    }

    const modelName = 'gemini-1.5-pro-latest';

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    if (!generatedText) {
      return res.status(500).json({ message: "Failed to generate script" });
    }

    res.json({ 
      generated_script: generatedText,
      prompt: prompt,
      model: modelName
    });
  } catch (error) {
    console.error('Script Generation Error:', error.response ? error.response.data : error);

    const errorMessage = 
      error.response?.data?.error?.message || 
      error.message || 
      'Unknown error occurred';
    
    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({ 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? 
        (error.response?.data || error.toString()) : undefined
    });
  }
};
