// Strapi Registration API Route
import { NextRequest, NextResponse } from 'next/server';
import { registerCustomer } from '@/lib/strapiAuth';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, phone, name } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Register with Strapi
    const authResponse = await registerCustomer({
      username,
      email,
      password,
      phone,
      name,
    });

    // Set JWT cookie
    await setAuthCookie(authResponse.jwt);

    return NextResponse.json({
      success: true,
      user: authResponse.user,
      message: 'Registration successful',
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Registration failed',
        success: false 
      },
      { status: 400 }
    );
  }
}
