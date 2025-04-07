
import express from 'express';
import { fetchNewsHeadlines } from '../services/news-service';
import { getEnvVariable } from '../lib/utils/envVariables';

const router = express.Router();

// API route to fetch news headlines (server-side only)
router.get('/news-trends', async (req, res) => {
  try {
    const newsApiKey = getEnvVariable('NEWS_API_KEY');
    
    if (!newsApiKey) {
      return res.status(500).json({ 
        error: "NEWS_API_KEY not configured in environment variables" 
      });
    }
    
    const headlines = await fetchNewsHeadlines(newsApiKey);
    res.json(headlines);
  } catch (error: any) {
    console.error("Error fetching news trends:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch news trends" 
    });
  }
});

export default router;
