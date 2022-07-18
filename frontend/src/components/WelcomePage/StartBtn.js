import React, { useCallback, useState,useContext } from "react";
import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../contexts/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import './StartBtn.css';


const {v4: uuidv4} = require('uuid')
let uuId = uuidv4();

const Button = () => {
    const history = useNavigate();
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    console.log(uuId);


    const signUp = async event => {
        event.preventDefault();
        try {
            const responseData = await sendRequest('http://localhost:5000/api/users/signup',
              'POST',
              JSON.stringify({
                userId:uuId
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            auth.login(responseData.user.id);
          }catch(err){}

          try {
            const responseData = await sendRequest(
              'http://localhost:5000/api/users/login',
              'POST',
              JSON.stringify({
                userId:uuId
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            auth.login(responseData.user.id);
          } catch (err) {}

          history('/UploadPage')//navigate the user to the next page  
    };


    return (
        <React.Fragment>
            <button onClick={signUp}  className="start-button">START</button>
        </React.Fragment>
    );
};

export default Button;