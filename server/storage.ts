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
      let count = 1; // Default count
      
      // Basketball teams count as 3 people
      if (reg.deporte === "basket-3x3") {
        count = 3;
      }
      // Sports with partner option - if they come with partner, count as 2
      else if (["padel-masculino", "padel-femenino", "padel-mixto", "padel-infantil", "mus", "domino", "parchis"].includes(reg.deporte)) {
        if (reg.pareja === "si") {
          count = 2;
        }
      }
      
      stats[reg.deporte] = (stats[reg.deporte] || 0) + count;
    });
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
