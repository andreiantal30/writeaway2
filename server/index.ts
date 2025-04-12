
// server/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import newsApiRouter from "./newsApi";     // ✅ NewsAPI route
import cdPassRoute from "./cdPass";        // ✅ Creative Director Pass route
import disruptivePassRoute from './disruptivePass'; // ✅ Disruptive Pass route
import generateCampaignRouter from "../src/api/generateCampaign"; // ✅ Campaign generation route
import dataSourcesRouter from "../src/api/data-sources"; // ✅ Data sources route

const app = express();
const port = 8090;

// Ensure OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
  console.error("❗ Missing OPENAI_API_KEY environment variable. Please check your .env file.");
}

app.use(express.json({ limit: '50mb' })); // Increased JSON limit for larger payloads

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add detailed logging for debugging API requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`${timestamp} - Response ${res.statusCode} for ${req.method} ${req.url}`);
    if (res.statusCode >= 400) {
      console.log(`Error response body (first 200 chars): ${typeof body === 'string' ? body.substring(0, 200) : JSON.stringify(body).substring(0, 200)}`);
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// ✅ Mount API routes
app.use('/api', newsApiRouter);   // → /api/news
app.use('/api', cdPassRoute);     // → /api/cd-pass
app.use('/api', disruptivePassRoute); // → /api/disruptive-pass
app.use('/api', generateCampaignRouter); // → /api/generate
app.use('/api', dataSourcesRouter); // → /api/news-trends and /api/reddit-trends

// Optional: Health check route
app.get("/api/health", (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error in request:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'Unknown error occurred',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🧠 Backend server running at http://localhost:${port}`);
  console.log(`💡 OpenAI API key ${process.env.OPENAI_API_KEY ? 'is' : 'is NOT'} configured`);
});
