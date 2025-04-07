
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface RedditCredentials {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

interface RedditPost {
  data: {
    title: string;
    subreddit_name_prefixed: string;
    created_utc: number;
    url: string;
    selftext: string;
  }
}

interface RedditTrend {
  id: string;
  title: string;
  source: string;
  createdAt: string;
  url: string;
  description: string;
}

/**
 * Fetches trending posts from Reddit
 * Only called server-side to protect API credentials
 */
export async function fetchRedditTrends(credentials: RedditCredentials): Promise<RedditTrend[]> {
  try {
    // Get OAuth token
    const tokenResponse = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      `grant_type=password&username=${credentials.username}&password=${credentials.password}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')}`
        }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    if (!access_token) {
      throw new Error('Failed to authenticate with Reddit API');
    }
    
    // Subreddits to check for trends
    const subreddits = ['GenZ', 'trend', 'OutOfTheLoop', 'advertising', 'marketing', 'popular'];
    const allPosts: RedditTrend[] = [];
    
    // Fetch posts from each subreddit
    for (const subreddit of subreddits) {
      const response = await axios.get(
        `https://oauth.reddit.com/r/${subreddit}/hot`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'User-Agent': 'CampaignGeneratorApp/1.0'
          },
          params: {
            limit: 10
          }
        }
      );
      
      const posts: RedditPost[] = response.data.data.children;
      
      posts.forEach(post => {
        allPosts.push({
          id: uuidv4(),
          title: post.data.title,
          source: post.data.subreddit_name_prefixed,
          createdAt: new Date(post.data.created_utc * 1000).toISOString(),
          url: post.data.url,
          description: post.data.selftext.substring(0, 200) + (post.data.selftext.length > 200 ? '...' : '')
        });
      });
      
      // If we already have enough posts, break
      if (allPosts.length >= 30) {
        break;
      }
    }
    
    return allPosts;
  } catch (error: any) {
    console.error('Error fetching Reddit trends:', error.message);
    throw new Error(`Failed to fetch Reddit trends: ${error.message}`);
  }
}
