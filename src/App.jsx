import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // --- 1. STATE & PERSISTENCE ---
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('scoreboard-players');
    return saved ? JSON.parse(saved) : [];
  });

  const [multiplier, setMultiplier] = useState(() => {
    const saved = localStorage.getItem('scoreboard-multiplier');
    return saved !== null ? saved : ''; 
  });

  const [playerName, setPlayerName] = useState('');
  const [showSum, setShowSum] = useState(false);
  const [betIndex, setBetIndex] = useState(() => {
    const savedBet = localStorage.getItem('scoreboard-bet');
    return savedBet !== null ? Number(savedBet) : null;
  });

  useEffect(() => {
    localStorage.setItem('scoreboard-players', JSON.stringify(players));
    localStorage.setItem('scoreboard-multiplier', multiplier);
    localStorage.setItem('scoreboard-bet', betIndex);
  }, [players, multiplier, betIndex]);

  // --- 2. LOGIC HELPERS ---
  const highestScore = players.length > 0 ? Math.max(...players.map(p => p.score)) : -Infinity;
  const totalScoreSum = players.reduce((acc, p) => acc + p.score, 0);

  const addPlayer = () => {
    if (players.length < 10 && playerName.trim() !== '') {
      setPlayers([...players, { name: playerName, score: 0 }]);
      setPlayerName('');
    }
  };

  const updateScore = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].score += delta;
    setPlayers(newPlayers);
  };

  return (
    <div className="scoreboard-container">
      <h2>Tournament Tracker</h2>
      
      <div className="controls">
        <input type="number" value={multiplier} placeholder="Multiplier (e.g. 5000)" onChange={(e) => setMultiplier(e.target.value)} />
        <input type="text" value={playerName} placeholder="New Player" onChange={(e) => setPlayerName(e.target.value)} />
        <button className="btn-main" onClick={addPlayer} disabled={players.length >= 10}>Add Player</button>
        <button className={`btn-main btn-toggle ${showSum ? 'active' : ''}`} onClick={() => setShowSum(!showSum)}>
          {showSum ? 'Hide Sum' : 'Check Sum'}
        </button>
      </div>

      {showSum && (
        <div className={`sum-banner ${totalScoreSum === 0 ? 'sum-zero' : 'sum-nonzero'}`}>
          Total Raw Sum: {totalScoreSum} {totalScoreSum === 0 ? " (Balanced ✅)" : " (Unbalanced ❌)"}
        </div>
      )}

      <div className="list">
        {players.map((player, index) => {
          const m = multiplier === '' ? 1 : Number(multiplier);
          const isWinning = player.score === highestScore && player.score !== 0;
          const isMyBet = betIndex === index;

          return (
            <div key={index} className={`player-card ${isMyBet ? 'bet-active' : ''} ${isWinning ? 'leader-glow' : ''}`}>
              <strong className="player-name">
                {player.name} {isWinning ? '👑' : ''}
              </strong>

              <div className="score-controls">
                <button className="btn btn-minus" onClick={() => updateScore(index, -1)}>−</button>
                <span className="total-display">${(player.score * m).toLocaleString()}</span>
                <button className="btn btn-plus" onClick={() => updateScore(index, 1)}>+</button>
              </div>

              <button className={`btn-bet ${isMyBet ? 'bet-selected' : ''}`} onClick={() => setBetIndex(index)}>
                {isMyBet ? "Bet Active 🎯" : "Place Bet"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;