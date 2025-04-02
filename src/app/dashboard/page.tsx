'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/signin');
    }
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push('/auth/signin');
  };

  const handleResetPassword = () => {
    router.push('/auth/reset-password');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <nav className={`shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className="mr-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-gray-300 hover:bg-gray-400"
              >
                Toggle Dark Mode
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`w-64 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} h-full`}>
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleResetPassword}
                className={`w-full text-left px-4 py-2 rounded-md ${isDarkMode ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-black bg-blue-500 hover:bg-blue-600'}`}
              >
                Reset Password
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 rounded-md ${isDarkMode ? 'text-white bg-red-600 hover:bg-red-700' : 'text-black bg-red-500 hover:bg-red-600'}`}
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <div className={`border-4 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg h-96 p-4`}>
            <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
            <p className={`text-${isDarkMode ? 'gray-300' : 'gray-700'}`}>
              You are now signed in. This is a protected route.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
} 