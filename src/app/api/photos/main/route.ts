import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { photos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const mainPhoto = await db.select()
      .from(photos)
      .where(eq(photos.isMain, true))
      .limit(1);

    if (mainPhoto.length === 0) {
      // No main photo found, try to select a random photo from database
      const allPhotos = await db.select().from(photos);
      
      if (allPhotos.length > 0) {
        // Randomly select a photo
        const randomIndex = Math.floor(Math.random() * allPhotos.length);
        const selectedPhoto = allPhotos[randomIndex];
        
        // Set all photos to not main
        await db.update(photos).set({ isMain: false });
        
        // Set the selected photo as main
        await db.update(photos)
          .set({ isMain: true })
          .where(eq(photos.id, selectedPhoto.id));
        
        // Return the selected photo with updated isMain
        return NextResponse.json({ ...selectedPhoto, isMain: true }, { status: 200 });
      }
      
      // No photos at all in database
      return NextResponse.json({ 
        error: 'No main photo found',
        code: 'NO_MAIN_PHOTO' 
      }, { status: 404 });
    }

    return NextResponse.json(mainPhoto[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}