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

const ArrayScheduleElective = (props) => {


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

const antSystem = () => {

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
    //___________________________________________________________________________________________________________________________________
const array1DElectiveCombine = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrCombine = array1DElectiveCombine(combineArrayElective);


const array1DElective50 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective50 = array1DElective50(DataArrayElective50);

let insertedDataElective50_Slot2_2 = []
let insertedDataElective50_Slot2_1= []

const AntAlgoInsertElective50 = (array,combine) => {
    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0 

    let remainderArray = []
    let remainderArraySlot1 = []
    let remainderArray3 = []

    let totalRoom = array.length / 38

    for(let x=0; x<filterDataElective50.length;x++){
        test.push(filterDataElective50[x]);
    }

     for(let i = array.length-1;i>0;i--){
         if(k < test.length){
         let hourMS = test[k][7]

         changeToZero(array)
         changeToZero(combine)
         if(hourMS == 3){
             const j = Math.floor(Math.random()*(i+1));
             checking_3(combine,array,test[k]);
             if(array[i] == 100 && array[i-1] == 100 && array[i+1]==100){
                array[i] = array[j];
                array[i-1] = array[j-1];
                array[i+1] = array[j+1];
                array[j] = test[k];
                array[j-1] = test[k];
                array[j+1] = test[k];
                combine[j] = test[k];
                combine[j-1] = test[k];
                combine[j+1] = test[k];
                changeRowtoZero_3_(combine,array,i,i-1,i+1)
                }
                 else{
                    remainderArray3.push(test[k]);    
                }
             }

          else if(hourMS == 2){
            checking_minus_1(combine,array,test[k])
            checking_plus_1(combine,array,test[k])
             const j = Math.floor(Math.random()*(i+1));
             if(array[i] == 100){
                 if(array[i-1] == 100 ){
                    array[i] = array[j];
                    array[i-1] = array[j-1];
                    array[j] = test[k];
                    array[j-1] = test[k];
                    combine[j] = test[k];
                    combine[j-1] = test[k];
                    changeRowtoZero_minus_1(combine,array,i,i-1)
                     
                 }else if(array[i+1] == 100){
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
             }else{
                 remainderArray.push(test[k]);
             }
             }

            else if(hourMS == 4){
                checking_minus_1(combine,array,test[k]);
                checking_plus_1(combine,array,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j] = test[k];
                        combine[j-1] = test[k];

                        

                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j] = test[k];
                        combine[j+1] = test[k];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else{
                        remainderArray.push(test[k]);
                    }

            }
         }
         k++  
     }


     for(let x = 0; x< array.length; x++){
        if(k3 < remainderArraySlot1.length){                
            checking_plus_1(combine,array,remainderArraySlot1[k3])
            if(array[x] == 100 && array[x+1] ==100){
                array[x] = remainderArraySlot1[k3]
                array[x+1] = remainderArraySlot1[k3]
                combine[x] = remainderArraySlot1[k3]
                combine[x+1] = remainderArraySlot1[k3]
                changeRowtoZero_plus_1(combine,array,x,x+1)
            }else{insertedDataElective50_Slot2_2.push(remainderArraySlot1[k3])}
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
                        insertedDataElective50_Slot2_1.push(remainderArray[k2])
                     }
                     if(slot2 == 2){
                        insertedDataElective50_Slot2_2.push(remainderArray[k2])
                    }
                 }catch{}
         }
         k2++   
     }
      changeToZero(array)
      changeToZero(combine)

     if(array[-1] != undefined){
         insertedDataElective50_Slot2_1.push(array[-1]);
     }

    return array;
}
var AntArrInsElective50 = AntAlgoInsertElective50(AntArrElective50,AntArrCombine);


