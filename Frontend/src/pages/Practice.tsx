import React, { useState,  useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface UserAnswer {
  questionIndex: number;
  questionText: string;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuizSettings {
  course: string;
  questionNumber: number;
}

const Practice = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map()); // Map<questionIndex, selectedOption>
  
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({ course: "CHM101", questionNumber: 5 }); // Default settings
  const [showSettingsScreen, setShowSettingsScreen] = useState(true);

  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finalResults, setFinalResults] = useState<UserAnswer[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);

  const QUIZ_FETCH_ENDPOINT = `${API_BASE_URL}/api/chat/general-test`; // Endpoint to fetch questions
  const QUIZ_SUBMIT_ENDPOINT = `${API_BASE_URL}/api/quiz/submit-results`; // Endpoint to submit results

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuizSettings(prev => ({
      ...prev,
      [name]: name === 'questionNumber' ? parseInt(value, 10) : value,
    }));
  };

  const startQuiz = async () => {
    if (!quizSettings.course || quizSettings.questionNumber <= 0) {
        setError("Please select a course and specify a valid number of questions.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setShowSettingsScreen(false);
    try {
      const response = await axios.post<{ quiz: QuizQuestion[] }>(
        QUIZ_FETCH_ENDPOINT,
        quizSettings, // Send settings in the request body
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data && response.data.quiz && response.data.quiz.length > 0) {
        setQuestions(response.data.quiz);
        setQuizStarted(true);
        setStartTime(Date.now());
        setCurrentQuestionIndex(0);
        setUserAnswers(new Map());
        setQuizCompleted(false);
      } else {
        setError("No questions found for the selected criteria, or an error occurred.");
        setShowSettingsScreen(true); // Go back to settings
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError("Failed to load quiz questions. Please try again or adjust settings.");
      setShowSettingsScreen(true); // Go back to settings
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setUserAnswers(prev => new Map(prev).set(currentQuestionIndex, option));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (!startTime) return;

    const endTime = Date.now();
    const calculatedTimeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    setTimeSpent(calculatedTimeSpent);

    let calculatedScore = 0;
    const results: UserAnswer[] = questions.map((q, index) => {
      const selectedOption = userAnswers.get(index) || "";
      const isCorrect = selectedOption === q.answer;
      if (isCorrect) {
        calculatedScore++;
      }
      return {
        questionIndex: index,
        questionText: q.question,
        selectedOption,
        correctAnswer: q.answer,
        isCorrect,
      };
    });

    setScore(calculatedScore);
    setFinalResults(results);
    setQuizCompleted(true);
    setQuizStarted(false); 

    try {
      await axios.post(QUIZ_SUBMIT_ENDPOINT, {
        score: calculatedScore,
        totalQuestions: questions.length,
        timeSpent: calculatedTimeSpent,
        answers: results, // Send detailed answer objects
        quizSettingsUsed: quizSettings, // Optionally send the settings used
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Error submitting quiz results:", err);
      // Notify user if submission fails, but still show results
    }
  }, [questions, userAnswers, startTime, QUIZ_SUBMIT_ENDPOINT, quizSettings]);

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setShowSettingsScreen(true);
    setQuizStarted(false);
    setQuizCompleted(false);
    setStartTime(null);
    setError(null);
    setScore(0);
    setFinalResults([]);
    setTimeSpent(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#C62828]"></div>
        <p className="ml-4 text-xl text-gray-700">Loading Quiz...</p>
      </div>
    );
  }

  if (showSettingsScreen) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <h1 className="text-4xl font-bold text-[#263238] mb-6">Configure Your Practice Quiz</h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl">
          Select your course and the number of questions to start.
        </p>
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6">{error}</p>}
        <div className="w-full max-w-sm space-y-6 mb-8">
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1 text-left">Course Code</label>
            <input
              type="text"
              name="course"
              id="course"
              value={quizSettings.course}
              onChange={handleSettingChange}
              placeholder="e.g., CHM101"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C62828] focus:ring-[#C62828] p-3"
            />
          </div>
          <div>
            <label htmlFor="number_of_questions" className="block text-sm font-medium text-gray-700 mb-1 text-left">Number of Questions</label>
            <input
              type="number"
              name="number_of_questions"
              id="number_of_questions"
              value={quizSettings.questionNumber}
              onChange={handleSettingChange}
              min="1"
              max="50" // Example max
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#C62828] focus:ring-[#C62828] p-3"
            />
          </div>
        </div>
        <button
          onClick={startQuiz}
          className="bg-[#C62828] text-white px-10 py-4 rounded-lg hover:bg-[#E53935] transition-colors text-xl shadow-lg hover:shadow-xl"
        >
          Start Quiz
        </button>
         <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-[#C62828] hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (quizCompleted) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#263238] mb-2 text-center">Quiz Results</h2>
        <p className="text-xl text-gray-700 mb-6 text-center">
          Your Score: <span className="font-bold text-[#C62828]">{score}</span> / {questions.length}
        </p>
        <p className="text-md text-gray-600 mb-8 text-center">
          Time Spent: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </p>

        <div className="space-y-6">
          {finalResults.map((result, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md border-l-4 ${result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <p className="text-lg font-semibold text-[#263238] mb-3">Question {index + 1}: {result.questionText}</p>
              <p className="text-sm mb-1">Your answer: <span className={`font-semibold ${result.isCorrect ? 'text-green-700' : 'text-red-700'}`}>{result.selectedOption || "Not answered"}</span></p>
              {!result.isCorrect && <p className="text-sm mb-3">Correct answer: <span className="font-semibold text-green-700">{result.correctAnswer}</span></p>}
              
              <p className="text-sm text-gray-700 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <span className="font-semibold">Explanation:</span> {questions[result.questionIndex].explanation}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center space-x-4 space-y-4">
          <button
            onClick={resetQuiz}
            className="bg-[#C62828] text-white px-8 py-3 rounded-lg hover:bg-[#E53935] transition-colors text-lg"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border-2 border-[#C62828] text-[#C62828] px-8 py-3 rounded-lg hover:bg-[#fef2f2] transition-colors text-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted || questions.length === 0) {
     // This state should ideally be covered by showSettingsScreen or error handling within it.
     // If somehow reached, provide a way back.
    return (
        <div className="p-8 text-center">
            <p className="text-gray-700 mb-6">Something went wrong, or no quiz is active.</p>
            <button
                onClick={resetQuiz}
                className="bg-[#C62828] text-white px-6 py-3 rounded-lg hover:bg-[#E53935] transition-colors"
            >
                Start New Quiz
            </button>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="mb-6">
          <p className="text-sm text-[#C62828] font-semibold mb-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <h2 className="text-2xl font-bold text-[#263238]">{currentQuestion.question}</h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-150
                ${userAnswers.get(currentQuestionIndex) === option 
                  ? 'bg-[#C62828] text-white border-[#C62828] ring-2 ring-offset-2 ring-[#E53935]' 
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 hover:border-[#E53935]'}
              `}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={userAnswers.get(currentQuestionIndex) === undefined}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={userAnswers.get(currentQuestionIndex) === undefined}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#C62828] text-white hover:bg-[#E53935] disabled:bg-gray-400 transition-colors font-semibold"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Practice;