import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import VotingBooth from './VotingBooth';
import AdminPage from './AdminPage';

function App() {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [popup, setPopup] = useState('');
  const [page, setPage] = useState('loading');
  const [showRegister, setShowRegister] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // ✅ ADDED

  const showPopup = (msg) => {
    setPopup(msg);
    setTimeout(() => setPopup(''), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (
      (emailLogin === 'srecadmin' && passwordLogin === 'Srec@123') ||
      (emailLogin === 'itboys' && passwordLogin === 'IT@123')
    ) {
      showPopup('✅ Admin login successful.');
      setPage('admin');
      return;
    }

    

    showPopup('Logging in...');
    const { error } = await supabase.auth.signInWithPassword({
      email: emailLogin,
      password: passwordLogin,
    });

    if (error) {
      showPopup(`❌ ${error.message}`);
    }
    // Success: onAuthStateChange will handle redirect
  };

  const handleRegister = async (e) => {
    e.preventDefault();

   

    showPopup('Registering...');
    const { data, error } = await supabase.auth.signUp({
      email: emailRegister,
      password: passwordRegister,
      options: {
        data: { username: usernameRegister },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes('user already registered') ||
        error.message.toLowerCase().includes('user already exists')
      ) {
        showPopup('⚠️ User already exists. Please log in instead.');
      } else {
        showPopup(`❌ ${error.message}`);
      }
    } else {
      showPopup('✅ Registration successful! Please verify your email, then log in.');
      setShowRegister(false);
      setEmailRegister('');
      setPasswordRegister('');
      setUsernameRegister('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPage('login');
    showPopup('✅ Logged out.');
    setEmailLogin('');
    setPasswordLogin('');
  };
  const handleGoogleSignIn = async () => {
  showPopup('Redirecting to Google...');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) {
    showPopup(`❌ ${error.message}`);
  }
};

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        setUserEmail(userEmail); // ✅ ADDED
        if (userEmail === 'srecadmin' || userEmail === 'itboys') {
          setPage('admin');
        } else {
          setPage('voting');
        }
      } else {
        setPage('login');
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const userEmail = session.user.email;
        setUserEmail(userEmail); // ✅ ADDED
        if (userEmail === 'srecadmin' || userEmail === 'itboys') {
          setPage('admin');
        } else {
          setPage('voting');
        }
      } else {
        setPage('login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (page === 'loading') {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (page === 'voting') return <VotingBooth user={userEmail} onLogout={handleLogout} />; // ✅ ADDED user
  if (page === 'admin') return <AdminPage onLogout={handleLogout} />;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>SREC Election Booth</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email (or admin name)"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
          <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{ ...styles.button, background: '#db4437', marginTop: '10px' }}
          >
          Sign in with Google
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <span
            style={styles.link}
            onClick={() => {
              setPopup('');
              setShowRegister(true);
            }}
          >
            Register
          </span>
        </p>
      </div>

      {showRegister && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Register</h3>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={usernameRegister}
                onChange={(e) => setUsernameRegister(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email (abc@mail)"
                value={emailRegister}
                onChange={(e) => setEmailRegister(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordRegister}
                onChange={(e) => setPasswordRegister(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Register</button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              style={{ ...styles.button, background: '#dc3545', marginTop: '10px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {popup && <div style={styles.popup}>{popup}</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: '#f0f2f5', padding: 20
  },
  card: {
    background: '#fff', padding: '30px', borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '320px', textAlign: 'center'
  },
  input: {
    width: '90%', padding: '10px', margin: '10px 0',
    borderRadius: '4px', border: '1px solid #ccc'
  },
  button: {
    width: '95%', padding: '10px', background: '#007bff',
    color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
  },
  link: {
    color: '#007bff', cursor: 'pointer', textDecoration: 'underline'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    background: '#fff', padding: '20px', borderRadius: '8px',
    width: '300px', textAlign: 'center'
  },
  popup: {
    position: 'fixed', bottom: '20px', left: '50%',
    transform: 'translateX(-50%)',
    background: '#333', color: '#fff',
    padding: '12px 20px', borderRadius: '8px',
    fontSize: '14px', zIndex: 1000,
    transition: 'opacity 0.3s ease',
    maxWidth: '90%', textAlign: 'center',
  },
};

export default App;
