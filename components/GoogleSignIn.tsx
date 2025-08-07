'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  mode: 'login' | 'register';
}

export default function GoogleSignIn({ mode }: GoogleSignInProps) {
  const router = useRouter();

  const handleGoogleSignIn = useCallback(async (response: any) => {
    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: response.credential,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        toast.success(data.message);
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('An error occurred during Google sign-in');
    }
  }, [router]);

  useEffect(() => {
    // Use hardcoded Google Client ID
    const clientId = '591914768998-j0ldsudrj5u9nj7dedp9rg2un8jv9cq0.apps.googleusercontent.com';
    
    // Check if Google Client ID is configured
    if (!clientId) {
      console.warn('Google Client ID not configured. Google Sign-In will be disabled.');
      return;
    }
    
    // Check if we're in development and warn about OAuth configuration
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.warn('Development mode detected. Make sure to add this origin to your Google OAuth client configuration:');
      console.warn(`${window.location.protocol}//${window.location.host}`);
    }

    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
          });

          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              text: mode === 'login' ? 'signin_with' : 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            }
          );
        } catch (error) {
          console.error('Failed to initialize Google Sign-In:', error);
          // Show fallback message
          const buttonElement = document.getElementById('google-signin-button');
          if (buttonElement) {
            buttonElement.innerHTML = `
              <div class="text-sm text-red-600 dark:text-red-400 text-center p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p><strong>Google Sign-In Configuration Error</strong></p>
                <p class="mt-1">The current domain is not authorized for this Google OAuth client.</p>
                <p class="mt-1 text-xs">Please configure the OAuth client or use email authentication.</p>
              </div>
            `;
          }
        }
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [handleGoogleSignIn, mode]);

  const clientId = '591914768998-j0ldsudrj5u9nj7dedp9rg2un8jv9cq0.apps.googleusercontent.com';
  const isGoogleConfigured = !!clientId;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6">
        {isGoogleConfigured ? (
          <div
            id="google-signin-button"
            className="w-full flex justify-center"
          />
        ) : (
          <div className="w-full flex justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              <p>Google Sign-In is not configured.</p>
              <p className="mt-1">
                To enable Google Sign-In, set up your Google OAuth credentials and add them to your environment variables.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 