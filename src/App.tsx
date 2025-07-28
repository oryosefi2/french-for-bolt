import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import HebrewDashboard from './pages/HebrewDashboard';

const App: React.FC = () => {
  const { user, initialLoading } = useAuth();

  console.log('App.tsx: Current state', { user: !!user, initialLoading });

  if (initialLoading) {
    console.log('App.tsx: Showing loading screen');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  console.log('App.tsx: Rendering main content', { userExists: !!user });

  return (
    <>
      {user ? <HebrewDashboard /> : <AuthForm />}
      <Toaster position="top-right" />
    </>
  );
};

export default App;