const slot2Equal1forElective50= (array,combine) => {
    let k = 0;
    let test2 = []
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
           if(array[x] == 100){
               if(k < insertedDataElective50_Slot2_1.length){
                   checking_only_1(combine,array,insertedDataElective50_Slot2_1[k])
                   array[x] = insertedDataElective50_Slot2_1[k]
                   combine[x] = insertedDataElective50_Slot2_1[k]
               }
               k++   
        }
    }
    changeToZero(array)
    changeToZero(combine)
    return array;
}
slot2Equal1forElective50(AntArrElective50,AntArrCombine);



const slot2Equal2forElective50 = (array,combine) => {
    let k = 0;
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
        if(array[x] == 100 && array[x+1] ==100){
           if(k <insertedDataElective50_Slot2_2.length){
               checking_plus_1(combine,array,insertedDataElective50_Slot2_2[k])
                array[x] =insertedDataElective50_Slot2_2[k]
                array[x+1] =insertedDataElective50_Slot2_2[k]
                combine[x] =insertedDataElective50_Slot2_2[k]
                combine[x+1] =insertedDataElective50_Slot2_2[k]
            }
            k++
        }
    }
    changeToZero(array)
    changeToZero(combine)

    if(array[-1] != undefined){
        insertedDataElective50_Slot2_1.push(array[-1]);
    }

    return array;
}
slot2Equal2forElective50(AntArrElective50,AntArrCombine);


//___________________________________________________________________________________________________________________________________

//___________________________________________________________________________________________________________________________________

const array1DElective100 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective100 = array1DElective100(DataArrayElective100);

let insertedDataElective100_Slot2_2 = []
let insertedDataElective100_Slot2_1= []

const AntAlgoInsertElective100 = (array,combine) => {
    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0 

    let remainderArray = []
    let remainderArraySlot1 = []
    let remainderArray3 = []

    let totalRoom = array.length / 38

    for(let x=0; x<filterDataElective100.length;x++){
        test.push(filterDataElective100[x]);
    }

     for(let i = array.length-1;i>0;i--){
         if(k < test.length){
         let hourMS = test[k][7]

         changeToZero(array)
         changeToZero(combine)
         if(hourMS == 3){
             const j = Math.floor(Math.random()*(i+1));
             checking_3(combine,array,test[k]);
             if(array[i] == 100 && array[i-1] == 100 && array[i+1]==100){
                array[i] = array[j];
                array[i-1] = array[j-1];
                array[i+1] = array[j+1];
                array[j] = test[k];
                array[j-1] = test[k];
                array[j+1] = test[k];
                combine[j] = test[k];
                combine[j-1] = test[k];
                combine[j+1] = test[k];
                changeRowtoZero_3_(combine,array,i,i-1,i+1)
                }
                 else{
                    remainderArray3.push(test[k]);    
                }
             }

          else if(hourMS == 2){
            checking_minus_1(combine,array,test[k])
            checking_plus_1(combine,array,test[k])
             const j = Math.floor(Math.random()*(i+1));
             if(array[i] == 100){
                 if(array[i-1] == 100 ){
                    array[i] = array[j];
                    array[i-1] = array[j-1];
                    array[j] = test[k];
                    array[j-1] = test[k];
                    combine[j] = test[k];
                    combine[j-1] = test[k];
                    changeRowtoZero_minus_1(combine,array,i,i-1)
                     
                 }else if(array[i+1] == 100){
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
             }else{
                 remainderArray.push(test[k]);
             }
             }

            else if(hourMS == 4){
                checking_minus_1(combine,array,test[k]);
                checking_plus_1(combine,array,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j] = test[k];
                        combine[j-1] = test[k];

                        

                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j] = test[k];
                        combine[j+1] = test[k];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else{
                        remainderArray.push(test[k]);
                    }

            }
         }
         k++  
     }


     for(let x = 0; x< array.length; x++){
        if(k3 < remainderArraySlot1.length){                
            checking_plus_1(combine,array,remainderArraySlot1[k3])
            if(array[x] == 100 && array[x+1] ==100){
                array[x] = remainderArraySlot1[k3]
                array[x+1] = remainderArraySlot1[k3]
                combine[x] = remainderArraySlot1[k3]
                combine[x+1] = remainderArraySlot1[k3]
                changeRowtoZero_plus_1(combine,array,x,x+1)
            }else{insertedDataElective100_Slot2_2.push(remainderArraySlot1[k3])}
         }
         k3++   
     }
     changeToZero(array);
     changeToZero(combine);
    
     
     for(let x = 0; x< array.length; x++){
        if(k2 < remainderArray.length){
            //checkTest(AntArrElective100,remainderArray[k2])
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
                        insertedDataElective100_Slot2_1.push(remainderArray[k2])
                     }
                     if(slot2 == 2){
                        insertedDataElective100_Slot2_2.push(remainderArray[k2])
                    }
                 }catch{}
         }
         k2++   
     }
      changeToZero(array)
      changeToZero(combine)

     if(array[-1] != undefined){
        insertedDataElective100_Slot2_1.push(array[-1]);
     }

    return array;
}
var AntArrInsElective100 = AntAlgoInsertElective100(AntArrElective100,AntArrCombine);


