import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('scoreboard-players');
    return saved ? JSON.parse(saved) : [];
  });

  const [multiplier, setMultiplier] = useState(() => {
    const saved = localStorage.getItem('scoreboard-multiplier');
    return saved ? saved : ''; 
  });

  const [playerName, setPlayerName] = useState('');
  const [showSum, setShowSum] = useState(false); // Toggle state

  useEffect(() => {
    localStorage.setItem('scoreboard-players', JSON.stringify(players));
    localStorage.setItem('scoreboard-multiplier', multiplier);
  }, [players, multiplier]);

  const addPlayer = () => {
    if (players.length < 10 && playerName.trim() !== '') {
      setPlayers([...players, { name: playerName, score: 0 }]);
      setPlayerName('');
    }
  };

  const updateScore = (index, delta) => {
    const newPlayers = [...players];
    // Removed Math.max(0) so it can now go negative
    newPlayers[index].score += delta;
    setPlayers(newPlayers);
  };

  // Calculate the total sum of all raw scores
  const totalScoreSum = players.reduce((acc, p) => acc + p.score, 0);

  return (
    <div className="scoreboard-container">
      <h2>Tournament Tracker</h2>
      
      <div className="controls">
        <input type="number" value={multiplier} placeholder="Multiplier" onChange={(e) => setMultiplier(e.target.value)} />
        <input type="text" value={playerName} placeholder="Player Name" onChange={(e) => setPlayerName(e.target.value)} />
        <button className="btn-add" onClick={addPlayer}>Add Player</button>
        
        {/* Toggle Button */}
        <button 
          className={`btn-toggle ${showSum ? 'active' : ''}`} 
          onClick={() => setShowSum(!showSum)}
        >
          {showSum ? 'Hide Sum' : 'Check Sum'}
        </button>
      </div>

      {/* Conditional Sum Display */}
      {showSum && (
        <div className={`sum-banner ${totalScoreSum === 0 ? 'sum-zero' : 'sum-nonzero'}`}>
          Total Sum of Scores: {totalScoreSum} 
          {totalScoreSum === 0 ? " (Balanced ✅)" : " (Unbalanced ❌)"}
        </div>
      )}

      <div className="list">
        {players.map((player, index) => {
          const m = multiplier === '' ? 1 : Number(multiplier);
          return (
            <div key={index} className="player-card">
              <strong className="player-name">{player.name}</strong>
              <div className="score-controls">
                <button className="btn btn-minus" onClick={() => updateScore(index, -1)}>−</button>
                <span className="total-display">
                  ${(player.score * m).toLocaleString()}
                </span>
                <button className="btn btn-plus" onClick={() => updateScore(index, 1)}>+</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;