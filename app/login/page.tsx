import AuthForm from '@/components/AuthForm';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      
      <AuthForm mode="login" />
    </div>
  );
} 