import { concat, create, find, forEach, indexOf } from "lodash";
import React,{ useEffect,useState, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from 'lodash';
import { CSVLink } from "react-csv";
import LoadingSpinner from "../Modal/LoadingSpinner";


let finalDataAll = [];
let finalDataAllElective = [];
let checkHardConstraintOutsite = 0;
let checkSoftConstraintOutsite = 0;

const ArraySchedule = (props) => {


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
            courseData[0].pop()

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
            let combineArray = DataArray50 + DataArray100 + DataArray200 + DataArray500

            let startIndex100 = DataArray50-1
            let startIndex200 = DataArray50+ DataArray100-1
            let startIndex500 = DataArray50 +DataArray100+DataArray200-1

            let DataArrayElective50 = roomUnder50.length * 10;
            let DataArrayElective100 = roomUnder100.length * 10;
            let DataArrayElective200 = roomUnder200.length * 10;
            let DataArrayElective500 = roomUnder500.length * 10;
            let combineArrayElective = DataArrayElective50 + DataArrayElective100 + DataArrayElective200 + DataArrayElective500

//----------------------------------------------------------------------------------------------------------------------------------------

var checkTotalHardContraintsAll = 0
var checkTotalSoftContraintsAll = 0

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const antSystem = () => {

//______________________________________________________________________________________________________________________________________________
//Faculty courses

const checking_minus_1 = (array,array2,data) => {
    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            //if( array[u] != 100 && array[u][5] == data[5] && array[u-1] != 100 && array[u-1][5] == data[5]){
            if(array[u] != 100 && data[5] != array[u][5] || data[6] == array[u][6] && array[u-1] != 100 && data[5] == array[u-1][5] || data[6] == array[u-1][6]){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 && array[u+indexArray-1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray-1] = 0
                    }
                    if( array[u-indexArray] ==100 && array[u-indexArray-1] ==100){
                        array[u-indexArray] = 0
                        array[u-indexArray-1] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            //if( array2[u] != 100 && array2[u][5] == data[5] && array2[u-1] != 100 && array2[u-1][5] == data[5]){
            if(array2[u] != 100 && data[5] != array2[u][5] || data[6] == array2[u][6] && array2[u-1] != 100 && data[5] == array2[u-1][5] || data[6] == array2[u-1][6]){
                for(let b =0; b < totalRoom; b++){
                    let indexArray2 = b*38
                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2-1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2-1] = 0
                    }
                    if( array2[u-indexArray2] ==100 && array2[u-indexArray2-1] ==100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2-1] = 0
                    }
                }
            }
        }catch{}
    }
    return array


}

const checking_plus_1 = (array,array2,data) => {

    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            //if( array[u] != 100 && array[u][5] == data[5] && array[u+1] != 100 && array[u+1][5] == data[5]){
            if( array[u] != 100 && data[5] == array[u][5] || data[6] == array[u][6] && array[u+1] != 100 && data[5] == array[u+1][5] || data[6] == array[u+1][6]){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 && array[u+indexArray+1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray+1] = 0
                    }
                    if( array[u-indexArray] ==100 && array[u-indexArray+1] ==100){
                        array[u-indexArray] = 0
                        array[u-indexArray+1] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            //if( array2[u] != 100 && array2[u][5] == data[5] && array2[u+1] != 100 && array2[u+1][5] == data[5]){
            if( array2[u] != 100 && data[5] == array2[u][5] || data[6] == array2[u][6] && array2[u+1] != 100 && data[5] == array2[u+1][5] || data[6] == array2[u+1][6]){
                for(let b =0; b < totalRoom; b++){
                    let indexArray2 = b*38
                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2+1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2+1] = 0
                    }
                    if( array2[u-indexArray2] ==100 && array2[u-indexArray2+1] ==100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2+1] = 0
                    }
                }
            }
        }catch{}
    }
    return array
}

const checking_3 = (array,array2,data) =>{


    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            //if( array[u] != 100 && array[u][5] == data[5] && array[u-1] != 100 && array[u-1][5] == data[5] && array[u+1] != 100 && array[u+1][5] == data[5]){
            if( array[u] != 100 && data[5] == array[u][5] || data[6] == array[u][6]  && array[u-1] != 100 && data[5] == array[u-1][5] && array[u+1] != 100 && data[5] == array[u+1][5] || data[6] == array[u-1][6] && array[u+1] != 100 && data[6] == array[u+1][6]){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38

                    if( array[u+indexArray] ==100 && array[u+indexArray-1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray-1] = 0
                    }
                    if( array[u-indexArray] ==100 && array[u-indexArray-1] ==100){
                        array[u-indexArray] = 0
                        array[u-indexArray-1] = 0
                    }
                    if( array[u+indexArray] ==100 && array[u+indexArray+1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray+1] = 0
                    }
                    if( array[u-indexArray] ==100 && array[u-indexArray+1] ==100){
                        array[u-indexArray] = 0
                        array[u-indexArray+1] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            //if( array2[u] != 100 && array2[u][5] == data[5] && array2[u-1] != 100 && array2[u-1][5] == data[5] && array2[u+1] != 100 && array2[u+1][5] == data[5]){
            if( array2[u] != 100 && data[5] == array2[u][5] || data[6] == array2[u][6]  && array2[u-1] != 100 && data[5] == array2[u-1][5] && array2[u+1] != 100 && data[5] == array2[u+1][5] || data[6] == array2[u-1][6] && array2[u+1] != 100 && data[6] == array2[u+1][6]){
                for(let b =0; b < totalRoom2; b++){
                    let indexArray2 = b*38

                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2-1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2-1] = 0
                    }
                    if( array2[u-indexArray2] ==100 && array2[u-indexArray2-1] ==100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2-1] = 0
                    }
                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2+1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2+1] = 0
                    }
                    if( array2[u-indexArray2] ==100 && array2[u-indexArray2+1] ==100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2+1] = 0
                    }
                }
            }
        }catch{}
    }
    return array
}

const checking_only_1 = (array,array2,data) => {

    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            if( array[u] != 100 && data[5] == array[u][5] || data[6] == array[u][6]){
                for(let b =0; b < totalRoom; b++){
                    if( array[u+38*b] ==100){
                        array[u+38*b] = 0
                    }
                }
            }
        }catch{}
    }
    for(let u = 0; u < array2.length; u++){
        try{
            if( array2[u] != 100 && data[5] == array2[u][5] || data[6] == array2[u][6]){
                for(let b =0; b < totalRoom2; b++){
                    if( array2[u+38*b] ==100){
                        array2[u+38*b] = 0
                    }
                }
            }
        }catch{}
    }
    return array

}

const changeRowtoZero_minus_1 = (array,array2,index1,index2) => {
    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            if( u == index1 && u-1 == index2){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 && array[u+indexArray-1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray-1] = 0
                    }
                    if( array[u-indexArray]==100 && array[u-indexArray-1] == 100){
                        array[u-indexArray] = 0
                        array[u-indexArray-1] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            if( u == index1 && u-1 == index2){
                for(let b =0; b < totalRoom2; b++){
                    let indexArray2 = b*38
                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2-1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2-1] = 0
                    }
                    if( array2[u-indexArray2]==100 && array2[u-indexArray2-1] == 100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2-1] = 0
                    }
                }
            }
        }catch{}
    }
    return array    
}

