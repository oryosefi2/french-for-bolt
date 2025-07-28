import React from 'react';
import { BookOpen } from 'lucide-react';

const ReadingPage: React.FC = () => {
  console.log('ReadingPage rendering...');
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-8 h-8 text-green-600 ml-3" />
          <h1 className="text-3xl font-bold text-gray-900">תרגילי קריאה</h1>
        </div>
        <p className="text-gray-600">פתחו את כישורי הקריאה בצרפתית</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          תרגילי קריאה
        </h2>
        <p className="text-gray-600">
          הדף נטען בהצלחה!
        </p>
      </div>
    </div>
  );
};

export default ReadingPage;