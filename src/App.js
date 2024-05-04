import React, { useState } from "react";
import LoginPage from "./LoginPage";
import MainContent from "./MainContent";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dataFile, setDataFile] = useState(null);

  // const UserContext = React.createContext();
  const handleLogin = (username, file) => {
    console.log(username);
    setUser({ username });
    setIsLoggedIn(true);
    setDataFile(file);
  };

  return (
    <div className="App">
      {!isLoggedIn || !user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainContent username={user.username} file={dataFile} />
      )}
    </div>
  );
}

export default App;
