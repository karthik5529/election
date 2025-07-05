import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function ElectionBooth({ user, onLogout }) {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});
  const [userVoted, setUserVoted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetchUserAndCandidates();
  }, []);

  const fetchUserAndCandidates = async () => {
    // ✅ Get candidates
    const { data: candidateData, error } = await supabase
      .from('profiles')
      .select('id, username, role, created_at')
      .eq('role', 'candidate');

    if (error) {
      console.error('Error fetching candidates:', error.message);
      return;
    }

    setCandidates(candidateData);

    // ✅ Get all votes
    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select('user_id, candidate_id');

    if (votesError) {
      console.error('Error fetching votes:', votesError.message);
      return;
    }

    // ✅ Count votes per candidate
    const voteCountMap = {};
    votesData.forEach((vote) => {
      voteCountMap[vote.candidate_id] = (voteCountMap[vote.candidate_id] || 0) + 1;
    });
    setVotes(voteCountMap);

    // ✅ Has user voted?
    const currentUserId = (await supabase.auth.getUser()).data.user.id;
    const voted = votesData.some((vote) => vote.user_id === currentUserId);
    setUserVoted(voted);
  };

  const handleVote = async (candidateId) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    if (userVoted) {
      alert('You have already voted!');
      return;
    }

    const { error } = await supabase.from('votes').insert([
      {
        user_id: currentUser.id,
        candidate_id: candidateId,
      },
    ]);

    if (error) {
      console.error('Error voting:', error.message);
      alert('Voting failed. Maybe you already voted.');
      return;
    }

    alert('Vote submitted!');
    fetchUserAndCandidates();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div style={{ 
      background: theme === 'light' ? '#fff' : '#222',
      color: theme === 'light' ? '#000' : '#fff',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'sans-serif',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>SREC Election Booth</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#007bff',
            borderRadius: '50%',
            color: '#fff',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {user?.charAt(0) || 'U'}
          </div>
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
        {candidates.map((candidate) => (
          <div key={candidate.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            background: theme === 'light' ? '#f9f9f9' : '#333',
            transition: 'all 0.3s ease'
          }}>
            <img
              src={`https://picsum.photos/200?random=${candidate.id}`}
              alt="Candidate"
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <h3>{candidate.username}</h3>
            <p>Dept:IT</p>
            <p>"Vote me, I uplift you!"</p>
            <p>Votes: Revel Soon</p>
            <button
              disabled={userVoted}
              onClick={() => handleVote(candidate.id)}
              style={{
                marginTop: '10px',
                background: userVoted ? '#aaa' : '#28a745',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: userVoted ? 'not-allowed' : 'pointer'
              }}
            >
              {userVoted ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '40px', textAlign: 'center' }}>Made by IT Boys @ SREC 2024</p>
    </div>
  );
}

export default ElectionBooth;
