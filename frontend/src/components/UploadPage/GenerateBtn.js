import React from "react";
import { useNavigate } from 'react-router-dom';

import './GenerateBtn.css';

const GenerateButton = () => {
    const navigate = useNavigate(); // Use useNavigate correctly

    const handleClick = () => {
        navigate('/GenerateSchedule'); // Call navigate with the desired route
    };

    return (
        <React.Fragment>
            <button onClick={handleClick} className="generate-button">Generate Schedule</button>
        </React.Fragment>
    );
};

export default GenerateButton;
