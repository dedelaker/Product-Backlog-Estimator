# Product Backlog Estimator

A comprehensive web application for prioritizing development requests using an intelligent scoring algorithm.

## Features

- **Intelligent Scoring System**: 10 comprehensive business questions covering external integrations, dependencies, compliance, and technical complexity
- **Color-coded Complexity Tiers**: Visual indicators for Low, Medium, High, and Very High complexity
- **Timeline Estimates**: Automatic estimation based on calculated scores (1 month to 6+ months)
- **CRUD Operations**: Create, read, update, and delete backlog requests
- **Real-time Scoring**: Dynamic score calculation as you answer questions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel + Neon Database

## Scoring Algorithm

The application uses a 10-question assessment covering:

1. External API integrations (0-80 points)
2. Database changes (0-60 points)
3. UI complexity (5-70 points)
4. Business logic complexity (5-80 points)
5. Testing requirements (5-50 points)
6. Dependencies (0-60 points)
7. Requirements clarity (0-50 points)
8. Performance concerns (0-60 points)
9. Security/compliance (0-70 points)
10. Deployment complexity (0-45 points)

**Total Score Range**: 0-625 points

## Complexity Tiers

- **Low Complexity** (0-99 points): ~1 month
- **Medium Complexity** (100-199 points): 1-3 months
- **High Complexity** (200-499 points): 3-6 months
- **Very High Complexity** (500+ points): 6+ months

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Push database schema
npm run db:push
```

## Deployment

### Vercel + Neon Setup

1. **Database Setup**:
   - Create account at neon.tech
   - Create new project and copy connection string
   - Run: `DATABASE_URL="your_neon_url" npm run db:push`

2. **Vercel Deployment**:
   - Push code to GitHub
   - Import repository in Vercel dashboard
   - Add environment variable: `DATABASE_URL`
   - Deploy automatically

### Environment Variables

```
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NODE_ENV=production
```

## Cost Estimation

For typical usage (10 requests/month):
- **Vercel**: Free tier (sufficient)
- **Neon**: Free tier (sufficient)
- **Total Cost**: $0/month

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── lib/           # Utilities and configuration
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Database schema
│   └── questions.ts      # Scoring questions
└── vercel.json          # Deployment configuration
```

## API Endpoints

- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

## License

MIT