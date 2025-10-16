
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionType } from '../types';
import type { ChatMessage } from '../types';
import { MAX_TEXT_LENGTH } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getModel = () => ai.models;

const getTruncatedText = (text: string) => {
    if (text.length > MAX_TEXT_LENGTH) {
        return text.substring(0, MAX_TEXT_LENGTH);
    }
    return text;
};

const mcqSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING, description: "A short topic category for this question."}
    },
    required: ['question', 'options', 'correctAnswer', 'explanation', 'topic']
};

const saqSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        answer: { type: Type.STRING, description: "A concise, correct answer." },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING, description: "A short topic category for this question."}
    },
    required: ['question', 'answer', 'explanation', 'topic']
};

const laqSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        answerKeywords: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of keywords or key phrases expected in a good answer."
        },
        explanation: { type: Type.STRING, description: "A detailed explanation of the ideal answer." },
        topic: { type: Type.STRING, description: "A short topic category for this question."}
    },
    required: ['question', 'answerKeywords', 'explanation', 'topic']
};


export const generateQuiz = async (pdfText: string, type: QuestionType, count: number) => {
    const truncatedText = getTruncatedText(pdfText);

    let schema;
    let typeDescription;
    switch(type) {
        case QuestionType.MCQ:
            schema = mcqSchema;
            typeDescription = "Multiple Choice Questions";
            break;
        case QuestionType.SAQ:
            schema = saqSchema;
            typeDescription = "Short Answer Questions";
            break;
        case QuestionType.LAQ:
            schema = laqSchema;
            typeDescription = "Long Answer Questions";
            break;
    }

    const prompt = `Based on the following text from a coursebook, generate ${count} unique ${typeDescription}. Ensure the questions cover different aspects of the text and vary in difficulty.

Context from the document:
---
${truncatedText}
---
`;

    try {
        const response = await getModel().generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: schema
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from the document. The content might not be suitable or the AI service is currently unavailable.");
    }
};

export const chatWithDoc = async (pdfText: string, history: ChatMessage[], newMessage: string) => {
    const truncatedText = getTruncatedText(pdfText);
    const model = getModel();

    const contents = [
        ...history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }]})),
        { role: 'user', parts: [{ text: newMessage }] }
    ];

    try {
        const result = await model.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: `You are a helpful study assistant. Your goal is to answer questions based *only* on the provided document context. If the answer is not in the document, say so. Be concise and clear in your explanations. Here is the document context: \n\n---\n${truncatedText}\n---`,
            }
        });
        
        return result;

    } catch (error) {
        console.error("Error in chat stream:", error);
        throw new Error("Failed to get chat response. Please try again.");
    }
};
