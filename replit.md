# Product Backlog Estimator - System Documentation

## Overview

The Product Backlog Estimator is a comprehensive web application designed to help development teams prioritize and estimate backlog requests using an intelligent scoring algorithm. The system evaluates project complexity across 10 business dimensions and provides automated time estimates and complexity classifications.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js 20 (ES Modules)
- **API Structure**: Serverless functions for Vercel deployment
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas for type-safe data validation
- **Deployment**: Configured for Vercel serverless platform

## Key Components

### Scoring Algorithm
The application implements a sophisticated 10-question assessment system:

1. **External Integrations** (0-80 points): API integrations and third-party services
2. **Database Changes** (0-60 points): Schema modifications and data migrations
3. **UI Complexity** (5-70 points): User interface complexity assessment
4. **Business Logic** (5-80 points): Core functionality complexity
5. **Testing Requirements** (5-50 points): Quality assurance needs
6. **Dependencies** (0-60 points): External dependency management
7. **Requirements Clarity** (0-50 points): Specification completeness
8. **Performance Concerns** (0-60 points): Scalability and optimization needs
9. **Security/Compliance** (0-70 points): Security analysis and legal requirements
10. **Deployment Complexity** (0-45 points): Release and deployment considerations

**Total Score Range**: 0-625 points

### Complexity Classification
- **Low Complexity** (0-99 points): ~1 month construction phase
- **Medium Complexity** (100-199 points): 1-3 months construction phase
- **High Complexity** (200-499 points): 3-6 months construction phase
- **Very High Complexity** (500+ points): 6+ months construction phase

### Database Schema
```sql
-- Users table for authentication
users: id, username, password

-- Backlog requests with scoring data
backlog_requests: id, title, answers[], score, complexity, estimated_time, created_at
```

## Data Flow

1. **Request Creation**: User fills out 10-question assessment form
2. **Score Calculation**: Frontend calculates preview score in real-time
3. **Data Submission**: Form data sent to serverless API endpoint
4. **Server Processing**: Backend recalculates score and determines complexity tier
5. **Database Storage**: Request stored with calculated metrics
6. **Response**: Updated request list returned to frontend

## External Dependencies

### Production Dependencies
- **Database**: Neon PostgreSQL (serverless PostgreSQL)
- **Deployment**: Vercel (serverless hosting platform)
- **UI Components**: Radix UI primitives via Shadcn/ui
- **Forms**: React Hook Form + Hookform Resolvers
- **Validation**: Zod schema validation
- **Database ORM**: Drizzle ORM with Neon serverless adapter

### Development Dependencies
- **Build Tools**: Vite, TypeScript, ESBuild
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Development Server**: Express.js with Vite middleware

## Deployment Strategy

### Vercel Configuration
- **Build Command**: `npx vite build`
- **Output Directory**: `dist/public`
- **Serverless Functions**: `/api/index.js` handles all CRUD operations
- **Environment Variables**: `DATABASE_URL` for Neon connection
- **Custom Domain**: Configured for `project-backlog-estimator.estimr.ovh`

### Database Setup
- **Provider**: Neon PostgreSQL (serverless)
- **Connection**: WebSocket with fallback to HTTP pooling
- **Migrations**: Drizzle Kit for schema management
- **Connection String**: Stored as environment variable

### Security Features
- **Rate Limiting**: Focused protection for write operations
  - Write operation limits: 30 create/update/delete per IP address per day
  - Read operations: Unlimited (GET requests)
  - 24-hour reset window from first write operation
- **Privacy Protection**: Comprehensive crawler blocking via robots meta tags
- **Content Security**: X-Frame-Options, X-Content-Type-Options headers
- **SSL**: Automatic HTTPS with Vercel
- **Database**: SSL-required connections to Neon with write operation protection

## Changelog
- June 24, 2025: Simplified rate limiting to focus on write operations only
  - Write operations limited to 30 per day per IP address
  - Read operations unlimited for better user experience
  - Removed daily general limits, burst protection, and progressive slowdown
  - Maintained IP-based tracking with proper proxy support
- June 24, 2025: Implemented comprehensive rate limiting security
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.