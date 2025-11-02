import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    const photoId = parseInt(id);

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

    // Check if photo exists
    const existingPhoto = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId))
      .limit(1);

    if (existingPhoto.length === 0) {
      return NextResponse.json(
        {
          error: 'Photo not found',
          code: 'PHOTO_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // If setting this photo as main, first set all other photos to not main
    if (is_main === true) {
      await db
        .update(photos)
        .set({ isMain: false })
        .where(eq(photos.isMain, true));
    }

    // Update the specified photo
    const updatedPhoto = await db
      .update(photos)
      .set({
        isMain: is_main,
      })
      .where(eq(photos.id, photoId))
      .returning();

    if (updatedPhoto.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to update photo',
          code: 'UPDATE_FAILED',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPhoto[0], { status: 200 });
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
    const { id } = params;

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

    const photoId = parseInt(id);

    // Check if photo exists
    const existingPhoto = await db
      .select()
      .from(photos)
      .where(eq(photos.id, photoId))
      .limit(1);

    if (existingPhoto.length === 0) {
      return NextResponse.json(
        {
          error: 'Photo not found',
          code: 'PHOTO_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the photo
    await db
      .delete(photos)
      .where(eq(photos.id, photoId));

    return NextResponse.json(
      { 
        message: 'Photo deleted successfully',
        id: photoId 
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