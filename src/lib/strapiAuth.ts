// Strapi Authentication Service
// Handles customer authentication with Strapi Users & Permissions plugin

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiRegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  name?: string;
}

export interface StrapiLoginData {
  identifier: string; // email or username
  password: string;
}

// Register new customer
export async function registerCustomer(data: StrapiRegisterData): Promise<StrapiAuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return await response.json();
}

// Login customer
export async function loginCustomer(data: StrapiLoginData): Promise<StrapiAuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return await response.json();
}

// Get current user with JWT
export async function getCurrentUser(jwt: string): Promise<StrapiUser> {
  const response = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user data');
  }

  return await response.json();
}

// Forgot password
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send reset email');
  }
}

// Reset password
export async function resetPassword(code: string, password: string, passwordConfirmation: string): Promise<StrapiAuthResponse> {
  const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      password,
      passwordConfirmation,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password reset failed');
  }

  return await response.json();
}

// Update user profile
export async function updateProfile(jwt: string, data: Partial<StrapiUser>): Promise<StrapiUser> {
  const response = await fetch(`${STRAPI_URL}/api/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Profile update failed');
  }

  return await response.json();
}

// Change password
export async function changePassword(jwt: string, currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      currentPassword,
      password: newPassword,
      passwordConfirmation: newPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password change failed');
  }
}

// Verify JWT token
export function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Get token expiration time
export function getTokenExpiration(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
}

export default {
  registerCustomer,
  loginCustomer,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  isTokenValid,
  getTokenExpiration,
};
