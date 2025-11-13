import OpenAI from "openai";
import type { Event, Company, Trial, Scenario } from "@shared/schema";

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateEventAnalysis(
  event: Event,
  company?: Company,
  trial?: Trial
): Promise<{
  summary: string;
  keyFactors: string[];
  scenarios: Scenario[];
  confidence: number;
}> {
  const prompt = `You are an expert biotech analyst. Analyze the following clinical trial event and provide detailed insights.

Event Information:
- Title: ${event.title}
- Type: ${event.type}
- Date: ${new Date(event.dateUtc).toLocaleDateString()}
- Company: ${company?.name || "Unknown"}
- Therapeutic Area: ${event.therapeuticArea || "Not specified"}
${trial ? `- Trial Phase: ${trial.phase || "Not specified"}
- Trial Design: ${trial.design || "Not specified"}
- Endpoints: ${trial.endpoints?.join(", ") || "Not specified"}` : ""}

Provide your analysis in JSON format with:
1) A 2-3 sentence plain-English summary explaining the event's significance
2) An array of 3-5 key factors or endpoints to watch
3) Three scenarios (Bull, Base, Bear) with:
   - name: "Bull", "Base", or "Bear"
   - prob: probability between 0 and 1 (must sum to 1.0)
   - narrative: 3-sentence rationale for this scenario
   - priceTarget: estimated stock price target for this scenario (use current baseline of $100)
   - pricePath: array of 30 daily price points showing price evolution (each with date and price)
4) confidence: your confidence score between 0 and 1

Guidelines:
- Bull scenario: positive outcome, approval likely, strong efficacy
- Base scenario: moderate outcome, conditional approval or mixed results  
- Bear scenario: negative outcome, trial failure, or significant concerns
- Price paths should start from $100 and diverge based on scenario
- Do not provide legal or medical advice
- Mark limitations clearly

Respond ONLY with valid JSON matching this structure:
{
  "summary": "string",
  "keyFactors": ["string", "string", ...],
  "scenarios": [
    {
      "name": "Bull",
      "prob": 0.25,
      "narrative": "string",
      "priceTarget": 120,
      "pricePath": [{"date": "2025-01-20", "price": 100}, ...]
    },
    ...
  ],
  "confidence": 0.78
}`;

  if (!openai) {
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert biotech and pharmaceutical industry analyst specializing in clinical trials, FDA approvals, and market forecasting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 8192,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    const baseDate = new Date(event.dateUtc);
    const scenarios: Scenario[] = result.scenarios.map((scenario: any) => {
      if (!scenario.pricePath || scenario.pricePath.length === 0) {
        scenario.pricePath = generatePricePath(baseDate, scenario.priceTarget || 100);
      }
      return scenario;
    });

    return {
      summary: result.summary || "Analysis not available",
      keyFactors: result.keyFactors || [],
      scenarios,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
    };
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    throw new Error("Failed to generate AI analysis");
  }
}

function generatePricePath(startDate: Date, targetPrice: number): { date: string; price: number }[] {
  const path = [];
  const basePrice = 100;
  const days = 30;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Create smooth progression from basePrice to targetPrice
    const progress = i / days;
    const price = basePrice + (targetPrice - basePrice) * progress;
    
    // Add some randomness for realism
    const volatility = 0.02;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    
    path.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat((price * randomFactor).toFixed(2)),
    });
  }
  
  return path;
}
