import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const theme = await db
      .select()
      .from(themes)
      .where(eq(themes.id, parseInt(id)))
      .limit(1);

    if (theme.length === 0) {
      return NextResponse.json(
        {
          error: 'Theme not found',
          code: 'THEME_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(theme[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const themeId = parseInt(id);

    // Parse and validate request body
    const body = await request.json();
    const { is_main } = body;

    // Validate is_main is provided and is a boolean
    if (is_main === undefined || is_main === null) {
      return NextResponse.json(
        {
          error: 'is_main field is required',
          code: 'MISSING_REQUIRED_FIELD',
        },
        { status: 400 }
      );
    }

    if (typeof is_main !== 'boolean') {
      return NextResponse.json(
        {
          error: 'is_main must be a boolean value',
          code: 'INVALID_FIELD_TYPE',
        },
        { status: 400 }
      );
    }

    // Check if theme exists
    const existingTheme = await db
      .select()
      .from(themes)
      .where(eq(themes.id, themeId))
      .limit(1);

    if (existingTheme.length === 0) {
      return NextResponse.json(
        {
          error: 'Theme not found',
          code: 'THEME_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // If setting this theme as main, first set all other themes to not main
    if (is_main === true) {
      await db
        .update(themes)
        .set({ isMain: false })
        .where(eq(themes.isMain, true));
    }

    // Update the specified theme
    const updatedTheme = await db
      .update(themes)
      .set({
        isMain: is_main,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(themes.id, themeId))
      .returning();

    if (updatedTheme.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update theme',
          code: 'UPDATE_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedTheme[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + error,
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
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const existingTheme = await db
      .select()
      .from(themes)
      .where(eq(themes.id, parseInt(id)))
      .limit(1);

    if (existingTheme.length === 0) {
      return NextResponse.json(
        {
          error: 'Theme not found',
          code: 'THEME_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(themes)
      .where(eq(themes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Theme deleted successfully',
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