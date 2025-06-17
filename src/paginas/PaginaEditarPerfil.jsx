import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaEditarPerfil.css";

const PaginaEditarPerfil = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    paymentMethod: "",
  });

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (field === "confirmPassword") {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Data updated successfully.");
    navigate("/productos");
  };

  const handleBack = () => {
    navigate("/productos");
  };

  return (
    <div className="edit-page-wrapper">
      <div className={`edit-fade-wrapper ${isVisible ? "visible" : ""}`}>
        <div className="edit-editar-container">
          <button type="button" className="edit-back-to-editar" onClick={handleBack}>
            <i className="bi bi-arrow-left-circle"></i> Back
          </button>
          <h2 className="edit-h2">EDIT PROFILE</h2>
          <p className="edit-subtitle">Update your details and payment method</p>
          <form className="edit-editar-form" onSubmit={handleSubmit}>
            <div className="edit-form-group row">
              <div className="edit-form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Your first name" />
              </div>
              <div className="edit-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Your last name" />
              </div>
            </div>
            <div className="edit-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" />
            </div>
            <div className="edit-form-group">
              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone" />
            </div>
            <div className="edit-form-group">
              <label htmlFor="password">Password</label>
              <div className="edit-password-container">
                <input type={passwordVisible ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="New password" />
                <button type="button" className="edit-password-toggle" onClick={() => togglePasswordVisibility("password")} aria-label="Show/Hide password">
                  {passwordVisible ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                </button>
              </div>
            </div>
            <div className="edit-sombracinco-overlay"><img src="/imagenes/Fondo/sombra5.png" alt="sombra-cinco" /></div>
            <div className="edit-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="edit-password-container">
                <input type={confirmPasswordVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
                <button type="button" className="edit-password-toggle" onClick={() => togglePasswordVisibility("confirmPassword")} aria-label="Show/Hide confirm password">
                  {confirmPasswordVisible ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}
                </button>
              </div>
            </div>
            <div className="edit-form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="">Select a method</option>
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="transfer">Bank Transfer</option>
              </select>
            </div>
            <button type="submit" className="edit-submit-button">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaginaEditarPerfil;