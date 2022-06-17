import { create, find, forEach, indexOf } from "lodash";
import React,{ useEffect,useState, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from 'lodash';
import { CSVLink } from "react-csv";
import LoadingSpinner from "../Modal/LoadingSpinner";


let finalDataAll = [];
let finalDataAllElective = [];
let checkHardConstraintOutsite = 0;
let checkSoftConstraintOutsite = 0;

const HeuristicApproach = (props) => {


    const [isLoading, setIsLoading] = useState(false);
    const [loadedFile, setLoaadedFile] = useState(false);
    const [roomData, setroomData] = useState();
    const [courseData, setcourseData] = useState();
    const [CsvData, setCsvData] = useState();
    // const [Keys, setKeys] = useState();
    //const [uploadedData, setUploadedData] = useState([]);
    //console.log("props dataset:"+ props.test)

    const userId = useParams().userId;
    useEffect(()=>{
        const sendRequest = async () =>{
            setIsLoading(true);
            try{
            const response = await fetch('http://localhost:5000/api/files/users/6280a9b970216c2e558ac875');
            //const responseRequest = await sendRequest('http://localhost:5000/api/files/users/${userId}');
            //const response = await fetch('http://localhost:5000/api/files/users/${userId}');
            const responsedata = await response.json();
            let stringifyData = JSON.stringify(responsedata.userWithFiles.Dataset);

            // const ertLocation = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset => [Dataset['Location']]); //Extract Location
            const ertRoom = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset =>[Dataset['Room'],Dataset['Size']]); //Extract Room
            setroomData([ertRoom]);

            const ertCourse = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => [Dataset['Enrollment Quota'],Dataset['Course Code'],Dataset['Course Name'],Dataset['Year'],Dataset['Semester'],Dataset['Lecturer'],Dataset['Group'],Dataset['HMS'],Dataset['Programme Code'],Dataset['Slot1'],Dataset['Slot2']]); //Extract Enrollment Quota
            setcourseData([ertCourse]);

            if (!response.ok){
                throw new Error(responsedata.message);
            }
            setLoaadedFile(stringifyData);
            setIsLoading(true);
            }catch(err){
                console.log(err.message);
            }
            setIsLoading(false);
            
        };
        sendRequest();
    },[userId]);

        if(!isLoading && loadedFile){
            const testData = [1,2,3,4,5,6,7,8,9];
            const EnrollmentQuota = [];
            const CourseCode = [];
            const HMS = [];
            const lecturerData = []
            const roomName = [];
            const roomSize = [];
            const filterData50  = [];
            const filterData100  = [];
            const filterData200  = [];
            const filterData500  = [];
            const filterDataElective50  = [];
            const filterDataElective100  = [];
            const filterDataElective200  = [];
            const filterDataElective500  = [];
            const dupeData  = [];
            const room = []
            room.push(roomData[0])
            
            let hardConstraintViolated = 0;
            let softConstraintViolated = 0;
            //console.log(courseData[0][0][1]);
            for(let i = 0; i <courseData[0].length; i++){
                let enrollment = [courseData[0][i][0]];
                let code = [courseData[0][i][1]];
                let hms = [courseData[0][i][7]];
                let lecturer = [courseData[0][i][5]];
                enrollment.reduce(function(results, item, index, array){
                    results[index] = item;
                    EnrollmentQuota.push(item);
                    //console.log(results)
                },{});
                code.reduce(function(results, item, index, array){
                    results[index] = item;
                    CourseCode.push(item);
                    //console.log(results)
                },{});
                hms.reduce(function(results, item, index, array){
                    results[index] = item;
                    HMS.push(item);
                    //console.log(results)
                },{});
                lecturer.reduce(function(results, item, index, array){
                    results[index] = item;
                    lecturerData.push(item);
                    //console.log(results)
                },{});
            }

            for(let i = 0; i <roomData[0].length; i++){
                let name = [roomData[0][i][0]];
                let size = [roomData[0][i][1]];
                name.reduce(function(results, item, index, array){
                    results[index] = item;
                    roomName.push(item);
                    //console.log(results)
                },{});
                size.reduce(function(results, item, index, array){
                    results[index] = item;
                    roomSize.push(item);
                    //console.log(results)
                },{});
            }
 
            
            const notDuplicatesRoom = roomSize.filter((item, index) => index == roomSize.indexOf(item));

            const notDuplicatesLecturer = lecturerData.filter((item, index) => index == lecturerData.indexOf(item));
            notDuplicatesLecturer.pop();
            //console.log(notDuplicatesLecturer)


            let courseDataXElective = []
            let courseDataWithElective = []
            courseData[0].pop();

            //saparate faculty course with the elective course
            for(let i=0; i< courseData[0].length; i++){
                if(courseData[0][i][1].slice(0,3) != 'TMU'){
                    courseData[0][i].splice()
                    if(  courseData[0][i][1].slice(0,3) != 'TMX'){
                        courseData[0][i].splice()
                        courseDataXElective.push(courseData[0][i])
                    }
                }
            }

            //saparate elective course with the faculty course
            for(let i=0; i< courseData[0].length; i++){
                if(courseData[0][i][1].slice(0,3) == 'TMU' ||  courseData[0][i][1].slice(0,3) == 'TMX'){
                    courseDataWithElective.push(courseData[0][i])
                }
            }

            //insert data without elective courses into correct room capacity
                for(let i = 0; i< courseDataXElective.length;i++){
                        if (courseDataXElective[i][0] < 50) {
                            filterData50.push(courseDataXElective[i]);
                        }
                        if (courseDataXElective[i][0] >= 50 && courseDataXElective[i][0] < 100) {
                            
                            filterData100.push(courseDataXElective[i]);
                        }
                        if (courseDataXElective[i][0] >= 100 && courseDataXElective[i][0] < 200 ) {
                            filterData200.push(courseDataXElective[i]);
                        }
                        if (courseDataXElective[i][0] >= 200 && courseDataXElective[i][0] < 500) {
                            filterData500.push(courseDataXElective[i]);
                        }
                }
                //console.log(filterData50)

                //insert data without faculty courses into correct room capacity
                for(let i = 0; i< courseDataWithElective.length;i++){
                    if (courseDataWithElective[i][0] < 50) {
                        filterDataElective50.push(courseDataWithElective[i]);
                    }
                    if (courseDataWithElective[i][0] >= 50 && courseDataWithElective[i][0] < 100) {
                        
                        filterDataElective100.push(courseDataWithElective[i]);
                    }
                    if (courseDataWithElective[i][0] >= 100 && courseDataWithElective[i][0] < 200 ) {
                        filterDataElective200.push(courseDataWithElective[i]);
                    }
                    if (courseDataWithElective[i][0] >= 200 && courseDataWithElective[i][0] < 500) {
                        filterDataElective500.push(courseDataWithElective[i]);
                    }
                }
                // console.log(filterDataElective50);
                // console.log(filterDataElective100);
                // console.log(filterDataElective200);
                // console.log(filterDataElective500);


            let roomUnder50 = []
            let roomUnder100 = []
            let roomUnder200 = []
            let roomUnder500 = []
            const checkNumberofRoom = () => {
                for(let i = 0; i < roomData[0].length; i++){
                    let room = roomData[0][i][1]
                    //console.log(roomData[0][i][1]);
                    if(room < 50){
                        roomUnder50.push(room)
                    }else if(room > 50 && room < 100){
                        roomUnder100.push(room)

                    }else if(room > 100 && room < 200){
                        roomUnder200.push(room)

                    }else if(room > 200){
                        roomUnder500.push(room)
                    }
                }
            }
            checkNumberofRoom();


            const createArray = (data) => {
                var result = []

                    for(let i = 0; i<data; i++){
                        result[i] = []
                    }
                return result;
            }

            let DataArray50 = roomUnder50.length * 38;
            let DataArray100 = roomUnder100.length * 38;
            let DataArray200 = roomUnder200.length * 38;
            let DataArray500 = roomUnder500.length * 38;

            let DataArrayElective50 = roomUnder50.length * 10;
            let DataArrayElective100 = roomUnder100.length * 10;
            let DataArrayElective200 = roomUnder200.length * 10;
            let DataArrayElective500 = roomUnder500.length * 10;


//----------------------------------------------------------------------------------------------------------------------------------------

var checkTotalHardContraintsAll = 0
var checkTotalSoftContraintsAll = 0

const antSystem = () => {

    //Faculty courses

    //create 1d array for dataset 50
   const array1D50 = (data) => {
       var result = []

       for(let i = 0; i< data; i++){
           result[i]= 100;
       }
       return result;
   }
   var AntArr50 = array1D50(DataArray50);

   let extraData50_Slot2_2 = []
   let extraData50_Slot2_1 = []
   let insertedData50_Slot2_2 = []
   let insertedData50_Slot2_1= []

   const AntAlgoInsert50 = (array) => {
       let test = []
       let k = 0;
       let k2 =0
       let k3 =0

       let remainderArray = []
       let remainderArraySlot1 = []
       let zeroSlot = []

       let totalRoom = array.length / 38

       for(let x=0; x<filterData50.length;x++){
           test.push(filterData50[x]);
       }

        for(let i = array.length-1;i>0;i--){
            if(k < test.length){
            let hourMS = test[k][7]


            if(hourMS == 4){
               const j = Math.floor(Math.random()*(i+1));
               if(array[i] == 100){
                   if(array[i-1] == 100 ){
                       array[i] = array[j];
                       array[i-1] = array[j-1];
                       array[j] = test[k];
                       array[j-1] = test[k];

                       const z = Math.floor(Math.random()*(i+1));
                       if(array[i] == 100){
                           //slot in slot1 = 2
                           if(array[i-1] == 100 ){
                               array[i] = array[z];
                               array[i-1] = array[z-1];
                               array[i] = test[k];
                               array[i-1] = test[k];
                           }
                           else if(array[i+1] == 100 ){
                                array[i] = array[z];
                                array[i+1] = array[z+1];
                                array[z] = test[k];
                                array[z+1] = test[k];
                           }
                           else{
                            remainderArraySlot1.push(test[k]);
                            zeroSlot.push(test[k]);
                            }
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                            zeroSlot.push(test[k]);
                        }
                   }
                   //slot in slot1 = 2
                   else if(array[i+1] == 100 ){
                       array[i] = array[j];
                       array[i+1] = array[j+1];
                       array[j] = test[k];
                       array[j+1] = test[k];
                       
                       const v = Math.floor(Math.random()*(i+1));
                       if(array[i] == 100){
                           //slot in slot1 = 2
                           if(array[i-1] == 100 ){
                               array[i] = array[v];
                               array[i-1] = array[v-1];
                               array[v] = test[k];
                               array[v-1] = test[k];
                           }
                           else if(array[i+1] == 100){
                                array[i] = array[v];
                                array[i+1] = array[v+1];
                                array[v] = test[k];
                                array[v+1] = test[k];
                           }
                           else{
                            remainderArraySlot1.push(test[k]);
                            zeroSlot.push(test[k]);
                            }
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                            zeroSlot.push(test[k]);
                        }
                   }
                   else{
                       remainderArray.push(test[k]);
                       zeroSlot.push(test[k]);
                   }
               }else{
                   remainderArray.push(test[k]);
                   zeroSlot.push(test[k]);
                   
               }
            }
             
            else if(hourMS == 3){
                if(array[i] == 100){
                    if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                        array[i] = test[k];
                        array[i-1] = test[k];
                        array[i+1] = test[k];
                        
                    }else if(array[i-1] == 100){//slot 2 hours in 1 go
                        array[i] = test[k];
                        array[i-1] = test[k];
                        insertedData50_Slot2_1.push(test[k])
                        
                    }else if(array[i+1] == 100){//slot 2 hours in 1 go
                        array[i] = test[k];
                        array[i+1] = test[k];
                        insertedData50_Slot2_1.push(test[k])
                        
                    }else if(array[i] == 100 ){//slot 1 hours in 1 go
                        array[i] = test[k];
                        remainderArraySlot1.push(test[k])
                        zeroSlot.push(test[k]);
                        
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
                }

             else if(hourMS == 2){
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = test[k];
                        array[i-1] = test[k];
                        
                    }else if(array[i+1] == 100){
                        array[i] = test[k];
                        array[i+1] = test[k];
                        
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                        
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                }
                }
            }
            k++  
        }

        //fullfill the slot 3
        for(let x = 0; x< array.length; x++){
            if(array[x] == 100 && array[x+1] == 100){
                if(k3 < remainderArraySlot1.length){
                        array[x] = remainderArraySlot1[k3]
                        array[x+1] = remainderArraySlot1[k3]
                }else{
                    if(remainderArraySlot1[k3] != undefined){
                        insertedData50_Slot2_2.push(remainderArraySlot1[k3])
                    }
                }
                k3++   
            }else if(array[x] == 100 && array[x+1] ==100 ){
                if(k3 < remainderArraySlot1.length){
                        array[x] = remainderArraySlot1[k3]
                        array[x+1] = remainderArraySlot1[k3]
                }else{
                    if(remainderArraySlot1[k3] != undefined){
                        insertedData50_Slot2_2.push(remainderArraySlot1[k3])
                    }
                }
                k3++   
            }
        }
        //console.log(remainderArray);
        for(let x = 0; x< array.length; x++){
                if(array[x] == 100 && array[x+1] ==100 ){
                    if(k2 < remainderArray.length){
                        array[x] = remainderArray[k2]
                        array[x+1] = remainderArray[k2]
                    }
                    try{
                        let slot2 = remainderArray[k2][10]
                        if(slot2 == 1){
                            insertedData50_Slot2_1.push(remainderArray[k2])
                        }
                        if(slot2 == 2){
                            insertedData50_Slot2_2.push(remainderArray[k2])
                        }
                    }catch{}
                k2++   
            }
        }
        if(array[-1] != undefined || array[-1] != 0){
            insertedData50_Slot2_1.push(array[-1]);
            // array[-1] = undefined
        }

       return array;
   }
   var AntArrIns50 = AntAlgoInsert50(AntArr50);

   //console.log(AntArrIns50)

    const slot2Equal1for50 = (array) => {
        let k = 0;
        let test2 = []
        let totalRoom = array.length / 38
        //console.log(insertedData50_Slot2_1)
        for(let x = 0; x< array.length; x++){
            if(array[x] == 100){
                if(k < insertedData50_Slot2_1.length){
                    array[x] = insertedData50_Slot2_1[k]
                }
            k++   
            }
        }
        return array;
    }
     slot2Equal1for50(AntArr50);
 

    const slot2Equal2for50 = (array) => {
        let k = 0;
        let totalRoom = array.length / 38

        for(let x = 0; x< array.length; x++){
            if(array[x] == 100 && array[x+1] ==100){
                if(k < insertedData50_Slot2_2.length){    
                        array[x] = insertedData50_Slot2_2[k]
                        array[x+1] = insertedData50_Slot2_2[k]

                }else{

                    if(insertedData50_Slot2_2[k] != undefined){
                        extraData50_Slot2_2.push(insertedData50_Slot2_2[k])
                    }
                }
                k++   
            }
        }


        for(let x = 0; x< array.length; x++){
            if(array[x] == 100 && array[x+1] ==100){
                if(k < extraData50_Slot2_2.length){
                    array[x] = extraData50_Slot2_2[k]
                    array[x+1] = extraData50_Slot2_2[k]
                }
            k++   
            }
        }

        return array;
}
    slot2Equal2for50(AntArr50);

   const checkAmountData50 = (array) => {
       let count = 0
       for(let i = 0; i < array.length; i++){
               if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined){
                   count += 1
               }
       }
       return count
   }
   var checkAmount50 = checkAmountData50(AntArrIns50)
//    console.log(AntArrIns50)
//    console.log(checkAmount50)


//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 50 but less than 100

    //create 1d array for dataset 100
    const array1D100 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArr100 = array1D100(DataArray100);
    
    let extraData100_Slot2_2 = []
    let extraData100_Slot2_1 = []
    let insertedData100_Slot2_2 = []
    let insertedData100_Slot2_1= []
    
    const AntAlgoInsert100 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterData100.length;x++){
            test.push(filterData100[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }else if(array[i-1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         insertedData100_Slot2_1.push(test[k])
                         
                     }else if(array[i+1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i+1] = test[k];
                         insertedData100_Slot2_1.push(test[k])
                         
                     }else if(array[i] == 100 ){//slot 1 hours in 1 go
                         array[i] = test[k];
                         remainderArraySlot1.push(test[k])
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData100_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData100_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedData100_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedData100_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedData100_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrIns100 = AntAlgoInsert100(AntArr100);
    
    //console.log(AntArrIns100)

    
     const slot2Equal1for100 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedData100_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedData100_Slot2_1.length){
                     array[x] = insertedData100_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1for100(AntArr100);
    
    
     const slot2Equal2for100 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedData100_Slot2_2.length){    
                         array[x] = insertedData100_Slot2_2[k]
                         array[x+1] = insertedData100_Slot2_2[k]
    
                 }else{
    
                     if(insertedData100_Slot2_2[k] != undefined){
                         extraData100_Slot2_2.push(insertedData100_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraData100_Slot2_2.length){
                     array[x] = extraData100_Slot2_2[k]
                     array[x+1] = extraData100_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2for100(AntArr100);
    
    const checkAmountData100 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmount100 = checkAmountData100(AntArrIns100)
    // console.log(AntArrIns100)
    // console.log(checkAmount100)

//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 100 but less than 200

    //create 1d array for dataset 200
    const array1D200 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArr200 = array1D200(DataArray200);
    
    let extraData200_Slot2_2 = []
    let extraData200_Slot2_1 = []
    let insertedData200_Slot2_2 = []
    let insertedData200_Slot2_1= []
    
    const AntAlgoInsert200 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterData200.length;x++){
            test.push(filterData200[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }else if(array[i-1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         insertedData200_Slot2_1.push(test[k])
                         
                     }else if(array[i+1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i+1] = test[k];
                         insertedData200_Slot2_1.push(test[k])
                         
                     }else if(array[i] == 100 ){//slot 1 hours in 1 go
                         array[i] = test[k];
                         remainderArraySlot1.push(test[k])
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData200_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData200_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedData200_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedData200_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedData200_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrIns200 = AntAlgoInsert200(AntArr200);
    
    //console.log(AntArrIns200)
    
    
     const slot2Equal1for200 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedData200_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedData200_Slot2_1.length){
                     array[x] = insertedData200_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1for200(AntArr200);
    
    
     const slot2Equal2for200 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedData200_Slot2_2.length){    
                         array[x] = insertedData200_Slot2_2[k]
                         array[x+1] = insertedData200_Slot2_2[k]
    
                 }else{
    
                     if(insertedData200_Slot2_2[k] != undefined){
                         extraData200_Slot2_2.push(insertedData200_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraData200_Slot2_2.length){
                     array[x] = extraData200_Slot2_2[k]
                     array[x+1] = extraData200_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2for200(AntArr200);
    
    const checkAmountData200 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=200 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmount200 = checkAmountData200(AntArrIns200)
    // console.log(AntArrIns200)
    // console.log(checkAmount200)


//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 200 

    //create 1d array for dataset 500
    const array1D500 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArr500 = array1D500(DataArray500);
    
    let extraData500_Slot2_2 = []
    let extraData500_Slot2_1 = []
    let insertedData500_Slot2_2 = []
    let insertedData500_Slot2_1= []
    
    const AntAlgoInsert500 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterData500.length;x++){
            test.push(filterData500[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }else if(array[i-1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         insertedData500_Slot2_1.push(test[k])
                         
                     }else if(array[i+1] == 100){//slot 2 hours in 1 go
                         array[i] = test[k];
                         array[i+1] = test[k];
                         insertedData500_Slot2_1.push(test[k])
                         
                     }else if(array[i] == 100 ){//slot 1 hours in 1 go
                         array[i] = test[k];
                         remainderArraySlot1.push(test[k])
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData500_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedData500_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedData500_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedData500_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedData500_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrIns500 = AntAlgoInsert500(AntArr500);
    
    //console.log(AntArrIns500)
    
     const slot2Equal1for500 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedData500_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedData500_Slot2_1.length){
                     array[x] = insertedData500_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1for500(AntArr500);
    
    
     const slot2Equal2for500 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedData500_Slot2_2.length){    
                         array[x] = insertedData500_Slot2_2[k]
                         array[x+1] = insertedData500_Slot2_2[k]
    
                 }else{
    
                     if(insertedData500_Slot2_2[k] != undefined){
                         extraData500_Slot2_2.push(insertedData500_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraData500_Slot2_2.length){
                     array[x] = extraData500_Slot2_2[k]
                     array[x+1] = extraData500_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2for500(AntArr500);
    
    const checkAmountData500 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=500 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmount500 = checkAmountData500(AntArrIns500)
    // console.log(AntArrIns500)
    // console.log(checkAmount500)


//---------------------------------------------------------------------------------------------------------------------------------------------






//---------------------------------------------------------------------------------------------------------------------------------------------

//Elective courses

    //create 1d array for dataset 50
    const array1DElective50 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArrElective50 = array1DElective50(DataArrayElective50);
    
    let extraDataElective50_Slot2_2 = []
    let extraDataElective50_Slot2_1 = []
    let insertedDataElective50_Slot2_2 = []
    let insertedDataElective50_Slot2_1= []
    
    const AntAlgoInsertElective50 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let remainderArray3Slot = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterDataElective50.length;x++){
            test.push(filterDataElective50[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }
                 }else{
                     remainderArray3Slot.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
    
         for(let x = 0 ; x < array.length; x++){
            if(array[x] == 100 && array[x+1] == 100 && array[x+2] == 100){
                if(k3 < remainderArray3Slot.length){
                        array[x] = remainderArray3Slot[k3]
                        array[x+1] = remainderArray3Slot[k3]
                        array[x+2] = remainderArray3Slot[k3]
                }
                k3++   
            }
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective50_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective50_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedDataElective50_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedDataElective50_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedDataElective50_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrInsElective50 = AntAlgoInsertElective50(AntArrElective50);
    
    //console.log(AntArrInsElective50)
    
     const slot2Equal1forElective50 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedDataElective50_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedDataElective50_Slot2_1.length){
                     array[x] = insertedDataElective50_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1forElective50(AntArrElective50);
    
    
     const slot2Equal2forElective50 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedDataElective50_Slot2_2.length){    
                         array[x] = insertedDataElective50_Slot2_2[k]
                         array[x+1] = insertedDataElective50_Slot2_2[k]
    
                 }else{
    
                     if(insertedDataElective50_Slot2_2[k] != undefined){
                         extraDataElective50_Slot2_2.push(insertedDataElective50_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraDataElective50_Slot2_2.length){
                     array[x] = extraDataElective50_Slot2_2[k]
                     array[x+1] = extraDataElective50_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2forElective50(AntArrElective50);
    
    const checkAmountDataElective50 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmountElective50 = checkAmountDataElective50(AntArrInsElective50)
    // console.log(AntArrInsElective50)
    // console.log(checkAmountElective50)
//---------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 50 but less than 100

    //create 1d array for dataset 100
    const array1DElective100 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArrElective100 = array1DElective100(DataArrayElective100);
    
    let extraDataElective100_Slot2_2 = []
    let extraDataElective100_Slot2_1 = []
    let insertedDataElective100_Slot2_2 = []
    let insertedDataElective100_Slot2_1= []
    
    const AntAlgoInsertElective100 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let remainderArray3Slot = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterDataElective100.length;x++){
            test.push(filterDataElective100[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }
                 }else{
                     remainderArray3Slot.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
    
         for(let x = 0 ; x < array.length; x++){
            if(array[x] == 100 && array[x+1] == 100 && array[x+2] == 100){
                if(k3 < remainderArray3Slot.length){
                        array[x] = remainderArray3Slot[k3]
                        array[x+1] = remainderArray3Slot[k3]
                        array[x+2] = remainderArray3Slot[k3]
                }
                k3++   
            }
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective100_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective100_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedDataElective100_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedDataElective100_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedDataElective100_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrInsElective100 = AntAlgoInsertElective100(AntArrElective100);
    
    //console.log(AntArrInsElective100)
    
     const slot2Equal1forElective100 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedDataElective100_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedDataElective100_Slot2_1.length){
                     array[x] = insertedDataElective100_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1forElective100(AntArrElective100);
    
    
     const slot2Equal2forElective100 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedDataElective100_Slot2_2.length){    
                         array[x] = insertedDataElective100_Slot2_2[k]
                         array[x+1] = insertedDataElective100_Slot2_2[k]
    
                 }else{
    
                     if(insertedDataElective100_Slot2_2[k] != undefined){
                         extraDataElective100_Slot2_2.push(insertedDataElective100_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraDataElective100_Slot2_2.length){
                     array[x] = extraDataElective100_Slot2_2[k]
                     array[x+1] = extraDataElective100_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2forElective100(AntArrElective100);
    
    const checkAmountDataElective100 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmountElective100 = checkAmountDataElective100(AntArrInsElective100)
    // console.log(AntArrInsElective100)
    // console.log(checkAmountElective100)
//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 100 but less than 200

    //create 1d array for dataset 200
    const array1DElective200 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArrElective200 = array1DElective200(DataArrayElective200);
    
    let extraDataElective200_Slot2_2 = []
    let extraDataElective200_Slot2_1 = []
    let insertedDataElective200_Slot2_2 = []
    let insertedDataElective200_Slot2_1= []
    
    const AntAlgoInsertElective200 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let remainderArray3Slot = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterDataElective200.length;x++){
            test.push(filterDataElective200[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }
                 }else{
                     remainderArray3Slot.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
    
         for(let x = 0 ; x < array.length; x++){
            if(array[x] == 100 && array[x+1] == 100 && array[x+2] == 100){
                if(k3 < remainderArray3Slot.length){
                        array[x] = remainderArray3Slot[k3]
                        array[x+1] = remainderArray3Slot[k3]
                        array[x+2] = remainderArray3Slot[k3]
                }
                k3++   
            }
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective200_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective200_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedDataElective200_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedDataElective200_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedDataElective200_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrInsElective200 = AntAlgoInsertElective200(AntArrElective200);
    
    //console.log(AntArrInsElective200)
    
     const slot2Equal1forElective200 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedDataElective200_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedDataElective200_Slot2_1.length){
                     array[x] = insertedDataElective200_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1forElective200(AntArrElective200);
    
    
     const slot2Equal2forElective200 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedDataElective200_Slot2_2.length){    
                         array[x] = insertedDataElective200_Slot2_2[k]
                         array[x+1] = insertedDataElective200_Slot2_2[k]
    
                 }else{
    
                     if(insertedDataElective200_Slot2_2[k] != undefined){
                         extraDataElective200_Slot2_2.push(insertedDataElective200_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraDataElective200_Slot2_2.length){
                     array[x] = extraDataElective200_Slot2_2[k]
                     array[x+1] = extraDataElective200_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2forElective200(AntArrElective200);
    
    const checkAmountDataElective200 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmountElective200 = checkAmountDataElective200(AntArrInsElective200)
    // console.log(AntArrInsElective200)
    // console.log(checkAmountElective200)


//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// Data is more than or equal to 200 

    //create 1d array for dataset 500
    const array1DElective500 = (data) => {
        var result = []
    
        for(let i = 0; i< data; i++){
            result[i]= 100;
        }
        return result;
    }
    var AntArrElective500 = array1DElective500(DataArrayElective500);
    
    let extraDataElective500_Slot2_2 = []
    let extraDataElective500_Slot2_1 = []
    let insertedDataElective500_Slot2_2 = []
    let insertedDataElective500_Slot2_1= []
    
    const AntAlgoInsertElective500 = (array) => {
        let test = []
        let k = 0;
        let k2 =0
        let k3 =0
    
        let remainderArray = []
        let remainderArraySlot1 = []
        let remainderArray3Slot = []
        let zeroSlot = []
    
        let totalRoom = array.length / 38
    
        for(let x=0; x<filterDataElective500.length;x++){
            test.push(filterDataElective500[x]);
        }
    
         for(let i = array.length-1;i>0;i--){
             if(k < test.length){
             let hourMS = test[k][7]
    
    
             if(hourMS == 4){
                const j = Math.floor(Math.random()*(i+1));
                if(array[i] == 100){
                    if(array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
    
                        const z = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[z];
                                array[i-1] = array[z-1];
                                array[i] = test[k];
                                array[i-1] = test[k];
                            }
                            else if(array[i+1] == 100 ){
                                 array[i] = array[z];
                                 array[i+1] = array[z+1];
                                 array[z] = test[k];
                                 array[z+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    //slot in slot1 = 2
                    else if(array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        
                        const v = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100){
                            //slot in slot1 = 2
                            if(array[i-1] == 100 ){
                                array[i] = array[v];
                                array[i-1] = array[v-1];
                                array[v] = test[k];
                                array[v-1] = test[k];
                            }
                            else if(array[i+1] == 100){
                                 array[i] = array[v];
                                 array[i+1] = array[v+1];
                                 array[v] = test[k];
                                 array[v+1] = test[k];
                            }
                            else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                             }
                         }
                         else{
                             remainderArraySlot1.push(test[k]);
                             zeroSlot.push(test[k]);
                         }
                    }
                    else{
                        remainderArray.push(test[k]);
                        zeroSlot.push(test[k]);
                    }
                }else{
                    remainderArray.push(test[k]);
                    zeroSlot.push(test[k]);
                    
                }
             }
              
             else if(hourMS == 3){
                 if(array[i] == 100){
                     if(array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                         array[i] = test[k];
                         array[i-1] = test[k];
                         array[i+1] = test[k];
                         
                     }
                 }else{
                     remainderArray3Slot.push(test[k]);
                     zeroSlot.push(test[k]);
                     
                 }
                 }
    
              else if(hourMS == 2){
                 if(array[i] == 100){
                     if(array[i-1] == 100 ){
                         array[i] = test[k];
                         array[i-1] = test[k];
                         
                     }else if(array[i+1] == 100){
                         array[i] = test[k];
                         array[i+1] = test[k];
                         
                     }
                     else{
                         remainderArray.push(test[k]);
                         zeroSlot.push(test[k]);
                         
                     }
                 }else{
                     remainderArray.push(test[k]);
                     zeroSlot.push(test[k]);
                 }
                 }
             }
             k++  
         }
    
    
         for(let x = 0 ; x < array.length; x++){
            if(array[x] == 100 && array[x+1] == 100 && array[x+2] == 100){
                if(k3 < remainderArray3Slot.length){
                        array[x] = remainderArray3Slot[k3]
                        array[x+1] = remainderArray3Slot[k3]
                        array[x+2] = remainderArray3Slot[k3]
                }
                k3++   
            }
         }
    
         //fullfill the slot 3
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] == 100){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective500_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }else if(array[x] == 100 && array[x+1] ==100 ){
                 if(k3 < remainderArraySlot1.length){
                         array[x] = remainderArraySlot1[k3]
                         array[x+1] = remainderArraySlot1[k3]
                 }else{
                     if(remainderArraySlot1[k3] != undefined){
                         insertedDataElective500_Slot2_2.push(remainderArraySlot1[k3])
                     }
                 }
                 k3++   
             }
         }
         //console.log(remainderArray);
         for(let x = 0; x< array.length; x++){
                 if(array[x] == 100 && array[x+1] ==100 ){
                     if(k2 < remainderArray.length){
                         array[x] = remainderArray[k2]
                         array[x+1] = remainderArray[k2]
                     }
                     try{
                         let slot2 = remainderArray[k2][10]
                         if(slot2 == 1){
                             insertedDataElective500_Slot2_1.push(remainderArray[k2])
                         }
                         if(slot2 == 2){
                             insertedDataElective500_Slot2_2.push(remainderArray[k2])
                         }
                     }catch{}
                 k2++   
             }
         }
         if(array[-1] != undefined || array[-1] != 0){
             insertedDataElective500_Slot2_1.push(array[-1]);
             // array[-1] = undefined
         }
    
        return array;
    }
    var AntArrInsElective500 = AntAlgoInsertElective500(AntArrElective500);
    
    //console.log(AntArrInsElective500)
    
     const slot2Equal1forElective500 = (array) => {
         let k = 0;
         let test2 = []
         let totalRoom = array.length / 38
         //console.log(insertedDataElective500_Slot2_1)
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100){
                 if(k < insertedDataElective500_Slot2_1.length){
                     array[x] = insertedDataElective500_Slot2_1[k]
                 }
             k++   
             }
         }
         return array;
     }
      slot2Equal1forElective500(AntArrElective500);
    
    
     const slot2Equal2forElective500 = (array) => {
         let k = 0;
         let totalRoom = array.length / 38
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < insertedDataElective500_Slot2_2.length){    
                         array[x] = insertedDataElective500_Slot2_2[k]
                         array[x+1] = insertedDataElective500_Slot2_2[k]
    
                 }else{
    
                     if(insertedDataElective500_Slot2_2[k] != undefined){
                         extraDataElective500_Slot2_2.push(insertedDataElective500_Slot2_2[k])
                     }
                 }
                 k++   
             }
         }
    
    
         for(let x = 0; x< array.length; x++){
             if(array[x] == 100 && array[x+1] ==100){
                 if(k < extraDataElective500_Slot2_2.length){
                     array[x] = extraDataElective500_Slot2_2[k]
                     array[x+1] = extraDataElective500_Slot2_2[k]
                 }
             k++   
             }
         }
    
         return array;
    }
     slot2Equal2forElective500(AntArrElective500);
    
    const checkAmountDataElective500 = (array) => {
        let count = 0
        for(let i = 0; i < array.length; i++){
                if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined){
                    count += 1
                }
        }
        return count
    }
    var checkAmountElective500 = checkAmountDataElective500(AntArrInsElective500)
    // console.log(AntArrInsElective500)
    // console.log(checkAmountElective500)


//---------------------------------------------------------------------------------------------------------------------------------------------




//---------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------

let combineData = []
let combineElectiveData = []

//Combine all dataset
const combine = (data1,data2,data3,data4)  => {
    for(let i = 0; i < data1.length; i++){
        combineData.push(data1[i])
    }
    for(let i = 0; i < data2.length; i++){
        combineData.push(data2[i])
    }
    for(let i = 0; i < data3.length; i++){
        combineData.push(data3[i])
    }
    for(let i = 0; i < data4.length; i++){
        combineData.push(data4[i])
    }
    return combineData;
}
let dataCombine = combine(AntArr50,AntArr100,AntArr200,AntArr500)



//combine elective data
const combineElective = (data1,data2,data3,data4)  => {
    for(let i = 0; i < data1.length; i++){
        combineElectiveData.push(data1[i])
    }
    for(let i = 0; i < data2.length; i++){
        combineElectiveData.push(data2[i])
    }
    for(let i = 0; i < data3.length; i++){
        combineElectiveData.push(data3[i])
    }
    for(let i = 0; i < data4.length; i++){
        combineElectiveData.push(data4[i])
    }
    return combineElectiveData;
}
let dataCombineElective = combineElective(AntArrElective50,AntArrElective100,AntArrElective200,AntArrElective500)
//console.log(dataCombine)
//-----------------------------------------------------------------------------------------------------------------------------------------------
// Hard Constraint 
// H1: No student attend more than one class/ event at the same time
// H2: The room is large enough to accomodate all of the student in attendace while also meeting the requirement 
// H3: At any given time, each room can onle have one course booked
// H4: No student attend class during 12:00 pm -2:00 due to solat jumaat
// H5: One teacher can only teach one class at one time.

//Check for the H1 violation: same group attend more than 1 class at 1 time

const check1Group = (array) => {
   let count =0
   let indexArray = 0
   let totalRoom = array.length / 38
   for(let x= 1 ; x <= totalRoom ; x++){
       indexArray = (x * 37)
   }
   for(let x= 1 ; x <= totalRoom ; x++){
       try{
           //for(let x= 1 ; x <= totalRoom ; x++){
            for(let i = 0; i<array.length ; i++){
               indexArray = (x * 37)
               if(array[i+indexArray] != 100 && array[i+indexArray] != undefined ){
                   try{
                       //if(array[i][6] == array[i+indexArray][6] && array[i+1][6] == array[i+indexArray+1][6] && array[i][5] == array[i+indexArray][5] && array[i+1][5] == array[i+indexArray+1][5]){
                       if(array[i][6] == array[i+indexArray][6] && array[i][5] == array[i+indexArray][5]){
                            try{
                                //console.log(array[i])
                                //console.log(array[i+indexArray])
                                count +=1
                            }catch{}
                       }
                   }catch{}
               }   
           }
       }catch{}
   }
   return count

}

var checkH1_ALL = check1Group(dataCombine)
var checkH1_ALLElective = check1Group(dataCombineElective)
// console.log("H1 All: "+checkH1_ALL)
// console.log("H1 Elective: "+checkH1_ALLElective)
// var checkH1_50 = check1Group(AntArr50)
// console.log("HS1 50: " + checkH1_50);




//Check for the H2 violation: classsroom is large enough to accomodate number of student enroll to that class

const checkRoomQuota = (array) => {
   let count = 0
   return count 
}
var checkH2_ALL = checkRoomQuota(dataCombine)
var checkH2_ALLElective = checkRoomQuota(dataCombineElective)


//Check for the H4 violation: no one attend class during 12:00 - 14:00 due to solat jumaat
const checkSolatJummat = (array) => {
   let count = 0
   return count 
}
var checkH4_ALL = checkSolatJummat(dataCombine)
var checkH4_ALLElective = checkSolatJummat(dataCombineElective)

//Check for the H5 violation: each teacher can teach 1 subject at 1 room at each slot of time

const check1Teacher = (array) => {
   let count =0
   let indexArray = 0
   let totalRoom = array.length / 38
   for(let x= 1 ; x <= totalRoom ; x++){
    indexArray = (x * 38)
       try{
        for(let i = 1; i<array.length ; i++){
               if(array[i+indexArray] != 100 && array[i+indexArray] != undefined ){
                   try{
                       if(array[i][5] == array[i+indexArray][5]){
                           count +=1
                        }
                   }catch{}
               }    
           }
       }catch{}
   }
   return count


}
var checkH5_ALL = check1Teacher(dataCombine)
var checkH5_ALLElective = check1Group(dataCombineElective)
// var checkH5_50 = check1Teacher(AntArr50)
// console.log("HS5 50: " + checkH5_50);
// console.log("H5 All: "+checkH5_ALL)
// console.log("H5 Elective: "+checkH5_ALLElective)



//----------------------------------------------------------------------------------------------------------------------------------------


// Soft Constraint 
// S1: A student has a class schedule toward the end of the day
// S2: A student have more than two class in a row


//Check for the S1 violation: student have class at the end of the day
const checkEndOfClass = (array) => {
   let count =0
   let totalRoom = array.length / 38
   for(let x= 1 ; x <= totalRoom ; x++){
       let indexArray = (x * 37)
       if(array[indexArray] != 100 ){
           count = 1
       }
   }
   return count

}
var checkS1_50 = checkEndOfClass(AntArr50)
var checkS1_100 = checkEndOfClass(AntArr100)
var checkS1_200 = checkEndOfClass(AntArr200)
var checkS1_500 = checkEndOfClass(AntArr500)
var checkS1_Elective50 = checkEndOfClass(AntArrElective50)
var checkS1_Elective100 = checkEndOfClass(AntArrElective100)
var checkS1_Elective200 = checkEndOfClass(AntArrElective200)
var checkS1_Elective500 = checkEndOfClass(AntArrElective500)


//Check for the S2 violation: teacher have 2 class in a row

const check2ClassInARow = (array) => {
   let count =0
   for(let i = 0; i < array.length; i++){
       try{
        if(array[i][5] != undefined && array[i+3][5] != undefined && array[i+2][5] != undefined && array[i+4][5] != undefined){
            if(array[i][5] == array[i+3][5] && array[i+2][5] == array[i+4][5]){
                count = 1
            }
       }
       }catch{}
   }
   return count

}
var checkS2_50 = check2ClassInARow(AntArr50)
var checkS2_100 = check2ClassInARow(AntArr100)
var checkS2_200 = check2ClassInARow(AntArr200)
var checkS2_500 = check2ClassInARow(AntArr500)
var checkS2_Elective50 = check2ClassInARow(AntArrElective50)
var checkS2_Elective100 = check2ClassInARow(AntArrElective100)
var checkS2_Elective200 = check2ClassInARow(AntArrElective200)
var checkS2_Elective500 = check2ClassInARow(AntArrElective500)


//----------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------

//Check total Hard Constraint

const checkTotalHardContraint = () => {
   let count =0
   let totalH1 = checkH1_ALL
   let totalH2 = checkH2_ALL
   let totalH4 = checkH4_ALL
   let totalH5 = checkH5_ALL

   let totalH1_Elective = checkH1_ALLElective
   let totalH2_Elective = checkH2_ALLElective
   let totalH4_Elective = checkH4_ALLElective
   let totalH5_Elective = checkH5_ALLElective
   let totalHC1 = totalH1 + totalH1_Elective
   let totalHC2 = totalH2 + totalH2_Elective 
   let totalHC4 = totalH4 + totalH4_Elective 
   let totalHC5 = totalH5 + totalH5_Elective
   //let totalHC = totalH1 + totalH2 + totalH4 + totalH5 

   if( totalHC1 != 0){
       count +=1
   }   
   if( totalHC2 != 0){
       count +=1
   }
   if( totalHC4 != 0){
       count +=1
   }
   if( totalHC5 != 0){
       count +=1
   }

   return count
}
var checkTotalHardContraints = checkTotalHardContraint()
//console.log("Total Hard Constraint: "+checkTotalHardContraints)


//----------------------------------------------------------------------------------------------------------------------------------------




//-----------------------------------------------------------------------------------------------------------------------------------------------

const checkTotalSoftContraint = () => {
    let count =0
    let totalS1 = checkS1_50 + checkS1_100 + checkS1_200 + checkS1_500 + checkS1_Elective50 + checkS1_Elective100 + checkS1_Elective200 + checkS1_Elective500
    let totalS2 = checkS2_50 + checkS2_100 + checkS2_200 + checkS2_500 + checkS2_Elective50 + checkS2_Elective100 + checkS2_Elective200 + checkS2_Elective500
    
    if(totalS1 != 0){
        count +=1
    }
    if(totalS2 != 0){
        count +=1
    }   
    return count
}
var checkTotalSoftContraints = checkTotalSoftContraint()
//console.log("Total Soft Constraint: "+checkTotalSoftContraints)
//----------------------------------------------------------------------------------------------------------------------------------------------

const change100ToEmpty = (data) => {
    for(let i = 0; i< data.length; i++){
        if(data[i] == 100){
            data[i] = [];
        }
    }
    return data;
}
let finalData = change100ToEmpty(combineData)

const change100ToEmptyElective = (data) => {
    for(let i = 0; i< data.length; i++){
        if(data[i] == 100){
            data[i] = [];
        }
    }
    return data;
}
let finalDataElective = change100ToEmptyElective(combineElectiveData)


const checkMissingData = (data50,data100,data200,data500,dataE50,dataE100,dataE200,dataE500) => {
    let countData = []
    for(let i = 0; i< courseData[0].length;i++){
        for(let j = 0; j <courseData[0][i][7]; j++){
            countData.push(courseData[0][i]);
        }
    }

    let totalGenerateScheduleData = data50 + data100 + data200 + data500 + dataE50 + dataE100 + dataE200 + dataE500

    if(countData.length == totalGenerateScheduleData){
  
    }else{

    }
}
checkMissingData(checkAmount50,checkAmount100,checkAmount200,checkAmount500,checkAmountElective50,checkAmountElective100,checkAmountElective200,checkAmountElective500)


checkTotalHardContraintsAll = checkTotalHardContraints
checkTotalSoftContraintsAll = checkTotalSoftContraints
finalDataAll.push(finalData)
finalDataAllElective.push(finalDataElective)
return {checkTotalHardContraints,checkTotalSoftContraints,finalData,finalDataAllElective}
}
let antSystemAlgo = antSystem();
// -------------------------------------------------------------------------------------------------------------------------------------------

let trigger = 0

 var t0 = performance.now()
var start = new Date().getTime();
const iteration = () => {
        antSystem()
        let globalBestHS = checkTotalHardContraintsAll 
        let globalBestSS = checkTotalSoftContraintsAll
        let globalBestScehdule = finalDataAll[0]
        let globalBestScehduleElective = finalDataAllElective[0]
    for(let i= 1; i <= 500; i++){
        antSystem()
        let localBestHS = checkTotalHardContraintsAll 
        let localBestSS = checkTotalSoftContraintsAll
        let localBestScehdule = finalDataAll[0]
        let localBestScehduleElective = finalDataAllElective[0]
            console.log("iteraion: " + i)
            if(globalBestHS > localBestHS ){
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                globalBestScehduleElective = localBestScehduleElective
            }
            if(localBestHS == 0){
                console.log("iteraion: " + i)
                console.log("workable solution is found")
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                globalBestScehduleElective = localBestScehduleElective
                console.log("Workable Gloabal best HS: "+globalBestHS)
                console.log("Workable Gloabal best SS: " +globalBestSS)
                //console.log(finalDataAll[0])
                trigger = 1
                //return [finalDataAll[0], finalDataAllElective[0]]
            }
            else if(localBestHS == 0 && localBestSS == 0){
                console.log("iteraion: " + i)
                console.log("perfect solution is found")
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                console.log("Perfect Gloabal best HS: "+globalBestHS)
                console.log("Perfect Gloabal best SS: " +globalBestSS)
                console.log(finalDataAll[0])
                trigger = 1
                //return [finalDataAll[0], finalDataAllElective[0]]
            }
    }
    return [finalDataAll[0], finalDataAllElective[0]]
}
let interations = iteration()


if(trigger == 1){
    var t1 = performance.now()
    console.log("Duration: " + (t1-t0))
    alert("workable solution found")
}else{
    var t1 = performance.now()
    console.log("Duration: " + (t1-t0) + " milliseconds" )
    // var end = new Date().getTime();
    // var time = end - start;
    // console.log('Execution time: ' + time + " second");
    //alert("no workable solution found, please refersh until get workable solution")
}


//----------------------------------------------------------------------------------------------------------------------------------------

        }
    return(
        <React.Fragment>
            <h1>
                Generate Schedule Page Heuristic Approach 
            </h1>

        </React.Fragment>
    );
}


export default HeuristicApproach;


//result[i][j]=Course.splice(Math.floor(Math.random()* Course.length),1)[0] // create random placement of Course Value
//const Schedule = new Array(10).fill(Array(5).fill(null));
//console.log(Schedule);
// const Course = [['TE1',4],['TE1',4],['TE1',4],['TE1',3],['TE1',4],['TE1',2],['TE1',4],['TE1',4],['TE1',4],['TE1',3]];
//const Course = [['TE1',2],['TE2',2],['TE3',3],['TE4',4],['TE5',3],['TE6',4],['TE7',4],['TE8',2],['TE9',4]];
//const Course = ['TE1','TE2','TE3','TE4','TE5','TE6','TE7','TE8','TE9'];