// src/pages/Landing.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { QRCode } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

interface Highscore {
  id: number;
  email: string;
  score: number;
  created_at: string;
}

const Landing: React.FC = () => {
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHighscores = async () => {
      const { data, error } = await supabase
        .from<Highscore>('highscores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      if (error) {
        console.error('Error fetching highscores:', error);
      } else {
        setHighscores(data || []);
      }
    };

    fetchHighscores();
  }, []);

  // Construct the game URL (adjust if needed)
  const gameUrl = window.location.origin + '/game';

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to Playful Connection Station</h1>
      <div style={{ margin: '1rem 0' }}>
        <QRCode value={gameUrl} size={128} />
        <p>Scan to join the game!</p>
      </div>
      <h2>Highscores</h2>
      <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Rank</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Email</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {highscores.map((entry, index) => (
            <tr key={entry.id}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{entry.email}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={() => navigate('/game')}
        style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1rem' }}
      >
        Start Game
      </button>
    </div>
  );
};

export default Landing;