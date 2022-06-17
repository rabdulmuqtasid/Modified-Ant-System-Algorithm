import React from "react";

import './WelcomePage.css';
import './StartBtn';
import Button from "./StartBtn";

const WelcomePage = props => {
    return (
        <React.Fragment>
            <div className="welcome-page">
                <h2>Schedule Generator</h2>
                <p>
                    Welcome to the Ant System Generate Schedule Website. Click "start" button to start generating schedule
                </p>
                <Button></Button>
            </div>
        </React.Fragment>
    );
};

export default WelcomePage;