
import express from 'express';
import * as newsApi from '../lib/fetchNewsFromServer';
import { fetchAndGenerateRedditTrends } from '../lib/fetchRedditTrends';

const router = express.Router();

router.get('/news-trends', async (req, res) => {
  try {
    console.log('News trends API request received');
    // Check for a fetchNewsFromServer function instead of getNewsTrends
    if (typeof newsApi.fetchNewsFromServer === 'function') {
      const trends = await newsApi.fetchNewsFromServer();
      return res.json(trends); // Properly use res.json without double stringification
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

router.get('/reddit-trends', async (req, res) => {
  try {
    console.log('Reddit trends API request received');
    // Use fetchAndGenerateRedditTrends which is the correct exported function
    const trends = await fetchAndGenerateRedditTrends();
    return res.json(trends); // Properly use res.json without double stringification
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
