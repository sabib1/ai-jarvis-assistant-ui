import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themes } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const updated = await db.update(themes)
      .set({
        isMain: false,
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json({
      message: 'All themes cleared from main status',
      updated: updated.length
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}