import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { arceeResponses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Query single record
    const response = await db
      .select()
      .from(arceeResponses)
      .where(eq(arceeResponses.id, parseInt(id)))
      .limit(1);

    if (response.length === 0) {
      return NextResponse.json(
        {
          error: 'Arcee response not found',
          code: 'ARCEE_RESPONSE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(response[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // Check if response exists
    const existingResponse = await db
      .select()
      .from(arceeResponses)
      .where(eq(arceeResponses.id, parseInt(id)))
      .limit(1);

    if (existingResponse.length === 0) {
      return NextResponse.json(
        {
          error: 'Arcee response not found',
          code: 'ARCEE_RESPONSE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the response
    await db
      .delete(arceeResponses)
      .where(eq(arceeResponses.id, parseInt(id)));

    return NextResponse.json(
      {
        message: 'Arcee response deleted successfully',
        id: parseInt(id),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}