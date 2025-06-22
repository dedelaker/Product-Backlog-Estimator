import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

const requests = pgTable("backlog_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  answers: text("answers").array().notNull(),
  score: integer("score").notNull(),
  complexity: text("complexity").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const ESTIMATION_QUESTIONS = [
  {
    id: "external_integration",
    text: "Do we have to integrate or adapt solution of an external partner? (could be on YS side or in other teams)",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, standard API, already used by lot of other clients", score: 100 },
      { text: "Yes, but partner creates specifications for us", score: 250 },
      { text: "No, but we have to enhance their system drastically", score: 75 }
    ]
  },
  {
    id: "app_touch",
    text: "Do we have to touch all the part of the app (MPSA)?",
    options: [
      { text: "Yes", score: 100 },
      { text: "No, but 2 YS squads impacted", score: 75 },
      { text: "No only 1 squad", score: 30 }
    ]
  },
  {
    id: "new_business",
    text: "New business for Company 1",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, but already exists at Company 2", score: 50 },
      { text: "Yes for 1 & 2, but not complex", score: 100 },
      { text: "Yes for 1 & 2, and complex", score: 150 }
    ]
  },
  {
    id: "future_scope",
    text: "Future scope is clear?",
    options: [
      { text: "Yes, clear and probability of change is very low", score: 50 },
      { text: "Yes, but high probability of change is high", score: 75 },
      { text: "No", score: 100 }
    ]
  },
  {
    id: "legal_compliance",
    text: "Legal or compliance requirements?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, but simple", score: 75 },
      { text: "Yes, complex", score: 100 }
    ]
  },
  {
    id: "impact_scope",
    text: "Impact scope assessment",
    options: [
      { text: "Small", score: 30 },
      { text: "Medium", score: 50 },
      { text: "Large", score: 100 }
    ]
  },
  {
    id: "data_security",
    text: "Do we have to manage sensitive data?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 50 }
    ]
  },

  {
    id: "security_analysis",
    text: "Do we have complex analysis of IT security? or Legal? (ex: for big impacts / critical outsourcing, AI guidelines)",
    options: [
      { text: "No", score: 0 },
      { text: "Yes, with potential big impacts on solution", score: 150 },
      { text: "Yes, but no impact on solution", score: 20 }
    ]
  },
  {
    id: "new_technology",
    text: "Do we have to use a new technology?",
    options: [
      { text: "No", score: 0 },
      { text: "Yes", score: 100 }
    ]
  },
  {
    id: "new_architecture",
    text: "Do we have to put in place a new architecture?",
    options: [
      { text: "No, only upgrade on current one", score: 0 },
      { text: "Yes, but a new small piece", score: 30 },
      { text: "Yes, and big impact on current one", score: 100 }
    ]
  }
];

function initializeDB() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle({ client: pool });
}

function calculateScoreFromAnswers(answers) {
  let totalScore = 0;
  console.log('Calculating score for answers:', answers);
  console.log('Questions count:', ESTIMATION_QUESTIONS.length);
  
  ESTIMATION_QUESTIONS.forEach((question, index) => {
    const selectedAnswer = answers[index];
    console.log(`Question ${index}: "${selectedAnswer}"`);
    
    if (selectedAnswer) {
      const option = question.options.find(opt => opt.text === selectedAnswer);
      if (option) {
        console.log(`Found option with score: ${option.score}`);
        totalScore += option.score;
      } else {
        console.log(`No matching option found for: "${selectedAnswer}"`);
        console.log('Available options:', question.options.map(opt => opt.text));
      }
    }
  });
  
  console.log('Total calculated score:', totalScore);
  return totalScore;
}

function getComplexityFromScore(score) {
  if (score >= 500) return "Very high complexity or effort";
  if (score >= 200) return "High complexity or effort";
  if (score >= 100) return "Medium complexity or effort";
  return "No complexity and low effort";
}

function getEstimatedTimeFromScore(score) {
  if (score >= 500) return "More than 6 months for construction phase with max capacity";
  if (score >= 200) return "Between 3 & 6 months for construction phase with max capacity";
  if (score >= 100) return "Between 1 & 3 months for construction phase with max capacity";
  return "~1 month for construction phase with max capacity";
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL not configured' });
    }

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