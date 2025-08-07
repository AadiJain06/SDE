import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  createBookmark, 
  getBookmarksByUserId, 
  getBookmarksByTag 
} from '@/lib/bookmarks';
import { generateSummary, extractFavicon, extractTitle } from '@/lib/summary';

// GET - Fetch bookmarks
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    
    let bookmarks;
    if (tag) {
      bookmarks = await getBookmarksByTag(decoded.userId, tag);
    } else {
      bookmarks = await getBookmarksByUserId(decoded.userId);
    }
    
    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new bookmark
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.log('Bookmark API - User ID from token:', decoded.userId);
    
    const { url, tags = '', categoryId } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Extract title and favicon
    const title = await extractTitle(url);
    const favicon = extractFavicon(url);
    
    // Generate summary
    const summary = await generateSummary(url, title);
    
    // Create bookmark
    const bookmark = await createBookmark(
      decoded.userId,
      url,
      title,
      favicon,
      summary,
      tags,
      categoryId
    );
    
    return NextResponse.json(
      { 
        message: 'Bookmark created successfully',
        bookmark 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 