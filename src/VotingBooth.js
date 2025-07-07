import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import vijay from './vijay.jpg'
import kathir from './kathir.webp'
import csanjay from './csanjay.webp'
function ElectionBooth({ user, onLogout }) {
  const [candidates, setCandidates] = useState([]);
  const [, setVotes] = useState({});
  const [userVoted, setUserVoted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [hoverEmail, setHoverEmail] = useState(false);

  useEffect(() => {
    fetchUserAndCandidates();
  }, []);

  const fetchUserAndCandidates = async () => {
    const { data: candidateData, error } = await supabase
      .from('profiles')
      .select('id, username, role, created_at')
      .eq('role', 'candidate');

    if (error) {
      console.error('Error fetching candidates:', error.message);
      return;
    }

    setCandidates(candidateData);

    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select('user_id, candidate_id');

    if (votesError) {
      console.error('Error fetching votes:', votesError.message);
      return;
    }

    const voteCountMap = {};
    votesData.forEach((vote) => {
      voteCountMap[vote.candidate_id] = (voteCountMap[vote.candidate_id] || 0) + 1;
    });
    setVotes(voteCountMap);

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
      { user_id: currentUser.id, candidate_id: candidateId },
    ]);

    if (error) {
      console.error('Error voting:', error.message);
      alert('Voting failed.');
      return;
    }

    alert('Vote submitted!');
    fetchUserAndCandidates();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const userInitial = user ? user.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{
      background: theme === 'light' ? '#fff' : '#121212',
      color: theme === 'light' ? '#000' : '#fff',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'sans-serif',
      transition: 'all 0.4s ease'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
      }}>
        <h2>SREC Election Booth</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div
            onMouseEnter={() => setHoverEmail(true)}
            onMouseLeave={() => setHoverEmail(false)}
            style={{
              background: '#007bff',
              borderRadius: '50%',
              color: '#fff',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              cursor: 'default',
              transition: 'transform 0.2s',
            }}
          >
            {userInitial}
            {hoverEmail && (
              <div style={{
                position: 'absolute',
                top: '45px',
                background: '#333',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}>
                {user}
              </div>
            )}
          </div>
          <button onClick={toggleTheme} style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            background: theme === 'light' ? '#333' : '#f0f0f0',
            color: theme === 'light' ? '#fff' : '#000',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button onClick={onLogout} style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            background: '#dc3545',
            color: '#fff',
            cursor: 'pointer',
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              background: theme === 'light' ? '#f9f9f9' : '#1e1e1e',
              transition: 'transform 0.3s, background 0.3s',
              cursor: userVoted ? 'default' : 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <img
              src={
              candidate.id === "8c8aef56-2013-4be7-aeb1-b600dc7ec4df" ? vijay :
              candidate.id === "ea2afcc8-df91-404c-9a91-012309ce104e" ? kathir :
              candidate.id === "9bba09e1-e759-4863-939b-a93b844cb094" ? csanjay :
              ""
              }
              alt="Candidate"
              style={{ width: '100%', height : '50%' , borderRadius: '8px', marginBottom: '10px' }}
            />
            <h3>{candidate.username}</h3>
            <p>Dept: {
              candidate.id === "8c8aef56-2013-4be7-aeb1-b600dc7ec4df" ? "CSE" :
              candidate.id === "ea2afcc8-df91-404c-9a91-012309ce104e" ? "IT" :
              candidate.id === "9bba09e1-e759-4863-939b-a93b844cb094" ? "ECE" :
              ''
              }</p>
               <p>Year: {
              candidate.id === "8c8aef56-2013-4be7-aeb1-b600dc7ec4df" ? "II" :
              candidate.id === "ea2afcc8-df91-404c-9a91-012309ce104e" ? "II" :
              candidate.id === "9bba09e1-e759-4863-939b-a93b844cb094" ? "II" :
              ''
              }</p>
            <p>"Vote me, I uplift you!"</p>
            <p>Votes: Revealed Soon</p>
            <button
              disabled={userVoted}
              onClick={() => handleVote(candidate.id)}
              style={{
                marginTop: '10px',
                width: '100%',
                background: userVoted ? '#888' : '#28a745',
                color: '#fff',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: userVoted ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {userVoted ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px', color: theme === 'light' ? '#555' : '#aaa' }}>
        Made by IT Boys @ SREC 2024
      </p>
    </div>
  );
}

export default ElectionBooth;
