// src/pages/EmailSubmission.tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface EmailSubmissionProps {
  score: number;
  onSubmitted: () => void;
}

const EmailSubmission: React.FC<EmailSubmissionProps> = ({ score, onSubmitted }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
        .from('highscores')
        .insert([{ username, email, score }]);
    
    if (error) {
      setError('Error submitting score. Please try again.');
      console.error(error);
    } else {
      onSubmitted();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h3>Your Score: {score}</h3>
      <label>
        Enter your email to save your score:
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
        />
      </label>
      <br />
      <button type="submit" disabled={loading} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        {loading ? 'Submitting...' : 'Submit Score'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default EmailSubmission;