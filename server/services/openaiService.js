import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const generateModifiedResume = async (
	resumeText,
	jobDescription,
	prompt
) => {
	try {
		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are an expert resume writer who helps tailor resumes to specific job descriptions while maintaining the original tone and style of the resume and natural flow of the resume.",
				},
				{
					role: "user",
					content: `
                        Job Description:
                        ${jobDescription}

                        Current Resume:
                        ${resumeText}

                        Instructions:
                        ${prompt}
                    `,
				},
			],
			temperature: 0.7,
			max_tokens: 2000,
			presence_penalty: 0.6,
			frequency_penalty: 0.6,
		});

		return chatCompletion.choices[0].message.content;
	} catch (error) {
		console.error("OpenAI API error:", error);
		throw error;
	}
};
