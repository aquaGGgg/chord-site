import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return;
    }

    try {
      await register(username, email, password);
    } catch (err) {
      setError(err.message || "Ошибка при регистрации");
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Регистрация</h2>
      {error && <div style={errorStyle}>{error}</div>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Подтверждение пароля"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
};

const formContainerStyle = {
  maxWidth: "400px",
  margin: "50px auto",
  padding: "20px",
  backgroundColor: "#333",
  color: "#fff",
  borderRadius: "8px",
};

const formStyle = { display: "flex", flexDirection: "column" };
const inputStyle = { marginBottom: "10px", padding: "10px", borderRadius: "4px", border: "none" };
const buttonStyle = { padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#555", color: "#fff", cursor: "pointer" };
const errorStyle = { color: "red", marginBottom: "10px" };

export default RegisterPage;
