'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, Sparkles, Shield, Zap } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Bookmark className="w-12 h-12 text-primary-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white">
              Link Saver
            </h1>
          </div>
          <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Professional bookmark management with AI-powered summaries. 
            Save, organize, and understand your links with intelligent insights.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-md">
            <Sparkles className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              AI Summaries
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Automatically generate intelligent summaries of your bookmarks using advanced AI technology.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-md">
            <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Your data is protected with industry-standard encryption and secure authentication.
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-md">
            <Zap className="w-12 h-12 text-accent-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              Smart Organization
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              Organize bookmarks with tags, search, and filter functionality for easy access.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-primary-600 dark:text-primary-400 font-semibold py-3 px-8 rounded-lg border-2 border-primary-600 dark:border-primary-400 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-secondary-500 dark:text-secondary-400">
          <p>&copy; 2024 Link Saver. Professional bookmark management solution.</p>
        </footer>
      </div>
    </div>
  );
} 