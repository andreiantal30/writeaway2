
import express, { Request, Response, Router } from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import { fetchAndGenerateRedditTrends } from '../lib/fetchRedditTrends';

const router = Router();

// Fixed: Use proper router.get pattern with improved error handling
router.get('/news-trends', async (req: Request, res: Response) => {
  try {
    // Check for a fetchNewsFromServer function instead of getNewsTrends
    if (typeof newsApi.fetchNewsFromServer === 'function') {
      const trends = await newsApi.fetchNewsFromServer();
      return res.json(trends);
    } else {
      // Fallback if the function doesn't exist
      return res.json({ message: "News trends API not implemented" });
    }
  } catch (error) {
    console.error('Error fetching news trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Failed to fetch news trends', 
      message: errorMessage 
    });
  }
});

router.get('/reddit-trends', async (req: Request, res: Response) => {
  try {
    // Use fetchAndGenerateRedditTrends which is the correct exported function
    const trends = await fetchAndGenerateRedditTrends();
    return res.json(trends);
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Failed to fetch Reddit trends', 
      message: errorMessage 
    });
  }
});

export default router;
