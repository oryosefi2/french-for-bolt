import React from 'react';
import { BookOpen, User, LogOut, Trophy, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Français<span className="text-blue-600">Pro</span>
            </h1>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-amber-600">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">{user.total_points}</span>
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Flame className="w-4 h-4" />
                  <span className="font-medium">{user.streak_days}j</span>
                </div>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {user.current_level}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;