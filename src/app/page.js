'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const fetchTrivia = async (category, difficulty) => {
  const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
};

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('9');
  const [difficulty, setDifficulty] = useState('easy');
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!start) return;
    setLoading(true);
    fetchTrivia(category, difficulty).then((q) => {
      setQuestions(q);
      setIndex(0);
      setScore(0);
      setSelected(null);
      setShowAnswer(false);
      setGameOver(false);
      setLoading(false);
    });
  }, [start, category, difficulty]);

  const handleAnswer = (ans) => {
    if (showAnswer) return;
    setSelected(ans);
    setShowAnswer(true);
    if (ans === questions[index].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setGameOver(true);
    }
  };

  const restart = () => {
    setStart(false);
  };

  const answers =
  questions.length > 0 && questions[index]
    ? [...questions[index].incorrect_answers, questions[index].correct_answer].sort(() => Math.random() - 0.5)
    : [];


  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#A4C6B8] to-[#5E435D] text-white font-sans p-4">
      
      <svg className="absolute top-0 left-0 w-full h-32 z-0" viewBox="0 0 1440 320">
        <path fill="#ffffff22" d="M0,160L80,160C160,160,320,160,480,154.7C640,149,800,139,960,122.7C1120,107,1280,85,1360,74.7L1440,64V0H0Z"></path>
      </svg>

      <svg className="absolute bottom-0 left-0 w-full h-40 z-0" viewBox="0 0 1440 320">
        <path fill="#ffffff22" d="M0,288L80,266.7C160,245,320,203,480,192C640,181,800,203,960,224C1120,245,1280,267,1360,277.3L1440,288V320H0Z"></path>
      </svg>
      {start && (
  <button
    onClick={restart}
    className="fixed top-4 left-4 px-4 py-2 bg-black text-white rounded shadow-md hover:bg-gray-800 transition duration-200 z-50"
  >
    ⬅ HOME
  </button>
)}

      <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl">
      
        <h1 className="text-3xl font-bold text-center mb-6">🧠 Trivia Time</h1>

        {!start ? (
          <div className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded bg-white text-black"
              >
                <option value="9">General Knowledge</option>
                <option value="21">Sports</option>
                <option value="23">History</option>
                <option value="18">Science</option>
                <option value="27">Animals</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 rounded bg-white text-black"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              onClick={() => setStart(true)}
              className="w-full py-3 bg-white text-black font-bold rounded shadow hover:bg-gray-200"
            >
              Start Game
            </button>
          </div>
        ) : loading ? (
          <p className="text-center">Loading questions...</p>
        ) : gameOver ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">🎉 Game Over 🎉</h2>
            <p>Your Score: {score} / {questions.length}</p>
            {score >= 8 && <Confetti />}
            <button
              onClick={restart}
              className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <p>Question {index + 1} / {questions.length}</p>
              <p>Score: {score}</p>
            </div>
            <h2 className="text-lg font-semibold">{decodeHTML(questions[index].question)}</h2>
            <ul className="space-y-2">
              {answers.map((ans, i) => (
                <li
                  key={i}
                  className={`
                    p-3 border rounded cursor-pointer transition
                    ${showAnswer && ans === questions[index].correct_answer ? 'bg-green-500 text-white' : ''}
                    ${showAnswer && ans === selected && ans !== questions[index].correct_answer ? 'bg-red-500 text-white' : ''}
                    ${!showAnswer ? 'hover:bg-white hover:text-black' : ''}
                  `}
                  onClick={() => handleAnswer(ans)}
                >
                  {decodeHTML(ans)}
                </li>
              ))}
            </ul>
            {showAnswer && (
              <button
                onClick={next}
                className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
