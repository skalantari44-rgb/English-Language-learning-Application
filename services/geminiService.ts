import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RoomData, Puzzle, Difficulty } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const puzzleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: "The puzzle question or riddle." },
    type: { type: Type.STRING, enum: ["vocabulary", "grammar", "comprehension", "riddle"] },
    correctAnswer: { type: Type.STRING, description: "The precise correct answer." },
    hint: { type: Type.STRING, description: "A subtle hint to help the user if they are stuck." },
    explanation: { type: Type.STRING, description: "Educational explanation of why the answer is correct." },
  },
  required: ["question", "type", "correctAnswer", "hint", "explanation"],
};

const roomSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Creative title of the room." },
    description: { type: Type.STRING, description: "Atmospheric description of the room, 2-3 sentences." },
    theme: { type: Type.STRING },
    puzzles: {
      type: Type.ARRAY,
      items: puzzleSchema,
      description: "A list of exactly 3 progressive puzzles (Easy, Medium, Hard).",
    },
  },
  required: ["title", "description", "theme", "puzzles"],
};

export const generateRoom = async (theme: string, difficulty: Difficulty): Promise<RoomData> => {
  const prompt = `
    Create an escape room level for an English learner.
    Theme: ${theme}.
    Difficulty Level: ${difficulty}.
    
    The room should have 3 puzzles that the user must solve to escape.
    1. First puzzle: Simple, warming up.
    2. Second puzzle: Moderate challenge.
    3. Third puzzle: The final lock, challenging but fair.
    
    The puzzles should be related to English learning (grammar, vocabulary, reading comprehension) but woven into the narrative of the room.
    For 'Beginner', focus on basic nouns, verbs, and simple sentences.
    For 'Intermediate', focus on tenses, prepositions, and common idioms.
    For 'Advanced', focus on nuance, phrasal verbs, and complex riddles.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: roomSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const roomData = JSON.parse(text) as RoomData;
    // Add IDs to puzzles for local management
    roomData.puzzles = roomData.puzzles.map((p, index) => ({ ...p, id: index, solved: false }));
    return roomData;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate the room. Please try again.");
  }
};

export const checkAnswerWithGemini = async (
  puzzle: Puzzle,
  userAnswer: string
): Promise<{ isCorrect: boolean; feedback: string }> => {
  const prompt = `
    Context: An English learning puzzle.
    Question: "${puzzle.question}"
    Correct Answer: "${puzzle.correctAnswer}"
    User Answer: "${userAnswer}"
    
    Task: Evaluate if the user's answer is correct. 
    It doesn't have to be an exact string match, but it must be semantically correct in English.
    Ignore capitalization and minor punctuation differences.
    
    If incorrect, provide a gentle, encouraging hint or explanation of the mistake, but do not give the answer yet.
    If correct, provide a brief congratulatory message explaining the concept.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      feedback: { type: Type.STRING },
    },
    required: ["isCorrect", "feedback"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) return { isCorrect: false, feedback: "The spirits are silent..." };
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    // Fallback simple validation
    const isExact = userAnswer.toLowerCase().trim() === puzzle.correctAnswer.toLowerCase().trim();
    return {
      isCorrect: isExact,
      feedback: isExact ? "Perfectly done." : "That doesn't seem quite right. Try again.",
    };
  }
};
