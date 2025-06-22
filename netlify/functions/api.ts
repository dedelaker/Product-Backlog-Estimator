import { Handler } from '@netlify/functions';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Configure Neon for serverless
neonConfig.webSocketConstructor = globalThis.WebSocket || require('ws');

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

const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  score: true,
  complexity: true,
  estimatedTime: true,
  createdAt: true,
});

// Questions for scoring
const ESTIMATION_QUESTIONS = [
  {
    id: "external_integrations",
    text: "Does this request require external API integrations or third-party services?",
    options: [
      { text: "No external integrations needed", score: 0 },
      { text: "Simple API integration (well-documented)", score: 20 },
      { text: "Multiple APIs or complex integration", score: 50 },
      { text: "Custom/legacy system integration", score: 80 }
    ]
  },
  {
    id: "database_changes",
    text: "What level of database changes are required?",
    options: [
      { text: "No database changes", score: 0 },
      { text: "Simple table updates or new fields", score: 10 },
      { text: "New tables or moderate schema changes", score: 30 },
      { text: "Complex migrations or data restructuring", score: 60 }
    ]
  },
  {
    id: "ui_complexity",
    text: "How complex is the user interface for this feature?",
    options: [
      { text: "Minor UI updates or existing patterns", score: 5 },
      { text: "New components using design system", score: 15 },
      { text: "Custom UI components or layouts", score: 35 },
      { text: "Complex interactive features or animations", score: 70 }
    ]
  },
  {
    id: "business_logic",
    text: "What's the complexity of the business logic involved?",
    options: [
      { text: "Simple CRUD operations", score: 5 },
      { text: "Moderate logic with validations", score: 20 },
      { text: "Complex calculations or workflows", score: 45 },
      { text: "Advanced algorithms or processing", score: 80 }
    ]
  },
  {
    id: "testing_requirements",
    text: "What testing approach is needed?",
    options: [
      { text: "Basic manual testing", score: 5 },
      { text: "Unit tests for key functions", score: 15 },
      { text: "Integration and automated testing", score: 30 },
      { text: "Comprehensive testing including load/security", score: 50 }
    ]
  },
  {
    id: "dependencies",
    text: "Does this feature depend on other incomplete work?",
    options: [
      { text: "No dependencies", score: 0 },
      { text: "Depends on completed features", score: 10 },
      { text: "Depends on work in progress", score: 30 },
      { text: "Blocked by multiple incomplete dependencies", score: 60 }
    ]
  },
  {
    id: "documentation",
    text: "How well-defined are the requirements?",
    options: [
      { text: "Clear requirements with detailed specs", score: 0 },
      { text: "Good requirements, some clarification needed", score: 10 },
      { text: "Basic requirements, significant research needed", score: 25 },
      { text: "Vague requirements, extensive discovery required", score: 50 }
    ]
  },
  {
    id: "performance",
    text: "Are there specific performance or scalability concerns?",
    options: [
      { text: "No special performance requirements", score: 0 },
      { text: "Standard performance expectations", score: 10 },
      { text: "High performance requirements", score: 30 },
      { text: "Critical performance with complex optimization", score: 60 }
    ]
  },
  {
    id: "security_compliance",
    text: "What security or compliance considerations apply?",
    options: [
      { text: "Standard security practices", score: 0 },
      { text: "Additional security validation required", score: 15 },
      { text: "Compliance requirements (GDPR, SOX, etc.)", score: 35 },
      { text: "High-security features or audit requirements", score: 70 }
    ]
  },
  {
    id: "deployment_complexity",
    text: "How complex is the deployment and rollout?",
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

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '').replace('/api', '') || '/';
  const method = event.httpMethod;

  try {
    const database = initializeDB();

    // GET /requests
    if (method === 'GET' && path === '/requests') {
      const allRequests = await database.select().from(requests);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(allRequests),
      };
    }

    // POST /requests
    if (method === 'POST' && path === '/requests') {
      const { title, answers } = JSON.parse(event.body || '{}');
      
      if (!title || !answers || !Array.isArray(answers)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Title and answers are required' }),
        };
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
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newRequest),
      };
    }

    // DELETE /requests/:id
    if (method === 'DELETE' && path.startsWith('/requests/')) {
      const id = parseInt(path.split('/')[2]);
      
      await database
        .delete(requests)
        .where(eq(requests.id, id));
      
      return {
        statusCode: 204,
        headers,
        body: '',
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
    
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};