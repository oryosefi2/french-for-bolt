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

  // Parse URL hash to set initial state
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/#\/exercise\/([A-B][1-2])\/([a-z]+)/);
    if (match) {
      const [, level, skill] = match;
      setSelectedLevel(level as CEFRLevel);
      setSelectedSkill(skill as SkillType);
    }
  }, []);

  const skillNames = {
    reading: 'Lecture',
    listening: 'Écoute',
    writing: 'Écriture',
    speaking: 'Oral',
    vocabulary: 'Vocabulaire',
    grammar: 'Grammaire'
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
    setExercise(null);
    setSelectedTopic(null);
  };

  const goBack = () => {
    window.location.hash = '#/dashboard';
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={goBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedSkill ? skillNames[selectedSkill] : 'Exercices'}
            </h1>
            <p className="text-gray-600">
              {selectedTopic ? `Sujet: ${selectedTopic.name}` : 'Choisissez un niveau et un sujet'}
            </p>
          </div>
        </div>

        {exercise && (
          <button
            onClick={resetExercise}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            Nouvel exercice
          </button>
        )}
      </div>

      {!exercise ? (
        <div className="space-y-8">
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
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Générer l'exercice</span>
                  </>
                )}
              </button>
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