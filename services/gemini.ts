import { GoogleGenAI, Type } from "@google/genai";
import { JobType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (
  title: string,
  company: string,
  keyDetails: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert HR specialist. Write a professional and engaging job description for the following position:
      
      Job Title: ${title}
      Company: ${company}
      Key Details/Requirements: ${keyDetails}
      
      Structure the response with clear sections: "About the Role", "Key Responsibilities", and "Requirements".
      Use professional tone, but keep it concise (under 300 words).
      Do not use markdown formatting like **bold** or # headers, just use plain text with bullet points for readability.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate job description. Please try again.");
  }
};

export const generateCoverLetter = async (
  jobTitle: string,
  company: string,
  candidateName: string,
  skills: string
): Promise<string> => {
  try {
    const prompt = `
      Write a professional and persuasive cover letter for a job application.
      
      Candidate Name: ${candidateName}
      Applying for: ${jobTitle} at ${company}
      Candidate Skills/Experience: ${skills}
      
      Keep it formal, enthusiastic, and concise (under 200 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate cover letter.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Could not generate cover letter. Please try again.");
  }
};

export interface SearchResult {
  summary: string;
  sources: { title: string; uri: string }[];
}

export const searchJobs = async (query: string): Promise<SearchResult> => {
  try {
    const prompt = `Find the latest active job vacancies for: ${query}. 
    Focus on government and private sector jobs in Pakistan unless specified otherwise.
    Provide a concise summary of the top 5 opportunities found, including their titles and locations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract sources from grounding metadata
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Job Source',
        uri: chunk.web?.uri || '#'
      }))
      .filter((s: any) => s.uri !== '#') || [];

    // Remove duplicates based on URI
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values()) as { title: string; uri: string }[];

    return {
      summary: response.text || "No results found.",
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw new Error("Could not search for jobs. Please try again later.");
  }
};

export interface AutoFormatResult {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  applyLink: string;
  deadline: string;
  imageUrl?: string;
}

const JOB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    company: { type: Type.STRING },
    location: { type: Type.STRING },
    type: { type: Type.STRING, enum: Object.values(JobType) },
    salary: { type: Type.STRING },
    summary: { type: Type.STRING, description: "A rewritten unique summary of the role" },
    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    experience: { type: Type.STRING },
    education: { type: Type.STRING },
    category: { type: Type.STRING },
    deadline: { type: Type.STRING, description: "The specific deadline date (YYYY-MM-DD) if found, otherwise empty string." },
    applyLink: { type: Type.STRING, description: "The original URL or email to apply" },
    imageUrl: { type: Type.STRING, description: "Direct URL of an image found in the text (e.g., ending in .jpg, .png) or extracted from markdown image syntax." }
  },
  required: ['title', 'company', 'location', 'type', 'salary', 'summary', 'responsibilities', 'requirements', 'applyLink']
};

export const autoFormatJob = async (rawText: string): Promise<AutoFormatResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are an AI that cleans, rewrites, and formats job vacancies for my website.
        
        Task:
        - Rewrite the following raw job data uniquely.
        - Extract clear fields.
        - Remove duplicates.
        - Keep details accurate.
        - Infer missing fields (like 'type' or 'salary') if possible, otherwise use reasonable defaults (e.g., 'Full-time', 'Negotiable').
        - IMPORTANT for 'deadline': Only extract a specific date (e.g., '2024-12-31' or 'December 31, 2024') if it is explicitly stated in the text. If no specific calendar date is found, return an empty string "". Do NOT return phrases like "As soon as possible", "Until filled", or "Check original advertisement".
        - IMPORTANT for 'imageUrl': Scan the text for any valid image URLs (starting with http/https and often ending in .png, .jpg, .jpeg, .webp) that might represent a job poster, advertisement flyer, or company logo. Also look for markdown image links like ![alt](url). If found, populate this field.
        
        Raw Data:
        ${rawText}
      `,
      config: {
        responseMimeType: 'application/json',
        responseSchema: JOB_SCHEMA
      }
    });

    return parseJobResponse(response.text);
  } catch (error) {
    console.error("Gemini Auto-Format Error:", error);
    throw new Error("Could not process job data. Please check the content and try again.");
  }
};

const parseJobResponse = (jsonText: string | undefined): AutoFormatResult => {
  const data = JSON.parse(jsonText || '{}');

  const formattedDescription = `Summary:
${data.summary}

Responsibilities:
${data.responsibilities?.map((r: string) => `- ${r}`).join('\n')}

Experience: ${data.experience || 'Not specified'}
Education: ${data.education || 'Not specified'}
Category: ${data.category || 'General'}
`;

  return {
    title: data.title,
    company: data.company,
    location: data.location,
    type: data.type,
    salary: data.salary,
    description: formattedDescription,
    requirements: data.requirements || [],
    applyLink: data.applyLink,
    deadline: data.deadline,
    imageUrl: data.imageUrl
  };
};