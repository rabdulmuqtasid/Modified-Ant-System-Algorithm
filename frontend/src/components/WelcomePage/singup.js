import React from "react";
import { userHttpClient } from "../hooks/http-hook";


const Signup = async event => {
    const { isLoading, error, sendRequest, clearError } = userHttpClient();
    event.preventDefault();
    try {
        //const response = await fetch('http://localhost:5000/api/uploadFile/', {
        //const response = await fetch('http://localhost:5000/api/users/signup', {
        const responseData = await sendRequest('http://localhost:5000/api/users/signup', 'POST', 
        JSON.stringify({
            userId:1
          }),
          {
            'Content-Type' : 'application/json'
          }
        );
        //const  responsedata = await response.json();
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message);
          }
        //console.log(responsedata);

      }catch(err){
        console.log(err);
        //setError(err.message  || 'Something went wrong');
      }
};


export default Signup;