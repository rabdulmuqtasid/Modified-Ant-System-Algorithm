import React from "react";

import Course from '../../image/CourseDataset.png';
import Room from '../../image/RoomDataset.png';
import GenerateButton from "./GenerateBtn";
import UploadFile from "./UploadFile";
import './UploadPage.css'

const UploadPage = () => {

    return (
        <React.Fragment>
            <div className="upload-page">
                <div className="upload-page__textbox">Make Sure The Header of The Dataset Is Correct According To The Image</div>
                <div className="upload-page__content">
                    <img src={Course} alt="CourseDataset"></img>
                    <ul className="nav">
                        <li >*Course Code</li>
                        <li >*Course Name</li>
                        <li >*Credits Hours</li>
                        <li >*Year</li>
                        <li >*Semester</li>
                        <li >Lecture Code</li>
                        <li >*Lecture</li>
                        <li >*Group</li>
                        <li >*HMS(Hours of Meeting Student </li>
                        <li >*Programme Code</li>
                        <li >*Enrollment Quota</li>
                        <li >*Slot 1 </li>
                        <li > *Slot 2 </li>
                    </ul>
                    <img src={Room} alt="RoomDataset"></img>
                    <ul className="nav">
                        <li >*Location</li>
                        <li >*Room</li>
                        <li >*Size</li>
                        <li >Slot</li>
                    </ul>
                    <ul className="nav">
                        <li >Attribute with " * " is important</li>
                    </ul>
                </div>
                <div className="upload-page__button">
                    <UploadFile />
                    <GenerateButton></GenerateButton>  
                </div>
            </div>
        </React.Fragment>
        
    );
};

export default UploadPage;