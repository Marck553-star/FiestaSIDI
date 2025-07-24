# Sports Event Registration System

## Overview

This is a full-stack web application for managing sports event registrations built with React, Express, and PostgreSQL. The system allows users to register for various sports events and provides an admin panel for managing registrations. It features a modern UI built with shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **API**: RESTful API endpoints for CRUD operations
- **Validation**: Zod schemas for request validation

### Database Schema
The application uses two main tables:
- **Users**: Simple user management with username/password
- **Registrations**: Event registrations with fields for name, phone, skill level, age, sport type, and comments

## Key Components

### Frontend Components
- **Home Page**: Main dashboard showing sports categories and registration stats
- **Sports Grid**: Categorized display of available sports events
- **Registration Modal**: Form for new event registrations
- **Admin Panel**: Management interface for viewing and managing registrations
- **UI Components**: Comprehensive set of reusable components from shadcn/ui

### Backend Components
- **API Routes**: RESTful endpoints for registrations CRUD operations
- **Storage Layer**: Database abstraction with IStorage interface
- **Database Connection**: Neon PostgreSQL connection with connection pooling
- **Middleware**: Request logging and error handling

### Sports Categories
The system supports multiple sports categories with highly customized registration forms:

**Padel Competitive (Masculine, Feminine, Mixed):**
- Fields: Name, Partner (Si/No), Level (A: Alto-Medio, B: Medio-Bajo), Partner Name (comments field)
- Streamlined for competitive play organization

**Padel Infantil:**
- Fields: Name, Partner (Si/No), Partner Name (comments field)
- No level or contact requirements for children

**Team Sports (Mus, Dominó, Parchís):**
- Fields: Name, Partner (Si/No), Partner Name (comments field)
- Simplified for casual team activities

**Basketball 3x3:**
- Fields: Team Name, Comments
- Team-focused registration

**Royalty Events (Rey/Reina Fiestas):**
- Fields: Name, Age, Comments
- Age requirement for festival competitions

**Other Sports:**
- Fields: Name, Comments
- Includes: Tennis (all categories), Ping Pong (all categories), Ajedrez, Poker, Cartas UNO
- Minimal registration for casual participation

## Data Flow

1. **User Registration Flow**:
   - User selects sport from grid → Opens registration modal → Submits form → Validated with Zod → Stored in database → UI updates with React Query

2. **Admin Management Flow**:
   - Admin opens panel → Fetches all registrations → Displays in organized views → Enables filtering, statistics, and export functionality

3. **Statistics Flow**:
   - Real-time stats calculated from registration data → Displayed on dashboard and admin panel

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: Configured via DATABASE_URL environment variable
- **Migrations**: Managed through Drizzle Kit

### UI Libraries
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Date-fns**: Date utility library

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **Drizzle Kit**: Database migration and introspection

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: Express server with TypeScript compilation via tsx
- **Database**: Direct connection to Neon PostgreSQL

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Single process serving both static files and API

### Environment Configuration
- Uses NODE_ENV for environment detection
- DATABASE_URL required for database connection
- Replit-specific optimizations included for the platform

The architecture prioritizes developer experience with hot reloading, type safety, and modern tooling while maintaining production readiness with optimized builds and proper error handling.