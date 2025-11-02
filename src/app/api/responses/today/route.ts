import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { aiResponses } from '@/db/schema';
import { like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Query responses where createdAt starts with today's date
    const todaysResponses = await db.select()
      .from(aiResponses)
      .where(like(aiResponses.createdAt, `${today}%`))
      .orderBy(desc(aiResponses.createdAt));
    
    return NextResponse.json(todaysResponses, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}