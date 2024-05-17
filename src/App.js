import React, { useState } from "react";
import LoginPage from "./LoginPage";
import MainContent from "./MainContent";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [progressFile, setProgressFile] = useState(null);

  // const UserContext = React.createContext();
  const handleLogin = (username, rawFile, progressFile) => {
    console.log(username);
    setUser({ username });
    setIsLoggedIn(true);
    setDataFile(rawFile);
    setProgressFile(progressFile);
  };

  return (
    <div className="App">
      {!isLoggedIn || !user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainContent
          username={user.username}
          rawDataFile={dataFile}
          progressFile={progressFile}
        />
      )}
    </div>
  );
}

export default App;
