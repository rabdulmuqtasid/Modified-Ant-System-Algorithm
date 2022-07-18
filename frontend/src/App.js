import React,{ useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import WelcomePage from './components/WelcomePage/WelcomePage'
import GenerateSch from './components/GenerateSchedulePage/GenerateSchedulePage';
import UploadPage from './components/UploadPage/UploadPage';
import { AuthContext } from './components/contexts/auth-context';
import SlotIn from './components/Slot_In_Heuristic/SlotIn';

import './App.css';

const App = () =>{

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback(uid => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      login: login,
      logout: logout
    }}
  >
      <Router>
        <Routes>
          <Route path="/" exact element ={<WelcomePage />} />
         <Route path="/UploadPage" exact element ={<UploadPage />} />
         <Route path="/GenerateSchedule" exact element={<GenerateSch />} />
         <Route path="/Slot" exact element={<SlotIn />} />
         </Routes>
      </Router>
      </AuthContext.Provider>
  );
}

export default App;
