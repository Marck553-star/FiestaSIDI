import { users, registrations, type User, type InsertUser, type Registration, type InsertRegistration } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistrationsByDeporte(deporte: string): Promise<Registration[]>;
  deleteRegistration(id: number): Promise<void>;
  getRegistrationStats(): Promise<{ [key: string]: number }>;
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

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const [newRegistration] = await db
      .insert(registrations)
      .values(registration)
      .returning();
    return newRegistration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async getRegistrationsByDeporte(deporte: string): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.deporte, deporte));
  }

  async deleteRegistration(id: number): Promise<void> {
    await db.delete(registrations).where(eq(registrations.id, id));
  }

  async getRegistrationStats(): Promise<{ [key: string]: number }> {
    const allRegistrations = await this.getRegistrations();
    const stats: { [key: string]: number } = {};
    
    allRegistrations.forEach(reg => {
      stats[reg.deporte] = (stats[reg.deporte] || 0) + 1;
    });
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
