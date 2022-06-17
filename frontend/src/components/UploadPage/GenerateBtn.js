import React from "react";
import {useNavigate} from 'react-router-dom';
import GetDataset from '../GetDataset/getDataset';

import './GenerateBtn.css';

const GenerateButton = () => {
    const history = useNavigate();
    history('/GenerateSchedule')
    return (
        <React.Fragment>
        <button onClick={history} className="generate-button" >Generate Schedule</button>
        </React.Fragment>
    );
};
export default GenerateButton;