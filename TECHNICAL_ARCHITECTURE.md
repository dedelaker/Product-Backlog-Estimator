# Product Backlog Estimator - Technical Architecture Schema

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   React Pages   │  │  UI Components  │  │  Custom Hooks   │             │
│  │                 │  │                 │  │                 │             │
│  │ • Home          │  │ • Forms         │  │ • useToast      │             │
│  │ • NotFound      │  │ • Modals        │  │ • useMobile     │             │
│  │                 │  │ • Cards         │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                │                                            │
│  ┌─────────────────────────────────────────────────────────────┐             │
│  │              STATE MANAGEMENT LAYER                        │             │
│  │                                                            │             │
│  │  ┌─────────────────┐  ┌─────────────────┐                 │             │
│  │  │ TanStack Query  │  │ React Hook Form │                 │             │
│  │  │                 │  │                 │                 │             │
│  │  │ • Server State  │  │ • Form State    │                 │             │
│  │  │ • Caching       │  │ • Validation    │                 │             │
│  │  │ • Mutations     │  │ • Error Handling│                 │             │
│  │  └─────────────────┘  └─────────────────┘                 │             │
│  └─────────────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                               HTTP/HTTPS Requests
                                       │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐             │
│  │                   EXPRESS.JS SERVER                        │             │
│  │                                                            │             │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│             │
│  │  │     Routes      │  │   Middleware    │  │  Validation  ││             │
│  │  │                 │  │                 │  │              ││             │
│  │  │ • GET /api/...  │  │ • CORS          │  │ • Zod Schema ││             │
│  │  │ • POST /api/... │  │ • Body Parser   │  │ • Type Check ││             │
│  │  │ • PUT /api/...  │  │ • Error Handler │  │ • Sanitize   ││             │
│  │  │ • DELETE /api...│  │ • Session Mgmt  │  │              ││             │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘│             │
│  └─────────────────────────────────────────────────────────────┘             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐             │
│  │                 BUSINESS LOGIC LAYER                       │             │
│  │                                                            │             │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│             │
│  │  │ Storage Service │  │ Scoring Engine  │  │ Complexity   ││             │
│  │  │                 │  │                 │  │ Calculator   ││             │
│  │  │ • CRUD Ops      │  │ • 10 Questions  │  │ • Time Est.  ││             │
│  │  │ • Data Access   │  │ • Score Calc    │  │ • Complexity ││             │
│  │  │ • Error Handle  │  │ • Weight System │  │ • Categories ││             │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘│             │
│  └─────────────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                              Database Queries (SQL)
                                       │
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐             │
│  │                    DRIZZLE ORM                             │             │
│  │                                                            │             │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│             │
│  │  │    Schema       │  │   Migrations    │  │  Relations   ││             │
│  │  │                 │  │                 │  │              ││             │
│  │  │ • Type Safety   │  │ • Auto Generate │  │ • Foreign    ││             │
│  │  │ • Table Defs    │  │ • Version Ctrl  │  │   Keys       ││             │
│  │  │ • Validations   │  │ • Rollback      │  │ • Joins      ││             │
│  │  └─────────────────┘  └─────────────────┘  └──────────────┘│             │
│  └─────────────────────────────────────────────────────────────┘             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────┐             │
│  │               POSTGRESQL DATABASE                          │             │
│  │                                                            │             │
│  │  ┌─────────────────┐  ┌─────────────────┐                 │             │
│  │  │     Tables      │  │    Indexes      │                 │             │
│  │  │                 │  │                 │                 │             │
│  │  │ • users         │  │ • Primary Keys  │                 │             │
│  │  │ • backlog_req   │  │ • Foreign Keys  │                 │             │
│  │  │ • sessions      │  │ • Performance   │                 │             │
│  │  └─────────────────┘  └─────────────────┘                 │             │
│  └─────────────────────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │────│  React App  │────│   API Call  │────│  Express.js │
│             │    │             │    │             │    │   Server    │
│ • User      │    │ • Form      │    │ • HTTP      │    │             │
│   Input     │    │   Submit    │    │   Request   │    │ • Route     │
│ • UI        │    │ • State     │    │ • JSON      │    │   Handler   │
│   Events    │    │   Update    │    │   Payload   │    │ • Validate  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Database   │────│ Drizzle ORM │────│  Business   │────│  Storage    │
│             │    │             │    │   Logic     │    │  Service    │
│ • Store     │    │ • Query     │    │             │    │             │
│   Data      │    │   Builder   │    │ • Score     │    │ • CRUD      │
│ • Persist   │    │ • Type      │    │   Calc      │    │   Ops       │
│   State     │    │   Safety    │    │ • Complex   │    │ • Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Response   │────│   JSON      │────│   HTTP      │────│  TanStack   │
│             │    │  Serialize  │    │  Response   │    │   Query     │
│ • Updated   │    │             │    │             │    │             │
│   Data      │    │ • Format    │    │ • Status    │    │ • Cache     │
│ • Status    │    │   Output    │    │   Code      │    │   Update    │
│ • Metadata  │    │ • Error     │    │ • Headers   │    │ • UI Sync   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Component Relationships

```
Frontend Components:
┌──────────────────────────────────────────────────────────────┐
│                        App.tsx                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │   Router()      │ │  QueryProvider  │ │   ThemeProvider│ │
│  │                 │ │                 │ │                │ │
│  │ • Home          │ │ • TanStack      │ │ • Dark/Light   │ │
│  │ • NotFound      │ │   Query         │ │   Mode         │ │
│  │ • Navigation    │ │ • Cache Mgmt    │ │ • CSS Vars     │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────┘

Page Components:
┌──────────────────────────────────────────────────────────────┐
│                     Home Page                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ │
│  │ RequestCard     │ │ AddRequestModal │ │EditRequestModal│ │
│  │                 │ │                 │ │                │ │
│  │ • Display Data  │ │ • Form Handling │ │ • Update Form  │ │
│  │ • Actions       │ │ • Validation    │ │ • Validation   │ │
│  │ • Events        │ │ • Submission    │ │ • Submission   │ │
│  └─────────────────┘ └─────────────────┘ └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Technology Integration Points

| Layer | Technology | Purpose | Integration |
|-------|------------|---------|-------------|
| **Client** | React + TypeScript | UI Components | Vite bundling, Hot reload |
| **Styling** | Tailwind CSS | Design System | PostCSS processing |
| **State** | TanStack Query | Server State | React hooks integration |
| **Forms** | React Hook Form | Form Management | Zod validation schemas |
| **API** | Express.js | HTTP Server | Serverless deployment |
| **Validation** | Zod | Type Safety | Shared client/server schemas |
| **Database** | Drizzle ORM | Data Layer | Type-safe PostgreSQL queries |
| **Hosting** | Vercel | Deployment | Serverless functions, CDN |

This architecture provides scalability, maintainability, and type safety throughout the entire application stack.