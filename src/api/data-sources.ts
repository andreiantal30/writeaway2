
import express, { Request, Response, Router } from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import * as redditApi from '../lib/fetchRedditTrends';

const router = Router();

router.get('/news-trends', (req: Request, res: Response) => {
  try {
    const trends = newsApi.getNewsTrends();
    return res.json(trends);
  } catch (error) {
    console.error('Error fetching news trends:', error);
    return res.status(500).json({ error: 'Failed to fetch news trends' });
  }
});

router.get('/reddit-trends', (req: Request, res: Response) => {
  try {
    const trends = redditApi.getRedditTrends();
    return res.json(trends);
  } catch (error) {
    console.error('Error fetching Reddit trends:', error);
    return res.status(500).json({ error: 'Failed to fetch Reddit trends' });
  }
});

export default router;
