const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is stored in the .env file
});

exports.generateAiWorkout = async (req, res) => {
  const { age, experienceLevel, goal, duration } = req.body;

  try {
    // Call the OpenAI API to generate a workout plan
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a fitness assistant. Generate a workout plan based on user input.',
        },
        {
          role: 'user',
          content: `Generate a workout plan for a ${age}-year-old with ${experienceLevel} experience, aiming for ${goal}, with a duration of ${duration} minutes.`,
        },
      ],
      max_tokens: 150, // Adjust based on the length of response you expect
    });

    const generatedWorkout = response.choices[0].message.content;

    // Return the workout to the frontend
    res.status(200).json({ workout: generatedWorkout });
  } catch (error) {
    console.error('Error generating AI workout:', error);
    res.status(500).json({ error: 'Failed to generate AI workout' });
  }
};
