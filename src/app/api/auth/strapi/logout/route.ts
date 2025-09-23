// Strapi Logout API Route
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  try {
    // Clear JWT cookie
    await clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        error: 'Logout failed',
        success: false 
      },
      { status: 500 }
    );
  }
}
