import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DEFAULT_PHOTO_URL = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d2436165-1a14-4952-ad87-745182e2a2ec/generated_images/portrait-of-futuristic-female-humanoid-a-db75eb83-20251011232611.jpg";

export async function POST(request: NextRequest) {
  try {
    // Step 1: Update all existing photos to set isMain = false
    await db.update(photos)
      .set({ isMain: false })
      .where(eq(photos.isMain, true));

    // Step 2: Insert the default photo with isMain = true
    const newPhoto = await db.insert(photos)
      .values({
        photoUrl: DEFAULT_PHOTO_URL,
        isMain: true,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newPhoto[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}