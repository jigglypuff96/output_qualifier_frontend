import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [rawfile, setRawFile] = useState(null);
  const [progressfile, setProgressFile] = useState(null);

  const handleRawDataUpload = (event) => {
    setRawFile(event.target.files[0]);
  };

  const handleProgressUpload = (event) => {
    setProgressFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (rawfile) {
      onLogin(username, rawfile, progressfile);
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
          Upload Raw Data:
          <input
            type="file"
            accept=".csv"
            onChange={handleRawDataUpload}
            required
          />
        </label>
        <label className="upload-data-field">
          Upload Progress Data:
          <input
            type="file"
            accept=".csv"
            onChange={handleProgressUpload}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