const changeRowtoZero_plus_1 = (array,array2,index1,index2) => {
    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            if( u == index1 && u-1 == index2){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 && array[u+indexArray+1] ==100){
                        array[u+indexArray] = 0
                        array[u+indexArray+1] = 0
                    }
                    if( array[u-indexArray]==100 && array[u-indexArray+1] == 100){
                        array[u-indexArray] = 0
                        array[u-indexArray+1] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            if( u == index1 && u-1 == index2){
                for(let b =0; b < totalRoom2; b++){
                    let indexArray2 = b*38
                    if( array2[u+indexArray2] ==100 && array2[u+indexArray2+1] ==100){
                        array2[u+indexArray2] = 0
                        array2[u+indexArray2+1] = 0
                    }
                    if( array2[u-indexArray2]==100 && array2[u-indexArray2+1] == 100){
                        array2[u-indexArray2] = 0
                        array2[u-indexArray2+1] = 0
                    }
                }
            }
        }catch{}
    }
    return array    
}

const changeRowtoZero_1 = (array,array2,index1) => {
    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            if( u == index1){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 ){
                        array[u+indexArray] = 0
                    }
                    if( array[u-indexArray] ==100 ){
                        array[u-indexArray] = 0
                    }
                }
            }
        }catch{}
    }

    for(let u = 0; u < array2.length; u++){
        try{
            if( u == index1){
                for(let b =0; b < totalRoom2; b++){
                    let indexArray2 = b*38
                    if( array2[u+indexArray2] ==100 ){
                        array2[u+indexArray2] = 0
                    }
                    if( array2[u-indexArray2] ==100 ){
                        array2[u-indexArray2] = 0
                    }
                }
            }
        }catch{}
    }
    return array    
}

const changeRowtoZero_3_ = (array,array2,index1,index2,index3) => {
    let k =0
    let b =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let u = 0; u < array.length; u++){
        try{
            if( u == index1 && u-1 == index2 && u+1 == index3){
                for(let b =0; b < totalRoom; b++){
                    let indexArray = b*38
                    if( array[u+indexArray] ==100 && array[u+indexArray-1] ==100  && array[u+indexArray+1] == 100 ){
                        array[u+indexArray] = 0
                        array[u+indexArray-1] = 0
                        array[u+indexArray+1] = 0
                    }
                    if( array[u-indexArray] ==100 && array[u-indexArray-1] ==100  && array[u-indexArray+1] == 100){
                        array[u-indexArray] = 0
                        array[u-indexArray-1] = 0
                        array[u-indexArray+1] = 0
                    }
                }
            }
        }catch{}
    }


    for(let u = 0; u < array2.length; u++){
        try{
            if( u == index1 && u-1 == index2 && u+1 == index3){
                for(let b =0; b < totalRoom2; b++){
                    let indexArray = b*38
                    if( array2[u+indexArray] ==100 && array2[u+indexArray-1] ==100  && array2[u+indexArray+1] == 100 ){
                        array2[u+indexArray] = 0
                        array2[u+indexArray-1] = 0
                        array2[u+indexArray+1] = 0
                    }
                    if( array2[u-indexArray] ==100 && array2[u-indexArray-1] ==100  && array2[u-indexArray+1] == 100){
                        array2[u-indexArray] = 0
                        array2[u-indexArray-1] = 0
                        array2[u-indexArray+1] = 0
                    }
                }
            }
        }catch{}
    }
    return array    
}

const changeToZero = (array) => {
    for(let i = 0; i < array.length; i++){
        if(array[i] == 0){
            array[i] = 100
        }
    }
    return array;
}


const checkTest = (array,array2,data1) => {
    let count =0
    let totalRoom = array.length / 38
    let totalRoom2 = array2.length / 38

    for(let x= 1 ; x <= totalRoom ; x++){
     let indexArray = (x * 38)
        try{
         for(let i = 1; i<array.length ; i++){
                //if(array[i+indexArray] != 100 && array[i+indexArray] != undefined && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                    try{
                        if(data1 == array[i][5]){
                            if(array[i+indexArray] == 100){
                                array[i+indexArray] = 0
                            }

                         }
                    }catch{}
                //}    
            }
        }catch{}
    }

    for(let x= 1 ; x <= totalRoom2 ; x++){
        let indexArray2 = (x * 38)
           try{
            for(let i = 1; i<array2.length ; i++){
                   //if(array2[i+indexArray2] != 100 && array2[i+indexArray2] != undefined && array2[i+indexArray2] != 1 && array2[i+indexArray2] != 0 ){
                       try{
                           if(data1 == array2[i][5]){
                               if(array2[i+indexArray2] == 100){
                                   array2[i+indexArray2] = 0
                               }
   
                            }
                       }catch{}
                   //}    
               }
           }catch{}
       }
    return array
}



const array1DCombine = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrCombine = array1DCombine(combineArray);


//create 1d array for dataset less than 50
const array1D50 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr50 = array1D50(DataArray50);

let insertedData50_Slot2_2 = []
let insertedData50_Slot2_1= []

let arrayLength50 =  DataArray50
const AntAlgoInsert50 = (array,combine) => {

    //array.length = 1064 (last index = 1063)
    //arrayLength50 = 646 (last index = 645)


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4=0
    let k5 =0
    let count = 0;
    let b = 1

    
    let remainderArray = []
    let remainderArraySlot1 = []
    let totalRoom = array.length / 38


        for(let x=0; x<filterData50.length;x++){
            test.push(filterData50[x]);
        }

        for(let i = array.length-1;i>0;i--){
            if(k < test.length){
            let hourMS = test[k][7]    
            changeToZero(array);
            changeToZero(combine);

            if(hourMS == 2){
                const j = Math.floor(Math.random()*(i+1));
                checking_minus_1(combine,array,test[k])
                checking_plus_1(combine,array,test[k])
                if(array[i] == 100 && array[i-1] == 100){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j] = test[k];
                        combine[j-1] = test[k];
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                 }
                 else if(array[i] == 100 && array[i+1] == 100){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j] = test[k];
                        combine[j+1] = test[k];
                        changeRowtoZero_plus_1(combine,i,i+1)
                }
                else{
                    remainderArray.push(test[k]);
                }

            }
            }
            k++  
        }


        for(let i = array.length-1;i>0;i--){
            if(k4 < test.length){
            let hourMS = test[k4][7]    
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 4){
                checking_minus_1(combine,array,test[k4]);
                checking_plus_1(combine,array,test[k4])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k4];
                        array[j-1] = test[k4];
                        combine[j] = test[k4];
                        combine[j-1] = test[k4];

                        

                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j] = test[k4];
                            combine[j-1] = test[k4];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j] = test[k4];
                            combine[j+1] = test[k4];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k4];
                        array[j+1] = test[k4];
                        combine[j] = test[k4];
                        combine[j+1] = test[k4];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j] = test[k4];
                            combine[j-1] = test[k4];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j] = test[k4];
                            combine[j+1] = test[k4];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                    }
                    else{
                        remainderArray.push(test[k4]);
                    }

            }

            changeToZero(array);
            changeToZero(combine);
            }
            k4++  
        }

        for(let i = array.length-1;i>0;i--){
            if(k5 < test.length){
            let hourMS = test[k5][7]    
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 3){
                const j = Math.floor(Math.random()*(i+1)); 

                    checking_3(combine,array,test[k5]);
                    if( array[i] == 100 && array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        array[j+1] = test[k5];
                        combine[j] = test[k5];
                        combine[j-1] = test[k5];
                        combine[j+1] = test[k5];
                        changeRowtoZero_3_(combine,array,i,i-1,i+1)
                    }else if(array[i] == 100 && array[i-1] == 100){//slot 2 hours in 1 go
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        combine[j] = test[k5];
                        combine[j-1] = test[k5];
                        insertedData50_Slot2_1.push(test[k5])
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                    }else if(array[i] == 100 && array[i+1] == 100){//slot 2 hours in 1 go
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j+1] = test[k5];
                        combine[j] = test[k5];
                        combine[j+1] = test[k5];
                        insertedData50_Slot2_1.push(test[k5])
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                    }else if(array[i] == 100 ){//slot 1 hours in 1 go
                        array[i] = array[j];
                        array[j] = test[k5];
                        combine[j] = test[k5];
                        changeRowtoZero_1(combine,array,i)
                        remainderArraySlot1.push(test[k5])
                    }
            }

            changeToZero(array);
            changeToZero(combine);
            }
            k5++  
        }


 //changeToZero(array) 

 //fullfill the slot 3
 for(let x = 0; x< array.length; x++){
    if(k3 < remainderArraySlot1.length){                
        checking_plus_1(combine,array,remainderArraySlot1[k3])
        if(array[x] == 100 && array[x+1] ==100){
            array[x] = remainderArraySlot1[k3]
            array[x+1] = remainderArraySlot1[k3]
            combine[x] = remainderArraySlot1[k3]
            combine[x+1] = remainderArraySlot1[k3]
            changeRowtoZero_plus_1(combine,array,x,x+1)
        }else{insertedData50_Slot2_2.push(remainderArraySlot1[k3])}
     }
     k3++   
 }
 changeToZero(array);
 changeToZero(combine);

 
 for(let x = 0; x< array.length; x++){
    if(k2 < remainderArray.length){
        //checkTest(AntArr50,remainderArray[k2])
        checking_plus_1(combine,array,remainderArray[k2])
         if(array[x] == 100 && array[x+1] ==100){
             //if(k2 < remainderArray.length){
                //changeRowtoZero_plus_1(array,remainderArraySlot1[k2])
                 array[x] = remainderArray[k2]
                 array[x+1] = remainderArray[k2]
                 combine[x] = remainderArray[k2]
                 combine[x+1] = remainderArray[k2]
                 changeRowtoZero_plus_1(combine,array,x,x+1)
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
     }
     k2++   
 }
  changeToZero(array)
  changeToZero(combine)


 if(array[-1] != undefined){
     insertedData50_Slot2_1.push(array[-1]);
 }

    return array;
}

//var AntArrIns50 = AntAlgoInsert50(AntArr50);
var AntArrIns50 = AntAlgoInsert50(AntArr50,AntArrCombine);
//console.log(AntArrIns50);

 const slot2Equal1for50= (array,combine) => {
     let k = 0;
     let test2 = []
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
            if(array[x] == 100){
                if(k < insertedData50_Slot2_1.length){
                    checking_only_1(combine,array,insertedData50_Slot2_1[k])
                    array[x] = insertedData50_Slot2_1[k]
                    combine[x] = insertedData50_Slot2_1[k]
                }
                k++   
         }
     }
     changeToZero(array)
     changeToZero(combine)
     return array;
 }
slot2Equal1for50(AntArr50,AntArrCombine);



 const slot2Equal2for50 = (array,combine) => {
     let k = 0;
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
         if(array[x] == 100 && array[x+1] ==100){
            if(k < insertedData50_Slot2_2.length){
                checking_plus_1(combine,array,insertedData50_Slot2_2[k])
                 array[x] = insertedData50_Slot2_2[k]
                 array[x+1] = insertedData50_Slot2_2[k]
                 combine[x] = insertedData50_Slot2_2[k]
                 combine[x+1] = insertedData50_Slot2_2[k]
             }
             k++
         }
     }
     changeToZero(array)
     changeToZero(combine)

     if(array[-1] != undefined){
         insertedData50_Slot2_1.push(array[-1]);
     }

     return array;
 }
 slot2Equal2for50(AntArr50,AntArrCombine);
 //slot2Equal2for50(AntArrCombine);

const checkAmountData50_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
//var checkAmount_2 = checkAmountData50_2(AntArrIns50)
var checkAmount_2 = checkAmountData50_2(AntArrIns50)
//console.log(AntArrIns50)
//console.log("Amount of data: " +checkAmount_2);

const checkAmountData50_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 //var checkAmount_0 = checkAmountData50_0(AntArr50)
 var checkAmount_0 = checkAmountData50_0(AntArr50)
//console.log("zero counter: "+checkAmount_0);

//______________________________________________________________________________________________________________________________________________

//create 1d array for dataset less than 100


//create 1d array for dataset less than 100


//create 1d array for dataset less than 100
const array1D100 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr100 = array1D100(DataArray100);

let insertedData100_Slot2_2 = []
let insertedData100_Slot2_1= []

