import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function AdminPage({ onLogout }) {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, role, created_at')
      .eq('role', 'candidate');

    if (error) {
      console.error('Error fetching candidates:', error.message);
    } else {
      setCandidates(data || []);
      fetchVotes(data || []);
    }
  };

  const fetchVotes = async (candidateList) => {
    const voteCounts = {};
    for (let candidate of candidateList) {
      const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('candidate_id', candidate.id);

      if (!error) {
        voteCounts[candidate.id] = count || 0;
      }
    }
    setVotes(voteCounts);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <h3>Live Vote Results</h3>
      {candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.username}</td>
                <td>{votes[candidate.id] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      <p>Made by IT Boys @ SREC 2024</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AdminPage;
