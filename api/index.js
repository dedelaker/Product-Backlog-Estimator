const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const { pgTable, serial, text, timestamp } = require('drizzle-orm/pg-core');

// Handle WebSocket constructor for serverless environment
if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
} else if (typeof global !== 'undefined' && global.WebSocket) {
  neonConfig.webSocketConstructor = global.WebSocket;
} else {
  try {
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  } catch (e) {
    // WebSocket will be handled by Neon in serverless environment
  }
}

const requests = pgTable("backlog_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  answers: text("answers").array().notNull(),
  score: serial("score").notNull(),
  complexity: text("complexity").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const ESTIMATION_QUESTIONS = [
  { options: [{ text: "No external integrations needed", score: 0 }, { text: "Simple API integration (well-documented)", score: 20 }, { text: "Multiple APIs or complex integration", score: 50 }, { text: "Custom/legacy system integration", score: 80 }] },
  { options: [{ text: "No database changes", score: 0 }, { text: "Simple table updates or new fields", score: 10 }, { text: "New tables or moderate schema changes", score: 30 }, { text: "Complex migrations or data restructuring", score: 60 }] },
  { options: [{ text: "Minor UI updates or existing patterns", score: 5 }, { text: "New components using design system", score: 15 }, { text: "Custom UI components or layouts", score: 35 }, { text: "Complex interactive features or animations", score: 70 }] },
  { options: [{ text: "Simple CRUD operations", score: 5 }, { text: "Moderate logic with validations", score: 20 }, { text: "Complex calculations or workflows", score: 45 }, { text: "Advanced algorithms or processing", score: 80 }] },
  { options: [{ text: "Basic manual testing", score: 5 }, { text: "Unit tests for key functions", score: 15 }, { text: "Integration and automated testing", score: 30 }, { text: "Comprehensive testing including load/security", score: 50 }] },
  { options: [{ text: "No dependencies", score: 0 }, { text: "Depends on completed features", score: 10 }, { text: "Depends on work in progress", score: 30 }, { text: "Blocked by multiple incomplete dependencies", score: 60 }] },
  { options: [{ text: "Clear requirements with detailed specs", score: 0 }, { text: "Good requirements, some clarification needed", score: 10 }, { text: "Basic requirements, significant research needed", score: 25 }, { text: "Vague requirements, extensive discovery required", score: 50 }] },
  { options: [{ text: "No special performance requirements", score: 0 }, { text: "Standard performance expectations", score: 10 }, { text: "High performance requirements", score: 30 }, { text: "Critical performance with complex optimization", score: 60 }] },
  { options: [{ text: "Standard security practices", score: 0 }, { text: "Additional security validation required", score: 15 }, { text: "Compliance requirements (GDPR, SOX, etc.)", score: 35 }, { text: "High-security features or audit requirements", score: 70 }] },
  { options: [{ text: "Standard deployment process", score: 0 }, { text: "Requires configuration changes", score: 10 }, { text: "Phased rollout or feature flags needed", score: 25 }, { text: "Complex deployment with multiple environments", score: 45 }] }
];

let db = null;

function initializeDB() {
  if (!db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool });
  }
  return db;
}

function calculateScoreFromAnswers(answers) {
  let totalScore = 0;
  ESTIMATION_QUESTIONS.forEach((question, index) => {
    const selectedAnswer = answers[index];
    if (selectedAnswer) {
      const option = question.options.find(opt => opt.text === selectedAnswer);
      if (option) totalScore += option.score;
    }
  });
  return totalScore;
}

function getComplexityFromScore(score) {
  if (score <= 100) return "Low Complexity";
  if (score <= 250) return "Medium Complexity";
  if (score <= 400) return "High Complexity";
  return "Very High Complexity";
}

function getEstimatedTimeFromScore(score) {
  if (score <= 50) return "Less than 1 week";
  if (score <= 150) return "1-3 weeks";
  if (score <= 300) return "1-2 months";
  if (score <= 500) return "3-6 months";
  return "More than 6 months";
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const database = initializeDB();

    if (req.method === 'GET') {
      const allRequests = await database.select().from(requests);
      return res.status(200).json(allRequests);
    }

    if (req.method === 'POST') {
      const { title, answers } = req.body;
      if (!title || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Title and answers are required' });
      }

      const score = calculateScoreFromAnswers(answers);
      const complexity = getComplexityFromScore(score);
      const estimatedTime = getEstimatedTimeFromScore(score);
      
      const [newRequest] = await database
        .insert(requests)
        .values({ title, answers, score, complexity, estimatedTime })
        .returning();
      
      return res.status(201).json(newRequest);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const { title, answers } = req.body;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      if (!title || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Title and answers are required' });
      }

      const score = calculateScoreFromAnswers(answers);
      const complexity = getComplexityFromScore(score);
      const estimatedTime = getEstimatedTimeFromScore(score);
      
      const [updatedRequest] = await database
        .update(requests)
        .set({ title, answers, score, complexity, estimatedTime })
        .where(eq(requests.id, parseInt(id)))
        .returning();
      
      return res.status(200).json(updatedRequest);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID is required' });
      
      await database.delete(requests).where(eq(requests.id, parseInt(id)));
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
};