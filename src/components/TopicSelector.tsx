import React from 'react';
import { TOPICS_BY_LEVEL } from '../data/vocabularyData';
import type { CEFRLevel, Topic } from '../types';

interface TopicSelectorProps {
  level: CEFRLevel;
  selectedTopic: string | null;
  onTopicSelect: (topic: Topic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  level,
  selectedTopic,
  onTopicSelect
}) => {
  const topics = TOPICS_BY_LEVEL[level] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Choisir un sujet ({level})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicSelect(topic)}
            className={`
              p-4 border-2 rounded-lg text-left transition-all duration-200
              ${selectedTopic === topic.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <h4 className="font-medium text-gray-900 mb-2">
              {topic.name}
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              {topic.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {topic.vocabulary_count} mots
              </span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedTopic === topic.id
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {topic.level}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSelector;