
import express, { Request, Response, Router } from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import * as redditApi from '../lib/fetchRedditTrends';

const router = Router();

router.get('/news-trends', async (req: Request, res: Response) => {
  try {
    // Check if getNewsTrends exists, if not use fallback
    if (typeof newsApi.getNewsTrends === 'function') {
      const trends = await newsApi.getNewsTrends();
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
    // Check if getRedditTrends exists, if not use fallback
    if (typeof redditApi.getRedditTrends === 'function') {
      const trends = await redditApi.getRedditTrends();
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
