// Get Current User API Route
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/strapiAuth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sdp_session')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Get user data from Strapi
    const user = await getCurrentUser(token);

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to get user data',
        success: false 
      },
      { status: 401 }
    );
  }
}
