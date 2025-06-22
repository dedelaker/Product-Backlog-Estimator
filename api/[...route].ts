import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import ws from 'ws';
import * as schema from '../shared/schema';
import { requests } from '../shared/schema';
import { insertRequestSchema } from '../shared/schema';
import { ESTIMATION_QUESTIONS } from '../shared/questions';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { route } = req.query;
  const path = Array.isArray(route) ? route.join('/') : route || '';

  try {
    // GET /api/requests
    if (req.method === 'GET' && path === 'requests') {
      const allRequests = await db.select().from(requests);
      return res.status(200).json(allRequests);
    }

    // GET /api/requests/:id
    if (req.method === 'GET' && path.startsWith('requests/')) {
      const id = parseInt(path.split('/')[1]);
      const [request] = await db.select().from(requests).where(eq(requests.id, id));
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      return res.status(200).json(request);
    }

    // POST /api/requests
    if (req.method === 'POST' && path === 'requests') {
      const validatedData = insertRequestSchema.parse(req.body);
      
      const [newRequest] = await db
        .insert(requests)
        .values(validatedData)
        .returning();
      
      return res.status(201).json(newRequest);
    }

    // PUT /api/requests/:id
    if (req.method === 'PUT' && path.startsWith('requests/')) {
      const id = parseInt(path.split('/')[1]);
      const validatedData = insertRequestSchema.parse(req.body);
      
      const [updatedRequest] = await db
        .update(requests)
        .set(validatedData)
        .where(eq(requests.id, id))
        .returning();
      
      if (!updatedRequest) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      return res.status(200).json(updatedRequest);
    }

    // DELETE /api/requests/:id
    if (req.method === 'DELETE' && path.startsWith('requests/')) {
      const id = parseInt(path.split('/')[1]);
      
      await db
        .delete(requests)
        .where(eq(requests.id, id));
      
      return res.status(204).end();
    }

    return res.status(404).json({ error: 'Not found' });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}