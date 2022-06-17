import React, { useCallback, useState,useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../contexts/auth-context";
import { useHttpClient } from "../hooks/http-hook";

import './StartBtn.css';

const Button = () => {
    const history = useNavigate();
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const signUp = async event => {
      //const [userId, setUserId] = useState(false)
        event.preventDefault();
        try {
            //const response = await fetch('http://localhost:5000/api/uploadFile/', {
            const responseData = await sendRequest('http://localhost:5000/api/users/signup',
              'POST',
              JSON.stringify({
                userId:"1"
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            auth.login(responseData.user.id);
            //auth.isLoggedIn
            //history('/UploadPage')//navigate the user to the next page
          }catch(err){}
          // {auth.isLoggedIn && (history('/UploadPage'))}//navigate the user to the next page  )
          history('/UploadPage')//navigate the user to the next page  
    };


    return (
        <React.Fragment>
            <button onClick={signUp}  className="start-button">START</button>
        </React.Fragment>
    );
};

export default Button;