import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all registrations
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      res.status(500).json({ message: "Error fetching registrations" });
    }
  });

  // Get registrations by sport
  app.get("/api/registrations/:deporte", async (req, res) => {
    try {
      const { deporte } = req.params;
      const registrations = await storage.getRegistrationsByDeporte(deporte);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching registrations by sport:", error);
      res.status(500).json({ message: "Error fetching registrations" });
    }
  });

  // Create new registration
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating registration:", error);
        res.status(500).json({ message: "Error creating registration" });
      }
    }
  });

  // Delete registration
  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid registration ID" });
        return;
      }
      
      await storage.deleteRegistration(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting registration:", error);
      res.status(500).json({ message: "Error deleting registration" });
    }
  });

  // Get registration statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getRegistrationStats();
      const totalPlayers = Object.values(stats).reduce((sum, count) => sum + count, 0);
      res.json({ stats, totalPlayers });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
