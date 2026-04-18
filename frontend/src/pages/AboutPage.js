import React, { useState } from 'react';

const quizData = [
  { question: "Which game did I start my journey with?", options: ["PC Games", "Mobile Games", "Console Games"], answer: 1 },
  { question: "In Valorant, what is the top rank called?", options: ["Global Elite", "Challenger", "Radiant"], answer: 2 },
  { question: "Which developer created League of Legends?", options: ["Valve", "Epic Games", "Riot Games"], answer: 2 },
  { question: "Brawl Stars is primarily played on which platform?", options: ["PC", "Mobile", "PlayStation"], answer: 1 }
];

const AboutPage = () => {
  // --- Quiz State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  // Current question data
  const currentData = quizData[currentQuestionIndex];

  // Handle selecting an option
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  // Handle submitting an answer
  const handleSubmit = () => {
    if (selectedOption === null) return;

    // Check answer
    if (selectedOption === currentData.answer) {
      setScore(score + 1);
      setResultMessage("Correct!");
    } else {
      setResultMessage("Wrong!");
    }

    // Move to next question or end after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setResultMessage("");
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  // Handle restarting the quiz
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setResultMessage("");
    setIsFinished(false);
  };

  return (
    <main>
      <section className="content-large">
        <h2>My Journey With Games</h2>
        <ol>
          <li>Started with mobile games</li>
          <li>Discovered Brawl Stars</li>
          <li>Moved to Valorant</li>
          <li>Learned League of Legends</li>
        </ol>
      </section>

      <section>
        <h2>What I Love About These Games</h2>
        
        <div className="gallery-grid">
          {/* Ensure image paths match your React public folder structure */}
          <img src="/PICS/44e12a21-462a-4322-8462-c3a613603244.jpg" alt="Valorant" />
          <img src="/PICS/3f7eab66-a4e3-4314-b2d2-926fe318155f.jpg" alt="Brawl Stars" />
        </div>

        <blockquote style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '20px', color: 'var(--accent-gold)', fontSize: '1.1rem' }}>
          "Games give us a chance to challenge ourselves and grow."
        </blockquote>
      </section>

      {/* --- Quiz Section --- */}
      <section className="quiz-section">
        <h2>Portfolio Trivia Challenge</h2>
        <div className="quiz-container">
          {!isFinished ? (
            <>
              <h3>{currentData.question}</h3>
              <div className="options">
                {currentData.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`option ${selectedOption === index ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <button 
                className="quiz-btn" 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
              
              {resultMessage && (
                <div style={{ marginTop: '15px', fontWeight: 'bold', color: resultMessage === "Correct!" ? 'var(--accent-gold)' : 'var(--accent-red)' }}>
                  {resultMessage}
                </div>
              )}
            </>
          ) : (
            // Finished State
            <div>
              <h3>Quiz Finished!</h3>
              <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                You scored {score} out of {quizData.length}
              </p>
              <button className="quiz-btn" onClick={handleRestart}>
                Play Again 🎮
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;