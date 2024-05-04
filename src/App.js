import React, { useState } from "react";
import LoginPage from "./LoginPage";
import MainContent from "./MainContent";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  // const UserContext = React.createContext();
  const handleLogin = (username) => {
    console.log(username);
    setUsername(username);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainContent username={username} />
      )}
    </div>
  );
}

export default App;
