import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Capture the file from the input
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      onLogin(username, file);
    } else {
      alert("Please upload a CSV file to continue.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <label className="username-field">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="upload-data-field">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
