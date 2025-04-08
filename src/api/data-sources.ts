
import { Request, Response, Router } from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import { fetchAndGenerateRedditTrends } from '../lib/fetchRedditTrends';

const router = Router();

router.get('/news-trends', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('News trends API request received');
    // Check for a fetchNewsFromServer function instead of getNewsTrends
    if (typeof newsApi.fetchNewsFromServer === 'function') {
      const trends = await newsApi.fetchNewsFromServer();
      res.json(trends); // Properly use res.json without double stringification
    } else {
      // Fallback if the function doesn't exist
      res.json({ message: "News trends API not implemented" });
    }
  } catch (error) {
    console.error('Error fetching news trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to fetch news trends', 
      message: errorMessage 
    });
  }
});

router.get('/reddit-trends', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Reddit trends API request received');
    // Use fetchAndGenerateRedditTrends which is the correct exported function
    const trends = await fetchAndGenerateRedditTrends();
    res.json(trends); // Properly use res.json without double stringification
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to fetch Reddit trends', 
      message: errorMessage 
    });
  }
});

export default router;
