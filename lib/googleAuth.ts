import { OAuth2Client } from 'google-auth-library';
import { createUser, getUserByEmail, generateToken } from './auth';

const client = new OAuth2Client('591914768998-j0ldsudrj5u9nj7dedp9rg2un8jv9cq0.apps.googleusercontent.com');

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export const verifyGoogleToken = async (idToken: string): Promise<GoogleUser> => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: '591914768998-j0ldsudrj5u9nj7dedp9rg2un8jv9cq0.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture!,
    };
  } catch (error) {
    console.error('Google token verification error:', error);
    throw new Error('Invalid Google token');
  }
};

export const handleGoogleAuth = async (idToken: string) => {
  try {
    // Verify the Google token
    const googleUser = await verifyGoogleToken(idToken);

    // Check if user already exists
    const existingUser = await getUserByEmail(googleUser.email);

    if (existingUser) {
      // User exists, generate JWT token
      const token = generateToken(existingUser.id);
      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        token,
        isNewUser: false,
      };
    } else {
      // Create new user with Google info
      // For Google users, we'll use a placeholder password since they don't have one
      const hashedPassword = await import('bcryptjs').then(bcrypt => 
        bcrypt.hash(googleUser.id + process.env.JWT_SECRET, 12)
      );

      const newUser = await createUser(googleUser.email, hashedPassword);
      const token = generateToken(newUser.id);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        },
        token,
        isNewUser: true,
      };
    }
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
}; 