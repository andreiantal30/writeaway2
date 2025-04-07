
import axios from 'axios';

interface NewsArticle {
  title: string;
  source: {
    id: string | null;
    name: string;
  };
  publishedAt: string;
  url: string;
  description: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

interface Headline {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  description: string;
}

/**
 * Fetches top headlines from NewsAPI
 * Only called server-side to protect API key
 */
export async function fetchNewsHeadlines(apiKey: string): Promise<Headline[]> {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        language: 'en',
        pageSize: 20,
        apiKey
      }
    });
    
    const data: NewsAPIResponse = response.data;
    
    if (data.status !== 'ok') {
      throw new Error(`News API error: ${data.status}`);
    }
    
    return data.articles.map(article => ({
      title: article.title,
      source: article.source.name,
      publishedAt: article.publishedAt,
      url: article.url,
      description: article.description
    }));
  } catch (error: any) {
    console.error('Error fetching news:', error.message);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}
