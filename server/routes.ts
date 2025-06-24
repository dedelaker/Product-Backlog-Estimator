import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRequestSchema } from "@shared/schema";
import { z } from "zod";
import { writeOperationsLimit } from "./middleware/rateLimiter";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all requests
  app.get("/api/requests", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  // Get a single request
  app.get("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }
      
      const request = await storage.getRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  // Create a new request
  app.post("/api/requests", writeOperationsLimit, async (req, res) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  // Update a request
  app.put("/api/requests/:id", writeOperationsLimit, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      const validatedData = insertRequestSchema.partial().parse(req.body);
      const request = await storage.updateRequest(id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      if (error instanceof Error && error.message === 'Request not found') {
        return res.status(404).json({ message: "Request not found" });
      }
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // Delete a request
  app.delete("/api/requests/:id", writeOperationsLimit, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      await storage.deleteRequest(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ message: "Failed to delete request" });
    }
  });

  // Add /api/hello route to match frontend expectations
  app.get("/api/hello", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/hello", writeOperationsLimit, async (req, res) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.put("/api/hello", async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.updateRequest(id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  app.delete("/api/hello", async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      await storage.deleteRequest(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ message: "Failed to delete request" });
    }
  });

  // Add /api/index route for Vercel compatibility
  app.get("/api/index", async (req, res) => {
    try {
      const requests = await storage.getAllRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/index", async (req, res) => {
    try {
      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.put("/api/index", async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      const validatedData = insertRequestSchema.parse(req.body);
      const request = await storage.updateRequest(id, validatedData);
      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  app.delete("/api/index", async (req, res) => {
    try {
      const id = parseInt(req.query.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid request ID" });
      }

      await storage.deleteRequest(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ message: "Failed to delete request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
