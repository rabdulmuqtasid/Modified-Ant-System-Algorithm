import React, { useCallback, useContext, useState} from "react";
import {parse} from "papaparse";
import {useDropzone} from 'react-dropzone';
import LoadingSpinner from '../../components/Modal/LoadingSpinner';
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../contexts/auth-context";

import './UploadFile.css';

const UploadFile =  () => {

  const [Filename,setFileName] = useState([]);
  const auth =  useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  console.log(auth.userId)

  const onDrop = useCallback( acceptedFiles => {
    acceptedFiles.forEach((file) => { 
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        setFileName((existing)=> [...existing, file.name])
        const binaryStr = parse(reader.result,{header:true,blackrows: false});
        let test = JSON.stringify(binaryStr.data);
         try {
           const response = await sendRequest('http://localhost:5000/api/files/', 'POST', JSON.stringify({
            userId: auth.userId,
            Dataset: binaryStr.data
           }),{ 'Content-Type': 'application/json' });
           const responsedata = await response.json();
         }catch(err){
           console.log(err);
         }
      }
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