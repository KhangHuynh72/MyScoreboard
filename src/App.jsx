import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
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

  // NEW: Store bets as an object { index: count }
  const [bets, setBets] = useState(() => {
    const savedBets = localStorage.getItem('scoreboard-bet-counts');
    return savedBets ? JSON.parse(savedBets) : {};
  });

  useEffect(() => {
    localStorage.setItem('scoreboard-players', JSON.stringify(players));
    localStorage.setItem('scoreboard-multiplier', multiplier);
    localStorage.setItem('scoreboard-bet-counts', JSON.stringify(bets));
  }, [players, multiplier, bets]);

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

  // Function to increment bet for a specific player
  const addBet = (index) => {
    setBets(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));
  };

  const resetBets = () => setBets({});

  return (
    <div className="scoreboard-container">
      <h2>Tournament Tracker</h2>
      
      <div className="controls">
        <input type="number" value={multiplier} placeholder="Multiplier" onChange={(e) => setMultiplier(e.target.value)} />
        <input type="text" value={playerName} placeholder="New Player" onChange={(e) => setPlayerName(e.target.value)} />
        <button className="btn-main" onClick={addPlayer}>Add Player</button>
        <button className="btn-main" onClick={() => setShowSum(!showSum)}>Check Sum</button>
        <button className="btn-main btn-reset-bets" onClick={resetBets}>Reset Bets</button>
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
          const currentBets = bets[index] || 0;

          return (
            <div key={index} className={`player-card ${isWinning ? 'leader-glow' : ''}`}>
              <strong className="player-name">
                {player.name} {isWinning ? '👑' : ''}
              </strong>

              <div className="score-controls">
                <button className="btn btn-minus" onClick={() => updateScore(index, -1)}>−</button>
                <span className="total-display">${(player.score * m).toLocaleString()}</span>
                <button className="btn btn-plus" onClick={() => updateScore(index, 1)}>+</button>
              </div>

              <button className="btn-bet" onClick={() => addBet(index)}>
                Bet: {currentBets} {currentBets === 1 ? 'Vote' : 'Votes'} 🎯
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;