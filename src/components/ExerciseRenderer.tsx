import React, { useState } from 'react';
import { Play, Volume2, Check, X, Mic, Clock, Target, BookOpen, Award, ChevronRight } from 'lucide-react';
import type { SkillType } from '../types';

interface ExerciseRendererProps {
  exercise: any;
  skillType: SkillType;
  onComplete: (score: number, timeSpent: number) => void;
}

const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  skillType,
  onComplete
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSubmit = () => {
    const score = calculateScore();
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    setShowResults(true);
    onComplete(score, timeSpent);
  };

  const calculateScore = () => {
    if (!exercise) return 0;

    let correct = 0;
    let total = 0;

    if (exercise.questions || exercise.content?.questions) {
      const questions = exercise.questions || exercise.content?.questions;
      questions.forEach((q: any, index: number) => {
        total++;
        if (q.type === 'true_false') {
          // For true/false questions, compare boolean values
          if (userAnswers[`q${index}`] === q.correct) {
            correct++;
          }
        } else {
          // For multiple choice questions, compare indices
          if (userAnswers[`q${index}`] === q.correct) {
            correct++;
          }
        }
      });
    }

    if (exercise.exercises) {
      exercise.exercises.forEach((ex: any, index: number) => {
        total++;
        if (userAnswers[`ex${index}`]?.toLowerCase().trim() === ex.answer.toLowerCase().trim()) {
          correct++;
        }
      });
    }

    if (exercise.completions) {
      exercise.completions.forEach((comp: any, index: number) => {
        total++;
        if (userAnswers[`comp${index}`]?.toLowerCase().trim() === comp.answer.toLowerCase().trim()) {
          correct++;
        }
      });
    }

    // Handle grammar completion exercises
    if (exercise.content?.exercise_type === 'grammaire' && exercise.content?.answers) {
      const answers = exercise.content.answers;
      const questions = exercise.content?.exercise_content?.questions;
      
      if (questions) {
        questions.forEach((_: any, index: number) => {
          total++;
          const questionKey = String(index + 1);
          if (userAnswers[`completion${index}`] === answers[questionKey]) {
            correct++;
          }
        });
      }
    }

    return total > 0 ? (correct / total) * 100 : 0;
  };

  const renderGrammarCompletionExercise = () => {
    const text = exercise.content?.content?.text || exercise.content?.exercise_content?.text;
    const correctAnswers = exercise.content?.answers;
    const questions = exercise.content?.exercise_content?.questions;
    
    return (
      <div className="space-y-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-indigo-900 mb-1">תרגיל דקדוק</h3>
                <p className="text-indigo-600">השלמת מאמרים בצרפתית</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="flex items-center space-x-reverse space-x-2 bg-white/70 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">5-10 דקות</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2 bg-white/70 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">{questions?.length || 0} שאלות</span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
              {text}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-reverse space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">?</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">השלמו את המשפטים</h3>
          </div>
          {questions && questions.map((questionObj: any, index: number) => {
            const options = ['le', 'la', "l'", 'les', 'un', 'une', 'des']; // Extended options
            const questionKey = String(index + 1);
            return (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200">
                <div className="flex items-start space-x-reverse space-x-4 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-purple-700 mb-2">{questionObj.question_in_Hebrew}</p>
                    <p className="text-xl font-medium text-gray-800 mb-4 bg-gray-50 p-4 rounded-xl border-r-4 border-purple-400" dir="ltr">{questionObj.sentence}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {options.map((option: string, optIndex: number) => (
                    <label key={optIndex} className={`
                      flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium
                      ${showResults && correctAnswers?.[questionKey] === option 
                        ? 'bg-green-100 border-green-400 text-green-800 shadow-md' 
                        : showResults && userAnswers[`completion${index}`] === option && correctAnswers?.[questionKey] !== option
                        ? 'bg-red-100 border-red-400 text-red-800 shadow-md'
                        : userAnswers[`completion${index}`] === option
                        ? 'bg-purple-100 border-purple-400 text-purple-800 shadow-md'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                      }
                    `}>
                      <input
                        type="radio"
                        name={`completion${index}`}
                        value={option}
                        onChange={(e) => setUserAnswers(prev => ({
                          ...prev,
                          [`completion${index}`]: e.target.value
                        }))}
                        disabled={showResults}
                        className="sr-only"
                      />
                      <span className="text-lg font-bold" dir="ltr">{option}</span>
                      {showResults && correctAnswers?.[questionKey] === option && (
                        <Check className="w-5 h-5 text-green-600 mr-2" />
                      )}
                      {showResults && userAnswers[`completion${index}`] === option && correctAnswers?.[questionKey] !== option && (
                        <X className="w-5 h-5 text-red-600 mr-2" />
                      )}
                    </label>
                  ))}
                </div>
                {showResults && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Award className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">תשובה נכונה:</span>
                      <span className="font-bold text-green-700 text-lg" dir="ltr">{correctAnswers?.[questionKey]}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReadingExercise = () => {
    // Try different possible structures for dynamic exercises
    const text = exercise.passage || 
                 exercise.content?.text || 
                 exercise.text || 
                 exercise.content?.passage ||
                 exercise.content?.content?.text ||  // For old grammar exercises
                 exercise.content?.exercise_content?.text;  // For new grammar exercises
    
    const questions = exercise.questions || 
                     exercise.content?.questions ||
                     exercise.content?.content?.questions ||  // For old grammar exercises
                     exercise.content?.exercise_content?.questions;  // For new grammar exercises

    // Check if this is a grammar completion exercise
    const isGrammarCompletion = exercise.content?.exercise_type === 'grammaire' && 
                               exercise.content?.answers && 
                               (Array.isArray(exercise.content.answers) || typeof exercise.content.answers === 'object');
    
    if (isGrammarCompletion) {
      return renderGrammarCompletionExercise();
    }
    
    return (
      <div className="space-y-8">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">תרגיל קריאה</h3>
                <p className="text-blue-600">הבנת הנקרא בצרפתית</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="flex items-center space-x-reverse space-x-2 bg-white/70 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">5-10 דקות</span>
              </div>
              <div className="flex items-center space-x-reverse space-x-2 bg-white/70 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{questions?.length || 0} שאלות</span>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
            {text ? (
              <div className="text-gray-800 leading-relaxed text-lg" dir="ltr">{text}</div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 font-medium">טקסט לא נמצא - מבנה תרגיל לא מזוהה</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-reverse space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">?</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">שאלות הבנה</h3>
          </div>
          {questions && Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question: any, index: number) => (
              <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200">
                <div className="flex items-start space-x-reverse space-x-4 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 flex-1">{question.question}</p>
                </div>
                <div className="space-y-3 mr-12">
                  {question.type === 'true_false' ? (
                    // True/False question
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`
                        flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium
                        ${showResults && question.correct === true 
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-md' 
                          : userAnswers[`q${index}`] === true
                          ? 'bg-blue-100 border-blue-400 text-blue-800 shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                        }
                      `}>
                        <input
                          type="radio"
                          name={`q${index}`}
                          value="true"
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: e.target.value === 'true'
                          }))}
                          disabled={showResults}
                          className="sr-only"
                        />
                        <span className="text-lg">✓ נכון</span>
                        {showResults && question.correct === true && (
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                        )}
                      </label>
                      <label className={`
                        flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium
                        ${showResults && question.correct === false 
                          ? 'bg-green-100 border-green-400 text-green-800 shadow-md' 
                          : userAnswers[`q${index}`] === false
                          ? 'bg-blue-100 border-blue-400 text-blue-800 shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                        }
                      `}>
                        <input
                          type="radio"
                          name={`q${index}`}
                          value="false"
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: e.target.value === 'true'
                          }))}
                          disabled={showResults}
                          className="sr-only"
                        />
                        <span className="text-lg">✗ לא נכון</span>
                        {showResults && question.correct === false && (
                          <Check className="w-5 h-5 text-green-600 mr-2" />
                        )}
                      </label>
                    </div>
                  ) : (
                    // Multiple choice question
                    question.options && Array.isArray(question.options) ? (
                      <div className="space-y-3">
                        {question.options.map((option: string, optIndex: number) => (
                          <label key={optIndex} className={`
                            flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-medium
                            ${showResults && question.correct === optIndex 
                              ? 'bg-green-100 border-green-400 text-green-800 shadow-md' 
                              : showResults && userAnswers[`q${index}`] === optIndex && question.correct !== optIndex
                              ? 'bg-red-100 border-red-400 text-red-800 shadow-md'
                              : userAnswers[`q${index}`] === optIndex
                              ? 'bg-blue-100 border-blue-400 text-blue-800 shadow-md'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                            }
                          `}>
                            <input
                              type="radio"
                              name={`q${index}`}
                              value={optIndex}
                              onChange={(e) => setUserAnswers(prev => ({
                                ...prev,
                                [`q${index}`]: parseInt(e.target.value)
                              }))}
                              disabled={showResults}
                              className="sr-only"
                            />
                            <div className="flex items-center justify-between w-full">
                              <span className="text-lg">{option}</span>
                              <div className="flex items-center space-x-reverse space-x-2">
                                {showResults && question.correct === optIndex && (
                                  <Check className="w-5 h-5 text-green-600" />
                                )}
                                {showResults && userAnswers[`q${index}`] === optIndex && question.correct !== optIndex && (
                                  <X className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <X className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-red-600 font-medium">אפשרויות שאלה לא נמצאו</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <h4 className="text-xl font-semibold text-red-600 mb-2">שאלות לא נמצאו</h4>
              <p className="text-gray-600">מבנה התרגיל לא מזוהה - אנא נסה ליצור תרגיל חדש</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListeningExercise = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Dialogue</h3>
        <div className="flex items-center space-x-4 mb-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Play className="w-4 h-4" />
            <span>Écouter</span>
          </button>
          <Volume2 className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-gray-700 italic">{exercise.dialogue}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Questions de compréhension</h3>
        {exercise.questions?.map((question: any, index: number) => (
          <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
            <p className="font-medium mb-3">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={optIndex}
                    onChange={(e) => setUserAnswers(prev => ({
                      ...prev,
                      [`q${index}`]: parseInt(e.target.value)
                    }))}
                    disabled={showResults}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWritingExercise = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Sujet d'écriture</h3>
        <p className="text-gray-800">{exercise.prompt}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Complétez les phrases</h3>
        {exercise.completions?.map((completion: any, index: number) => (
          <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
            <p className="mb-3">{completion.sentence}</p>
            <input
              type="text"
              placeholder="Votre réponse..."
              onChange={(e) => setUserAnswers(prev => ({
                ...prev,
                [`comp${index}`]: e.target.value
              }))}
              disabled={showResults}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showResults && (
              <p className="mt-2 text-sm text-green-600">
                Réponse: {completion.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderVocabularyExercise = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Vocabulaire</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercise.words?.map((word: any, index: number) => (
            <div key={index} className="bg-white p-3 border border-gray-200 rounded">
              <div className="font-medium text-blue-600">{word.french}</div>
              <div className="text-sm text-gray-600">{word.english}</div>
              <div className="text-xs text-gray-500 italic">{word.example}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Exercices</h3>
        {exercise.matching?.map((match: any, index: number) => (
          <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
            <p className="font-medium mb-3">Traduisez: <span className="text-blue-600">{match.french}</span></p>
            <div className="space-y-2">
              {match.options.map((option: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`match${index}`}
                    value={optIndex}
                    onChange={(e) => setUserAnswers(prev => ({
                      ...prev,
                      [`match${index}`]: parseInt(e.target.value)
                    }))}
                    disabled={showResults}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGrammarExercise = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Règle de grammaire</h3>
        <p className="text-gray-800">{exercise.rule}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Exercices</h3>
        {exercise.exercises?.map((ex: any, index: number) => (
          <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
            <p className="mb-3">{ex.sentence}</p>
            <div className="space-y-2">
              {ex.options.map((option: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`ex${index}`}
                    value={option}
                    onChange={(e) => setUserAnswers(prev => ({
                      ...prev,
                      [`ex${index}`]: e.target.value
                    }))}
                    disabled={showResults}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {showResults && (
              <p className="mt-2 text-sm text-green-600">
                Réponse correcte: {ex.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpeakingExercise = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Scénario de conversation</h3>
        <p className="text-gray-800 mb-4">{exercise.scenario}</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Phrases utiles:</h4>
          <ul className="list-disc list-inside space-y-1">
            {exercise.phrases?.map((phrase: string, index: number) => (
              <li key={index} className="text-gray-700">{phrase}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prompts de conversation</h3>
        {exercise.prompts?.map((prompt: string, index: number) => (
          <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
            <p className="text-gray-800">{prompt}</p>
            <button className="mt-3 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Mic className="w-4 h-4" />
              <span>Enregistrer votre réponse</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExercise = () => {
    if (!exercise) return <div>Chargement de l'exercice...</div>;

    // Handle dynamic exercises - try to detect type from exercise structure
    if (exercise.isDynamic || !skillType) {
      // If exercise has 'content' and 'questions', treat as reading
      if (exercise.content && exercise.questions) {
        return renderReadingExercise();
      }
      // If exercise has 'exercises' array, treat as vocabulary/grammar
      if (exercise.exercises) {
        return renderVocabularyExercise();
      }
      // Default fallback
      return renderReadingExercise();
    }

    switch (skillType) {
      case 'reading':
        return renderReadingExercise();
      case 'listening':
        return renderListeningExercise();
      case 'writing':
        return renderWritingExercise();
      case 'vocabulary':
        return renderVocabularyExercise();
      case 'grammar':
        return renderGrammarExercise();
      case 'speaking':
        return renderSpeakingExercise();
      default:
        return renderReadingExercise(); // Default to reading instead of error
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">תרגיל דינמי</h1>
                <p className="text-purple-100">נוצר במיוחד עבורך</p>
              </div>
            </div>
            <div className="text-4xl">🤖</div>
          </div>
        </div>
        <div className="p-8">
        {renderExercise()}
        
        {!showResults && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center space-x-reverse space-x-3">
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                <span>בדוק את התשובות שלי</span>
              </div>
            </button>
          </div>
        )}
        
        {showResults && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-800 mb-1">
                    כל הכבוד! התרגיל הושלם
                  </h3>
                  <p className="text-green-700 text-lg">
                    הציון שלך: <span className="font-bold text-2xl">{Math.round(calculateScore())}%</span>
                  </p>
                </div>
              </div>
              <div className="text-6xl">🎉</div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseRenderer;