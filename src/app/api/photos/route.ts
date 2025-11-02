import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';

export async function GET() {
  try {
    const allPhotos = await db.select().from(photos);
    
    // Sort in JavaScript instead of SQL
    const sortedPhotos = allPhotos.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return NextResponse.json(sortedPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photo_url, is_main } = body;

    // Validate required field
    if (!photo_url || typeof photo_url !== 'string' || photo_url.trim() === '') {
      return NextResponse.json(
        { 
          error: 'photo_url is required and must be a non-empty string',
          code: 'MISSING_PHOTO_URL'
        },
        { status: 400 }
      );
    }

    // If is_main is true, set all existing photos to not main
    if (is_main === true) {
      await db.update(photos).set({ isMain: false });
    }

    const newPhoto = await db.insert(photos)
      .values({
        photoUrl: photo_url.trim(),
        isMain: is_main === true,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPhoto[0], { status: 201 });

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