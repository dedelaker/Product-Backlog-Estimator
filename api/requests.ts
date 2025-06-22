import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import ws from 'ws';

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Database schema
const requests = pgTable("backlog_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  answers: text("answers").array().notNull(),
  score: serial("score").notNull(),
  complexity: text("complexity").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scoring questions
const ESTIMATION_QUESTIONS = [
  {
    options: [
      { text: "No external integrations needed", score: 0 },
      { text: "Simple API integration (well-documented)", score: 20 },
      { text: "Multiple APIs or complex integration", score: 50 },
      { text: "Custom/legacy system integration", score: 80 }
    ]
  },
  {
    options: [
      { text: "No database changes", score: 0 },
      { text: "Simple table updates or new fields", score: 10 },
      { text: "New tables or moderate schema changes", score: 30 },
      { text: "Complex migrations or data restructuring", score: 60 }
    ]
  },
  {
    options: [
      { text: "Minor UI updates or existing patterns", score: 5 },
      { text: "New components using design system", score: 15 },
      { text: "Custom UI components or layouts", score: 35 },
      { text: "Complex interactive features or animations", score: 70 }
    ]
  },
  {
    options: [
      { text: "Simple CRUD operations", score: 5 },
      { text: "Moderate logic with validations", score: 20 },
      { text: "Complex calculations or workflows", score: 45 },
      { text: "Advanced algorithms or processing", score: 80 }
    ]
  },
  {
    options: [
      { text: "Basic manual testing", score: 5 },
      { text: "Unit tests for key functions", score: 15 },
      { text: "Integration and automated testing", score: 30 },
      { text: "Comprehensive testing including load/security", score: 50 }
    ]
  },
  {
    options: [
      { text: "No dependencies", score: 0 },
      { text: "Depends on completed features", score: 10 },
      { text: "Depends on work in progress", score: 30 },
      { text: "Blocked by multiple incomplete dependencies", score: 60 }
    ]
  },
  {
    options: [
      { text: "Clear requirements with detailed specs", score: 0 },
      { text: "Good requirements, some clarification needed", score: 10 },
      { text: "Basic requirements, significant research needed", score: 25 },
      { text: "Vague requirements, extensive discovery required", score: 50 }
    ]
  },
  {
    options: [
      { text: "No special performance requirements", score: 0 },
      { text: "Standard performance expectations", score: 10 },
      { text: "High performance requirements", score: 30 },
      { text: "Critical performance with complex optimization", score: 60 }
    ]
  },
  {
    options: [
      { text: "Standard security practices", score: 0 },
      { text: "Additional security validation required", score: 15 },
      { text: "Compliance requirements (GDPR, SOX, etc.)", score: 35 },
      { text: "High-security features or audit requirements", score: 70 }
    ]
  },
  {
    options: [
      { text: "Standard deployment process", score: 0 },
      { text: "Requires configuration changes", score: 10 },
      { text: "Phased rollout or feature flags needed", score: 25 },
      { text: "Complex deployment with multiple environments", score: 45 }
    ]
  }
];

let db: any = null;

function initializeDB() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool });
  }
  return db;
}

function calculateScoreFromAnswers(answers: string[]): number {
  let totalScore = 0;
  ESTIMATION_QUESTIONS.forEach((question, index) => {
    const selectedAnswer = answers[index];
    if (selectedAnswer) {
      const option = question.options.find(opt => opt.text === selectedAnswer);
      if (option) {
        totalScore += option.score;
      }
    }
  });
  return totalScore;
}

function getComplexityFromScore(score: number): string {
  if (score <= 100) return "Low Complexity";
  if (score <= 250) return "Medium Complexity";
  if (score <= 400) return "High Complexity";
  return "Very High Complexity";
}

function getEstimatedTimeFromScore(score: number): string {
  if (score <= 50) return "Less than 1 week";
  if (score <= 150) return "1-3 weeks";
  if (score <= 300) return "1-2 months";
  if (score <= 500) return "3-6 months";
  return "More than 6 months";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const database = initializeDB();

    switch (req.method) {
      case 'GET':
        const allRequests = await database.select().from(requests);
        return res.status(200).json(allRequests);

      case 'POST':
        const { title, answers } = req.body;
        
        if (!title || !answers || !Array.isArray(answers)) {
          return res.status(400).json({ error: 'Title and answers are required' });
        }

        const score = calculateScoreFromAnswers(answers);
        const complexity = getComplexityFromScore(score);
        const estimatedTime = getEstimatedTimeFromScore(score);
        
        const requestData = {
          title,
          answers,
          score,
          complexity,
          estimatedTime
        };
        
        const [newRequest] = await database
          .insert(requests)
          .values(requestData)
          .returning();
        
        return res.status(201).json(newRequest);

      case 'DELETE':
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        
        await database.delete(requests).where(eq(requests.id, parseInt(id as string)));
        return res.status(204).end();

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}