import React from "react";
import { userHttpClient } from "../hooks/http-hook";
import ipv4 from "ipv4/lib/ipv4";

let ipv4Id  = []


const Signup = async event => {
    const { isLoading, error, sendRequest, clearError } = userHttpClient();
    event.preventDefault();

    const assignedId = () => {
      ipv4Id.push(ipv4);
    }
    console.log(ipv4Id)

    try {
        const responseData = await sendRequest('http://localhost:5000/api/users/signup', 'POST', 
        JSON.stringify({
            userId:1
          }),
          {
            'Content-Type' : 'application/json'
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message);
          }
      }catch(err){
        console.log(err);
      }
};


export default Signup;