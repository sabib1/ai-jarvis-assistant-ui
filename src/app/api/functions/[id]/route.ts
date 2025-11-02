import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { functions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const functionId = parseInt(id);

    // Check if function exists before deletion
    const existingFunction = await db
      .select()
      .from(functions)
      .where(eq(functions.id, functionId))
      .limit(1);

    if (existingFunction.length === 0) {
      return NextResponse.json(
        {
          error: 'Function not found',
          code: 'FUNCTION_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the function record
    const deleted = await db
      .delete(functions)
      .where(eq(functions.id, functionId))
      .returning();

    return NextResponse.json(
      {
        message: 'Function deleted successfully',
        id: deleted[0].id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}