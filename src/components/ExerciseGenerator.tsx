import React, { useState } from 'react';
import { Loader2, Sparkles, Play, Volume2 } from 'lucide-react';
import { backendClient } from '../services/backendClient';
import { dialogueApiClient } from '../services/dialogueApiClient';
import type { CEFRLevel, SkillType } from '../types';
import toast from 'react-hot-toast';

interface ExerciseGeneratorProps {
  level: CEFRLevel;
  skillType: SkillType;
  topic?: string;
  onExerciseGenerated?: (exercise: any) => void;
}

const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  level,
  skillType,
  topic,
  onExerciseGenerated
}) => {
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const skillNames = {
    reading: 'קריאה',
    listening: 'האזנה',
    writing: 'כתיבה',
    speaking: 'דיבור',
    vocabulary: 'אוצר מילים',
    grammar: 'דקדוק'
  };

  const generateExercise = async () => {
    setLoading(true);
    setExercise(null);
    setUserAnswers({});
    setShowResults(false);
    setAudioUrl('');

    try {
      console.log('Starting exercise generation...');
      
      // Map skillType to backend skill_category
      const skillCategoryMap = {
        'reading': 'comprehension_ecrite',
        'listening': 'comprehension_orale',
        'writing': 'expression_ecrite',
        'speaking': 'expression_orale',
        'vocabulary': 'vocabulaire',
        'grammar': 'grammaire'
      };

      const exerciseRequest = {
        level,
        skill_category: skillCategoryMap[skillType] || 'comprehension_ecrite',
        topic: topic || getDefaultTopic(level),
        difficulty: 3,
        template_type: getTemplateType(skillType),
        prompt: ''
      };

      const exerciseResponse = await backendClient.generateExercise(exerciseRequest);

      if (!exerciseResponse.success) {
        throw new Error(exerciseResponse.error || 'שגיאה ביצירת התרגיל');
      }

      console.log('Exercise generated successfully:', exerciseResponse);

      const exerciseData = {
        ...exerciseResponse.content,
        correct_answers: exerciseResponse.correct_answers,
        explanation: exerciseResponse.explanation
      };

      // For listening exercises, generate audio
      if (skillType === 'listening') {
        try {
          console.log('Generating dialogue with audio...');
          
          // Extract words from the exercise or use default words
          const words = exerciseData.words || ['bonjour', 'comment', 'allez-vous'];
          
          const dialogueResponse = await backendClient.createDialogue({
            words,
            topic: topic || getDefaultTopic(level)
          });
          
          if (dialogueResponse.success) {
            // Replace the dialogue with the generated one
            exerciseData.dialogue = dialogueResponse.dialogue;
            if (dialogueResponse.audioUrl) {
              setAudioUrl(dialogueResponse.audioUrl);
            }
            console.log('Audio generated successfully');
          }
        } catch (error) {
          console.log('Audio generation failed, using text only:', error);
        }
      }

      setExercise(exerciseData);
      onExerciseGenerated?.(exerciseData);
      toast.success('תרגיל נוצר בהצלחה!');
    } catch (error) {
      console.error('Exercise generation failed:', error);
      // Error message already handled in openaiClient
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTopic = (level: CEFRLevel): string => {
    const topics = {
      A1: ['משפחה', 'הצגה עצמית', 'מספרים', 'צבעים', 'אוכל'],
      A2: ['שגרה יומית', 'קניות', 'תחבורה', 'מזג אוויר', 'תחביבים'],
      B1: ['עבודה', 'בריאות', 'נסיעות', 'טכנולוגיה', 'סביבה'],
      B2: ['פוליטיקה', 'תרבות', 'כלכלה', 'מדע', 'חברה']
    };
    
    const levelTopics = topics[level] || topics.A1;
    return levelTopics[Math.floor(Math.random() * levelTopics.length)];
  };

  const getTemplateType = (skillType: SkillType): string => {
    const templateMap = {
      'reading': 'reading_comprehension',
      'listening': 'listening_comprehension',
      'writing': 'writing_exercise',
      'speaking': 'speaking_exercise',
      'vocabulary': 'vocabulary_exercise',
      'grammar': 'grammar_exercise'
    };
    return templateMap[skillType] || 'reading_comprehension';
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    toast.success(`ציון: ${Math.round(score)}%`);
  };

  const calculateScore = () => {
    if (!exercise) return 0;

    let correct = 0;
    let total = 0;

    if (exercise.questions) {
      exercise.questions.forEach((q: any, index: number) => {
        total++;
        if (userAnswers[`q${index}`] === q.correct) {
          correct++;
        }
      });
    }

    return total > 0 ? (correct / total) * 100 : 0;
  };

  const renderExercise = () => {
    if (!exercise) return null;

    switch (skillType) {
      case 'reading':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold mb-4 text-blue-900">טקסט לקריאה</h3>
              <p className="text-gray-800 leading-relaxed text-right" dir="ltr">
                {exercise.passage}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">שאלות הבנה</h3>
              {exercise.questions?.map((question: any, index: number) => (
                <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium mb-3 text-right">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <label key={optIndex} className="flex items-center space-x-2 cursor-pointer text-right">
                        <span className={showResults && question.correct === optIndex ? 'text-green-600 font-medium' : ''}>{option}</span>
                        <input
                          type="radio"
                          name={`q${index}`}
                          value={optIndex}
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: parseInt(e.target.value)
                          }))}
                          disabled={showResults}
                          className="text-blue-600 mr-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold mb-4 text-purple-900">דיאלוג להאזנה</h3>
              
              {/* Audio Player */}
              <div className="mb-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-purple-900">🎧 האזן לדיאלוג</h4>
                    <div className="text-sm text-purple-600">
                      {audioUrl ? '✅ אודיו זמין' : '⏳ טוען אודיו...'}
                    </div>
                  </div>
                  
                  {audioUrl ? (
                    <div className="space-y-2">
                      <audio 
                        controls 
                        className="w-full h-10"
                        preload="metadata"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('❌ שגיאת אודיו:', e);
                          console.error('❌ URL שנכשל:', audioUrl);
                          toast.error(`שגיאה בטעינת האודיו: ${audioUrl}`);
                        }}
                        onLoadStart={() => console.log('🎵 התחלת טעינת אודיו')}
                        onCanPlay={() => console.log('✅ אודיו מוכן לנגינה')}
                        onLoadedData={() => console.log('📊 נתוני אודיו נטענו')}
                      >
                        <source src={audioUrl} type="audio/mpeg" />
                        <source src={audioUrl} type="audio/wav" />
                        <source src={audioUrl} type="audio/ogg" />
                        הדפדפן שלך לא תומך בנגן אודיו
                      </audio>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="text-center">🔗 <strong>URL:</strong> {audioUrl}</p>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              console.log('🧪 בודק URL באופן ישיר...');
                              window.open(audioUrl, '_blank');
                            }}
                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
                          >
                            בדוק URL
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(audioUrl);
                              toast.success('URL הועתק!');
                            }}
                            className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200"
                          >
                            העתק URL
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center space-x-2 text-purple-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>יוצר אודיו...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 italic text-right" dir="ltr">
                {exercise.dialogue}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">שאלות הבנה</h3>
              {exercise.questions?.map((question: any, index: number) => (
                <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium mb-3 text-right">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => (
                      <label key={optIndex} className="flex items-center space-x-2 cursor-pointer text-right">
                        <span>{option}</span>
                        <input
                          type="radio"
                          name={`q${index}`}
                          value={optIndex}
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: parseInt(e.target.value)
                          }))}
                          disabled={showResults}
                          className="text-purple-600 mr-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'vocabulary':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold mb-4 text-orange-900">מילים חדשות</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercise.words?.map((word: any, index: number) => (
                  <div key={index} className="bg-white p-3 border border-orange-200 rounded">
                    <div className="font-medium text-orange-600" dir="ltr">{word.french}</div>
                    <div className="text-sm text-gray-600">{word.english}</div>
                    <div className="text-xs text-gray-500 italic" dir="ltr">{word.example}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">תרגילי התאמה</h3>
              {exercise.matching?.map((match: any, index: number) => (
                <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                  <p className="font-medium mb-3 text-right">
                    תרגם: <span className="text-orange-600" dir="ltr">{match.french}</span>
                  </p>
                  <div className="space-y-2">
                    {match.options.map((option: string, optIndex: number) => (
                      <label key={optIndex} className="flex items-center space-x-2 cursor-pointer text-right">
                        <span>{option}</span>
                        <input
                          type="radio"
                          name={`match${index}`}
                          value={optIndex}
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`match${index}`]: parseInt(e.target.value)
                          }))}
                          disabled={showResults}
                          className="text-orange-600 mr-2"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>תרגיל זה עדיין בפיתוח</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {skillNames[skillType]} - רמה {level}
            </h2>
            <p className="text-gray-600">
              {topic ? `נושא: ${topic}` : 'תרגיל דינמי מבוסס AI'}
            </p>
          </div>
          <button
            onClick={generateExercise}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>יוצר תרגיל...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>צור תרגיל חדש</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Exercise Content */}
      {exercise && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderExercise()}
          
          {!showResults && exercise.questions && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                בדוק תשובות
              </button>
            </div>
          )}
          
          {showResults && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                תרגיל הושלם!
              </h3>
              <p className="text-green-700">
                ציון: {Math.round(calculateScore())}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!loading && !exercise && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            מוכן ליצור תרגיל?
          </h3>
          <p className="text-gray-500 mb-6">
            לחץ על "צור תרגיל חדש" כדי להתחיל
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseGenerator;