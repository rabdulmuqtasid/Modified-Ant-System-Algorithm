import React,{ useEffect,useState, useContext } from "react";
import { CSVLink } from "react-csv";
import ArraySchedule from "../RandomSchedule/arraySchedule";

import LoadingSpinner from "../Modal/LoadingSpinner";

const Dataset = (props) => {
    const ertRoom = props.ertRoom;
    const ertCourse = props.ertCourse;
    const [isLoading, setIsLoading] = useState(false);
    const [loadedFile, setLoaadedFile] = useState(false);
    const [CsvData, setCsvData] = useState();
    // const [Keys, setKeys] = useState();
    //const [uploadedData, setUploadedData] = useState([]);
    //console.log("props dataset:"+ props.test)
    useEffect(()=>{
        const sendRequest = async () =>{
            setIsLoading(true);
            try{
            // const response = await fetch('http://localhost:5000/api/user/');
            //const response = await fetch('http://localhost:5000/api/files/users/624278b29a90a9077e2f65e4');
            const response = await fetch('http://localhost:5000/api/files/users/6280a9b970216c2e558ac875');
            const responsedata = await response.json();
            let stringifyData = JSON.stringify(responsedata.userWithFiles.Dataset);
            ertRoom(JSON.stringify(responsedata.userWithFiles.Dataset[0]));
            ertCourse(JSON.stringify(responsedata.userWithFiles.Dataset[1].Dataset));

            // const ertLocation = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset => [Dataset['Location']]); //Extract Location
            //const ertRoom = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset => Dataset['Room']); //Extract Room
            // const  ertSize= responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset => Dataset['Size']); //Extract Size
            // const ertSlot = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset => Dataset['Slot']); //Extract Slot

            // const ertCCode = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Course Code']); //Extract Course Code
            // const ertCName = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Course Name']); //Extract Course Name
            // const ertCHours = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Credit Hours']); //Extract Credit Hours
            // const ertYear = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Year']); //Extract Year
            // const ertSemester = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Semester']); //Extract Semester
            // const ertProCode = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Program Code']); //Extract Lecture Code
            // const ertLecturer = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Lecturer']); //Extract Lecturer
            // const ertGroup = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Group']); //Extract Group
            // const ertHMS = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['HMS']); //Extract Hours Meeting Student
            // const ertProgram = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Programme Code']); //Extract Programme Code
            // const ertTtlStudent = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => Dataset['Enrollment Quota']); //Extract Enrollment Quota

            //console.log("Dataset: " + ertLocation);

            // console.log("X value= " + ertCName);
            // for (let i = 0 ; i<test1.length; i++){
            //      let x = test1[i].Location;
            //      console.log("X value= " +x);
            // }
            //console.log("Test 1: "+ test1);
            //let stringifyData = JSON.stringify(responsedata.files.Dataset);
            //let setK = Object.keys(responsedata.files.Dataset[1])
            //setKeys([setK])
            //console.log("STRINGIFYDATA: " + stringifyData);
            //const test1 = responsedata.files.Dataset.map(Dataset => Dataset['Location']);
            //console.log("Test: " + test1);
            //setCsvData([ertLocation]);
            //setUploadedData(responsedata.userWithFiles.Datasetp[0].Dataset);
            //console.log("Get Data: "+ JSON.stringify(responsedata));
            if (!response.ok){
                throw new Error(responsedata.message);
            }
            setLoaadedFile(responsedata.users);
            setIsLoading(true);
            }catch(err){
                console.log(err.message);
            }
            setIsLoading(false);
            
        };
        sendRequest();
    },[]);


    // console.log("Csv" + CsvData);
    return(
        <React.Fragment>
             {/* <h1>test:{ertLocation}</h1> */}
      {/* <CSVLink data = {CsvData} enclosingCharacter= {`,`}>Download Me</CSVLink>
    //         {isLoading && <div className="center"><LoadingSpinner/></div>} */}
        </React.Fragment>
    );
    
};

export default Dataset;