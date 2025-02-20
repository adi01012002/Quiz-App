import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Quiz from "./components/Quiz";
import History from "./components/History";
import "./App.css";  //Import external CSS

function Navigation({ resetQuiz }) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    resetQuiz();  // Reset quiz state
    navigate("/"); // Navigate to home
  };

  return (
    <nav className="top-nav">
      <button className="history-btn" onClick={handleHomeClick}>Home</button>
      <Link to="/history" className="history-btn">History</Link>
    </nav>
  );
}

function App() {
  let resetQuizFn = () => {}; // Placeholder function

  return (
    <Router>
      <div className="container">
        <Navigation resetQuiz={() => resetQuizFn()} />

        <Routes>
          <Route path="/" element={<Quiz setResetQuiz={(fn) => (resetQuizFn = fn)} />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

//Please,I really want this internship due to my family condition 
