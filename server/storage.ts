import { users, requests, type User, type InsertUser, type Request, type InsertRequest } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Request methods
  getAllRequests(): Promise<Request[]>;
  getRequest(id: number): Promise<Request | undefined>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: number, request: Partial<InsertRequest>): Promise<Request>;
  deleteRequest(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.score));
  }

  async getRequest(id: number): Promise<Request | undefined> {
    const [request] = await db.select().from(requests).where(eq(requests.id, id));
    return request || undefined;
  }

  async createRequest(insertRequest: InsertRequest): Promise<Request> {
    // Calculate score and derived fields
    const score = insertRequest.technicalComplexity + insertRequest.businessImpact + 
                  insertRequest.resourceRequirements + insertRequest.riskLevel;
    
    let complexity: string;
    let estimatedTime: string;

    if (score >= 500) {
      complexity = 'Very High Complexity';
      estimatedTime = 'More than 6 months';
    } else if (score >= 200) {
      complexity = 'High Complexity';
      estimatedTime = '3-6 months';
    } else if (score >= 100) {
      complexity = 'Medium Complexity';
      estimatedTime = '1-3 months';
    } else {
      complexity = 'Low Complexity';
      estimatedTime = '~1 month';
    }

    const requestWithScore = {
      ...insertRequest,
      score,
      complexity,
      estimatedTime,
    };

    const [request] = await db
      .insert(requests)
      .values(requestWithScore)
      .returning();
    return request;
  }

  async updateRequest(id: number, updateData: Partial<InsertRequest>): Promise<Request> {
    // If any scoring factors are updated, recalculate score
    const currentRequest = await this.getRequest(id);
    if (!currentRequest) {
      throw new Error('Request not found');
    }

    let updatedRequest = { ...currentRequest, ...updateData };

    // Recalculate score if any scoring factors changed
    if (updateData.technicalComplexity !== undefined || 
        updateData.businessImpact !== undefined ||
        updateData.resourceRequirements !== undefined ||
        updateData.riskLevel !== undefined) {
      
      const score = updatedRequest.technicalComplexity + updatedRequest.businessImpact + 
                    updatedRequest.resourceRequirements + updatedRequest.riskLevel;
      
      let complexity: string;
      let estimatedTime: string;

      if (score >= 500) {
        complexity = 'Very High Complexity';
        estimatedTime = 'More than 6 months';
      } else if (score >= 200) {
        complexity = 'High Complexity';
        estimatedTime = '3-6 months';
      } else if (score >= 100) {
        complexity = 'Medium Complexity';
        estimatedTime = '1-3 months';
      } else {
        complexity = 'Low Complexity';
        estimatedTime = '~1 month';
      }

      updatedRequest.score = score;
      updatedRequest.complexity = complexity;
      updatedRequest.estimatedTime = estimatedTime;
    }

    const [request] = await db
      .update(requests)
      .set(updatedRequest)
      .where(eq(requests.id, id))
      .returning();
    return request;
  }

  async deleteRequest(id: number): Promise<void> {
    await db.delete(requests).where(eq(requests.id, id));
  }
}

export const storage = new DatabaseStorage();
