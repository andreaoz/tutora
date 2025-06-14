import { useState } from 'react';
import'../style/style.css'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/backend/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Redirige al dashboard
        window.location.href = '/dashboard'; 
      }
    } else {
      const data = await response.json();
      setError(data.error || 'Error logging in');
    }
  };

  return (
    <div className="bg-chalkboard vstack">
      <div className="chalkboard-white">

            <div className="d-flex justify-content-start mb-3">
              <a href="/" className="btn btn-back">Go back</a>
            </div>

            <h3 className="text-center mb-3">Log in</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 row text-center text-sm-start">
            <label htmlFor="email" className="col-12 col-sm-3 col-form-label">Email</label>
            <div className="col-12 col-sm-9">
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3 row text-center text-sm-start">
            <label htmlFor="password" className="col-12 col-sm-3 col-form-label">Password</label>
            <div className="col-12 col-sm-9">
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />             
            </div>
          </div>

          <div className="d-grid gap-3 mx-auto" style={{maxWidth: '250px'}}>
            <button type="submit" className="btn btn-login">Login</button>
            <a href="/signup" className="btn btn-signup">Sign Up</a>
          </div>

        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
      <footer className="custom-footer">
        <small>&copy; 2025 Tutora</small>
      </footer>

    </div>
  );
}
