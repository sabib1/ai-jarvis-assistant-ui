import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allThemes = await db.select()
      .from(themes)
      .orderBy(desc(themes.createdAt));

    return NextResponse.json(allThemes, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, css_code, is_main } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (!css_code || typeof css_code !== 'string' || css_code.trim().length === 0) {
      return NextResponse.json({ 
        error: "CSS code is required and must be a non-empty string",
        code: "INVALID_CSS_CODE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedCssCode = css_code.trim();

    // Auto-generate timestamps
    const now = new Date().toISOString();

    // If is_main is true (or not provided, default to true), set all other themes to not main
    const isMainValue = is_main !== false;
    if (isMainValue) {
      await db.update(themes).set({ isMain: false }).where(eq(themes.isMain, true));
    }

    // Insert new theme
    const newTheme = await db.insert(themes)
      .values({
        name: sanitizedName,
        cssCode: sanitizedCssCode,
        isMain: isMainValue,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newTheme[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}