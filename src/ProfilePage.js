import React, { useState } from 'react';
import AdminPage from './AdminPage';

function ProfilePage({ username, isAdmin, onLogout }) {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin && isAdmin) {
    return <AdminPage onBack={() => setShowAdmin(false)} />;
  }

  const firstLetter = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <div style={styles.container}>
      <h1>SREC Election Booth</h1>
      <div style={styles.avatar}>{firstLetter}</div>
      <img
        src="https://source.unsplash.com/300x200/?vote,election"
        alt="Vote"
        style={styles.image}
      />
      <button style={styles.button}>Vote</button>
      {isAdmin && (
        <button onClick={() => setShowAdmin(true)} style={styles.adminButton}>
          View All Candidates
        </button>
      )}
      <p style={styles.footer}>Made by IT Boys@Srec-2024</p>
      <button onClick={onLogout} style={styles.logout}>Logout</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '320px',
    margin: '50px auto',
    padding: 20,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    margin: '20px auto',
  },
  image: {
    width: '100%',
    borderRadius: 8,
    margin: '15px 0',
  },
  button: {
    padding: 10,
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 15,
  },
  adminButton: {
    padding: 10,
    backgroundColor: '#6c757d',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    width: '100%',
    marginBottom: 15,
  },
  footer: {
    marginTop: 20,
    color: '#555',
    fontSize: 14,
  },
  logout: {
    padding: 8,
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    width: '50%',
    fontSize: 14,
  },
};

export default ProfilePage;
