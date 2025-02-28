import React, { useState } from 'react';
import { Check, X, ChevronRight, ChevronLeft, Award, Home, RefreshCw } from 'lucide-react';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const questions = [
    {
      id: 1,
      questionText: 'What is React?',
      answerOptions: [
        { id: 'a', text: 'A JavaScript library for building user interfaces', isCorrect: true },
        { id: 'b', text: 'A programming language', isCorrect: false },
        { id: 'c', text: 'A database management system', isCorrect: false },
        { id: 'd', text: 'A server-side framework', isCorrect: false },
      ],
      type: 'multiple-choice'
    },
    {
      id: 2,
      questionText: 'Which hook is used for side effects in React?',
      answerOptions: [
        { id: 'a', text: 'useState', isCorrect: false },
        { id: 'b', text: 'useEffect', isCorrect: true },
        { id: 'c', text: 'useContext', isCorrect: false },
        { id: 'd', text: 'useReducer', isCorrect: false },
      ],
      type: 'multiple-choice'
    },
    {
      id: 3,
      questionText: 'Explain the concept of React components in your own words:',
      type: 'open-ended',
      expectedKeywords: ['reusable', 'ui', 'element', 'function', 'class']
    },
    {
      id: 4,
      questionText: 'Which of these is NOT a React Hook?',
      answerOptions: [
        { id: 'a', text: 'useHistory', isCorrect: false },
        { id: 'b', text: 'useState', isCorrect: false },
        { id: 'c', text: 'useSelect', isCorrect: true },
        { id: 'd', text: 'useReducer', isCorrect: false },
      ],
      type: 'multiple-choice'
    },
    {
      id: 5,
      questionText: 'What is JSX in React?',
      answerOptions: [
        { id: 'a', text: 'A styling framework', isCorrect: false },
        { id: 'b', text: 'JavaScript XML - syntax extension for JavaScript', isCorrect: true },
        { id: 'c', text: 'A JavaScript compiler', isCorrect: false },
        { id: 'd', text: 'JavaScript eXtra libraries', isCorrect: false },
      ],
      type: 'multiple-choice'
    }
  ];

  const handleAnswerOptionClick = (isCorrect, questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });

    if (isCorrect) {
      setScore(score + 1);
      showToastNotification('Correct!', 'success');
    } else {
      showToastNotification('Incorrect!', 'error');
    }
  };

  const handleOpenEndedSubmit = (e, questionId) => {
    e.preventDefault();
    const input = e.target.elements.answer.value.toLowerCase();
    const currentQuestion = questions.find(q => q.id === questionId);
    
    let foundKeywords = 0;
    currentQuestion.expectedKeywords.forEach(keyword => {
      if (input.includes(keyword.toLowerCase())) {
        foundKeywords++;
      }
    });
    
    // If the answer contains at least 2 expected keywords, count it as correct
    const isCorrect = foundKeywords >= 2;
    
    setAnswers({
      ...answers,
      [questionId]: input
    });
    
    if (isCorrect) {
      setScore(score + 1);
      showToastNotification('Good answer!', 'success');
    } else {
      showToastNotification('Try to include more key concepts.', 'warning');
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevQuestion = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setAnswers({});
    showToastNotification('Quiz reset!', 'info');
  };

  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getToastClasses = () => {
    let baseClasses = "fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-500";
    
    switch (toastType) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'info':
        return `${baseClasses} bg-blue-500 text-white`;
      default:
        return `${baseClasses} bg-gray-700 text-white`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex flex-col items-center justify-center">
      {/* Toast Notification */}
      {showToast && (
        <div className={getToastClasses()}>
          {toastMessage}
        </div>
      )}

      {/* Quiz Container */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Quiz Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">React Knowledge Quiz</h2>
          <div className="flex items-center">
            <Home className="cursor-pointer mr-2" onClick={resetQuiz} />
            <span className="bg-white text-indigo-600 px-2 rounded-full">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Quiz Content */}
        {showScore ? (
          <div className="p-6 text-center">
            <Award className="mx-auto text-yellow-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
            <p className="text-lg mb-4">
              You scored <span className="text-indigo-600 font-bold">{score}</span> out of {questions.length}
            </p>
            <div className="space-y-4 text-left mb-6">
              <h3 className="font-semibold">Your answers:</h3>
              {questions.map((question) => (
                <div key={question.id} className="border-b pb-2">
                  <p className="font-medium">{question.questionText}</p>
                  {question.type === 'multiple-choice' ? (
                    <p className="flex items-center">
                      {question.answerOptions.find(option => option.id === answers[question.id])?.text || 'Not answered'}
                      {question.answerOptions.find(option => option.id === answers[question.id])?.isCorrect ? 
                        <Check className="ml-2 text-green-500" size={16} /> : 
                        <X className="ml-2 text-red-500" size={16} />
                      }
                    </p>
                  ) : (
                    <p className="italic text-gray-600">{answers[question.id] || 'Not answered'}</p>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={resetQuiz}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
            >
              <RefreshCw className="mr-2" size={16} />
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Question {currentQuestion + 1}:
              </h3>
              <p className="text-gray-700 text-lg">
                {questions[currentQuestion].questionText}
              </p>
            </div>

            {questions[currentQuestion].type === 'multiple-choice' ? (
              <div className="space-y-3 mb-8">
                {questions[currentQuestion].answerOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerOptionClick(
                      option.isCorrect, 
                      questions[currentQuestion].id, 
                      option.id
                    )}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      answers[questions[currentQuestion].id] === option.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <span className="font-medium mr-2">{option.id.toUpperCase()}.</span> {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <form 
                onSubmit={(e) => handleOpenEndedSubmit(e, questions[currentQuestion].id)}
                className="mb-8"
              >
                <textarea
                  name="answer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Type your answer here..."
                  rows={4}
                  defaultValue={answers[questions[currentQuestion].id] || ''}
                  required
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Answer
                </button>
              </form>
            )}

            <div className="flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors`}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </button>
              <button
                onClick={handleNextQuestion}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-gray-200 h-1 w-full">
          <div 
            className="bg-indigo-600 h-1 transition-all duration-300"
            style={{ width: `${(currentQuestion / (questions.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}