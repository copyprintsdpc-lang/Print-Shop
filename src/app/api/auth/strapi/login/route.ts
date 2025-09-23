// Strapi Login API Route
import { NextRequest, NextResponse } from 'next/server';
import { loginCustomer } from '@/lib/strapiAuth';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    // Validate required fields
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Login with Strapi
    const authResponse = await loginCustomer({
      identifier,
      password,
    });

    // Set JWT cookie
    await setAuthCookie(authResponse.jwt);

    return NextResponse.json({
      success: true,
      user: authResponse.user,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Login failed',
        success: false 
      },
      { status: 401 }
    );
  }
}
