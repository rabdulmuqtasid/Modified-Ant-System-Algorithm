import React,{ useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import WelcomePage from './components/WelcomePage/WelcomePage'
import GenerateSch from './components/GenerateSchedulePage/GenerateSchedulePage';
import UploadPage from './components/UploadPage/UploadPage';
import ArraySchedule from './components/RandomSchedule/arraySchedule';
import Dataset from './components/GetDataset/getDataset';
import HeuristicApproach from './components/RandomSchedule/heuristicalgo';
import { AuthContext } from './components/contexts/auth-context';
import ArrayScheduleElective from './components/GenerateSchedulePage/GenerateScheduleElective';

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

  let routes;

  // if (isLoggedIn) {
  //   routes = (
  //     <Routes>
  //       <Route path="/UploadPage" exact>
  //         <UploadPage />
  //       </Route>
  //       <Route path="/GenerateSchedule" exact>
  //         <GenerateSch />
  //       </Route>
  //       <Route path="/Dataset">
  //         <Dataset />
  //       </Route>
  //       <Route path="/ArraySchedule">
  //         <ArraySchedule />
  //       </Route>
  //       {/* <Route path="/UploadPage" exact element ={<UploadPage />} />
  //       <Route path="/GenerateSchedule" exact element={<GenerateSch />} />
  //       <Route path="/Dataset" exact element={<Dataset />} />
  //       <Route path="/ArraySchedule" exact element={<ArraySchedule />} />     */}
  //     </Routes>
  //   );}
  return (
  //   <AuthContext.Provider
  //   value={{
  //     isLoggedIn: isLoggedIn,
  //     userId: userId,
  //     login: login,
  //     logout: logout
  //   }}
  // >
      <Router>
        <Routes>
          <Route path="/" exact element ={<WelcomePage />} />
         <Route path="/UploadPage" exact element ={<UploadPage />} />
         <Route path="/GenerateSchedule" exact element={<GenerateSch />} />
         <Route path="/Dataset" exact element={<Dataset />} />
         <Route path="/ArraySchedule" exact element={<ArraySchedule />} />    
         <Route path="/ArrayScheduleElective" exact element={<ArrayScheduleElective />} />    
         <Route path="/Heuristic" exact element={<HeuristicApproach />} />    
         </Routes>
      </Router>
      // </AuthContext.Provider>
  );
}

export default App;
