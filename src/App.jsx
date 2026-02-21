import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // 1. Load data from LocalStorage on startup
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('scoreboard-players');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });

  const [multiplier, setMultiplier] = useState(() => {
    const savedMult = localStorage.getItem('scoreboard-multiplier');
    return savedMult ? Number(savedMult) : ''; 
  });

  const [playerName, setPlayerName] = useState('');

  // 2. Save to LocalStorage whenever 'players' or 'multiplier' changes
  useEffect(() => {
    localStorage.setItem('scoreboard-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('scoreboard-multiplier', multiplier);
  }, [multiplier]);

  const addPlayer = () => {
    if (players.length < 10 && playerName.trim() !== '') {
      setPlayers([...players, { name: playerName, score: 0 }]);
      setPlayerName('');
    }
  };

  const updateScore = (index, delta) => {
    const newPlayers = [...players];
    newPlayers[index].score = Math.max(0, newPlayers[index].score + delta);
    setPlayers(newPlayers);
  };

  // 3. Optional: Clear everything
  const resetAll = () => {
    if(window.confirm("Are you sure you want to delete all players?")) {
      setPlayers([]);
      localStorage.removeItem('scoreboard-players');
    }
  };

  return (
    <div className="scoreboard-container">
      <h2>Tournament Tracker</h2>
      
      <div className="controls">
        <input 
          type="number" 
          value={multiplier} 
          placeholder="Enter the value"
          onChange={(e) => setMultiplier(Number(e.target.value))}
        />
        <input 
          type="text" 
          value={playerName} 
          placeholder="New Player Name"
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={addPlayer} disabled={players.length >= 10}>
          Add Player
        </button>
        <button onClick={resetAll} style={{background: '#ff4444'}}>Reset</button>
      </div>

      <div className="list">
        {players.map((player, index) => (
          <div key={index} className="player-card">
            <strong className="player-name">{player.name}</strong>
            <div className="score-controls">
              <button className="btn btn-minus" onClick={() => updateScore(index, -1)}>-</button>
              <span className="total-display">
                ${(player.score * multiplier).toLocaleString()}
              </span>
              <button className="btn btn-plus" onClick={() => updateScore(index, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;