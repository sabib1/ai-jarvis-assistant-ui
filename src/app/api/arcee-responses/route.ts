import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { arceeResponses } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audio_transcript, audio_url } = body;

    // Validate required fields
    if (!audio_transcript || typeof audio_transcript !== 'string') {
      return NextResponse.json(
        { 
          error: 'audio_transcript is required and must be a string',
          code: 'MISSING_AUDIO_TRANSCRIPT'
        },
        { status: 400 }
      );
    }

    if (!audio_url || typeof audio_url !== 'string') {
      return NextResponse.json(
        { 
          error: 'audio_url is required and must be a string',
          code: 'MISSING_AUDIO_URL'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTranscript = audio_transcript.trim();
    const sanitizedUrl = audio_url.trim();

    // Validate non-empty after trimming
    if (sanitizedTranscript === '') {
      return NextResponse.json(
        { 
          error: 'audio_transcript cannot be empty',
          code: 'EMPTY_AUDIO_TRANSCRIPT'
        },
        { status: 400 }
      );
    }

    if (sanitizedUrl === '') {
      return NextResponse.json(
        { 
          error: 'audio_url cannot be empty',
          code: 'EMPTY_AUDIO_URL'
        },
        { status: 400 }
      );
    }

    // Create new Arcee response
    const newResponse = await db.insert(arceeResponses)
      .values({
        audioTranscript: sanitizedTranscript,
        audioUrl: sanitizedUrl,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newResponse[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Retrieve all Arcee responses ordered by createdAt DESC
    const responses = await db.select()
      .from(arceeResponses)
      .orderBy(desc(arceeResponses.createdAt));

    return NextResponse.json(responses, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}