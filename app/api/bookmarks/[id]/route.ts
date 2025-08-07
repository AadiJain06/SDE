import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { 
  updateBookmark, 
  deleteBookmark, 
  getBookmarkById 
} from '@/lib/bookmarks';

// PUT - Update bookmark
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const bookmarkId = params.id;
    const updates = await request.json();
    
    const bookmark = await updateBookmark(bookmarkId, decoded.userId, updates);
    
    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Bookmark updated successfully',
        bookmark 
      }
    );
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const bookmarkId = params.id;
    const success = await deleteBookmark(bookmarkId, decoded.userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Bookmark deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 