const slot2Equal1forElective100= (array,combine) => {
    let k = 0;
    let test2 = []
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
           if(array[x] == 100){
               if(k < insertedDataElective100_Slot2_1.length){
                   checking_only_1(combine,array,insertedDataElective100_Slot2_1[k])
                   array[x] =insertedDataElective100_Slot2_2[k]
                   combine[x] = insertedDataElective100_Slot2_2[k]
               }
               k++   
        }
    }
    changeToZero(array)
    changeToZero(combine)
    return array;
}
slot2Equal1forElective100(AntArrElective100,AntArrCombine);



const slot2Equal2forElective100 = (array,combine) => {
    let k = 0;
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
        if(array[x] == 100 && array[x+1] ==100){
           if(k < insertedDataElective100_Slot2_2.length){
               checking_plus_1(combine,array,insertedDataElective100_Slot2_2[k])
                array[x] = insertedDataElective100_Slot2_2[k]
                array[x+1] = insertedDataElective100_Slot2_2[k]
                combine[x] = insertedDataElective100_Slot2_2[k]
                combine[x+1] = insertedDataElective100_Slot2_2[k]
            }
            k++
        }
    }
    changeToZero(array)
    changeToZero(combine)

    if(array[-1] != undefined){
        insertedDataElective100_Slot2_1.push(array[-1]);
    }

    return array;
}
slot2Equal2forElective100(AntArrElective100,AntArrCombine);



//___________________________________________________________________________________________________________________________________

//___________________________________________________________________________________________________________________________________

const array1DElective200 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective200 = array1DElective200(DataArrayElective200);

let insertedDataElective200_Slot2_2 = []
let insertedDataElective200_Slot2_1= []

