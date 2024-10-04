require('dotenv').config();
const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI API with your key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate a workout with exponential backoff for retries
const generateWorkout = async (
  age,
  experienceLevel,
  goal,
  duration,
  request,
  retries = 5,
  delay = 2000
) => {
  try {
    // Make the API request to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a fitness assistant. Generate a workout plan based on user input.',
        },
        {
          role: 'user',
          content: `
            Generate a workout plan for a ${age}-year-old with ${experienceLevel} experience, aiming for ${goal}, with a duration of ${duration} minutes and keeping in mind this request: ${request}. Please also include kg when possible.

        Every single exercise should start with a number, do not include any number or anything other that a number, and should have the following fields:

          name: [exercise name]
          sets: [number of sets]
          reps: [number of reps]
          kg: [weight in kg]
          rest: [rest time in seconds]
          muscle_group: [targeted muscle group]
          notes: [exercise notes]
          video: [URL of a video demonstrating the exercise]

        Please provide no more than 3 exercises max, and ensure the response is structured exactly as requested. Remember, all exercises should start with a number.
          `,
        },
      ],
      max_tokens: 1500,
    });

    // Return the generated workout
    return response.choices[0].message.content;
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      // If a rate limit error occurs, use exponential backoff
      console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);

      // Wait for the delay (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request, doubling the delay for the next retry
      return generateWorkout(
        age,
        experienceLevel,
        goal,
        duration,
        retries - 1,
        delay * 2
      );
    } else {
      // If it's a different error or no retries left, throw the error
      console.error('Error with OpenAI API:', error);
      throw error;
    }
  }
};

module.exports = { generateWorkout };
