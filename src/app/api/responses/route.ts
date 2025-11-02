import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { aiResponses } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response_text } = body;

    // Validation: response_text is required and must be non-empty after trimming
    if (!response_text || typeof response_text !== 'string') {
      return NextResponse.json(
        { 
          error: 'response_text is required and must be a string',
          code: 'MISSING_RESPONSE_TEXT'
        },
        { status: 400 }
      );
    }

    const trimmedResponseText = response_text.trim();
    if (trimmedResponseText === '') {
      return NextResponse.json(
        { 
          error: 'response_text cannot be empty',
          code: 'EMPTY_RESPONSE_TEXT'
        },
        { status: 400 }
      );
    }

    // Create new AI response with auto-generated timestamp
    const newResponse = await db.insert(aiResponses)
      .values({
        responseText: trimmedResponseText,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newResponse[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    let query = db.select().from(aiResponses);

    // Apply date filtering if date parameter is provided
    if (date) {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return NextResponse.json(
          { 
            error: 'Invalid date format. Expected YYYY-MM-DD',
            code: 'INVALID_DATE_FORMAT'
          },
          { status: 400 }
        );
      }

      // Filter responses where createdAt starts with the provided date
      query = query.where(
        sql`substr(${aiResponses.createdAt}, 1, 10) = ${date}`
      );
    }

    // Order by createdAt descending (newest first)
    const responses = await query.orderBy(desc(aiResponses.createdAt));

    return NextResponse.json(responses, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}