const AntAlgoInsertElective200 = (array,combine) => {
    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0 

    let remainderArray = []
    let remainderArraySlot1 = []
    let remainderArray3 = []

    let totalRoom = array.length / 38

    for(let x=0; x<filterDataElective200.length;x++){
        test.push(filterDataElective200[x]);
    }

     for(let i = array.length-1;i>0;i--){
         if(k < test.length){
         let hourMS = test[k][7]

         changeToZero(array)
         changeToZero(combine)
         if(hourMS == 3){
             const j = Math.floor(Math.random()*(i+1));
             checking_3(combine,array,test[k]);
             if(array[i] == 100 && array[i-1] == 100 && array[i+1]==100){
                array[i] = array[j];
                array[i-1] = array[j-1];
                array[i+1] = array[j+1];
                array[j] = test[k];
                array[j-1] = test[k];
                array[j+1] = test[k];
                combine[j] = test[k];
                combine[j-1] = test[k];
                combine[j+1] = test[k];
                changeRowtoZero_3_(combine,array,i,i-1,i+1)
                }
                 else{
                    remainderArray3.push(test[k]);    
                }
             }

          else if(hourMS == 2){
            checking_minus_1(combine,array,test[k])
            checking_plus_1(combine,array,test[k])
             const j = Math.floor(Math.random()*(i+1));
             if(array[i] == 100){
                 if(array[i-1] == 100 ){
                    array[i] = array[j];
                    array[i-1] = array[j-1];
                    array[j] = test[k];
                    array[j-1] = test[k];
                    combine[j] = test[k];
                    combine[j-1] = test[k];
                    changeRowtoZero_minus_1(combine,array,i,i-1)
                     
                 }else if(array[i+1] == 100){
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
             }else{
                 remainderArray.push(test[k]);
             }
             }

            else if(hourMS == 4){
                checking_minus_1(combine,array,test[k]);
                checking_plus_1(combine,array,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j] = test[k];
                        combine[j-1] = test[k];

                        

                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j] = test[k];
                        combine[j+1] = test[k];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else{
                        remainderArray.push(test[k]);
                    }

            }
         }
         k++  
     }


     for(let x = 0; x< array.length; x++){
        if(k3 < remainderArraySlot1.length){                
            checking_plus_1(combine,array,remainderArraySlot1[k3])
            if(array[x] == 100 && array[x+1] ==100){
                array[x] = remainderArraySlot1[k3]
                array[x+1] = remainderArraySlot1[k3]
                combine[x] = remainderArraySlot1[k3]
                combine[x+1] = remainderArraySlot1[k3]
                changeRowtoZero_plus_1(combine,array,x,x+1)
            }else{insertedDataElective200_Slot2_2.push(remainderArraySlot1[k3])}
         }
         k3++   
     }
     changeToZero(array);
     changeToZero(combine);
    
     
     for(let x = 0; x< array.length; x++){
        if(k2 < remainderArray.length){
            //checkTest(AntArrElective200,remainderArray[k2])
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
                        insertedDataElective200_Slot2_1.push(remainderArray[k2])
                     }
                     if(slot2 == 2){
                        insertedDataElective200_Slot2_2.push(remainderArray[k2])
                    }
                 }catch{}
         }
         k2++   
     }
      changeToZero(array)
      changeToZero(combine)

     if(array[-1] != undefined){
        insertedDataElective200_Slot2_1.push(array[-1]);
     }

    return array;
}
var AntArrInsElective200 = AntAlgoInsertElective200(AntArrElective200,AntArrCombine);


const slot2Equal1forElective200= (array,combine) => {
    let k = 0;
    let test2 = []
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
           if(array[x] == 100){
               if(k < insertedDataElective200_Slot2_1.length){
                   checking_only_1(combine,array,insertedDataElective200_Slot2_1[k])
                   array[x] = insertedDataElective200_Slot2_1[k]
                   combine[x] = insertedDataElective200_Slot2_1[k]
               }
               k++   
        }
    }
    changeToZero(array)
    changeToZero(combine)
    return array;
}
slot2Equal1forElective200(AntArrElective200,AntArrCombine);



const slot2Equal2forElective200 = (array,combine) => {
    let k = 0;
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
        if(array[x] == 100 && array[x+1] ==100){
           if(k < insertedDataElective200_Slot2_2.length){
               checking_plus_1(combine,array,insertedDataElective200_Slot2_2[k])
                array[x] = insertedDataElective200_Slot2_2[k]
                array[x+1] = insertedDataElective200_Slot2_2[k]
                combine[x] = insertedDataElective200_Slot2_2[k]
                combine[x+1] = insertedDataElective200_Slot2_2[k]
            }
            k++
        }
    }
    changeToZero(array)
    changeToZero(combine)

    if(array[-1] != undefined){
        insertedDataElective200_Slot2_1.push(array[-1]);
    }

    return array;
}
slot2Equal2forElective200(AntArrElective200,AntArrCombine);


//___________________________________________________________________________________________________________________________________

//___________________________________________________________________________________________________________________________________

const array1DElective500 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective500 = array1DElective500(DataArrayElective500);

let extraDataElective500_Slot2_2 = []
let extraData500Elective_Slot2_1 = []
let insertedDataElective500_Slot2_2 = []
let insertedDataElective500_Slot2_1= []

const AntAlgoInsertElective500 = (array,combine) => {
    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0 

    let remainderArray = []
    let remainderArraySlot1 = []
    let remainderArray3 = []

    let totalRoom = array.length / 38

    for(let x=0; x<filterDataElective500.length;x++){
        test.push(filterDataElective500[x]);
    }

     for(let i = array.length-1;i>0;i--){
         if(k < test.length){
         let hourMS = test[k][7]

         changeToZero(array)
         changeToZero(combine)
         if(hourMS == 3){
             const j = Math.floor(Math.random()*(i+1));
             checking_3(combine,array,test[k]);
             if(array[i] == 100 && array[i-1] == 100 && array[i+1]==100){
                array[i] = array[j];
                array[i-1] = array[j-1];
                array[i+1] = array[j+1];
                array[j] = test[k];
                array[j-1] = test[k];
                array[j+1] = test[k];
                combine[j] = test[k];
                combine[j-1] = test[k];
                combine[j+1] = test[k];
                changeRowtoZero_3_(combine,array,i,i-1,i+1)
                }
                 else{
                    remainderArray3.push(test[k]);    
                }
             }

          else if(hourMS == 2){
            checking_minus_1(combine,array,test[k])
            checking_plus_1(combine,array,test[k])
             const j = Math.floor(Math.random()*(i+1));
             if(array[i] == 100){
                 if(array[i-1] == 100 ){
                    array[i] = array[j];
                    array[i-1] = array[j-1];
                    array[j] = test[k];
                    array[j-1] = test[k];
                    combine[j] = test[k];
                    combine[j-1] = test[k];
                    changeRowtoZero_minus_1(combine,array,i,i-1)
                     
                 }else if(array[i+1] == 100){
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
             }else{
                 remainderArray.push(test[k]);
             }
             }

            else if(hourMS == 4){
                checking_minus_1(combine,array,test[k]);
                checking_plus_1(combine,array,test[k])
                const j = Math.floor(Math.random()*(i+1));
                    if(array[i] == 100 && array[i-1] == 100 ){
                        array[i] = array[j];
                        array[i-1] = array[j-1];
                        array[j] = test[k];
                        array[j-1] = test[k];
                        combine[j] = test[k];
                        combine[j-1] = test[k];

                        

                        changeRowtoZero_minus_1(combine,array,j,j-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            //checking_minus_1(array,test[k]);
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else if(array[i] == 100 && array[i+1] == 100 ){
                        array[i] = array[j];
                        array[i+1] = array[j+1];
                        array[j] = test[k];
                        array[j+1] = test[k];
                        combine[j] = test[k];
                        combine[j+1] = test[k];
                    
                        changeRowtoZero_plus_1(combine,array,i,i-1);
                        if(array[i] == 100 && array[i-1] == 100){
                            array[i] = array[j];
                            array[i-1] = array[j-1];
                            array[j] = test[k];
                            array[j-1] = test[k];
                            combine[j] = test[k];
                            combine[j-1] = test[k];
                            changeRowtoZero_minus_1(combine,array,j,j-1);
                        }
                        else if(array[i] == 100 && array[i+1] == 100){
                            array[i] = array[j];
                            array[i+1] = array[j+1];
                            array[j] = test[k];
                            array[j+1] = test[k];
                            combine[j] = test[k];
                            combine[j+1] = test[k];
                            changeRowtoZero_plus_1(combine,array,j,j-1);
                        }
                        else{
                            remainderArraySlot1.push(test[k]);
                        }
                    }
                    else{
                        remainderArray.push(test[k]);
                    }

            }
         }
         k++  
     }


     for(let x = 0; x< array.length; x++){
        if(k3 < remainderArraySlot1.length){                
            checking_plus_1(combine,array,remainderArraySlot1[k3])
            if(array[x] == 100 && array[x+1] ==100){
                array[x] = remainderArraySlot1[k3]
                array[x+1] = remainderArraySlot1[k3]
                combine[x] = remainderArraySlot1[k3]
                combine[x+1] = remainderArraySlot1[k3]
                changeRowtoZero_plus_1(combine,array,x,x+1)
            }else{insertedDataElective500_Slot2_2.push(remainderArraySlot1[k3])}
         }
         k3++   
     }
     changeToZero(array);
     changeToZero(combine);
    
     
     for(let x = 0; x< array.length; x++){
        if(k2 < remainderArray.length){
            //checkTest(AntArrElective500remainderArray[k2])
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
                        insertedDataElective500_Slot2_2.push(remainderArray[k2])
                     }
                     if(slot2 == 2){
                        insertedDataElective500_Slot2_2.push(remainderArray[k2])
                    }
                 }catch{}
         }
         k2++   
     }
      changeToZero(array)
      changeToZero(combine)

     if(array[-1] != undefined){
        insertedDataElective500_Slot2_1.push(array[-1]);
     }

    return array;
}
var AntArrInsElective500 = AntAlgoInsertElective500(AntArrElective500,AntArrCombine);


const slot2Equal1forElective500= (array,combine) => {
    let k = 0;
    let test2 = []
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
           if(array[x] == 100){
               if(k < insertedDataElective500_Slot2_1.length){
                   checking_only_1(combine,array,insertedDataElective500_Slot2_1[k])
                   array[x] = insertedDataElective500_Slot2_1[k]
                   combine[x] = insertedDataElective500_Slot2_1[k]
               }
               k++   
        }
    }
    changeToZero(array)
    changeToZero(combine)
    return array;
}
slot2Equal1forElective500(AntArrElective500,AntArrCombine);



const slot2Equal2forElective500 = (array,combine) => {
    let k = 0;
   let totalRoom = array.length / 38

    for(let x = 0; x< array.length; x++){
        if(array[x] == 100 && array[x+1] ==100){
           if(k < insertedDataElective500_Slot2_2.length){
               checking_plus_1(insertedDataElective500_Slot2_2[k])
                array[x] = insertedDataElective500_Slot2_2[k]
                array[x+1] = insertedDataElective500_Slot2_2[k]
                combine[x] = insertedDataElective500_Slot2_2[k]
                combine[x+1] = insertedDataElective500_Slot2_2[k]
            }
            k++
        }
    }
    changeToZero(array)
    changeToZero(combine)

    if(array[-1] != undefined){
        insertedDataElective500_Slot2_1.push(array[-1]);
    }

    return array;
}
slot2Equal2forElective500(AntArrElective500,AntArrCombine);

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
             for(let i = 0; i<array.length ; i++){
                indexArray = (x * 37)
                if(array[i+indexArray] != 100 && array[i+indexArray] != undefined  && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                    try{
                        if(array[i][6] == array[i+indexArray][6] && array[i][5] == array[i+indexArray][5]){
                             try{
       
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

 
 
 
 
 //Check for the H2 violation: classsroom is large enough to accomodate number of student enroll to that class
 
 const checkRoomQuota = (array) => {
    let count = 0
    return count 
 }
 var checkH2_ALLElective = checkRoomQuota(AntArrCombine)
 
 
 //Check for the H4 violation: no one attend class during 12:00 - 14:00 due to solat jumaat
 const checkSolatJummat = (array) => {
    let count = 0
    return count 
 }
 var checkH4_ALLElective = checkSolatJummat(AntArrCombine)
 
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
 var checkSC2_ALL = checkEndOfClass(AntArrCombine)
 
 
 //----------------------------------------------------------------------------------------------------------------------------------------------
 
 //-----------------------------------------------------------------------------------------------------------------------------------------------

 
 
 
 //----------------------------------------------------------------------------------------------------------------------------------------
 
 
 
 
 //-----------------------------------------------------------------------------------------------------------------------------------------------
 
 const checkTotalSoftContraint = () => {
     let count =0
     let totalSC = checkSC1_ALL + checkSC2_ALL
     
     if(totalSC != 0){
         count +=1
     }
     return count
 }
 var checkTotalSoftContraints = checkTotalSoftContraint()
 console.log("Total Soft Constraint: "+checkTotalSoftContraints)
 //----------------------------------------------------------------------------------------------------------------------------------------------
 
 const change100ToEmptyElective = (data) => {
     for(let i = 0; i< data.length; i++){
         if(data[i] == 100){
             data[i] = [];
         }
     }
     return data;
 }
 let finalDataElective = change100ToEmptyElective(AntArrCombine)
 
 
 checkTotalHardContraintsAll = checkTotalHardContraints
 checkTotalSoftContraintsAll = checkTotalSoftContraints
 finalDataAllElective.push(finalDataElective)
 return {checkTotalHardContraints,checkTotalSoftContraints,finalDataAllElective}

//___________________________________________________________________________________________________________________________________
}

let trigger = 0
var t0 = performance.now()
const iteration = () => {
        //antSystem()
        let globalBestHS = checkTotalHardContraintsAll 
        let globalBestSS = checkTotalSoftContraintsAll
        let globalBestScehdule = finalDataAllElective[0]
    for(let i= 1; i <= 500; i++){
        antSystem()
        let localBestHS = checkTotalHardContraintsAll 
        let localBestSS = checkTotalSoftContraintsAll
        let localBestScehdule = finalDataAllElective[0]
            console.log("iteraion: " + i)
            if(globalBestHS > localBestHS ){
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
            }
            if(localBestHS == 0){
                console.log("iteraion: " + i)
                console.log("workable solution is found")
                globalBestHS = localBestHS
                globalBestSS = localBestSS
                globalBestScehdule = localBestScehdule
                console.log("Workable Gloabal best HS: "+globalBestHS)
                console.log("Workable Gloabal best SS: " +globalBestSS)
                //console.log(finalDataAll[0])
                trigger = 1
                return [finalDataAllElective[0]]
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
                return [finalDataAllElective[0]]
            }
    }
    return [finalDataAllElective[0]]
}
let interations = iteration()

let presentableDataElective = []

if(trigger == 1){
//shot course code, course name and lecturer
console.log(interations);    
const changeToPresentationData = (data) => {
    console.log(data)
    for(let i= 0; i <= data[0].length; i++){
        try {
            presentableDataElective.push([data[0][i][1],data[0][i][2],data[0][i][5]])
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


let wed = ['Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday','Wednesday']

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
let datasetElective = create2dArrayElective(wed,10,presentableDataElective,10);
console.log(datasetElective)
//console.log(dataset)

const insertRoomNameElective = (roomData,array) => {
    for(let i= 0; i<array.length; i++){
        array[i].unshift(roomData[i]);
    }
    return array;
}

insertRoomNameElective(allRoomName,datasetElective)


  /** Convert a 2D array into a CSV string
   * elective
 */
   function arrayToCsvElective(data){
    //console.log(data)
    return data.map(row =>
      row
      .map(String)  // convert every value to String
      .map(v => v.replaceAll('"', '""'))  // escape double colons
      .map(v => `"${v}"`)  // quote it
      .join(',')  // comma-separated
    ).join('\r\n');  // rows starting on new lines
  }

let csvElective = arrayToCsvElective(
    datasetElective
);

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
  downloadBlobElective(csvElective, 'ModifiedAntSystemElective_GeneratedSchedule.csv', 'text/csv;charset=utf-8;')
}else{
    var t1 = performance.now()
    console.log("Duration: " + (t1-t0) + " milliseconds" )
    alert("no workable solution found, please refersh until get workable solution")
}
        }
        return(
            <React.Fragment>
                <h1>
                    Generate Schedule Page Elective
                </h1>
        
            </React.Fragment>
        );
    }

    export default ArrayScheduleElective;