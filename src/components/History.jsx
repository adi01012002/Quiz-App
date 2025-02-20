import React, { useState, useEffect } from "react";
import { getAttempts } from "../utils/db";
import "../styles/History.css"; // ✅ Ensure this file exists

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const attempts = await getAttempts();
      setHistory(attempts);
    }
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Quiz Attempt History</h2>
      {history.length === 0 ? (
        <p className="no-history">No history available.</p>
      ) : (
        <div className="history-list">
        {/* Map on hitory saving to in a list form*/}
          {history.map((attempt, index) => (
            <div key={index} className="history-item">
              <p>
                <span className="history-label">📅 Date:</span> {new Date(attempt.date).toLocaleString()}
              </p>
              <p>
                <span className="history-label">⭐ Score:</span> {attempt.score}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;

// Please,I really want this internship due to my family condition 