let arrayLength100 =  DataArray100
const AntAlgoInsert100 = (array,combine) => {

    //array.length = 1064 (last index = 1063)
    //array.length = 646 (last index = 645)


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4=0
    let k5 =0
    let count = 0;
    let b = 1

    
    let remainderArray = []
    let remainderArraySlot1 = []
    let totalRoom = array.length / 38


    for(let x=0; x<filterData100.length;x++){
        test.push(filterData100[x]);
    }

        //for(let i = array.length-1;i>0;i--){
        for(let i = array.length-1;i>0;i--){
            if(k < test.length){
            let hourMS = test[k][7]    
            //checkTest(AntArr100,test[k])
            changeToZero(array);
            changeToZero(combine);
            if(hourMS == 2){
                //changeToZero(array)
                const j = Math.floor(Math.random()*(i+1));
                // checking_minus_1(array,test[k])
                // checking_plus_1(array,test[k])
                checking_minus_1(combine,array,test[k])
                checking_plus_1(combine,array,test[k])
                //checking_only_1(array,test[k])
                //checkTest(AntArr100,test[k])
                if(array[i] == 100 && array[i-1] == 100){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100-1] = test[k];
                        //changeRowtoZero_minus_1(array,i,i-1)
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                        //checking_minus_1(array,test[k])
                 }
                 else if(array[i] == 100 && array[i+1] == 100){
                        //checking_plus_1(array,test[k])
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100+1] = test[k];
                        //changeRowtoZero_plus_1(array,i,i+1)
                        changeRowtoZero_plus_1(combine,i,i+1)
                        //checking_plus_1(array,test[k])
                }
                else{
                    remainderArray.push(test[k]);
                }

            }

            // changeToZero(array);
            // changeToZero(combine);
            }
            k++  
        }


        for(let i = array.length-1;i>0;i--){
            if(k4 < test.length){
            let hourMS = test[k4][7]    
            //checkTest(AntArr100,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 4){
                // checking_minus_1(array,test[k]);
                checking_minus_1(combine,array,test[k4]);
                checking_plus_1(combine,array,test[k4])
                //checking_only_1(array,test[k])
                //checkTest(AntArr100,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k4];
                        array[j-1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100-1] = test[k4];

                        
    
                        //const j = Math.floor(Math.random()*(i+1));
                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,j,j-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                        //count += 1
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k4];
                        array[j+1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100+1] = test[k4];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        //const j = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100 && array[i-1] == 100){
                        //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,i,i-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                    }
                    else{
                        remainderArray.push(test[k4]);
                    }

            }

            changeToZero(array);
            changeToZero(combine);
            }
            k4++  
        }

        for(let i = array.length-1;i>0;i--){
            if(k5 < test.length){
            let hourMS = test[k5][7]    
            //checkTest(AntArr100,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 3){
                const j = Math.floor(Math.random()*(i+1)); 

                    checking_3(combine,array,test[k5]);
                    //checking_only_1(array,test[k])
                    //checkTest(AntArr100,test[k])
                    if( array[i] == 100 && array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                        //checking_3(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        changeRowtoZero_3_(combine,array,i,i-1,i+1)
                    }else if(array[i] == 100 && array[i-1] == 100){//slot 2 hours in 1 go
                        //checking_minus_1(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        insertedData100_Slot2_1.push(test[k5])
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                    }else if(array[i] == 100 && array[i+1] == 100){//slot 2 hours in 1 go
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        insertedData100_Slot2_1.push(test[k5])
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                    }else if(array[i] == 100 ){//slot 1 hours in 1 go
                        //checking_only_1(array,test[k]);
                        array[i] = array[j];
                        array[j] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        changeRowtoZero_1(combine,array,i)
                        remainderArraySlot1.push(test[k5])
                    }
            }

            changeToZero(array);
            changeToZero(combine);
            }
            k5++  
        }


 //changeToZero(array) 

 //fullfill the slot 3
 for(let x = 0; x< array.length; x++){
    if(k3 < remainderArraySlot1.length){                
        //checking_only_1(array, remainderArraySlot1[k3])
        //checkTest(AntArr100,remainderArraySlot1[k3])
        checking_plus_1(combine,array,remainderArraySlot1[k3])
        if(array[x] == 100 && array[x+1] ==100){
            //changeRowtoZero_plus_1(array,remainderArraySlot1[k3])
            array[x] = remainderArraySlot1[k3]
            array[x+1] = remainderArraySlot1[k3]
            combine[x+startIndex100] = remainderArraySlot1[k3]
            combine[x+startIndex100+1] = remainderArraySlot1[k3]
            changeRowtoZero_plus_1(combine,array,x,x+1)
        }else{insertedData100_Slot2_2.push(remainderArraySlot1[k3])}
     }
     k3++   
 }
 changeToZero(array);
 changeToZero(combine);

 
 for(let x = 0; x< array.length; x++){
    if(k2 < remainderArray.length){
        //checkTest(AntArr100,remainderArray[k2])
        checking_plus_1(combine,array,remainderArray[k2])
         if(array[x] == 100 && array[x+1] ==100){
             //if(k2 < remainderArray.length){
                //changeRowtoZero_plus_1(array,remainderArraySlot1[k2])
                 array[x] = remainderArray[k2]
                 array[x+1] = remainderArray[k2]
                 combine[x+startIndex100] = remainderArray[k2]
                 combine[x+startIndex100+1] = remainderArray[k2]
                 changeRowtoZero_plus_1(combine,array,x,x+1)
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
     }
     k2++   
 }
  changeToZero(array)
  changeToZero(combine)

//  for(let i = 0; i < array.length; i++){
//     if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
//         count += 1
//     }
// }
//console.log(count);

 if(array[-1] != undefined){
     insertedData100_Slot2_1.push(array[-1]);
 }

    return array;
}

//var AntArrIns100 = AntAlgoInsert100(AntArr100);
var AntArrIns100 = AntAlgoInsert100(AntArr100,AntArrCombine);
//console.log(AntArrIns100);

 const slot2Equal1for100= (array,combine) => {
     let k = 0;
     let test2 = []
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
            if(array[x] == 100){
                if(k < insertedData100_Slot2_1.length){
                    checking_only_1(combine,array,insertedData100_Slot2_1[k])
                    array[x] = insertedData100_Slot2_1[k]
                    combine[x+startIndex100] = insertedData100_Slot2_1[k]
                //changeRowtoZero_1(array,x)
                }
                k++   
         }
     }
     changeToZero(array)
     changeToZero(combine)
     return array;
 }
slot2Equal1for100(AntArr100,AntArrCombine);
//slot2Equal1for100(AntArrCombine);


 const slot2Equal2for100 = (array,combine) => {
     let k = 0;
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
         if(array[x] == 100 && array[x+1] ==100){
            if(k < insertedData100_Slot2_2.length){
                //checking_only_1(array,insertedData100_Slot2_2[k])
                //checkTest(AntArr100,insertedData100_Slot2_2[k])
                checking_plus_1(combine,array,insertedData100_Slot2_2[k])
                 array[x] = insertedData100_Slot2_2[k]
                 array[x+1] = insertedData100_Slot2_2[k]
                 combine[x+startIndex100] = insertedData100_Slot2_2[k]
                 combine[x+startIndex100+1] = insertedData100_Slot2_2[k]
                 //changeRowtoZero_plus_1(array,x,x+1)
             }
             k++
         }
     }
     changeToZero(array)
     changeToZero(combine)

     if(array[-1] != undefined){
         insertedData100_Slot2_1.push(array[-1]);
     }

     return array;
 }
 slot2Equal2for100(AntArr100,AntArrCombine);
 //slot2Equal2for100(AntArrCombine);

const checkAmountData100_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
//var checkAmount_2 = checkAmountData100_2(AntArrIns100)
var checkAmount_2 = checkAmountData100_2(AntArrIns100)
//console.log(AntArrIns100)
//console.log("Amount of data: " +checkAmount_2);

const checkAmountData100_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 //var checkAmount_0 = checkAmountData100_0(AntArr100)
 var checkAmount_0 = checkAmountData100_0(AntArr100)
//console.log("zero counter: "+checkAmount_0);

// _____________________________________________________________________________________________________________________________________________________

const array1D200 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr200 = array1D200(DataArray200);

let insertedData200_Slot2_2 = []
let insertedData200_Slot2_1= []

let arrayLength200 =  DataArray200
const AntAlgoInsert200 = (array,combine) => {

    //array.length = 1064 (last index = 1063)
    //array.length = 646 (last index = 645)


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4=0
    let k5 =0
    let count = 0;
    let b = 1

    
    let remainderArray = []
    let remainderArraySlot1 = []
    let totalRoom = array.length / 38


    for(let x=0; x<filterData200.length;x++){
        test.push(filterData200[x]);
    }

        //for(let i = array.length-1;i>0;i--){
        for(let i = array.length-1;i>0;i--){
            if(k < test.length){
            let hourMS = test[k][7]    
            //checkTest(AntArr200,test[k])
            changeToZero(array);
            changeToZero(combine);
            if(hourMS == 2){
                //changeToZero(array)
                const j = Math.floor(Math.random()*(i+1));
                // checking_minus_1(array,test[k])
                // checking_plus_1(array,test[k])
                checking_minus_1(combine,array,test[k])
                checking_plus_1(combine,array,test[k])
                //checking_only_1(array,test[k])
                //checkTest(AntArr200,test[k])
                if(array[i] == 100 && array[i-1] == 100){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100-1] = test[k];
                        //changeRowtoZero_minus_1(array,i,i-1)
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                        //checking_minus_1(array,test[k])
                 }
                 else if(array[i] == 100 && array[i+1] == 100){
                        //checking_plus_1(array,test[k])
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100+1] = test[k];
                        //changeRowtoZero_plus_1(array,i,i+1)
                        changeRowtoZero_plus_1(combine,i,i+1)
                        //checking_plus_1(array,test[k])
                }
                else{
                    remainderArray.push(test[k]);
                }

            }

            // changeToZero(array);
            // changeToZero(combine);
            }
            k++  
        }


        for(let i = array.length-1;i>0;i--){
            if(k4 < test.length){
            let hourMS = test[k4][7]    
            //checkTest(AntArr200,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 4){
                // checking_minus_1(array,test[k]);
                checking_minus_1(combine,array,test[k4]);
                checking_plus_1(combine,array,test[k4])
                //checking_only_1(array,test[k])
                //checkTest(AntArr200,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k4];
                        array[j-1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100-1] = test[k4];

                        
    
                        //const j = Math.floor(Math.random()*(i+1));
                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,j,j-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                        //count += 1
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k4];
                        array[j+1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100+1] = test[k4];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        //const j = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100 && array[i-1] == 100){
                        //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,i,i-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                    }
                    else{
                        remainderArray.push(test[k4]);
                    }

            }

            changeToZero(array);
            changeToZero(combine);
            }
            k4++  
        }

        for(let i = array.length-1;i>0;i--){
            if(k5 < test.length){
            let hourMS = test[k5][7]    
            //checkTest(AntArr200,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 3){
                const j = Math.floor(Math.random()*(i+1)); 

                    checking_3(combine,array,test[k5]);
                    //checking_only_1(array,test[k])
                    //checkTest(AntArr200,test[k])
                    if( array[i] == 100 && array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                        //checking_3(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        changeRowtoZero_3_(combine,array,i,i-1,i+1)
                    }else if(array[i] == 100 && array[i-1] == 100){//slot 2 hours in 1 go
                        //checking_minus_1(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        insertedData200_Slot2_1.push(test[k5])
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                    }else if(array[i] == 100 && array[i+1] == 100){//slot 2 hours in 1 go
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        insertedData200_Slot2_1.push(test[k5])
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                    }else if(array[i] == 100 ){//slot 1 hours in 1 go
                        //checking_only_1(array,test[k]);
                        array[i] = array[j];
                        array[j] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        changeRowtoZero_1(combine,array,i)
                        remainderArraySlot1.push(test[k5])
                    }
            }

            changeToZero(array);
            changeToZero(combine);
            }
            k5++  
        }


 //changeToZero(array) 

 //fullfill the slot 3
 for(let x = 0; x< array.length; x++){
    if(k3 < remainderArraySlot1.length){                
        //checking_only_1(array, remainderArraySlot1[k3])
        //checkTest(AntArr200,remainderArraySlot1[k3])
        checking_plus_1(combine,array,remainderArraySlot1[k3])
        if(array[x] == 100 && array[x+1] ==100){
            //changeRowtoZero_plus_1(array,remainderArraySlot1[k3])
            array[x] = remainderArraySlot1[k3]
            array[x+1] = remainderArraySlot1[k3]
            combine[x+startIndex200] = remainderArraySlot1[k3]
            combine[x+startIndex200+1] = remainderArraySlot1[k3]
            changeRowtoZero_plus_1(combine,array,x,x+1)
        }else{insertedData200_Slot2_2.push(remainderArraySlot1[k3])}
     }
     k3++   
 }
 changeToZero(array);
 changeToZero(combine);

 
 for(let x = 0; x< array.length; x++){
    if(k2 < remainderArray.length){
        //checkTest(AntArr200,remainderArray[k2])
        checking_plus_1(combine,array,remainderArray[k2])
         if(array[x] == 100 && array[x+1] ==100){
             //if(k2 < remainderArray.length){
                //changeRowtoZero_plus_1(array,remainderArraySlot1[k2])
                 array[x] = remainderArray[k2]
                 array[x+1] = remainderArray[k2]
                 combine[x+startIndex200] = remainderArray[k2]
                 combine[x+startIndex200+1] = remainderArray[k2]
                 changeRowtoZero_plus_1(combine,array,x,x+1)
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
     }
     k2++   
 }
  changeToZero(array)
  changeToZero(combine)

//  for(let i = 0; i < array.length; i++){
//     if(array[i] != 100 && array[i] !=200 && array[i] != 0 && array[i] != undefined && array[i] != 1){
//         count += 1
//     }
// }
//console.log(count);

 if(array[-1] != undefined){
     insertedData200_Slot2_1.push(array[-1]);
 }

    return array;
}

//var AntArrIns200 = AntAlgoInsert200(AntArr200);
var AntArrIns200 = AntAlgoInsert200(AntArr200,AntArrCombine);
//console.log(AntArrIns200);

 const slot2Equal1for200= (array,combine) => {
     let k = 0;
     let test2 = []
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
            if(array[x] == 100){
                if(k < insertedData200_Slot2_1.length){
                    checking_only_1(combine,array,insertedData200_Slot2_1[k])
                    array[x] = insertedData200_Slot2_1[k]
                    combine[x+startIndex200] = insertedData200_Slot2_1[k]
                //changeRowtoZero_1(array,x)
                }
                k++   
         }
     }
     changeToZero(array)
     changeToZero(combine)
     return array;
 }
slot2Equal1for200(AntArr200,AntArrCombine);
//slot2Equal1for200(AntArrCombine);


 const slot2Equal2for200 = (array,combine) => {
     let k = 0;
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
         if(array[x] == 100 && array[x+1] ==100){
            if(k < insertedData200_Slot2_2.length){
                //checking_only_1(array,insertedData200_Slot2_2[k])
                //checkTest(AntArr200,insertedData200_Slot2_2[k])
                checking_plus_1(combine,array,insertedData200_Slot2_2[k])
                 array[x] = insertedData200_Slot2_2[k]
                 array[x+1] = insertedData200_Slot2_2[k]
                 combine[x+startIndex200] = insertedData200_Slot2_2[k]
                 combine[x+startIndex200+1] = insertedData200_Slot2_2[k]
                 //changeRowtoZero_plus_1(array,x,x+1)
             }
             k++
         }
     }
     changeToZero(array)
     changeToZero(combine)

     if(array[-1] != undefined){
         insertedData200_Slot2_1.push(array[-1]);
     }

     return array;
 }
 slot2Equal2for200(AntArr200,AntArrCombine);
 //slot2Equal2for200(AntArrCombine);

const checkAmountData200_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=200 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
//var checkAmount_2 = checkAmountData200_2(AntArrIns200)
var checkAmount_2 = checkAmountData200_2(AntArrIns200)
// console.log(AntArrIns200)
// console.log("Amount of data: " +checkAmount_2);

const checkAmountData200_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 //var checkAmount_0 = checkAmountData200_0(AntArr200)
 var checkAmount_0 = checkAmountData200_0(AntArr200)
//console.log("zero counter: "+checkAmount_0);



//________________________________________________________________________________________________________________________________________________________


const array1D500 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr500 = array1D500(DataArray500);

let insertedData500_Slot2_2 = []
let insertedData500_Slot2_1= []

let arrayLength500 =  DataArray500
const AntAlgoInsert500 = (array,combine) => {

    //array.length = 1064 (last index = 1063)
    //array.length = 646 (last index = 645)


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4=0
    let k5 =0
    let count = 0;
    let b = 1

    
    let remainderArray = []
    let remainderArraySlot1 = []
    let totalRoom = array.length / 38


    for(let x=0; x<filterData500.length;x++){
        test.push(filterData500[x]);
    }

        //for(let i = array.length-1;i>0;i--){
        for(let i = array.length-1;i>0;i--){
            if(k < test.length){
            let hourMS = test[k][7]    
            //checkTest(AntArr500,test[k])
            changeToZero(array);
            changeToZero(combine);
            if(hourMS == 2){
                //changeToZero(array)
                const j = Math.floor(Math.random()*(i+1));
                // checking_minus_1(array,test[k])
                // checking_plus_1(array,test[k])
                checking_minus_1(combine,array,test[k])
                checking_plus_1(combine,array,test[k])
                //checking_only_1(array,test[k])
                //checkTest(AntArr500,test[k])
                if(array[i] == 100 && array[i-1] == 100){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100-1] = test[k];
                        //changeRowtoZero_minus_1(array,i,i-1)
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                        //checking_minus_1(array,test[k])
                 }
                 else if(array[i] == 100 && array[i+1] == 100){
                        //checking_plus_1(array,test[k])
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j+startIndex100] = test[k];
                        combine[j+startIndex100+1] = test[k];
                        //changeRowtoZero_plus_1(array,i,i+1)
                        changeRowtoZero_plus_1(combine,i,i+1)
                        //checking_plus_1(array,test[k])
                }
                else{
                    remainderArray.push(test[k]);
                }

            }

            // changeToZero(array);
            // changeToZero(combine);
            }
            k++  
        }


        for(let i = array.length-1;i>0;i--){
            if(k4 < test.length){
            let hourMS = test[k4][7]    
            //checkTest(AntArr500,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 4){
                // checking_minus_1(array,test[k]);
                checking_minus_1(combine,array,test[k4]);
                checking_plus_1(combine,array,test[k4])
                //checking_only_1(array,test[k])
                //checkTest(AntArr500,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k4];
                        array[j-1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100-1] = test[k4];

                        
    
                        //const j = Math.floor(Math.random()*(i+1));
                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,j,j-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                        //count += 1
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k4];
                        array[j+1] = test[k4];
                        combine[j+startIndex100] = test[k4];
                        combine[j+startIndex100+1] = test[k4];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        //const j = Math.floor(Math.random()*(i+1));
                        if(array[i] == 100 && array[i-1] == 100){
                        //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k4];
                            array[j-1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100-1] = test[k4];
                            //changeRowtoZero_minus_1(array,i,i-1)
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            //checking_plus_1(array,test[k]);
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k4];
                            array[j+1] = test[k4];
                            combine[j+startIndex100] = test[k4];
                            combine[j+startIndex100+1] = test[k4];
                            //changeRowtoZero_plus_1(array,i,i-1);
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k4]);
                        }
                    }
                    else{
                        remainderArray.push(test[k4]);
                    }

            }

            changeToZero(array);
            changeToZero(combine);
            }
            k4++  
        }

        for(let i = array.length-1;i>0;i--){
            if(k5 < test.length){
            let hourMS = test[k5][7]    
            //checkTest(AntArr500,test[k])
            changeToZero(array)
            changeToZero(combine)
            if(hourMS == 3){
                const j = Math.floor(Math.random()*(i+1)); 

                    checking_3(combine,array,test[k5]);
                    //checking_only_1(array,test[k])
                    //checkTest(AntArr500,test[k])
                    if( array[i] == 100 && array[i-1] == 100 && array[i+1]==100){// slot 3 hours in 1 go
                        //checking_3(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        changeRowtoZero_3_(combine,array,i,i-1,i+1)
                    }else if(array[i] == 100 && array[i-1] == 100){//slot 2 hours in 1 go
                        //checking_minus_1(array,test[k]);
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k5];
                        array[j-1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100-1] = test[k5];
                        insertedData500_Slot2_1.push(test[k5])
                        changeRowtoZero_minus_1(combine,array,i,i-1)
                    }else if(array[i] == 100 && array[i+1] == 100){//slot 2 hours in 1 go
                        //checking_plus_1(array,test[k]);
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k5];
                        array[j+1] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        combine[j+startIndex100+1] = test[k5];
                        insertedData500_Slot2_1.push(test[k5])
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                    }else if(array[i] == 100 ){//slot 1 hours in 1 go
                        //checking_only_1(array,test[k]);
                        array[i] = array[j];
                        array[j] = test[k5];
                        combine[j+startIndex100] = test[k5];
                        changeRowtoZero_1(combine,array,i)
                        remainderArraySlot1.push(test[k5])
                    }
            }

            changeToZero(array);
            changeToZero(combine);
            }
            k5++  
        }


 //changeToZero(array) 

 //fullfill the slot 3
 for(let x = 0; x< array.length; x++){
    if(k3 < remainderArraySlot1.length){                
        //checking_only_1(array, remainderArraySlot1[k3])
        //checkTest(AntArr500,remainderArraySlot1[k3])
        checking_plus_1(combine,array,remainderArraySlot1[k3])
        if(array[x] == 100 && array[x+1] ==100){
            //changeRowtoZero_plus_1(array,remainderArraySlot1[k3])
            array[x] = remainderArraySlot1[k3]
            array[x+1] = remainderArraySlot1[k3]
            combine[x+startIndex500] = remainderArraySlot1[k3]
            combine[x+startIndex500+1] = remainderArraySlot1[k3]
            changeRowtoZero_plus_1(combine,array,x,x+1)
        }else{insertedData500_Slot2_2.push(remainderArraySlot1[k3])}
     }
     k3++   
 }
 changeToZero(array);
 changeToZero(combine);

 
 for(let x = 0; x< array.length; x++){
    if(k2 < remainderArray.length){
        //checkTest(AntArr500,remainderArray[k2])
        checking_plus_1(combine,array,remainderArray[k2])
         if(array[x] == 100 && array[x+1] ==100){
             //if(k2 < remainderArray.length){
                //changeRowtoZero_plus_1(array,remainderArraySlot1[k2])
                 array[x] = remainderArray[k2]
                 array[x+1] = remainderArray[k2]
                 combine[x+startIndex500] = remainderArray[k2]
                 combine[x+startIndex500+1] = remainderArray[k2]
                 changeRowtoZero_plus_1(combine,array,x,x+1)
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
     }
     k2++   
 }
  changeToZero(array)
  changeToZero(combine)

//  for(let i = 0; i < array.length; i++){
//     if(array[i] != 100 && array[i] !=500 && array[i] != 0 && array[i] != undefined && array[i] != 1){
//         count += 1
//     }
// }
//console.log(count);

 if(array[-1] != undefined){
     insertedData500_Slot2_1.push(array[-1]);
 }

    return array;
}

//var AntArrIns500 = AntAlgoInsert500(AntArr500);
var AntArrIns500 = AntAlgoInsert500(AntArr500,AntArrCombine);
//console.log(AntArrIns500);

 const slot2Equal1for500= (array,combine) => {
     let k = 0;
     let test2 = []
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
            if(array[x] == 100){
                if(k < insertedData500_Slot2_1.length){
                    checking_only_1(combine,array,insertedData500_Slot2_1[k])
                    array[x] = insertedData500_Slot2_1[k]
                    combine[x+startIndex500] = insertedData500_Slot2_1[k]
                //changeRowtoZero_1(array,x)
                }
                k++   
         }
     }
     changeToZero(array)
     changeToZero(combine)
     return array;
 }
slot2Equal1for500(AntArr500,AntArrCombine);
//slot2Equal1for500(AntArrCombine);


 const slot2Equal2for500 = (array,combine) => {
     let k = 0;
    let totalRoom = array.length / 38

     for(let x = 0; x< array.length; x++){
         if(array[x] == 100 && array[x+1] ==100){
            if(k < insertedData500_Slot2_2.length){
                //checking_only_1(array,insertedData500_Slot2_2[k])
                //checkTest(AntArr500,insertedData500_Slot2_2[k])
                checking_plus_1(combine,array,insertedData500_Slot2_2[k])
                 array[x] = insertedData500_Slot2_2[k]
                 array[x+1] = insertedData500_Slot2_2[k]
                 combine[x+startIndex500] = insertedData500_Slot2_2[k]
                 combine[x+startIndex500+1] = insertedData500_Slot2_2[k]
                 //changeRowtoZero_plus_1(array,x,x+1)
             }
             k++
         }
     }
     changeToZero(array)
     changeToZero(combine)

     if(array[-1] != undefined){
         insertedData500_Slot2_1.push(array[-1]);
     }

     return array;
 }
 slot2Equal2for500(AntArr500,AntArrCombine);
 //slot2Equal2for500(AntArrCombine);

