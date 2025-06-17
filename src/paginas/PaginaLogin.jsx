import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./PaginaLogin.css";

const PaginaLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const ADMIN_EMAIL = "admin@admin.com";
  const ADMIN_PASSWORD_MOCKED = "adminrm1";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    setTimeout(() => {
      if (enteredEmail === ADMIN_EMAIL.toLowerCase() && enteredPassword === ADMIN_PASSWORD_MOCKED) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/productos", { replace: true });
      }
    }, 500);
  };

  return (
    <div className={`login-pantalla-wrapper fadeuno-wrapper ${isVisible ? "visible" : ""}`}>
      <div className="login-sombra-overlay">
        <img src="/imagenes/Fondo/sombra.png" alt="Background shadow" />
      </div>
      <div className="login-pantalla-dividida">
        <div className="login-lado-izquierdo">
          <div className="login-container">
            <h2>WELCOME</h2>
            <p className="login-subtitle">Sign in to your account</p>
            {error && <p className="login-error-message">{error}</p>}
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Write your email"
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">Password</label>
                <div className="login-password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Write your password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label="Show or hide password">
                    {passwordVisible ? <i className="bi bi-eye-fill"></i> : <i className="bi bi-eye-slash-fill"></i>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="login-custom-button">
                {loading ? 'Processing...' : 'Login'}
              </button>
            </form>
            <div className="login-links-container">
              <p>Don’t have an account?</p>
              <p>
                <Link to="/registro" style={{ color: "#004D5B", textDecoration: "none" }}>Register here</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="login-lado-derecho">
          <div className="login-imagen-custom">
            <img src="/imagenes/Fondo/rmwilliams.png" alt="Promotional" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaLogin;