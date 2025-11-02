import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const mainTheme = await db.select()
      .from(themes)
      .where(eq(themes.isMain, true))
      .limit(1);

    if (mainTheme.length === 0) {
      return NextResponse.json({ 
        error: 'No main theme found',
        code: 'NO_MAIN_THEME' 
      }, { status: 404 });
    }

    return NextResponse.json(mainTheme[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}