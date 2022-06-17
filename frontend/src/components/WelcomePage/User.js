import React, {useEffect, useState} from "react";
import LoadingSpinner from "../Modal/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const User = () => {

    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(()=>{
        const fetchUsers = async () => {
            try{
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData.users);
            }catch(err){}
        };
        fetchUsers();
    },[sendRequest]);


    return (
        <React.Fragment>
            {isLoading && (
                <div>
                    <LoadingSpinner/>
                </div>
            )}
        </React.Fragment>
    )
};

export default User;