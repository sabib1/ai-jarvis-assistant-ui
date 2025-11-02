import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { functions } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const results = await db.select()
      .from(functions)
      .orderBy(desc(functions.createdAt));

    return NextResponse.json(results, { status: 200 });
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
    const { name, code } = body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    // Validate code
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json({ 
        error: "Code is required and must be a non-empty string",
        code: "INVALID_CODE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedCode = code.trim();

    // Create new function record
    const newFunction = await db.insert(functions)
      .values({
        name: sanitizedName,
        code: sanitizedCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newFunction[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}