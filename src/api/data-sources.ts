
import express, { Request, Response, Router } from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import * as redditApi from '../lib/fetchRedditTrends';

const router = Router();

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
    return res.status(500).json({ error: 'Failed to fetch news trends' });
  }
});

router.get('/reddit-trends', async (req: Request, res: Response) => {
  try {
    // Check for a fetchRedditTrends function
    if (typeof redditApi.fetchRedditTrends === 'function') {
      const trends = await redditApi.fetchRedditTrends();
      return res.json(trends);
    } else {
      // Fallback if the function doesn't exist
      return res.json({ message: "Reddit trends API not implemented" });
    }
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return res.status(500).json({ error: 'Failed to fetch Reddit trends' });
  }
});

export default router;
