import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { openaiClient } from '../services/openaiClient';
import { dialogueApiClient } from '../services/dialogueApiClient';
import LevelSelector from '../components/LevelSelector';
import TopicSelector from '../components/TopicSelector';
import ExerciseRenderer from '../components/ExerciseRenderer';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import type { CEFRLevel, SkillType, Topic } from '../types';
import toast from 'react-hot-toast';

const ExercisePage: React.FC = () => {
  const { user } = useAuth();
  const { addProgress } = useProgress(user?.id);
  
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(user?.current_level || 'A1');
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDynamic, setIsDynamic] = useState(false);

  // Parse URL hash to set initial state
  useEffect(() => {
    const hash = window.location.hash;
    
    // Check for dynamic exercise
    const dynamicMatch = hash.match(/#\/exercise\/dynamic\/([A-C][1-2])/);
    if (dynamicMatch) {
      const [, level] = dynamicMatch;
      setSelectedLevel(level as CEFRLevel);
      setIsDynamic(true);
      loadDynamicExercise();
      return;
    }
    
    // Regular exercise
    const match = hash.match(/#\/exercise\/([A-B][1-2])\/([a-z]+)/);
    if (match) {
      const [, level, skill] = match;
      setSelectedLevel(level as CEFRLevel);
      setSelectedSkill(skill as SkillType);
      setIsDynamic(false);
    }
  }, []);

  const skillNames = {
    reading: 'קריאה',
    listening: 'האזנה',
    writing: 'כתיבה',
    speaking: 'דיבור',
    vocabulary: 'אוצר מילים',
    grammar: 'דקדוק'
  };

  const loadDynamicExercise = async () => {
    console.log('🔍 מחפש תרגיל דינמי...');
    
    // Try to get the exercise from localStorage (where it was saved after creation)
    const savedExercise = localStorage.getItem('dynamic-exercise');
    if (savedExercise) {
      try {
        const exerciseData = JSON.parse(savedExercise);
        console.log('📖 נמצא תרגיל שמור:', exerciseData);
        
        // Check if exercise is recent (within last 10 minutes)
        const now = Date.now();
        const exerciseAge = now - (exerciseData.timestamp || 0);
        const maxAge = 10 * 60 * 1000; // 10 minutes
        
        if (exerciseAge > maxAge) {
          console.log('⏰ התרגיל ישן מדי, מוחק...');
          localStorage.removeItem('dynamic-exercise');
          toast.error('התרגיל פג תוקף. אנא צור תרגיל חדש.');
          window.location.hash = '#/dashboard';
          return;
        }
        
        setExercise(exerciseData);
        // Clear the saved exercise after successful load
        localStorage.removeItem('dynamic-exercise');
        console.log('✅ תרגיל נטען בהצלחה');
        
        // For dynamic exercises, set skill type based on exercise type or default to reading
        const skillType = exerciseData.type || 'reading';
        setSelectedSkill(skillType);
        console.log('🎯 הוגדר סוג תרגיל:', skillType);
      } catch (error) {
        console.error('❌ שגיאה בפענוח התרגיל השמור:', error);
        localStorage.removeItem('dynamic-exercise');
        toast.error('שגיאה בטעינת התרגיל השמור');
        window.location.hash = '#/dashboard';
      }
    } else {
      console.log('❌ לא נמצא תרגיל שמור');
      toast.error('לא נמצא תרגיל לטעינה. אנא צור תרגיל חדש.');
      setTimeout(() => {
        window.location.hash = '#/dashboard';
      }, 2000);
    }
  };

  const generateExercise = async () => {
    if (!selectedTopic || !selectedSkill) return;

    setLoading(true);
    try {
      // For listening exercises, we might want to generate audio
      if (selectedSkill === 'listening') {
        // First generate the exercise content
        const exerciseData = await openaiClient.generateExercise(
          selectedLevel,
          selectedSkill,
          selectedTopic.name
        );

        // Then try to generate audio for the dialogue
        if (exerciseData.dialogue) {
          try {
            const dialogueResponse = await dialogueApiClient.generateDialogue(
              [], // We'll extract words from the dialogue
              selectedLevel,
              selectedTopic.name
            );
            exerciseData.audioUrl = dialogueResponse.audio_url;
          } catch (error) {
            console.log('Audio generation failed, using text only');
          }
        }

        setExercise(exerciseData);
      } else {
        const exerciseData = await openaiClient.generateExercise(
          selectedLevel,
          selectedSkill,
          selectedTopic.name
        );
        setExercise(exerciseData);
      }
    } catch (error) {
      toast.error('Échec de la génération de l\'exercice');
      console.error('Exercise generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseComplete = async (score: number, timeSpent: number) => {
    if (!selectedTopic || !selectedSkill) return;

    await addProgress(
      selectedLevel,
      selectedSkill,
      selectedTopic.name,
      score,
      timeSpent
    );

    // Show success message and option to continue
    toast.success(`Exercice terminé! Score: ${Math.round(score)}%`);
  };

  const resetExercise = () => {
    if (isDynamic) {
      // For dynamic exercises, go back to dashboard
      window.location.hash = '#/dashboard';
    } else {
      // For regular exercises, reset to allow creating a new one
      setExercise(null);
      setSelectedTopic(null);
    }
  };

  const goBack = () => {
    window.location.hash = '#/dashboard';
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8" dir="rtl">
        <div className="flex items-center space-x-reverse space-x-4">
          <button
            onClick={goBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 scale-x-[-1]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isDynamic ? 'תרגיל דינמי' : (selectedSkill ? skillNames[selectedSkill] : 'תרגילים')}
            </h1>
            <p className="text-gray-600">
              {isDynamic ? 'תרגיל שנוצר באמצעות AI' : (selectedTopic ? `נושא: ${selectedTopic.name}` : 'בחר רמה ונושא')}
            </p>
          </div>
        </div>

        {exercise && (
          <button
            onClick={resetExercise}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            {isDynamic ? 'חזור לדשבורד' : 'תרגיל חדש'}
          </button>
        )}
      </div>

      {!exercise ? (
        <div className="space-y-8" dir="rtl">
          {!isDynamic && (
            <>
              {/* Level Selector */}
              <LevelSelector
                currentLevel={selectedLevel}
                userLevel={user.current_level}
                onLevelChange={setSelectedLevel}
              />

              {/* Topic Selector */}
              {selectedSkill && (
                <TopicSelector
                  level={selectedLevel}
                  selectedTopic={selectedTopic?.id || null}
                  onTopicSelect={setSelectedTopic}
                />
              )}

              {/* Generate Exercise Button */}
              {selectedTopic && selectedSkill && (
                <div className="text-center">
                  <button
                    onClick={generateExercise}
                    disabled={loading}
                    className="inline-flex items-center space-x-reverse space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>יוצר תרגיל...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>צור תרגיל</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
          
          {isDynamic && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">טוען תרגיל דינמי...</p>
            </div>
          )}
        </div>
      ) : (
        /* Exercise Renderer */
        <ExerciseRenderer
          exercise={exercise}
          skillType={selectedSkill!}
          onComplete={handleExerciseComplete}
        />
      )}
    </div>
  );
};

export default ExercisePage;