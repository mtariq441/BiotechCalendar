import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

app.post("/api/ai-analysis/:eventId", async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        message: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable." 
      });
    }

    const { eventId } = req.params;
    const { eventData } = req.body;

    if (!eventData) {
      return res.status(400).json({ message: "Event data is required" });
    }

    const prompt = `You are a biotech analyst. Analyze this clinical trial event and provide a detailed assessment:

Event: ${eventData.title}
Type: ${eventData.type}
Date: ${eventData.dateUtc}
Company: ${eventData.company?.name} (${eventData.company?.ticker})
Trial: ${eventData.trial?.indication} - ${eventData.trial?.phase}
NCT ID: ${eventData.trial?.nctId}
Description: ${eventData.description}

Provide a JSON response with the following structure:
{
  "summary": "2-3 sentence overview of the event and its significance",
  "keyFactors": ["factor 1", "factor 2", "factor 3", "factor 4", "factor 5"],
  "bullScenario": {
    "probability": <number 0-100>,
    "priceTarget": <number>,
    "rationale": "explanation",
    "pricePath": [array of 30 daily price points starting from current price]
  },
  "baseScenario": {
    "probability": <number 0-100>,
    "priceTarget": <number>,
    "rationale": "explanation",
    "pricePath": [array of 30 daily price points]
  },
  "bearScenario": {
    "probability": <number 0-100>,
    "priceTarget": <number>,
    "rationale": "explanation",
    "pricePath": [array of 30 daily price points]
  },
  "confidenceLevel": <number 0-100>
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a biotech analyst providing detailed event analysis in JSON format." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content || "{}");
    
    res.json({
      ...analysis,
      eventId: parseInt(eventId),
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to generate AI analysis" 
    });
  }
});

export default app;
