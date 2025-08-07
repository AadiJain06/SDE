import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';

export async function GET() {
  try {
    // Test database connection
    await initDatabase();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      },
      { status: 500 }
    );
  }
} 