import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  async generateSummary(text: string, language: string) {
    const prompt = `You are a world-class medical device regulation expert. 
    Based on the following input text, perform comprehensive web research (simulated if search tool not available) and provide a detailed summary (2000-3000 words).
    Include:
    1. Executive Summary
    2. Regulatory Landscape Overview
    3. Key Requirements
    4. Recent Updates & Trends
    5. Implications for Manufacturers
    6. Evidence Map (Table)
    7. Sources Consulted
    
    Output Language: ${language === "zh" ? "Traditional Chinese" : "English"}
    Input Text: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text;
  },

  async generateReport(summary: string, template: string, language: string) {
    const prompt = `You are a regulatory affairs officer. 
    Using the following summary and template, generate a comprehensive medical device regulation report (3000-4000 words).
    Follow the template structure strictly.
    
    Output Language: ${language === "zh" ? "Traditional Chinese" : "English"}
    Template: ${template}
    Summary: ${summary}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  },

  async generateSkill(input: string, report: string, language: string) {
    const prompt = `Create a 'skill.md' file that describes how an AI agent should reliably produce a comprehensive medical device regulation report for similar inputs in the future.
    Follow the 'Artistic Agentic Flow System' specification for skill creation.
    Include:
    - Frontmatter (name, description)
    - Trigger guidance
    - Required inputs
    - Workflow steps
    - Output format templates
    - Quality checklist
    - Test prompts
    
    Output Language: ${language === "zh" ? "Traditional Chinese" : "English"}
    Original Input: ${input}
    Generated Report: ${report}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  },
};
