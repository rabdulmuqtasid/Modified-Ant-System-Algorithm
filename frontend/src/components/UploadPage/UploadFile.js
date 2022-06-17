import React, { useCallback, useContext, useState} from "react";
import {parse} from "papaparse";
import {useDropzone} from 'react-dropzone';
//import ErrorModal from '../../components/Modal/ErrorModal';
import LoadingSpinner from '../../components/Modal/LoadingSpinner';
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../contexts/auth-context";

import './UploadFile.css';

const UploadFile =  () => {

  const [Filename,setFileName] = useState([]);
  const auth =  useContext(AuthContext);
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  const onDrop = useCallback( acceptedFiles => {
    acceptedFiles.forEach((file) => { 
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        setFileName((existing)=> [...existing, file.name])
        //console.log(setFileName);
      // Do whatever you want with the file contents
        const binaryStr = parse(reader.result,{header:true,blackrows: false});
        let test = JSON.stringify(binaryStr.data);
        //console.log("Test: " + test);
         try {
           //setIsLoading(true);
           //const response = await fetch('http://localhost:5000/api/uploadFile/', {
           const response = await sendRequest('http://localhost:5000/api/files/', 'POST', JSON.stringify({
            //userId:"6280a9b970216c2e558ac875",
            userId: '6280a9b970216c2e558ac875',
            Dataset: binaryStr.data
           }),{ 'Content-Type': 'application/json' });
           //const  responsedata = await response.json();
           const responsedata = await response.json();
           //console.log(responsedata);
           //setIsLoading(false);
         }catch(err){
           //setIsLoading(false);
           console.log(err);
           //setError(err.message  || 'Something went wrong');
         }
        //console.log(binaryStr.data)
      }
      //reader.readAsArrayBuffer(file)
      reader.readAsText(file)
    })
    
  }, [])


  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <React.Fragment>
    <div {...getRootProps()} className="upload-file">
      {Filename.map((Dataset)=>(
        <h2>{Dataset}</h2>
      ))}
      <input {...getInputProps()} accept=".csv" multiple />
      {isLoading && <LoadingSpinner asOverlay />}
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop some files here, or click to select files</p>
      }
    </div>
    
    </React.Fragment>

  )
}

export default UploadFile;