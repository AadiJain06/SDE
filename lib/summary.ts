import axios from 'axios';

// Extract favicon URL from a website URL
export const extractFavicon = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '';
  }
};

// Extract title from a webpage
export const extractTitle = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].trim();
    }
    
    // Fallback: extract from URL
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    console.error('Error extracting title:', error);
    // Fallback: extract from URL
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown Title';
    }
  }
};

// Generate AI summary using Jina AI
export const generateSummary = async (url: string, title: string): Promise<string> => {
  try {
    const apiKey = 'jina_b03c6b67b96d4805857382d74d4f4995JJiMamY7lJiKp-BZGTBQXEWmVr8P';
    
    // Fetch the webpage content
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    
    // Extract text content (simple approach)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000); // Limit content length
    
    // Call Jina AI API for summarization
    const summaryResponse = await axios.post(
      'https://api.jina.ai/v1/chat/completions',
      {
        model: 'jina-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, informative summaries of web content. Focus on the main points and key information.'
          },
          {
            role: 'user',
            content: `Please provide a brief summary of this webpage content:\n\nTitle: ${title}\n\nContent: ${textContent}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    const summary = summaryResponse.data.choices[0]?.message?.content;
    return summary || `Summary for: ${title}\n\nUnable to generate AI summary at this time.`;
    
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Fallback summary
    return `Summary for: ${title}\n\nThis is a fallback summary. The AI summary service is currently unavailable.`;
  }
}; 