const checkAmountData500_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=500 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
//var checkAmount_2 = checkAmountData500_2(AntArrIns500)
var checkAmount_2 = checkAmountData500_2(AntArrIns500)
// console.log(AntArrIns500)
// console.log("Amount of data: " +checkAmount_2);

const checkAmountData500_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 //var checkAmount_0 = checkAmountData500_0(AntArr500)
 var checkAmount_0 = checkAmountData500_0(AntArr500)
//console.log("zero counter: "+checkAmount_0);


//______________________________________________________________________________________________________________________________________________


const checkAmountDataCombine_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_combine = checkAmountDataCombine_2(AntArrCombine)
// console.log(AntArrCombine)
// console.log("Amount of data: " +checkAmount_combine);

const checkAmountDataCombine = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 //var checkAmount_0 = checkAmountData100_0(AntArr100)
 var checkAmount_combineData = checkAmountDataCombine(AntArrCombine)
//console.log("zero counter: "+checkAmount_combineData);



//---------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------



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
       indexArray = (x * 38)
   }
   for(let x= 1 ; x <= totalRoom ; x++){
       try{
           //for(let x= 1 ; x <= totalRoom ; x++){
            for(let i = 0; i<array.length ; i++){
               indexArray = (x * 37)
               if(array[i+indexArray] != 100 && array[i+indexArray] != undefined  && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                   try{
                       //if(array[i][6] == array[i+indexArray][6] && array[i+1][6] == array[i+indexArray+1][6] && array[i][5] == array[i+indexArray][5] && array[i+1][5] == array[i+indexArray+1][5]){
                       if(array[i][6] == array[i+indexArray][6] && array[i][5] == array[i+indexArray][5]){
                            try{
                                // console.log(i)
                                // console.log(i+indexArray)
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

var checkH1_ALL = check1Group(AntArrCombine)
//console.log("HC1 Counter: "+checkH1_ALL);
//var checkH1_ALLElective = check1Group(dataCombineElective)





//Check for the H2 violation: classsroom is large enough to accomodate number of student enroll to that class

const checkRoomQuota = (array) => {
   let count = 0
   return count 
}
//var checkH2_ALL = checkRoomQuota(dataCombine)
//var checkH2_ALLElective = checkRoomQuota(dataCombineElective)


//Check for the H4 violation: no one attend class during 12:00 - 14:00 due to solat jumaat
const checkSolatJummat = (array) => {
   let count = 0
   return count 
}
//var checkH4_ALL = checkSolatJummat(dataCombine)
//var checkH4_ALLElective = checkSolatJummat(dataCombineElective)

//Check for the H5 violation: each teacher can teach 1 subject at 1 room at each slot of time

const check1Teacher = (array) => {
   let count =0
   let indexArray = 0
   let totalRoom = array.length / 38
   for(let x= 1 ; x <= totalRoom ; x++){
    indexArray = (x * 38)
       try{
        for(let i = 1; i<array.length ; i++){
               if(array[i+indexArray] != 100 && array[i+indexArray] != undefined && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                   try{
                       if(array[i][5] == array[i+indexArray][5]){
                        //    console.log(i)
                        //    console.log(i+indexArray)
                           count +=1
                        }
                   }catch{}
               }    
           }
       }catch{}
   }
   return count


}
var checkH5_ALL = check1Teacher(AntArrCombine)
//console.log("HC5 Counter: "+checkH5_ALL)
//var checkH5_ALLElective = check1Group(dataCombineElective)

const checkHC = (data1,data2) => {
    let count =0;
    if(data1 != 0){
        count +=1
    }
    if(data2 != 0){
        count +=1
    }

    return count;
}
let checkTotalHardContraints = checkHC(checkH5_ALL,checkH1_ALL)
console.log("Total Hard Constraint: "+checkTotalHardContraints)


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
// var checkS1_50 = checkEndOfClass(AntArr50)
// var checkS1_100 = checkEndOfClass(AntArr50)
// var checkS1_200 = checkEndOfClass(AntArr200)
// var checkS1_500 = checkEndOfClass(AntArr500)
// var checkS1_Elective50 = checkEndOfClass(AntArrElective50)
// var checkS1_Elective100 = checkEndOfClass(AntArrElective100)
// var checkS1_Elective200 = checkEndOfClass(AntArrElective200)
// var checkS1_Elective500 = checkEndOfClass(AntArrElective500)
 var checkSC1_ALL = checkEndOfClass(AntArrCombine)



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
// var checkS2_50 = check2ClassInARow(AntArr50)
// var checkS2_100 = check2ClassInARow(AntArr50)
// var checkS2_200 = check2ClassInARow(AntArr200)
// var checkS2_500 = check2ClassInARow(AntArr500)
// var checkS2_Elective50 = check2ClassInARow(AntArrElective50)
// var checkS2_Elective100 = check2ClassInARow(AntArrElective100)
// var checkS2_Elective200 = check2ClassInARow(AntArrElective200)
// var checkS2_Elective500 = check2ClassInARow(AntArrElective500)
var checkSC2_ALL = checkEndOfClass(AntArrCombine)


//----------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------





//Check total Hard Constraint

// const checkTotalHardContraint = () => {
//    let count =0
//    //let totalH1 = checkH1_ALL
// //    let totalH2 = checkH2_ALL
// //    let totalH4 = checkH4_ALL
// //    let totalH5 = checkH5_ALL

// //    let totalH1_Elective = checkH1_ALLElective
// //    let totalH2_Elective = checkH2_ALLElective
// //    let totalH4_Elective = checkH4_ALLElective
// //    let totalH5_Elective = checkH5_ALLElective
//    //let totalHC = totalH1 + totalH2 + totalH4 + totalH5 + totalH1_Elective + totalH2_Elective + totalH4_Elective + totalH5_Elective
//    //let totalHC = totalH1 + totalH2 + totalH4 + totalH5
//    //let totalHC = totalH2 + totalH4 + totalH5
//    //let totalHC = totalH1 + totalH2 + totalH4 + totalH5 

// //    if( totalHC != 0){
// //        count +=1
// //    }   

//    return totalHC
// }
// var checkTotalHardContraints = checkTotalHardContraint()
// console.log("Total Hard Constraint: "+checkTotalHardContraints)



//----------------------------------------------------------------------------------------------------------------------------------------




//-----------------------------------------------------------------------------------------------------------------------------------------------

const checkTotalSoftContraint = () => {
    let count =0
    let totalSC = checkSC1_ALL + checkSC2_ALL
    // let totalS1 = checkS1_50 + checkS1_100 + checkS1_200 + checkS1_500 + checkS1_Elective50 + checkS1_Elective100 + checkS1_Elective200 + checkS1_Elective500
    // let totalS2 = checkS2_50 + checkS2_100 + checkS2_200 + checkS2_500 + checkS2_Elective50 + checkS2_Elective100 + checkS2_Elective200 + checkS2_Elective500
    
    if(totalSC != 0){
        count +=1
    }
    return count
}
var checkTotalSoftContraints = checkTotalSoftContraint()
console.log("Total Soft Constraint: "+checkTotalSoftContraints)
//----------------------------------------------------------------------------------------------------------------------------------------------

const change100ToEmpty = (data) => {
    for(let i = 0; i< data.length; i++){
        if(data[i] == 100){
            data[i] = [];
        }
    }
    return data;
}
let finalData = change100ToEmpty(AntArrCombine);

const change100ToEmptyElective = (data) => {
    for(let i = 0; i< data.length; i++){
        if(data[i] == 100){
            data[i] = [];
        }
    }
    return data;
}


// const checkMissingData = (data50,data100,data200,data500,dataE50,dataE100,dataE200,dataE500) => {
//     let countData = []
//     for(let i = 0; i< courseData[0].length;i++){
//         for(let j = 0; j <courseData[0][i][7]; j++){
//             countData.push(courseData[0][i]);
//         }
//     }

//     let totalGenerateScheduleData = data50 + data100 + data200 + data500 + dataE50 + dataE100 + dataE200 + dataE500

//     if(countData.length == totalGenerateScheduleData){
  
//     }else{

//     }
// }
// //checkMissingData(checkAmount50,checkAmount100,checkAmount200,checkAmount500,checkAmountElective50,checkAmountElective100,checkAmountElective200,checkAmountElective500)


checkTotalHardContraintsAll = checkTotalHardContraints
checkTotalSoftContraintsAll = checkTotalSoftContraints
finalDataAll.push(finalData)
return {checkTotalHardContraints,checkTotalSoftContraints,finalData}
 ////return {checkTotalHardContraints,checkTotalSoftContraints}
}
// for(let i = 1; i <= 1; i++){
//     console.log("iteration: " + i)
//     let antSystemAlgo = antSystem();
// }
// -------------------------------------------------------------------------------------------------------------------------------------------

let trigger = 0
var t0 = performance.now()
const iteration = () => {
        //antSystem()
        let globalBestHS = checkTotalHardContraintsAll 
        let globalBestSS = checkTotalSoftContraintsAll
        let globalBestScehdule = finalDataAll[0]
        // let globalBestScehduleElective = finalDataAllElective[0]
    for(let i= 1; i <= 500; i++){
        antSystem()
        let localBestHS = checkTotalHardContraintsAll 
        let localBestSS = checkTotalSoftContraintsAll
        let localBestScehdule = finalDataAll[0]
        // let localBestScehduleElective = finalDataAllElective[0]
            console.log("iteraion: " + i)
            if(globalBestHS > localBestHS ){
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                // globalBestScehduleElective = localBestScehduleElective
            }
            if(localBestHS == 0){
                console.log("iteraion: " + i)
                console.log("workable solution is found")
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                // globalBestScehduleElective = localBestScehduleElective
                console.log("Workable Gloabal best HS: "+globalBestHS)
                console.log("Workable Gloabal best SS: " +globalBestSS)
                //console.log(finalDataAll[0])
                trigger = 1
                //return [finalDataAll[0], finalDataAllElective[0]]
                return [finalDataAll[0]]
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
                return [finalDataAll[0]]
            }
    }
    //return [finalDataAll[0], finalDataAllElective[0]]
    return [finalDataAll[0]]
}
let interations = iteration()

let presentableData = []
//let presentableDataElective = []

if(trigger == 1){
//shot course code, course name and lecturer    
const changeToPresentationData = (data) => {
    for(let i= 0; i <= data[0].length; i++){
        try {
            presentableData.push([data[0][i][1],data[0][i][2],data[0][i][5]])
        } catch (error) {
            
        }
    }
}
changeToPresentationData(interations)


let allRoomName = []
for(let i = 0; i < roomData[0].length; i++){
    allRoomName.push(roomData[0][i][0])
}
allRoomName.unshift("Room");
if(allRoomName.pop() == undefined){
}


let weekday = ['Monday','Monday','Monday','Monday','Monday','Monday','Monday','Monday','Monday','Monday',
'Tuesday','Tuesday','Tuesday','Tuesday','Tuesday','Tuesday','Tuesday','Tuesday','Tuesday','Tuesday',
'Thursday','Thursday','Thursday','Thursday','Thursday','Thursday','Thursday','Thursday','Thursday','Thursday',
'Friday','Friday','Friday','Friday','Friday','Friday','Friday','Friday']

let wed = ['Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday']


const create2dArray = (weekdayArray,partDay,arrayAll, partAll) => {
    var tmp = [];

    for(var i = 0; i < weekdayArray.length; i += partDay) {
        tmp.push(weekdayArray.slice(i, i + partDay));
    }
    for(var i = 0; i < arrayAll.length; i += partAll) {
        tmp.push(arrayAll.slice(i, i + partAll));
    }
    return tmp;
}
let dataset = create2dArray(weekday,38,presentableData,38)
console.log(dataset);

const create2dArrayElective = (weekdayArray,partDay,arrayAll, partAll) => {
    var tmp = [];

    for(var i = 0; i < weekdayArray.length; i += partDay) {
        tmp.push(weekdayArray.slice(i, i + partDay));
    }
    for(var i = 0; i < arrayAll.length; i += partAll) {
        tmp.push(arrayAll.slice(i, i + partAll));
    }
    return tmp;
}


const insertRoomName = (roomData,array) => {
    for(let i= 0; i<array.length; i++){
        array[i].unshift(roomData[i]);
    }
    return array;
}

insertRoomName(allRoomName,dataset)


/** Convert a 2D array into a CSV string
 */
  function arrayToCsv(data){
    //console.log(data)
    return data.map(row =>
      row
      .map(String)  // convert every value to String
      .map(v => v.replaceAll('"', '""'))  // escape double colons
      .map(v => `"${v}"`)  // quote it
      .join(',')  // comma-separated
    ).join('\r\n');  // rows starting on new lines
  }

let csv = arrayToCsv(
    dataset
);

function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);
  
    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }

  /** Convert a 2D array into a CSV string
   * elective
 */


function downloadBlobElective(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);
  
    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
  }

    var t1 = performance.now()
    console.log("Duration: " + (t1-t0))
    downloadBlob(csv, 'ModifiedAntSystem_GeneratedSchedule.csv', 'text/csv;charset=utf-8;')
  //downloadBlobElective(csvElective, 'ModifiedAntSystemElective_GeneratedSchedule.csv', 'text/csv;charset=utf-8;')
}else{
    var t1 = performance.now()
    console.log("Duration: " + (t1-t0) + " milliseconds" )
    alert("no workable solution found, please refersh until get workable solution")
}


//----------------------------------------------------------------------------------------------------------------------------------------

        }
    return(
        <React.Fragment>
            <h1>
                Generate Schedule Page
            </h1>

        </React.Fragment>
    );
}


export default ArraySchedule;


//result[i][j]=Course.splice(Math.floor(Math.random()* Course.length),1)[0] // create random placement of Course Value
//const Schedule = new Array(10).fill(Array(5).fill(null));
//console.log(Schedule);
// const Course = [['TE1',4],['TE1',4],['TE1',4],['TE1',3],['TE1',4],['TE1',2],['TE1',4],['TE1',4],['TE1',4],['TE1',3]];
//const Course = [['TE1',2],['TE2',2],['TE3',3],['TE4',4],['TE5',3],['TE6',4],['TE7',4],['TE8',2],['TE9',4]];
//const Course = ['TE1','TE2','TE3','TE4','TE5','TE6','TE7','TE8','TE9'];