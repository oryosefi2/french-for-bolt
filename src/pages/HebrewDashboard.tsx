import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import Dashboard from './Dashboard';
import ReadingPage from './ReadingPage';
import ListeningPage from './ListeningPage';
import WritingPage from './WritingPage';
import SpeakingPage from './SpeakingPage';
import VocabularyPage from './VocabularyPage';
import GrammarPage from './GrammarPage';
import ExercisePage from './ExercisePage';

const HebrewDashboard: React.FC = () => {
  const { user, signOut, initialLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Listen for hash changes to handle navigation to exercise pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/exercise/')) {
        setCurrentPage('exercise');
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" dir="rtl">
        <div className="text-center">
          <p className="text-gray-600 text-lg">אנא התחבר למערכת</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'reading':
        return <ReadingPage />;
      case 'listening':
        return <ListeningPage />;
      case 'writing':
        return <WritingPage />;
      case 'speaking':
        return <SpeakingPage />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'grammar':
        return <GrammarPage />;
      case 'exercise':
        return <ExercisePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userStats={{
          level: user.current_level,
          points: user.total_points,
          streak: user.streak_days
        }}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4" dir="rtl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {getCurrentPageTitle(currentPage)}
            </h1>
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="flex items-center space-x-reverse space-x-3 text-right">
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-medium shadow-sm"
                >
                  התנתק
                </button>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.current_level} • {user.total_points} נקודות</p>
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6" dir="rtl">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// Helper function to get page title
const getCurrentPageTitle = (page: string): string => {
  const titles = {
    dashboard: 'דשבורד ראשי',
    reading: 'תרגילי קריאה',
    listening: 'תרגילי האזנה',
    writing: 'תרגילי כתיבה',
    speaking: 'תרגילי דיבור',
    vocabulary: 'אוצר מילים',
    grammar: 'דקדוק',
    exercise: 'תרגיל דינמי'
  };
  return titles[page as keyof typeof titles] || 'דשבורד ראשי';
};

export default HebrewDashboard;