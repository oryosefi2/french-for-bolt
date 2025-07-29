import React, { useState } from 'react';
import { Play, Volume2, Check, X, Mic } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">תרגיל דקדוק</h3>
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {text}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">השלמו את המשפטים</h3>
          {questions && questions.map((questionObj: any, index: number) => {
            const options = ['le', 'la', "l'", 'les', 'un', 'une', 'des']; // Extended options
            const questionKey = String(index + 1);
            return (
              <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                <p className="font-medium mb-2 text-blue-600">{questionObj.question_in_Hebrew}</p>
                <p className="font-medium mb-3">{questionObj.sentence}</p>
                <div className="space-y-2">
                  {options.map((option: string, optIndex: number) => (
                    <label key={optIndex} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`completion${index}`}
                        value={option}
                        onChange={(e) => setUserAnswers(prev => ({
                          ...prev,
                          [`completion${index}`]: e.target.value
                        }))}
                        disabled={showResults}
                        className="text-blue-600"
                      />
                      <span className={showResults && correctAnswers?.[questionKey] === option ? 'text-green-600 font-medium' : ''}>{option}</span>
                      {showResults && correctAnswers?.[questionKey] === option && <Check className="w-4 h-4 text-green-600" />}
                      {showResults && userAnswers[`completion${index}`] === option && correctAnswers?.[questionKey] !== option && <X className="w-4 h-4 text-red-600" />}
                    </label>
                  ))}
                </div>
                {showResults && (
                  <p className="mt-2 text-sm text-green-600">
                    תשובה נכונה: {correctAnswers?.[questionKey]}
                  </p>
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
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Texte à lire</h3>
          {text ? (
            <p className="text-gray-800 leading-relaxed">{text}</p>
          ) : (
            <div>
              <p className="text-red-500">טקסט לא נמצא - מבנה תרגיל לא מזוהה</p>
              <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto">{JSON.stringify(exercise, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Questions</h3>
          {questions && Array.isArray(questions) && questions.length > 0 ? (
            questions.map((question: any, index: number) => (
              <div key={index} className="bg-white p-4 border border-gray-200 rounded-lg">
                <p className="font-medium mb-3">{question.question}</p>
                <div className="space-y-2">
                  {question.type === 'true_false' ? (
                    // True/False question
                    <>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q${index}`}
                          value="true"
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: e.target.value === 'true'
                          }))}
                          disabled={showResults}
                          className="text-blue-600"
                        />
                        <span className={showResults && question.correct === true ? 'text-green-600 font-medium' : ''}>נכון</span>
                        {showResults && question.correct === true && <Check className="w-4 h-4 text-green-600" />}
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q${index}`}
                          value="false"
                          onChange={(e) => setUserAnswers(prev => ({
                            ...prev,
                            [`q${index}`]: e.target.value === 'true'
                          }))}
                          disabled={showResults}
                          className="text-blue-600"
                        />
                        <span className={showResults && question.correct === false ? 'text-green-600 font-medium' : ''}>לא נכון</span>
                        {showResults && question.correct === false && <Check className="w-4 h-4 text-green-600" />}
                      </label>
                    </>
                  ) : (
                    // Multiple choice question
                    question.options && Array.isArray(question.options) ? question.options.map((option: string, optIndex: number) => (
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
                        <span className={showResults && question.correct === optIndex ? 'text-green-600 font-medium' : ''}>{option}</span>
                        {showResults && question.correct === optIndex && <Check className="w-4 h-4 text-green-600" />}
                        {showResults && userAnswers[`q${index}`] === optIndex && question.correct !== optIndex && <X className="w-4 h-4 text-red-600" />}
                      </label>
                    )) : <p className="text-red-500">אפשרויות שאלה לא נמצאו</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="text-red-500">שאלות לא נמצאו - מבנה תרגיל לא מזוהה</p>
              <p className="text-sm text-gray-600 mt-2">מבנה התרגיל הנוכחי:</p>
              <pre className="text-xs bg-gray-100 p-2 mt-2 overflow-auto max-h-40">{JSON.stringify(exercise, null, 2)}</pre>
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderExercise()}
        
        {!showResults && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Valider mes réponses
            </button>
          </div>
        )}
        
        {showResults && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Exercice terminé!
            </h3>
            <p className="text-green-700">
              Score: {Math.round(calculateScore())}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseRenderer;