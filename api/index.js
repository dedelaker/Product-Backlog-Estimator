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
    id: "technical_integration",
    text: "Technical integration complexity",
    options: [
      { text: "Simple API integration (well-documented)", score: 10 },
      { text: "Simple table updates or new fields", score: 15 },
      { text: "New components using design system", score: 25 },
      { text: "Custom components or complex UI", score: 40 }
    ]
  },
  {
    id: "business_logic",
    text: "Business logic complexity",
    options: [
      { text: "Simple CRUD operations", score: 5 },
      { text: "Moderate logic with validations", score: 20 },
      { text: "Complex calculations or workflows", score: 45 },
      { text: "Advanced algorithms or processing", score: 80 }
    ]
  },
  {
    id: "testing_requirements",
    text: "Testing requirements",
    options: [
      { text: "Basic manual testing", score: 5 },
      { text: "Unit tests for key functions", score: 15 },
      { text: "Integration and automated testing", score: 30 },
      { text: "Comprehensive testing including load/security", score: 50 }
    ]
  },
  {
    id: "dependencies",
    text: "Dependencies and blockers",
    options: [
      { text: "No dependencies", score: 0 },
      { text: "Depends on completed features", score: 10 },
      { text: "Depends on work in progress", score: 30 },
      { text: "Blocked by multiple incomplete dependencies", score: 60 }
    ]
  },
  {
    id: "requirements_clarity",
    text: "Requirements clarity",
    options: [
      { text: "Clear requirements with detailed specs", score: 0 },
      { text: "Good requirements, some clarification needed", score: 10 },
      { text: "Basic requirements, significant research needed", score: 25 },
      { text: "Vague requirements, extensive discovery required", score: 50 }
    ]
  },
  {
    id: "performance_requirements",
    text: "Performance requirements",
    options: [
      { text: "No special performance requirements", score: 0 },
      { text: "Standard performance expectations", score: 10 },
      { text: "High performance requirements", score: 30 },
      { text: "Critical performance with complex optimization", score: 60 }
    ]
  },
  {
    id: "security_requirements",
    text: "Security requirements",
    options: [
      { text: "Standard security practices", score: 0 },
      { text: "Additional security validation required", score: 15 },
      { text: "Compliance requirements (GDPR, SOX, etc.)", score: 35 },
      { text: "High-security features or audit requirements", score: 70 }
    ]
  },
  {
    id: "deployment_complexity",
    text: "Deployment complexity",
    options: [
      { text: "Standard deployment process", score: 0 },
      { text: "Requires configuration changes", score: 10 },
      { text: "Phased rollout or feature flags needed", score: 25 },
      { text: "Complex deployment with multiple environments", score: 45 }
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