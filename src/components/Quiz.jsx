import React, { useState, useEffect, useCallback, useRef } from "react";
import { quizQuestions } from "../data/quizData";
import { saveAttempt, getAttempts } from "../utils/db";
import "../styles/Quiz.css";
import { colors } from "chalk";
//  Please,I really want this internship due to my family condition 
const Quiz = ({ setResetQuiz }) => {
  //  State management for quiz flow
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userInput, setUserInput] = useState(""); // For integer-type questions
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(quizQuestions[0].timeLimit);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [attempts, setAttempts] = useState([]);

  //  Ref to prevent saving multiple times
  const hasSavedAttempt = useRef(false);

  //  Fetch previous quiz attempts from IndexedDB
  useEffect(() => {
    const fetchAttempts = async () => {
      const data = await getAttempts();
      setAttempts(data);
    };
    fetchAttempts();
  }, []);

  //  Reset quiz state when clicking "Home" or restarting the quiz
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(quizQuestions[0].timeLimit);
    setFeedback("");
    setSelectedAnswer(null);
    setUserInput("");
    hasSavedAttempt.current = false; // Reset duplicate-save prevention
  };

  //  Pass reset function to App.js so it works globally
  useEffect(() => {
    setResetQuiz(resetQuiz);
  }, []);

  // Starts the quiz when "Start Quiz" button is clicked
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(quizQuestions[0].timeLimit);
    hasSavedAttempt.current = false; // Ensure fresh start
  };

  //  Moves to the next question or saves the quiz result
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setUserInput("");
      setFeedback("");
      setTimeLeft(quizQuestions[currentQuestionIndex + 1].timeLimit);
    } else {
      //  Quiz is completed, save attempt only once
      setQuizCompleted(true);
      if (!hasSavedAttempt.current) {
        hasSavedAttempt.current = true; // Prevent duplicate saves
        saveAttempt({ date: new Date(), score });
      }
    }
  }, [currentQuestionIndex, score]);

  //  Timer countdown for each question
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      // Decrease timer every second
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer); // Clear timer when unmounting
    } else if (quizStarted && timeLeft === 0) {
      // Auto-move to next question when time runs out
      handleNextQuestion();
    }
  }, [timeLeft, handleNextQuestion, quizStarted]);

  //  Handles selection of MCQ answer
  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
    if (option === quizQuestions[currentQuestionIndex].answer) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1); // Increase score for correct answer
    } else {
      setFeedback("Wrong answer ❌");
    }
    setTimeout(handleNextQuestion, 1500); // Move to next question after delay
  };

  //  Handles submission of integer-type answers
  const handleIntegerSubmit = () => {
    if (parseInt(userInput) === quizQuestions[currentQuestionIndex].answer) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("Wrong answer ❌");
    }
    setTimeout(handleNextQuestion, 1500);
  };

  return (
    <div className="quiz-container">
      {/*  Show Start Screen if quiz hasn't started */}
      {!quizStarted ? (
        <div className="start-screen">
          <h1>Welcome to the Quiz!</h1>
          <h2>Instructions</h2>
          <ol className="instructions">
            <li>For multiple-choice questions, select the one best answer (A, B, C, or D).</li>
            <li>For integer-type questions, write your numerical answer clearly.</li>
            <li>No calculators unless specified.</li>
            <li>You have 30 minutes to complete this quiz.</li>
          </ol>
          <button className="start-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      ) : !quizCompleted ? (
        <>
          {/* Display Question */}
          <div className="question-box">
            <h2>{quizQuestions[currentQuestionIndex].question}</h2>
          </div>

          {/* ✅ Timer for the current question */}
          <p className="timer">Time Left: {timeLeft}s</p>

          {/* how MCQ options OR integer input based on question type */}
          {quizQuestions[currentQuestionIndex].type === "mcq" ? (
            <div className="options-grid">
              {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={option}
                  className={`option-button option-${index + 1}`}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {String.fromCharCode(65 + index)}: {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="integer-input">
              <input
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your answer"
                className="integer-textbox"
              />
              <button className="submit-button" onClick={handleIntegerSubmit}>
                Submit
              </button>
            </div>
          )}

          {/*Show feedback message (Correct/Wrong) */}
          {feedback && <p className="feedback">{feedback}</p>}
        </>
      ) : (
        //Show final score once quiz is completed
        <div className="scoreboard">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {quizQuestions.length}</p>
          <h6>Please,I really want this internship due to my family condition </h6>
        </div>
      )}
    </div>
  );
};

export default Quiz;
