import { NextRequest, NextResponse } from 'next/server';
import { handleGoogleAuth } from '@/lib/googleAuth';

export async function POST(request: NextRequest) {
  try {
    
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'Google ID token is required' },
        { status: 400 }
      );
    }

    // Handle Google authentication
    const result = await handleGoogleAuth(idToken);

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { 
        message: result.isNewUser ? 'Account created successfully' : 'Login successful',
        user: result.user 
      },
      { status: result.isNewUser ? 201 : 200 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Google authentication failed' },
      { status: 401 }
    );
  }
} 