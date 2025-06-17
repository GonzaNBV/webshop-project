import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./PaginaRegistro.css";

const PaginaRegistro = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Registration form submitted:", formData);

    setTimeout(() => {
      alert("Registration form submitted!");
      navigate("/login");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="registro-page-wrapper">
      <div className={`registro-fade-wrapper ${isVisible ? "visible" : ""}`}>
        <div className="registro-container">
          <Link to="/login" className="registro-back-to-login">
            <i className="bi bi-arrow-left-circle-fill"></i> Back to Login
          </Link>
          <h2>CREATE AN ACCOUNT</h2>
          <p className="registro-subtitle">Enter your information to register</p>
          <form className="registro-form" onSubmit={handleSubmit}>
            <div className="registro-form-group row">
              <div className="registro-form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Write your first name"
                />
              </div>
              <div className="registro-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Write your last name"
                />
              </div>
            </div>
            <div className="registro-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Write your email"
              />
            </div>
            <div className="registro-sombra-overlaydos">
              <img
                src="/imagenes/Fondo/sombra2.png"
                alt="decorative shadow overlay"
              />
            </div>
            <div className="registro-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Write your phone number"
              />
            </div>
            <div className="registro-form-group">
              <label htmlFor="password">Password</label>
              <div className="registro-password-container">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Write your password"
                />
                <button
                  type="button"
                  className="registro-password-toggle"
                  onClick={() => togglePasswordVisibility("password")}
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? (
                    <i className="bi bi-eye-fill"></i>
                  ) : (
                    <i className="bi bi-eye-slash-fill"></i>
                  )}
                </button>
              </div>
            </div>
            <div className="registro-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="registro-password-container">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="registro-password-toggle"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label="Toggle confirm password visibility"
                >
                  {confirmPasswordVisible ? (
                    <i className="bi bi-eye-fill"></i>
                  ) : (
                    <i className="bi bi-eye-slash-fill"></i>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="registro-submit-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaginaRegistro;