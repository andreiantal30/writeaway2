
import express from 'express';
import { fetchNewsHeadlines } from '../services/news-service';
import { fetchRedditTrends } from '../services/reddit-service';
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

// API route to fetch Reddit trends (server-side only)
router.get('/reddit-trends', async (req, res) => {
  try {
    const redditClientId = getEnvVariable('REDDIT_CLIENT_ID');
    const redditClientSecret = getEnvVariable('REDDIT_CLIENT_SECRET');
    const redditUsername = getEnvVariable('REDDIT_USERNAME');
    const redditPassword = getEnvVariable('REDDIT_PASSWORD');
    
    if (!redditClientId || !redditClientSecret || !redditUsername || !redditPassword) {
      return res.status(500).json({ 
        error: "Reddit API credentials not configured in environment variables" 
      });
    }
    
    const redditTrends = await fetchRedditTrends({
      clientId: redditClientId,
      clientSecret: redditClientSecret,
      username: redditUsername,
      password: redditPassword
    });
    
    res.json(redditTrends);
  } catch (error: any) {
    console.error("Error fetching Reddit trends:", error);
    res.status(500).json({ 
      error: error.message || "Failed to fetch Reddit trends" 
    });
  }
});

export default router;
