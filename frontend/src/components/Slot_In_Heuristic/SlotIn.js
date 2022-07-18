import React,{ useEffect,useState, useContext } from "react";
import { useParams } from "react-router-dom";
import _ from 'lodash';
import { AuthContext } from "../contexts/auth-context";

import './SlotIn.css';


let finalDataAll = [];
let presentableData = []
let presentableDataLecturer = []
let MainData = []
let byLectureData = []
let byCourseData = []
let notDuplicatesLecturerArray = []
let notDuplicatesLecturerCodeArray = []
let courseCodeArray = []
let courseNameArray = []
let userIds = []
let maxHCS = 0
let maxSCS = 0
let minHCS = 0
let minSCS = 0
let countWKSlt = 0
let countPerfectSlt = 0

var t0 = performance.now()

const SlotIn = (props) => {

    const auth =  useContext(AuthContext);
    userIds.push(auth.userId)
    

    const [isLoading, setIsLoading] = useState(false);
    const [loadedFile, setLoaadedFile] = useState(false);
    const [roomData, setroomData] = useState();
    const [courseData, setcourseData] = useState();

    let disbaleButton = true

    const userId = useParams().userId;

    useEffect(()=>{
        const sendRequest = async () =>{
            setIsLoading(true);
            try{
            const response = await fetch(`http://localhost:5000/api/files/users/${userIds}`);
            const responsedata = await response.json();
            let stringifyData = JSON.stringify(responsedata.userWithFiles.Dataset);

            const ertRoom = responsedata.userWithFiles.Dataset[0].Dataset.map(Dataset =>[Dataset['Room'],Dataset['Size']]); //Extract Room
            setroomData([ertRoom]);

            const ertCourse = responsedata.userWithFiles.Dataset[1].Dataset.map(Dataset => [Dataset['Enrollment Quota'],Dataset['Course Code'],Dataset['Course Name'],Dataset['Year'],Dataset['Semester'],Dataset['Lecturer'],Dataset['Group'],Dataset['HMS'],Dataset['Programme Code'],Dataset['Slot1'],Dataset['Slot2'],Dataset['Lecture Code']]); //Extract Enrollment Quota
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
            const EnrollmentQuota = [];
            const CourseCode = [];
            const CourseName = [];
            const HMS = [];
            const lecturerData = []
            const lecturerCodeData = []
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
            const totalAmountofData  = [];
            var totalAmountofDataSlottedIn = 0;
            const room = []
            room.push(roomData[0])
            

            for(let i = 0; i <courseData[0].length; i++){
                let enrollment = [courseData[0][i][0]];
                let code = [courseData[0][i][1]];
                let hms = [courseData[0][i][7]];
                let lecturer = [courseData[0][i][5]];
                let courseName = [courseData[0][i][2]]
                let lecturerCode = [courseData[0][i][11]];
                enrollment.reduce(function(results, item, index, array){
                    results[index] = item;
                    EnrollmentQuota.push(item);
                },{});
                code.reduce(function(results, item, index, array){
                    results[index] = item;
                    CourseCode.push(item);
                },{});
                hms.reduce(function(results, item, index, array){
                    results[index] = item;
                    HMS.push(item);
                },{});
                lecturer.reduce(function(results, item, index, array){
                    results[index] = item;
                    lecturerData.push(item);
                },{});
                courseName.reduce(function(results, item, index, array){
                    results[index] = item;
                    CourseName.push(item);
                },{});
                lecturerCode.reduce(function(results, item, index, array){
                    results[index] = item;
                    lecturerCodeData.push(item);
                },{});
            }
            for(let i = 0; i <roomData[0].length; i++){
                let name = [roomData[0][i][0]];
                let size = [roomData[0][i][1]];
                name.reduce(function(results, item, index, array){
                    results[index] = item;
                    roomName.push(item);
                },{});
                size.reduce(function(results, item, index, array){
                    results[index] = item;
                    roomSize.push(item);
                },{});
            }

            const notDuplicatesLecturer = lecturerData.filter((item, index) => index == lecturerData.indexOf(item));
            const notDuplicatesCodeLecturer = lecturerCodeData.filter((item, index) => index == lecturerCodeData.indexOf(item));
            notDuplicatesLecturer.pop();
            notDuplicatesCodeLecturer.pop();
             for(let i = 0; i < notDuplicatesLecturer.length; i++){
                 notDuplicatesLecturerArray.push(notDuplicatesLecturer[i]);
             }

             for(let i = 0; i < notDuplicatesCodeLecturer.length; i++){
                notDuplicatesLecturerCodeArray.push(notDuplicatesCodeLecturer[i]);
            }


             CourseCode.pop()
             for(let i = 0 ; i < CourseCode.length; i++){
                courseCodeArray.push(CourseCode[i]);
             }

             for(let i = 0 ; i < CourseName.length; i++){
                courseNameArray.push(CourseName[i]);
             }


            let courseDataXElective = []
            let courseDataWithElective = []
            courseData[0].pop()

            //saparate faculty course with the elective course
            for(let i=0; i< courseData[0].length; i++){
                if(courseData[0][i][8] != 'ELECTIVE'){
                    courseData[0][i].splice()
                    courseDataXElective.push(courseData[0][i])
                }
            }

            //saparate elective course with the faculty course
            for(let i=0; i< courseData[0].length; i++){
                if(courseData[0][i][8] == 'ELECTIVE'){
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


            let roomUnder50 = []
            let roomUnder100 = []
            let roomUnder200 = []
            let roomUnder500 = []

            //separate room 
            const checkNumberofRoom = () => {
                for(let i = 0; i < roomData[0].length; i++){
                    let room = roomData[0][i][1]
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

            const totalAmountData = () => {
                for(let i = 0; i< courseDataXElective.length;i++){
                    for(let j = 0; j <courseDataXElective[i][7]; j++){
                        totalAmountofData.push(courseDataXElective[i]);
                    }
                }
            }
            totalAmountData()

            const totalAmountDataElective = () => {
                for(let i = 0; i< courseDataWithElective.length;i++){
                    for(let j = 0; j <courseDataWithElective[i][7]; j++){
                        totalAmountofData.push(courseDataWithElective[i]);
                    }
                }
            }
            totalAmountDataElective()

            let DataArray50 = roomUnder50.length * 38;
            let DataArray100 = roomUnder100.length * 38;
            let DataArray200 = roomUnder200.length * 38;
            let DataArray500 = roomUnder500.length * 38;
            let combineArray = DataArray50 + DataArray100 + DataArray200 + DataArray500

            let startIndex100 = DataArray50-1
            let startIndex200 = DataArray50+ DataArray100-1
            let startIndex500 = DataArray50 +DataArray100+DataArray200-1

            let LastIndex50 = DataArray50
            let LastIndex100 = DataArray50 + DataArray100 
            let LastIndex200 = DataArray50 + DataArray100 + DataArray200
            let LastIndex500 = DataArray50 + DataArray100 + DataArray200 + DataArray500

            let DataArrayElective50 = roomUnder50.length * 10;
            let DataArrayElective100 = roomUnder100.length * 10;
            let DataArrayElective200 = roomUnder200.length * 10;
            let DataArrayElective500 = roomUnder500.length * 10;
            let combineArrayElective = DataArrayElective50 + DataArrayElective100 + DataArrayElective200 + DataArrayElective500

            let startIndexElective100 = DataArrayElective50-1
            let startIndexElective200 = DataArrayElective50+ DataArrayElective100-1
            let startIndexElective500 = DataArrayElective50 +DataArrayElective100+DataArrayElective200-1

            let LastIndexElective50 = DataArrayElective50
            let LastIndexElective100 = DataArrayElective50 + DataArrayElective100 
            let LastIndexElective200 = DataArrayElective50 + DataArrayElective100 + DataArrayElective200
            let LastIndexElective500 = DataArrayElective50 + DataArrayElective100 + DataArrayElective200 + DataArrayElective500


//----------------------------------------------------------------------------------------------------------------------------------------

var checkTotalHardContraintsAll = 0
var checkTotalSoftContraintsAll = 0

const antSystem = () => {

//______________________________________________________________________________________________________________________________________________
//Faculty courses


const changeToZero = (array) => {
    for(let i = 0; i < array.length; i++){
        if(array[i] == 0){
            array[i] = 100
        }
    }
    return array;
}


const array1DCombine = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrCombine = array1DCombine(combineArray);


const array1DElectiveCombine = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrCombineElective = array1DElectiveCombine(combineArrayElective);


const checkDay = (combine,array,index) => {
    let c = 0
    let z = index
    while (c != 1){
        if(z >= 0 && z < 10){
            zeroMonday(array)
            zeroMondayCom(combine)
            c = 1
        }
        else if( z >= 10 && z < 20){
            zeroTuesday(array)
            zeroTuesdayCom(combine)
            c = 1
        }
        else if( z >= 20 && z < 30){
            zeroThursday(array)
            zeroThursdayCom(combine)
            c = 1
        }
        else if( z >= 30 && z< 38){
            zeroFriday(array)
            zeroFridayCom(combine)
            c = 1
        }
        else(
            z -= 38
        )
    }
}

const zeroMonday = (array) => {
    let totalRoom2 = array.length / 38

    for(let u = 0; u < 10; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( array[u+indexArray] ==100){
                    array[u+indexArray] = 0
                }
                if( array[u-indexArray] ==100){
                    array[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return array
}
const zeroMondayCom = (combine) => {
    let totalRoom2 = combine.length / 38

    for(let u = 0; u < 10; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( combine[u+indexArray] ==100){
                    combine[u+indexArray] = 0
                }
                if( combine[u-indexArray] ==100){
                    combine[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return combine
}

const zeroTuesday = (array) => {
    let totalRoom2 = array.length / 38

    for(let u = 10; u < 20; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( array[u+indexArray] ==100){
                    array[u+indexArray] = 0
                }
                if( array[u-indexArray] ==100){
                    array[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return array
}
const zeroTuesdayCom = (combine) => {
    let totalRoom2 = combine.length / 38

    for(let u = 10; u < 20; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( combine[u+indexArray] ==100){
                    combine[u+indexArray] = 0
                }
                if( combine[u-indexArray] ==100){
                    combine[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return combine
}

const zeroThursday = (array) => {
    let totalRoom2 = array.length / 38

    for(let u = 20; u < 30; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( array[u+indexArray] ==100){
                    array[u+indexArray] = 0
                }
                if( array[u-indexArray] ==100){
                    array[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return array
}
const zeroThursdayCom = (combine) => {
    let totalRoom2 = combine.length / 38

    for(let u = 20; u < 30; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( combine[u+indexArray] ==100){
                    combine[u+indexArray] = 0
                }
                if( combine[u-indexArray] ==100){
                    combine[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return combine
}

const zeroFriday = (array) => {
    let totalRoom2 = array.length / 38

    for(let u = 30; u < 38; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( array[u+indexArray] ==100){
                    array[u+indexArray] = 0
                }
                if( array[u-indexArray] ==100){
                    array[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return array
}
const zeroFridayCom = (combine) => {
    let totalRoom2 = combine.length / 38

    for(let u = 30; u < 38; u++){
        try{
            for(let b =0; b < totalRoom2; b++){
                let indexArray = b*38
                if( combine[u+indexArray] ==100){
                    combine[u+indexArray] = 0
                }
                if( combine[u-indexArray] ==100){
                    combine[u-indexArray] = 0
                }
            }   
        }catch{}
    }
    return combine
}





//create 1d array for dataset less than 50
const array1D50 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr50 = array1D50(DataArray50);


const AntAlgoInsert50 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let k7 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain1 = []
    let remain3 = []


        for(let x=0; x<filterData50.length;x++){
            if(filterData50[x][7] == 2){
                hms2.push(filterData50[x])
            }
            if(filterData50[x][7] == 4){
                hms4.push(filterData50[x])
            }
            if(filterData50[x][7] == 3){
                hms3.push(filterData50[x])
            }
            test.push(filterData50[x]);
        }

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i] == 100 && combine[i-1] == 100 && i-1 != -1){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i] = hms2[k];
                        combine[i-1] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }   
            }
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i] == 100 && combine[i-1] == 100 && i-1 != -1){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i] = hms4[k2];
                            combine[i-1] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v] == 100 && combine[v-1] == 100 && v-1 != -1){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v] = hms4[k2];
                                    combine[v-1] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i] == 100 && combine[i-1] == 100 && combine[i+1] == 100 && i-1 != -1 && i+1 != startIndex100 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i] = hms3[k3];
                        combine[i-1] = hms3[k3];
                        combine[i+1] = hms3[k3];
                    }    
                    else if(combine[i] == 100 && combine[i-1] == 100 && i-1 != -1){ // slot in 2 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i] = hms3[k3];
                            combine[i-1] = hms3[k3];
                            checkDay(combine,array,i)
                            const p = Math.floor(Math.random()*(i+1));
                            if(combine[p] == 100 ){
                                array[p] = -1;
                                combine[p] = hms3[k3];
                            }
                            else{
                                remain1.push(hms3[k3]);
                            }
                    }
                    else if(combine[i] == 100){ // slot in 1 course at one time
                        array[i] = -1;
                        combine[i] = hms3[k3];
                        checkDay(combine,array,i)
                        const y = Math.floor(Math.random()*(i+1));
                        if(combine[y] == 100 && combine[y-1] == 100 && y-1 != -1){
                            array[y] = -1;
                            array[y-1] = -1;
                            combine[y] = hms3[k3];
                            combine[y-1] = hms3[k3];
                        }
                        else{
                            remain2.push(hms3[k3]);
                        }
                    }
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }

        changeToZero(array)
        changeToZero(combine)
//________________________________________________________________________________________________________________________________
        // start slot in randomly
        //remainder of 2hrs
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j] == 100 && combine[j-1] == 100 && j-1 != -1){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j] = remain2[k4];
                            combine[j-1] = remain2[k4];
                            c = 1
                    }
                    else if(combine[j] == 100 && combine[j+1] == 100 && j+1 != startIndex100){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j] = remain2[k4];
                            combine[j+1] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }

        //remainder of 4hrs
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j] == 100 && combine[j-1] == 100 && j-1 != -1){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j] = remain4[k5];
                            combine[j-1] = remain4[k5];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v] == 100 && combine[v-1] == 100 && v-1 != -1){
                                    
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v] = remain4[k5];
                                    combine[v-1] = remain4[k5];
                                    b = 1
                                }
                                else if(combine[v] == 100 && combine[v+1] == 100 && v+1 != startIndex100){
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v] = remain4[k5];
                                    combine[v+1] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j] == 100 && combine[j+1] == 100 && j+1 != startIndex100){
                            
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j] = hms4[k2];
                            combine[j+1] = hms4[k2];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p] == 100 && combine[p-1] == 100 && p-1 != -1){
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p] = hms4[k2];
                                    combine[p-1] = hms4[k2];
                                    z = 1
                                }
                                else if(combine[p] == 100 && combine[p+1] == 100 && p+1 != startIndex100){
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p] = hms4[k2];
                                    combine[p+1] = hms4[k2];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //remainder of 3hrs
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    
                    if(combine[j] == 100 && combine[j-1] == 100 && combine[j+1] == 100 && j-1 != -1 && j+1 != startIndex100 ){ // slot in 3 course at one time
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j] = remain3[k6];
                        combine[j-1] = remain3[k6];
                        combine[j+1] = remain3[k6];
                        c = 1
                    }    
                    else if(combine[j] == 100 && combine[j-1] == 100 && j-1 != -1){// slot in 2 course at one time
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j] = remain3[k6];
                            combine[j-1] = remain3[k6];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v] == 100){
                                    array[v] = -1;
                                    combine[v] = remain3[k6];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j] == 100 && combine[j+1] == 100 && j+1 != startIndex100){ // slot in 2 course at one time
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j] = remain3[k6];
                            combine[j+1] = remain3[k6];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p] == 100 ){
                                    array[p] = -1;
                                    combine[p] = remain3[k6];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j] == 100){ // slot in 1 course at one time
                        array[j] = -1;
                        combine[j] = remain3[k6];
                        checkDay(combine,array,j)
                            let m = 0 
                            while(m != 1){
                                const y = Math.floor(Math.random()*(i+1));
                                if(combine[y] == 100 && combine[y-1] == 100 && y-1 != -1){
                                    array[y] = -1;
                                    array[y-1] = -1;
                                    combine[y] = remain3[k6];
                                    combine[y-1] = remain3[k6];
                                    m = 1
                                }
                                else if(combine[y] == 100 && combine[y+1] == 100 && y+1 != startIndex100){
                                    array[y] = -1;
                                    array[y+1] = -1;
                                    combine[y] = remain3[k6];
                                    combine[y+1] = remain3[k6];
                                    m = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        //remaindet of 1hr
        for(let i = array.length-1;i>0;i--){
            if(k7 < remain1.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j] == 100){
                            array[j] = -1;
                            combine[j] = remain1[k7];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k7++  
        }


    return array;
    
}

var AntArrIns50 = AntAlgoInsert50(AntArr50,AntArrCombine);


const checkAmountData50_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountData50_2(AntArrIns50)

const checkAmountData50_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountData50_0(AntArr50)

//______________________________________________________________________________________________________________________________________________

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

const AntAlgoInsert100 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let k7 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain1 = []
    let remain3 = []

        for(let x=0; x<filterData100.length;x++){
            if(filterData100[x][7] == 2){
                hms2.push(filterData100[x])
            }
            if(filterData100[x][7] == 4){
                hms4.push(filterData100[x])
            }
            if(filterData100[x][7] == 3){
                hms3.push(filterData100[x])
            }
            test.push(filterData100[x]);
        }


        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i+startIndex100] == 100 && combine[i-1] == 100 && i-1 != LastIndex50){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i+startIndex100] = hms2[k];
                        combine[i-1+startIndex100] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }  
            } 
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i+startIndex100] == 100 && combine[i-1+startIndex100] == 100 && i-1 != LastIndex50){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex100] = hms4[k2];
                            combine[i-1+startIndex100] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex100] == 100 && combine[v-1+startIndex100] == 100 && v-1 != LastIndex50){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex100] = hms4[k2];
                                    combine[v-1+startIndex100] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i+startIndex100] == 100 && combine[i-1+startIndex100] == 100 && combine[i+1+startIndex100] == 100 && i-1 != LastIndex50 && i+1 != startIndex200 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i+startIndex100] = hms3[k3];
                        combine[i-1+startIndex100] = hms3[k3];
                        combine[i+1+startIndex100] = hms3[k3];
                    }    
                    else if(combine[i+startIndex100] == 100 && combine[i-1+startIndex100] == 100 && i-1 != LastIndex50){ // slot in 2 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex100] = hms3[k3];
                            combine[i-1+startIndex100] = hms3[k3];
                            checkDay(combine,array,i)
                            const p = Math.floor(Math.random()*(i+1));
                            if(combine[p+startIndex100] == 100 ){
                                array[p] = -1;
                                combine[p+startIndex100] = hms3[k3];
                            }
                            else{
                                remain1.push(hms3[k3]);
                            }
                    }
                    else if(combine[i+startIndex100] == 100){ // slot in 1 course at one time
                        array[i] = -1;
                        combine[i] = hms3[k3+startIndex100];
                        checkDay(combine,array,i)
                        const y = Math.floor(Math.random()*(i+1));
                        if(combine[y+startIndex100] == 100 && combine[y-1+startIndex100] == 100 && y-1 != LastIndex50){
                            array[y] = -1;
                            array[y-1] = -1;
                            combine[y+startIndex100] = hms3[k3];
                            combine[y-1+startIndex100] = hms3[k3];
                        }
                        else{
                            remain2.push(hms3[k3]);
                        }
                    }
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }
        
        changeToZero(array)
        changeToZero(combine)
        //________________________________________________________________________________________________________________________________
                // start slot in randomly

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex100] == 100 && combine[j-1+startIndex100] == 100 && j-1 != LastIndex50){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex100] = remain2[k4];
                            combine[j-1+startIndex100] = remain2[k4];
                            c = 1
                    }
                    else if(combine[j+startIndex100] == 100 && combine[j+1+startIndex100] == 100 && j+1 != startIndex200){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex100] = remain2[k4];
                            combine[j+1+startIndex100] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }


        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex100] == 100 && combine[j-1+startIndex100] == 100 && j-1 != LastIndex50){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex100] = remain4[k5];
                            combine[j-1+startIndex100] = remain4[k5];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex100] == 100 && combine[v-1+startIndex100] == 100 && v-1 != LastIndex50){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex100] = remain4[k5];
                                    combine[v-1+startIndex100] = remain4[k5];
                                    b = 1
                                }
                                else if(combine[v+startIndex100] == 100 && combine[v+1+startIndex100] == 100 && v+1 != startIndex200){
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndex100] = remain4[k5];
                                    combine[v+1+startIndex100] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex100] == 100 && combine[j+1+startIndex100] == 100 && j+1 != startIndex200){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex100] = remain4[k5];
                            combine[j+1+startIndex100] = remain4[k5];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex100] == 100 && combine[p-1+startIndex100] == 100 && p-1 != LastIndex50){
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndex100] = remain4[k5];
                                    combine[p-1+startIndex100] = remain4[k5];
                                    z = 1
                                }
                                else if(combine[p+startIndex100] == 100 && combine[p+1+startIndex100] == 100 && p+1 != startIndex200){
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndex100] = remain4[k5];
                                    combine[p+1+startIndex100] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 <remain3.length){
    
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    if(combine[j+startIndex100] == 100 && combine[j-1+startIndex100] == 100 && combine[j+1+startIndex100] == 100 && j-1 != LastIndex50 && j+1 != startIndex200 ){ // slot in 3 course at one time
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndex100] = remain3[k6];
                        combine[j-1+startIndex100] = remain3[k6];
                        combine[j+1+startIndex100] = remain3[k6];
                        c = 1
                    }    
                    //else if(array[j] == 100 && array[j-1] == 100){// slot in 2 course at one time
                    else if(combine[j+startIndex100] == 100 && combine[j-1+startIndex100] == 100 && j-1 != LastIndex50){// slot in 2 course at one time
                            
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex100] = remain3[k6];
                            combine[j-1+startIndex100] = remain3[k6];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex100] == 100){
                                    array[v] = -1;
                                    combine[v+startIndex100] = remain3[k6];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex100] == 100 && combine[j+1+startIndex100] == 100 && j+1 != startIndex200){ // slot in 2 course at one time
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex100] = remain3[k6];
                            combine[j+1+startIndex100] = remain3[k6];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex100] == 100 ){
                                    array[p] = -1;
                                    combine[p+startIndex100] = remain3[k6];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex100] == 100){ // slot in 1 course at one time
                        array[j] = -1;
                        combine[j+startIndex100] = remain3[k6];
                        checkDay(combine,array,j)
                            let m = 0 
                            while(m != 1){
                                const y = Math.floor(Math.random()*(i+1));
                                if(combine[y+startIndex100] == 100 && combine[y-1+startIndex100] == 100 && y-1 != LastIndex50){
                                    array[y] = -1;
                                    array[y-1] = -1;
                                    combine[y+startIndex100] = remain3[k6];
                                    combine[y-1+startIndex100] = remain3[k6];
                                    m = 1
                                }
                                else if(combine[y+startIndex100] == 100 && combine[y+1+startIndex100] == 100 && y+1 != startIndex200){
                                    array[y] = -1;
                                    array[y+1] = -1;
                                    combine[y+startIndex100] = remain3[k6];
                                    combine[y+1+startIndex100] = remain3[k6];
                                    m = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        //remaindet of 1hr
        for(let i = array.length-1;i>0;i--){
            if(k7 < remain1.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex100] == 100){
                            array[j] = -1;
                            combine[j+startIndex100] = remain1[k7];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k7++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}
var AntArrIns100 = AntAlgoInsert100(AntArr100,AntArrCombine);


const checkAmountData100_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountData100_2(AntArrIns100)

const checkAmountData100_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountData100_0(AntArr100)

// // _____________________________________________________________________________________________________________________________________________________


const array1D200 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr200 = array1D200(DataArray200);


const AntAlgoInsert200 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let k7 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain1 = []
    let remain3 = []

        for(let x=0; x<filterData200.length;x++){
            if(filterData200[x][7] == 2){
                hms2.push(filterData200[x])
            }
            if(filterData200[x][7] == 4){
                hms4.push(filterData200[x])
            }
            if(filterData200[x][7] == 3){
                hms3.push(filterData200[x])
            }
            test.push(filterData200[x]);
        }


        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i+startIndex200] == 100 && combine[i-1] == 100 && i-1 != LastIndex100){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i+startIndex200] = hms2[k];
                        combine[i-1+startIndex200] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }  
            } 
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i+startIndex200] == 100 && combine[i-1+startIndex200] == 100 && i-1 != LastIndex100){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex200] = hms4[k2];
                            combine[i-1+startIndex200] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex200] == 100 && combine[v-1+startIndex200] == 100 && v-1 != LastIndex100){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex200] = hms4[k2];
                                    combine[v-1+startIndex200] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i+startIndex200] == 100 && combine[i-1+startIndex200] == 100 && combine[i+1+startIndex200] == 100 && i-1 != LastIndex100 && i+1 != startIndex500 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i+startIndex200] = hms3[k3];
                        combine[i-1+startIndex200] = hms3[k3];
                        combine[i+1+startIndex200] = hms3[k3];
                    }    
                    else if(combine[i+startIndex200] == 100 && combine[i-1+startIndex200] == 100 && i-1 != LastIndex100){ // slot in 2 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex200] = hms3[k3];
                            combine[i-1+startIndex200] = hms3[k3];
                            checkDay(combine,array,i)
                            const p = Math.floor(Math.random()*(i+1));
                            if(combine[p+startIndex200] == 100 ){
                                array[p] = -1;
                                combine[p+startIndex200] = hms3[k3];
                            }
                            else{
                                remain1.push(hms3[k3]);
                            }
                    }
                    else if(combine[i+startIndex200] == 100){ // slot in 1 course at one time
                        array[i] = -1;
                        combine[i] = hms3[k3+startIndex200];
                        checkDay(combine,array,i)
                        const y = Math.floor(Math.random()*(i+1));
                        if(combine[y+startIndex200] == 100 && combine[y-1+startIndex200] == 100 && y-1 != LastIndex100){
                            array[y] = -1;
                            array[y-1] = -1;
                            combine[y+startIndex200] = hms3[k3];
                            combine[y-1+startIndex200] = hms3[k3];
                        }
                        else{
                            remain2.push(hms3[k3]);
                        }
                    }
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }
        
        changeToZero(array)
        changeToZero(combine)
        //________________________________________________________________________________________________________________________________
                // start slot in randomly

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex200] == 100 && combine[j-1+startIndex200] == 100 && j-1 != LastIndex100){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex200] = remain2[k4];
                            combine[j-1+startIndex200] = remain2[k4];
                            c = 1
                    }
                    else if(combine[j+startIndex200] == 100 && combine[j+1+startIndex200] == 100 && j+1 != startIndex500){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex200] = remain2[k4];
                            combine[j+1+startIndex200] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }


        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex200] == 100 && combine[j-1+startIndex200] == 100 && j-1 != LastIndex100){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex200] = remain4[k5];
                            combine[j-1+startIndex200] = remain4[k5];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex200] == 100 && combine[v-1+startIndex200] == 100 && v-1 != LastIndex100){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex200] = remain4[k5];
                                    combine[v-1+startIndex200] = remain4[k5];
                                    b = 1
                                }
                                else if(combine[v+startIndex200] == 100 && combine[v+1+startIndex200] == 100 && v+1 != startIndex500){
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndex200] = remain4[k5];
                                    combine[v+1+startIndex200] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex200] == 100 && combine[j+1+startIndex200] == 100 && j+1 != startIndex500){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex200] = remain4[k5];
                            combine[j+1+startIndex200] = remain4[k5];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex200] == 100 && combine[p-1+startIndex200] == 100 && p-1 != LastIndex100){
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndex200] = remain4[k5];
                                    combine[p-1+startIndex200] = remain4[k5];
                                    z = 1
                                }
                                else if(combine[p+startIndex200] == 100 && combine[p+1+startIndex200] == 100 && p+1 != startIndex500){
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndex200] = remain4[k5];
                                    combine[p+1+startIndex200] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 <remain3.length){
    
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    if(combine[j+startIndex200] == 100 && combine[j-1+startIndex200] == 100 && combine[j+1+startIndex200] == 100 && j-1 != LastIndex100 && j+1 != startIndex500 ){ // slot in 3 course at one time
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndex200] = remain3[k6];
                        combine[j-1+startIndex200] = remain3[k6];
                        combine[j+1+startIndex200] = remain3[k6];
                        c = 1
                    }    
                    //else if(array[j] == 100 && array[j-1] == 100){// slot in 2 course at one time
                    else if(combine[j+startIndex200] == 100 && combine[j-1+startIndex200] == 100 && j-1 != LastIndex100){// slot in 2 course at one time
                            
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex200] = remain3[k6];
                            combine[j-1+startIndex200] = remain3[k6];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex200] == 100){
                                    array[v] = -1;
                                    combine[v+startIndex200] = remain3[k6];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex200] == 100 && combine[j+1+startIndex200] == 100 && j+1 != startIndex500){ // slot in 2 course at one time
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex200] = remain3[k6];
                            combine[j+1+startIndex200] = remain3[k6];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex200] == 100 ){
                                    array[p] = -1;
                                    combine[p+startIndex200] = remain3[k6];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex200] == 100){ // slot in 1 course at one time
                        array[j] = -1;
                        combine[j+startIndex200] = remain3[k6];
                        checkDay(combine,array,j)
                            let m = 0 
                            while(m != 1){
                                const y = Math.floor(Math.random()*(i+1));
                                if(combine[y+startIndex200] == 100 && combine[y-1+startIndex200] == 100 && y-1 != LastIndex100){
                                    array[y] = -1;
                                    array[y-1] = -1;
                                    combine[y+startIndex200] = remain3[k6];
                                    combine[y-1+startIndex200] = remain3[k6];
                                    m = 1
                                }
                                else if(combine[y+startIndex200] == 100 && combine[y+1+startIndex200] == 100 && y+1 != startIndex500){
                                    array[y] = -1;
                                    array[y+1] = -1;
                                    combine[y+startIndex200] = remain3[k6];
                                    combine[y+1+startIndex200] = remain3[k6];
                                    m = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        //remaindet of 1hr
        for(let i = array.length-1;i>0;i--){
            if(k7 < remain1.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex200] == 100){
                            array[j] = -1;
                            combine[j+startIndex200] = remain1[k7];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k7++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}

var AntArrIns200 = AntAlgoInsert200(AntArr200,AntArrCombine);


const checkAmountData200_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=200 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountData200_2(AntArrIns200)

const checkAmountData200_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountData200_0(AntArr200)


// // //________________________________________________________________________________________________________________________________________________________


const array1D500 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArr500 = array1D500(DataArray500);


const AntAlgoInsert500 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let k7 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain1 = []
    let remain3 = []


        for(let x=0; x<filterData500.length;x++){
            if(filterData500[x][7] == 2){
                hms2.push(filterData500[x])
            }
            if(filterData500[x][7] == 4){
                hms4.push(filterData500[x])
            }
            if(filterData500[x][7] == 3){
                hms3.push(filterData500[x])
            }
            test.push(filterData500[x]);
        }

        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i+startIndex500] == 100 && combine[i-1] == 100 && i-1 != LastIndex200){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i+startIndex500] = hms2[k];
                        combine[i-1+startIndex500] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }  
            } 
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i+startIndex500] == 100 && combine[i-1+startIndex500] == 100 && i-1 != LastIndex200){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex500] = hms4[k2];
                            combine[i-1+startIndex500] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex500] == 100 && combine[v-1+startIndex500] == 100 && v-1 != LastIndex200){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex500] = hms4[k2];
                                    combine[v-1+startIndex500] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i+startIndex500] == 100 && combine[i-1+startIndex500] == 100 && combine[i+1+startIndex500] == 100 && i-1 != LastIndex200 && i+1 != startIndex500 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i+startIndex500] = hms3[k3];
                        combine[i-1+startIndex500] = hms3[k3];
                        combine[i+1+startIndex500] = hms3[k3];
                    }    
                    else if(combine[i+startIndex500] == 100 && combine[i-1+startIndex500] == 100 && i-1 != LastIndex200){ // slot in 2 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndex500] = hms3[k3];
                            combine[i-1+startIndex500] = hms3[k3];
                            checkDay(combine,array,i)
                            const p = Math.floor(Math.random()*(i+1));
                            if(combine[p+startIndex500] == 100 ){
                                array[p] = -1;
                                combine[p+startIndex500] = hms3[k3];
                            }
                            else{
                                remain1.push(hms3[k3]);
                            }
                    }
                    else if(combine[i+startIndex500] == 100){ // slot in 1 course at one time
                        array[i] = -1;
                        combine[i] = hms3[k3+startIndex500];
                        checkDay(combine,array,i)
                        const y = Math.floor(Math.random()*(i+1));
                        if(combine[y+startIndex500] == 100 && combine[y-1+startIndex500] == 100 && y-1 != LastIndex200){
                            array[y] = -1;
                            array[y-1] = -1;
                            combine[y+startIndex500] = hms3[k3];
                            combine[y-1+startIndex500] = hms3[k3];
                        }
                        else{
                            remain2.push(hms3[k3]);
                        }
                    }
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }
        
        changeToZero(array)
        changeToZero(combine)
        //________________________________________________________________________________________________________________________________
                // start slot in randomly

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                
    
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndex500] == 100 && combine[j-1+startIndex500] == 100 && j-1 != LastIndex200){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex500] = remain2[k4];
                            combine[j-1+startIndex500] = remain2[k4];
                            c = 1
                    }
                
                    else if(combine[j+startIndex500] == 100 && combine[j+1+startIndex500] == 100){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex500] = remain2[k4];
                            combine[j+1+startIndex500] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }


        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
            
                
    
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndex500] == 100 && combine[j-1+startIndex500] == 100 && j-1 != LastIndex200){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex500] = remain4[k5];
                            combine[j-1+startIndex500] = remain4[k5];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex500] == 100 && combine[v-1+startIndex500] == 100 && v-1 != LastIndex200){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndex500] = remain4[k5];
                                    combine[v-1+startIndex500] = remain4[k5];
                                    b = 1
                                }
                                else if(combine[v+startIndex500] == 100 && combine[v+1+startIndex500] == 100){
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndex500] = remain4[k5];
                                    combine[v+1+startIndex500] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                
                    else if(combine[j+startIndex500] == 100 && combine[j+1+startIndex500] == 100){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex500] = remain4[k5];
                            combine[j+1+startIndex500] = remain4[k5];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex500] == 100 && combine[p-1+startIndex500] == 100 && p-1 != LastIndex200){
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndex500] = remain4[k5];
                                    combine[p-1+startIndex500] = remain4[k5];
                                    z = 1
                                }
                                else if(combine[p+startIndex500] == 100 && combine[p+1+startIndex500] == 100 ){
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndex500] = remain4[k5];
                                    combine[p+1+startIndex500] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
                
    
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    if(combine[j+startIndex500] == 100 && combine[j-1+startIndex500] == 100 && combine[j+1+startIndex500] == 100 && j-1 != LastIndex200 ){ // slot in 3 course at one time
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndex500] = remain3[k6];
                        combine[j-1+startIndex500] = remain3[k6];
                        combine[j+1+startIndex500] = remain3[k6];
                        c = 1
                    }    
                    else if(combine[j+startIndex500] == 100 && combine[j-1+startIndex500] == 100 && j-1 != LastIndex200){// slot in 2 course at one time
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndex500] = remain3[k6];
                            combine[j-1+startIndex500] = remain3[k6];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndex500] == 100){
                                    array[v] = -1;
                                    combine[v+startIndex500] = remain3[k6];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                 // slot in 2 course at one time
                    else if(combine[j+startIndex500] == 100 && combine[j+1+startIndex500] == 100){ // slot in 2 course at one time
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndex500] = remain3[k6];
                            combine[j+1+startIndex500] = remain3[k6];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p+startIndex500] == 100 ){
                                    array[p] = -1;
                                    combine[p+startIndex500] = remain3[k6];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j+startIndex500] == 100){ // slot in 1 course at one time
                        array[j] = -1;
                        combine[j+startIndex500] = remain3[k6];
                        checkDay(combine,array,j)
                            let m = 0 
                            while(m != 1){
                                const y = Math.floor(Math.random()*(i+1));
                                if(combine[y+startIndex500] == 100 && combine[y-1+startIndex500] == 100 && y-1 != LastIndex200){
                                    array[y] = -1;
                                    array[y-1] = -1;
                                    combine[y+startIndex500] = remain3[k6];
                                    combine[y-1+startIndex500] = remain3[k6];
                                    m = 1
                                }
                                else if(combine[y+startIndex500] == 100 && combine[y+1+startIndex500] == 100){
                                    array[y] = -1;
                                    array[y+1] = -1;
                                    combine[y+startIndex500] = remain3[k6];
                                    combine[y+1+startIndex500] = remain3[k6];
                                    m = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        for(let i = array.length-1;i>0;i--){
            if(k7 < remain1.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j+startIndex500] == 100){
                            array[j] = -1;
                            combine[j+startIndex500] = remain1[k7];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k7++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}

var AntArrIns500 = AntAlgoInsert500(AntArr500,AntArrCombine);


const checkAmountData500_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=500 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountData500_2(AntArrIns500)

const checkAmountData500_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountData500_0(AntArr500)


//______________________________________________________________________________________________________________________________________________
//Elective Courses

const array1DElective50 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective50 = array1DElective50(DataArrayElective50);

const AntAlgoInsertElective50 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain3 = []


        for(let x=0; x<filterDataElective50.length;x++){
            if(filterDataElective50[x][7] == 2){
                hms2.push(filterDataElective50[x])
            }
            if(filterDataElective50[x][7] == 4){
                hms4.push(filterDataElective50[x])
            }
            if(filterDataElective50[x][7] == 3){
                hms3.push(filterDataElective50[x])
            }
            test.push(filterDataElective50[x]);
        }

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i] == 100 && combine[i-1] == 100 && i-1 != -1){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i] = hms2[k];
                        combine[i-1] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }   
            }
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i] == 100 && combine[i-1] == 100 && i-1 != -1){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i] = hms4[k2];
                            combine[i-1] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v] == 100 && combine[v-1] == 100 && v-1 != -1){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v] = hms4[k2];
                                    combine[v-1] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i] == 100 && combine[i-1] == 100 && combine[i+1] == 100 && i-1 != -1 && i+1 != startIndex100 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i] = hms3[k3];
                        combine[i-1] = hms3[k3];
                        combine[i+1] = hms3[k3];
                    }    
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }


        changeToZero(array)
        changeToZero(combine)
//________________________________________________________________________________________________________________________________
        // start slot in randomly
        //remainder of 2hrs
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j] == 100 && combine[j-1] == 100 && j-1 != -1){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j] = remain2[k4];
                            combine[j-1] = remain2[k4];
                            c = 1
                    }
                    else if(combine[j] == 100 && combine[j+1] == 100 && j+1 != startIndexElective100){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j] = remain2[k4];
                            combine[j+1] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }

        //remainder of 4hrs
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
                    if(combine[j] == 100 && combine[j-1] == 100 && j-1 != -1){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j] = remain4[k5];
                            combine[j-1] = remain4[k5];
                            checkDay(combine,array,j)
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                if(combine[v] == 100 && combine[v-1] == 100 && v-1 != -1){
                                    
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v] = remain4[k5];
                                    combine[v-1] = remain4[k5];
                                    b = 1
                                }
                                else if(combine[v] == 100 && combine[v+1] == 100 && v+1 != startIndexElective100){
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v] = remain4[k5];
                                    combine[v+1] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                    else if(combine[j] == 100 && combine[j+1] == 100 && j+1 != startIndexElective100){
                            
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j] = remain4[k5];
                            combine[j+1] = remain4[k5];
                            checkDay(combine,array,j)
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                if(combine[p] == 100 && combine[p-1] == 100 && p-1 != -1){
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p] = remain4[k5];;
                                    combine[p-1] = remain4[k5];;
                                    z = 1
                                }
                                else if(combine[p] == 100 && combine[p+1] == 100 && p+1 != startIndexElective100){
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p] = remain4[k5];;
                                    combine[p+1] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //remainder of 3hrs
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    
                    
                    if(combine[j] == 100 && combine[j-1] == 100 && combine[j+1] == 100 && j-1 != -1 && j+1 != startIndexElective100 ){ // slot in 3 course at one time
                        
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j] = remain3[k6];
                        combine[j-1] = remain3[k6];
                        combine[j+1] = remain3[k6];
                        c = 1
                    }    
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

    return array;
    
}


var AntArrInsElective50 = AntAlgoInsertElective50(AntArrElective50,AntArrCombineElective);

const checkAmountDataElective50_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=50 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountDataElective50_2(AntArrInsElective50)

const checkAmountDataElective50_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountDataElective50_0(AntArrElective50)


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


const AntAlgoInsertElective100 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain3 = []


        for(let x=0; x<filterDataElective100.length;x++){
            if(filterDataElective100[x][7] == 2){
                hms2.push(filterDataElective100[x])
            }
            if(filterDataElective100[x][7] == 4){
                hms4.push(filterDataElective100[x])
            }
            if(filterDataElective100[x][7] == 3){
                hms3.push(filterDataElective100[x])
            }
            test.push(filterDataElective100[x]);
        }

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k < hms2.length){
                if(combine[i+startIndexElective100] == 100 && combine[i-1+startIndexElective100] == 100 && i-1 != LastIndexElective50){
                        array[i] = -1;
                        array[i-1] = -1;
                        combine[i+startIndexElective100] = hms2[k];
                        combine[i-1+startIndexElective100] = hms2[k];
                }
                else{
                    remain2.push(hms2[k])
                }   
            }
            changeToZero(array)
            changeToZero(combine)
            k++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k2 < hms4.length){
                    if(combine[i+startIndexElective100] == 100 && combine[i-1+startIndexElective100] == 100 && i-1 != LastIndexElective50){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndexElective100] = hms4[k2];
                            combine[i-1+startIndexElective100] = hms4[k2];
                            checkDay(combine,array,i)
                            const v = Math.floor(Math.random()*(i+1));
                                if(combine[v+startIndexElective100] == 100 && combine[v-1+startIndexElective100] == 100 && v-1 != LastIndexElective50){
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndexElective100] = hms4[k2];
                                    combine[v-1+startIndexElective100] = hms4[k2];
                                }
                                else{
                                    remain2.push(hms4[k2])
                                }
                    }
                    else{
                        remain4.push(hms4[k2])
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k3 < hms3.length){
                    if(combine[i+startIndexElective100] == 100 && combine[i-1+startIndexElective100] == 100 && combine[i+1+startIndexElective100] == 100 && i-1 != LastIndexElective50 && i+1 != startIndexElective200 ){ // slot in 3 course at one time
                        array[i] = -1;
                        array[i-1] = -1;
                        array[i+1] = -1;
                        combine[i+startIndexElective100] = hms3[k3];
                        combine[i-1+startIndexElective100] = hms3[k3];
                        combine[i+1+startIndexElective100] = hms3[k3];
                    }    
                    else{
                        remain3.push(hms3[k3]);
                    }
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }
    
    
            changeToZero(array)
            changeToZero(combine)
    //________________________________________________________________________________________________________________________________
            // start slot in randomly
        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain4.length){
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective100] == 100 && combine[j-1+startIndexElective100] == 100 && j-1 != LastIndexElective50){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective100] = remain2[k4];
                            combine[j-1+startIndexElective100] = remain2[k4];
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective100] == 100 && combine[j+1+startIndexElective100] == 100 && j+1 != startIndexElective200){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective100] = remain2[k4];
                            combine[j+1+startIndexElective100] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }


        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective100] == 100 && combine[j-1+startIndexElective100] == 100 && j-1 != LastIndexElective50){
                            
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective100] = remain4[k5];
                            combine[j-1+startIndexElective100] = remain4[k5];
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                
                                if(combine[v+startIndexElective100] == 100 && combine[v-1+startIndexElective100] == 100 && v-1 != LastIndexElective50){
                                    
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndexElective100] = remain4[k5];
                                    combine[v-1+startIndexElective100] = remain4[k5];
                                    b = 1
                                }
                                
                                else if(combine[v+startIndexElective100] == 100 && combine[v+1+startIndexElective100] == 100 && v+1 != startIndexElective200){
                                    
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndexElective100] = remain4[k5];
                                    combine[v+1+startIndexElective100] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective100] == 100 && combine[j+1+startIndexElective100] == 100 && j+1 != startIndexElective200){
                            
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective100] = remain4[k5];
                            combine[j+1+startIndexElective100] = remain4[k5];
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                
                                if(combine[p+startIndexElective100] == 100 && combine[p-1+startIndexElective100] == 100 && p-1 != LastIndexElective50){
                                    
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndexElective100] = remain4[k5];
                                    combine[p-1+startIndexElective100] = remain4[k5];
                                    z = 1
                                }
                                
                                else if(combine[p+startIndexElective100] == 100 && combine[p+1+startIndexElective100] == 100 && p+1 != startIndexElective200){
                                    
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndexElective100] = remain4[k5];
                                    combine[p+1+startIndexElective100] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    
                    
                    if(combine[j+startIndexElective100] == 100 && combine[j-1+startIndexElective100] == 100 && combine[j+1+startIndexElective100] == 100 && j-1 != LastIndexElective50 && j+1 != startIndexElective200 ){ // slot in 3 course at one time
                        
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndexElective100] = remain3[k6];
                        combine[j-1+startIndexElective100] = remain3[k6];
                        combine[j+1+startIndexElective100] = remain3[k6];
                        c = 1
                    }    

                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}

var AntArrInsElective100 = AntAlgoInsertElective100(AntArrElective100,AntArrCombineElective);

const checkAmountDataElective100_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountDataElective100_2(AntArrInsElective100)


const checkAmountDataElective100_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountDataElective100_0(AntArrElective100)



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


const AntAlgoInsertElective200 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain3 = []


        for(let x=0; x<filterDataElective200.length;x++){
            if(filterDataElective200[x][7] == 2){
                hms2.push(filterDataElective200[x])
            }
            if(filterDataElective200[x][7] == 4){
                hms4.push(filterDataElective200[x])
            }
            if(filterDataElective200[x][7] == 3){
                hms3.push(filterDataElective200[x])
            }
            test.push(filterDataElective200[x]);
        }

               //slot in  2 hours of meeting student course
               for(let i = array.length-1;i>0;i--){
                if(k < hms2.length){
                    if(combine[i+startIndexElective200] == 100 && combine[i-1+startIndexElective200] == 100 && i-1 != LastIndexElective100){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndexElective200] = hms2[k];
                            combine[i-1+startIndexElective200] = hms2[k];
                    }
                    else{
                        remain2.push(hms2[k])
                    }   
                }
                changeToZero(array)
                changeToZero(combine)
                k++  
            }
    
            //slot in  4 hours of meeting student course 
            for(let i = array.length-1;i>0;i--){
                if(k2 < hms4.length){
                        if(combine[i+startIndexElective200] == 100 && combine[i-1+startIndexElective200] == 100 && i-1 != LastIndexElective100){
                                array[i] = -1;
                                array[i-1] = -1;
                                combine[i+startIndexElective200] = hms4[k2];
                                combine[i-1+startIndexElective200] = hms4[k2];
                                checkDay(combine,array,i)
                                const v = Math.floor(Math.random()*(i+1));
                                    if(combine[v+startIndexElective200] == 100 && combine[v-1+startIndexElective200] == 100 && v-1 != LastIndexElective100){
                                        array[v] = -1;
                                        array[v-1] = -1;
                                        combine[v+startIndexElective200] = hms4[k2];
                                        combine[v-1+startIndexElective200] = hms4[k2];
                                    }
                                    else{
                                        remain2.push(hms4[k2])
                                    }
                        }
                        else{
                            remain4.push(hms4[k2])
                        }
                }
                changeToZero(array)
                changeToZero(combine)
                k2++  
            }
    
            //slot in  3 hours of meeting student course
            for(let i = array.length-1;i>0;i--){
                if(k3 < hms3.length){
                        if(combine[i+startIndexElective200] == 100 && combine[i-1+startIndexElective200] == 100 && combine[i+1+startIndexElective200] == 100 && i-1 != LastIndexElective100 && i+1 != startIndexElective200 ){ // slot in 3 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            array[i+1] = -1;
                            combine[i+startIndexElective200] = hms3[k3];
                            combine[i-1+startIndexElective200] = hms3[k3];
                            combine[i+1+startIndexElective200] = hms3[k3];
                        }    
                        else{
                            remain3.push(hms3[k3]);
                        }
                }
                changeToZero(array)
                changeToZero(combine)
                k3++  
            }
        
        
                changeToZero(array)
                changeToZero(combine)
        //________________________________________________________________________________________________________________________________
                // start slot in randomly

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective200] == 100 && combine[j-1+startIndexElective200] == 100 && j-1 != LastIndexElective100){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective200] = remain2[k4];
                            combine[j-1+startIndexElective200] = remain2[k4];
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective200] == 100 && combine[j+1+startIndexElective200] == 100 && j+1 != startIndexElective500){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective200] = remain2[k4];
                            combine[j+1+startIndexElective200] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k4++  
        }

        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective200] == 100 && combine[j-1+startIndexElective200] == 100 && j-1 != LastIndexElective100){
                            
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective200] = remain4[k5];
                            combine[j-1+startIndexElective200] = remain4[k5];
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                
                                if(combine[v+startIndexElective200] == 100 && combine[v-1+startIndexElective200] == 100 && v-1 != LastIndexElective100){
                                    
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndexElective200] = remain4[k5];
                                    combine[v-1+startIndexElective200] = remain4[k5];
                                    b = 1
                                }
                                
                                else if(combine[v+startIndexElective200] == 100 && combine[v+1+startIndexElective200] == 100 && v+1 != startIndexElective500){
                                    
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndexElective200] = remain4[k5];
                                    combine[v+1+startIndexElective200] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective200] == 100 && combine[j+1+startIndexElective200] == 100 && j+1 != startIndexElective500){
                            
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective200] = remain4[k5];
                            combine[j+1+startIndexElective200] = remain4[k5];
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                
                                if(combine[p+startIndexElective200] == 100 && combine[p-1+startIndexElective200] == 100 && p-1 != LastIndexElective100){
                                    
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndexElective200] = remain4[k5];
                                    combine[p-1+startIndexElective200] = remain4[k5];
                                    z = 1
                                }
                                
                                else if(combine[p+startIndexElective200] == 100 && combine[p+1+startIndexElective200] == 100 && p+1 != startIndexElective500){
                                    
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndexElective200] =remain4[k5];
                                    combine[p+1+startIndexElective200] =remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k5++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    
                    
                    if(combine[j+startIndexElective200] == 100 && combine[j-1+startIndexElective200] == 100 && combine[j+1+startIndexElective200] == 100 && j-1 != LastIndexElective100 && j+1 != startIndexElective500 ){ // slot in 3 course at one time
                        
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndexElective200] = remain3[k6];
                        combine[j-1+startIndexElective200] = remain3[k6];
                        combine[j+1+startIndexElective200] = remain3[k6];
                        c = 1
                    }    
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k6++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}
var AntArrInsElective200 = AntAlgoInsertElective200(AntArrElective200,AntArrCombineElective);

const checkAmountDataElective200_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=200 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountDataElective200_2(AntArrInsElective200)


const checkAmountDataElective200_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountDataElective200_0(AntArrElective200)

// //___________________________________________________________________________________________________________________________________

// //___________________________________________________________________________________________________________________________________

const array1DElective500 = (data) => {
    var result = []

    for(let i = 0; i< data; i++){
        result[i]= 100;
    }
    return result;
}
var AntArrElective500 = array1DElective500(DataArrayElective500);


const AntAlgoInsertElective500 = (array,combine) => {


    let test = []
    let k = 0;
    let k2 =0
    let k3 =0
    let k4 =0
    let k5 =0
    let k6 =0
    let k7 =0
    let hms2 = []
    let hms3 = []
    let hms4 = []
    let remain4 = []
    let remain2 = []
    let remain1 = []
    let remain3 = []


        for(let x=0; x<filterDataElective500.length;x++){
            if(filterDataElective500[x][7] == 2){
                hms2.push(filterDataElective500[x])
            }
            if(filterDataElective500[x][7] == 4){
                hms4.push(filterDataElective500[x])
            }
            if(filterDataElective500[x][7] == 3){
                hms3.push(filterDataElective500[x])
            }
            test.push(filterDataElective500[x]);
        }

                      //slot in  2 hours of meeting student course
               for(let i = array.length-1;i>0;i--){
                if(k < hms2.length){
                    if(combine[i+startIndexElective500] == 100 && combine[i-1+startIndexElective500] == 100 && i-1 != LastIndexElective200){
                            array[i] = -1;
                            array[i-1] = -1;
                            combine[i+startIndexElective500] = hms2[k];
                            combine[i-1+startIndexElective500] = hms2[k];
                    }
                    else{
                        remain2.push(hms2[k])
                    }   
                }
                changeToZero(array)
                changeToZero(combine)
                k++  
            }
    
            //slot in  4 hours of meeting student course 
            for(let i = array.length-1;i>0;i--){
                if(k2 < hms4.length){
                        if(combine[i+startIndexElective500] == 100 && combine[i-1+startIndexElective500] == 100 && i-1 != LastIndexElective200){
                                array[i] = -1;
                                array[i-1] = -1;
                                combine[i+startIndexElective500] = hms4[k2];
                                combine[i-1+startIndexElective500] = hms4[k2];
                                checkDay(combine,array,i)
                                const v = Math.floor(Math.random()*(i+1));
                                    if(combine[v+startIndexElective500] == 100 && combine[v-1+startIndexElective500] == 100 && v-1 != LastIndexElective200){
                                        array[v] = -1;
                                        array[v-1] = -1;
                                        combine[v+startIndexElective500] = hms4[k2];
                                        combine[v-1+startIndexElective500] = hms4[k2];
                                    }
                                    else{
                                        remain2.push(hms4[k2])
                                    }
                        }
                        else{
                            remain4.push(hms4[k2])
                        }
                }
                changeToZero(array)
                changeToZero(combine)
                k2++  
            }
    
            //slot in  3 hours of meeting student course
            for(let i = array.length-1;i>0;i--){
                if(k3 < hms3.length){
                        if(combine[i+startIndexElective500] == 100 && combine[i-1+startIndexElective500] == 100 && combine[i+1+startIndexElective500] == 100 && i-1 != LastIndexElective200 && i+1 != startIndexElective500 ){ // slot in 3 course at one time
                            array[i] = -1;
                            array[i-1] = -1;
                            array[i+1] = -1;
                            combine[i+startIndexElective500] = hms3[k3];
                            combine[i-1+startIndexElective500] = hms3[k3];
                            combine[i+1+startIndexElective500] = hms3[k3];
                        }    
                        else{
                            remain3.push(hms3[k3]);
                        }
                }
                changeToZero(array)
                changeToZero(combine)
                k3++  
            }
        
        
                changeToZero(array)
                changeToZero(combine)
        //________________________________________________________________________________________________________________________________
                // start slot in randomly

        //slot in  2 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k4 < remain2.length){
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective500] == 100 && combine[j-1+startIndexElective500] == 100 && j-1 != LastIndexElective200){
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective500] = remain2[k4];
                            combine[j-1+startIndexElective500] = remain2[k4];
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective500] == 100 && combine[j+1+startIndexElective500] == 100){
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective500] = remain2[k4];
                            combine[j+1+startIndexElective500] = remain2[k4];
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k++  
        }


        //slot in  4 hours of meeting student course 
        for(let i = array.length-1;i>0;i--){
            if(k5 < remain4.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));    
            
                    if(combine[j+startIndexElective500] == 100 && combine[j-1+startIndexElective500] == 100 && j-1 != LastIndexElective200){
                            
                            array[j] = -1;
                            array[j-1] = -1;
                            combine[j+startIndexElective500] = remain4[k5];
                            combine[j-1+startIndexElective500] = remain4[k5];
                            let b = 0 
                            while(b != 1){
                                const v = Math.floor(Math.random()*(i+1));
                                
                                if(combine[v+startIndexElective500] == 100 && combine[v-1+startIndexElective500] == 100 && v-1 != LastIndexElective200){
                                    
                                    array[v] = -1;
                                    array[v-1] = -1;
                                    combine[v+startIndexElective500] = remain4[k5];
                                    combine[v-1+startIndexElective500] = remain4[k5];
                                    b = 1
                                }
                                
                                else if(combine[v+startIndexElective500] == 100 && combine[v+1+startIndexElective500] == 100){
                                    
                                    array[v] = -1;
                                    array[v+1] = -1;
                                    combine[v+startIndexElective500] = remain4[k5];
                                    combine[v+1+startIndexElective500] = remain4[k5];
                                    b = 1
                                }
                            }
                            c = 1
                    }
                
                    else if(combine[j+startIndexElective500] == 100 && combine[j+1+startIndexElective500] == 100){
                            
                            array[j] = -1;
                            array[j+1] = -1;
                            combine[j+startIndexElective500] = remain4[k5];
                            combine[j+1+startIndexElective500] = remain4[k5];
                            let z = 0 
                            while(z != 1){
                                const p = Math.floor(Math.random()*(i+1));
                                
                                if(combine[p+startIndexElective500] == 100 && combine[p-1+startIndexElective500] == 100 && p-1 != LastIndexElective200){
                                    
                                    array[p] = -1;
                                    array[p-1] = -1;
                                    combine[p+startIndexElective500] = remain4[k5];
                                    combine[p-1+startIndexElective500] = remain4[k5];
                                    z = 1
                                }
                                
                                else if(combine[p+startIndexElective500] == 100 && combine[p+1+startIndexElective500] == 100 ){
                                    
                                    array[p] = -1;
                                    array[p+1] = -1;
                                    combine[p+startIndexElective500] = remain4[k5];
                                    combine[p+1+startIndexElective500] = remain4[k5];
                                    z = 1
                                }
                            }
                            c = 1
                    }
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k2++  
        }

        //slot in  3 hours of meeting student course
        for(let i = array.length-1;i>0;i--){
            if(k6 < remain3.length){
            
                
                let c = 0
                while(c != 1){
                    const j = Math.floor(Math.random()*(i+1));
                    
                    
                    if(combine[j+startIndexElective500] == 100 && combine[j-1+startIndexElective500] == 100 && combine[j+1+startIndexElective500] == 100 && j-1 != LastIndexElective200 ){ // slot in 3 course at one time
                        
                        array[j] = -1;
                        array[j-1] = -1;
                        array[j+1] = -1;
                        combine[j+startIndexElective500] = remain3[k6];
                        combine[j-1+startIndexElective500] = remain3[k6];
                        combine[j+1+startIndexElective500] = remain3[k6];
                        c = 1
                    }    
                }    
            }
            changeToZero(array)
            changeToZero(combine)
            k3++  
        }

        changeToZero(array)
        changeToZero(combine)

    return array;
    
}


var AntArrInsElective500 = AntAlgoInsertElective500(AntArrElective500,AntArrCombineElective);

const checkAmountDataElective500_2 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=500 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_2 = checkAmountDataElective500_2(AntArrInsElective500)


const checkAmountDataElective500_0 = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
var checkAmount_0 = checkAmountDataElective500_0(AntArrElective500)

//______________________________________________________________________________________________________________________________________________



//---------------------------------------------------------------------------------------------------------------------------------------------

//Combine both faculty courses and elective courses 
let fullyCombine = []

const combineAll = (faculty,elective) => {
    let totalRoomFalculty = faculty.length / 38


    for(let b = 0; b < totalRoomFalculty; b++){
        let indexArray = b*38
        let indexArrayElective = b*10

        for(let i = 0; i < 20; i++){
            try{
                fullyCombine.push(faculty[i+indexArray])
             }catch{}
         }
         for(let i = 0; i < 10; i++){
             try{
                fullyCombine.push(elective[i+indexArrayElective])
              }catch{}
          }
          for(let i = 20; i < 34; i++){
             try{
                fullyCombine.push(faculty[i+indexArray])
              }catch{}
          }
          for(let i = 34; i < 36; i++){
             try{
                fullyCombine.push(["Solat Jumaat"])
              }catch{}
          }
          for(let i = 34; i < 38; i++){
             try{
                fullyCombine.push(faculty[i+indexArray])
              }catch{}
          }
    }


}
combineAll(AntArrCombine,AntArrCombineElective)


const checkAmountDataCombine_2_fully = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if(array[i] != 100 && array[i] !=100 && array[i] != 0 && array[i] != undefined && array[i] != 1){
                count += 1
            }
    }
    return count
}
var checkAmount_combine = checkAmountDataCombine_2_fully(fullyCombine)
 //console.log(fullyCombine)
 //console.log("Amount of data: " +checkAmount_combine);



const checkAmountDataCombineFully = (array) => {
    let count = 0
    for(let i = 0; i < array.length; i++){
            if( array[i] == 0 ){
                count += 1
            }
    }
    return count
}
 var checkAmount_combineData = checkAmountDataCombineFully(fullyCombine)


//----------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------

//Faculty

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
               indexArray = (x * 38)
               if(array[i+indexArray] != 100 && array[i+indexArray] != undefined  && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                   try{
                       if(array[i][6] == array[i+indexArray][6]){
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


//Check for the H4 violation: no one attend class during 12:00 - 14:00 due to solat jumaat
const checkSolatJummat = (array) => {
   let count = 0
   return count 
}

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

//------------------------------------------------------------------------------------------------------------------------------------------

//Elective

//Check for the H1 violation: same group attend more than 1 class at 1 time
const check1GroupElective = (array) => {
    let count =0
    let indexArray = 0
    //let totalRoom = array.length / 38
    let totalRoom = array.length / 10
    for(let x= 1 ; x <= totalRoom ; x++){
        //indexArray = (x * 38)
        indexArray = (x * 10)
    }
    for(let x= 1 ; x <= totalRoom ; x++){
        try{
             for(let i = 0; i<array.length ; i++){
                //indexArray = (x * 38)
                indexArray = (x * 10)
                if(array[i+indexArray] != 100 && array[i+indexArray] != undefined  && array[i+indexArray] != 1 && array[i+indexArray] != 0 ){
                    try{
                        if(array[i][6] == array[i+indexArray][6]){
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
 
 var checkH1_ALL_Elective = check1GroupElective(AntArrCombineElective)
 
 //Check for the H2 violation: classsroom is large enough to accomodate number of student enroll to that class
 const checkRoomQuotaElective = (array) => {
    let count = 0
    return count 
 }
 var checkH2_ALL_Elective = checkRoomQuotaElective(AntArrCombineElective)
 
 
 //Check for the H4 violation: no one attend class during 12:00 - 14:00 due to solat jumaat
 const checkSolatJummatElective = (array) => {
    let count = 0
    return count 
 }
 var checkH4_ALL_Elective = checkSolatJummatElective(AntArrCombineElective)
 
 //Check for the H5 violation: each teacher can teach 1 subject at 1 room at each slot of time
 const check1TeacherElective = (array) => {
    let count =0
    let indexArray = 0
    let totalRoom = array.length / 10
    for(let x= 1 ; x <= totalRoom ; x++){
     indexArray = (x * 10)
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
 var checkH5_ALL_ELective = check1TeacherElective(AntArrCombineElective)
 //------------------------------------------------------------------------------------------------------------------------------------------

const checkHC = (data1,data2,data3,data4) => {
    let count =0;
    count = data1 + data2 + data3 + data4
    return count;
}
let checkTotalHardContraints = checkHC(checkH5_ALL,checkH1_ALL,checkH5_ALL_ELective,checkH1_ALL_Elective)
//console.log("Total Hard Constraint: "+checkTotalHardContraints)

//----------------------------------------------------------------------------------------------------------------------------------------
// Soft Constraint 
// S1: A student has a class schedule toward the end of the day
// S2: A student have more than two class in a row

// Faculty


//Check for the S1 violation: student have class at the end of the day
const checkEndOfClass = (array) => {
   let count =0
   let totalRoom = array.length / 38
   for(let x= 1 ; x <= totalRoom ; x++){
       let indexArray = (x * 37)
       if(array[indexArray] != 100 ){
           count += 1
       }
   }
   return count

}

 var checkSC1_ALL = checkEndOfClass(AntArrCombine)



//Check for the S2 violation: student have 2 class in a row

const check2ClassInARow = (array) => {
   let count =0
   for(let i = 0; i < array.length; i++){
       try{
        if(array[i] != 100 && array[i+3] != 100){
            if(array[i][6] == array[i+3][6]){
                count += 1
            }
       }
       }catch{}
   }
   return count

}

var checkSC2_ALL = check2ClassInARow(AntArrCombine)


//----------------------------------------------------------------------------------------------------------------------------------------------

//Elective

const checkEndOfClassElective = (array) => {
    let count =0
    let totalRoom = array.length / 10
    for(let x= 1 ; x <= totalRoom ; x++){
        let indexArray = (x * 9)
        if(array[indexArray] != 100 ){
            count += 1
        }
    }
    return count
 
 } 
var checkSC1_ALL_Elective = checkEndOfClassElective(AntArrCombineElective)
 
 //Check for the S2 violation: teacher have 2 class in a row
 const check2ClassInARowElective = (array) => {
    let count =0
    for(let i = 0; i < array.length; i++){
        try{
         if(array[i] != 100 && array[i+3] != 100){
             if(array[i][6] == array[i+3][6]){
                 count += 1
             }
        }
        }catch{}
    }
    return count
 
 }
 var checkSC2_ALL_Elective = check2ClassInARowElective(AntArrCombineElective)

//-----------------------------------------------------------------------------------------------------------------------------------------------




//----------------------------------------------------------------------------------------------------------------------------------------




//-----------------------------------------------------------------------------------------------------------------------------------------------

const checkTotalSoftContraint = () => {
    let count = checkSC1_ALL + checkSC2_ALL + checkSC1_ALL_Elective + checkSC2_ALL_Elective
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
let finalData = change100ToEmpty(fullyCombine);

checkTotalHardContraintsAll = checkTotalHardContraints
checkTotalSoftContraintsAll = checkTotalSoftContraints
totalAmountofDataSlottedIn = checkAmount_combine
finalDataAll = []
finalDataAll.push(finalData)
return {checkTotalHardContraints,checkTotalSoftContraints,finalData,checkAmount_combine}
}

// -------------------------------------------------------------------------------------------------------------------------------------------

let trigger = 0

const iteration = () => {
        antSystem()
        let globalBestHS = checkTotalHardContraintsAll 
        let globalBestSS = checkTotalSoftContraintsAll
        let globalBestScehdule = finalDataAll[0]
        let checkTotalAmountDataset = totalAmountofData.length + 56
        // maxHCS = 0
        // maxSCS = 0
        minHCS = globalBestHS
        minSCS = globalBestSS
    for(let i= 1; i <= 100; i++){
        antSystem()
        let localBestHS = checkTotalHardContraintsAll 
        let localBestSS = checkTotalSoftContraintsAll
        let localBestScehdule = finalDataAll[0]
            console.log("iteraion: " + i)
            if(localBestHS == 0 && localBestSS == 0 && checkTotalAmountDataset == totalAmountofDataSlottedIn){
                console.log("iteraion: " + i)
                //console.log("perfect solution is found")
                globalBestHS = 0
                globalBestSS = 0
                globalBestScehdule = localBestScehdule
                //console.log("Perfect Gloabal best HS: "+globalBestHS)
                //console.log("Perfect Gloabal best SS: " +globalBestSS)
                countPerfectSlt += 1
            }
            else if(localBestHS == 0 && checkTotalAmountDataset == totalAmountofDataSlottedIn){
                console.log("iteraion: " + i)
                //console.log("workable solution is found")
                //console.log("Workable Gloabal best HS: "+localBestHS)
                //console.log("Workable Gloabal best SS: " +localBestSS)
                countWKSlt += 1
                if(globalBestSS > localBestSS){
                    globalBestHS = 0
                    globalBestSS = localBestSS
                    globalBestScehdule = localBestScehdule
                    //console.log("Updated Gloabal best HS: "+globalBestHS)
                    //console.log("Updated Gloabal best SS: " +globalBestSS)
                }
            }

            if(i == 100 && globalBestHS == 0){
                //console.log(globalBestScehdule)
                //console.log("Final Gloabal best HS: "+globalBestHS)
                //console.log("Final Gloabal best SS: " +globalBestSS)
                trigger = 1
                MainData = globalBestScehdule
                byLectureData = globalBestScehdule
                byCourseData = globalBestScehdule
                return [globalBestScehdule]
            }
            if(localBestHS > maxHCS){
                //maxHC = localBestHS
                maxHCS = localBestHS
            }
            if(localBestSS > maxSCS){
                maxSCS = localBestSS
                //maxSCS = maxSC
            }
            if(localBestHS < minHCS){
                minHCS = localBestHS
                //minHCS = minHC
            }
            if(localBestSS < minSCS){
                minSCS = localBestSS
                //console.log("minSC: " + minSC)
                //minSCS = minSC
            }
    }
}
iteration()

if(trigger == 1){
    var t1 = performance.now()
    disbaleButton = false
    console.log("Duration: " + (t1-t0))
    console.log("Duration: " + (t1-t0) + " milliseconds" )
    console.log("Max HC: " + maxHCS)
    console.log("Min HC: " + minHCS)
    console.log("Max SC: " + maxSCS)
    console.log("Min SC: " + minSCS)
    console.log("Workable Solution: " + countWKSlt)
    console.log("Perfect Solution: " + countPerfectSlt)
}else{
    var t1 = performance.now()
    console.log("Duration: " + (t1-t0) + " milliseconds" )
    console.log("Max HC: " + maxHCS)
    console.log("Min HC: " + minHCS)
    console.log("Max SC: " + maxSCS)
    console.log("Min SC: " + minSCS)
    console.log("Workable Solution: " + countWKSlt)
    //alert("no workable solution found, please refersh until get workable solution")
    //window.location.href = "/"
}


//----------------------------------------------------------------------------------------------------------------------------------------

        }

        const mainGeneratedSchedule = () => {
            const changeToPresentationData = (data) => {
                
                for(let i= 0; i <= data.length; i++){
                    try {
                            presentableData.push([data[i][1],data[i][6],data[i][11]])
                    } catch (error) {
                        
                    }
                }
            }
            changeToPresentationData(MainData)
            
            let allRoomName = []
            for(let i = 0; i < roomData[0].length; i++){
                allRoomName.push(roomData[0][i][0])
            }
            allRoomName.unshift("Room");
            if(allRoomName.pop() == undefined){
            }
            
            
            let weekday = [
            'Mon[0800-0900]','Mon[0900-1000]','Mon[1000-1100]','Mon[1100-1200]','Mon[1200-1300]','Mon[1300-1400]','Mon[1400-1500]','Mon[1500-1600]','Mon[1600-1700]','Mon[1700-1800]',
            'Tue[0800-0900]','Tue[0900-1000]','Tue[1000-1100]','Tue[1100-1200]','Tue[1200-1300]','Tue[1300-1400]','Tue[1400-1500]','Tue[1500-1600]','Tue[1600-1700]','Tue[1700-1800]',
            'Wed[0800-0900]','Wed[0900-1000]','Wed[1000-1100]','Wed[1100-1200]','Wed[1200-1300]','Wed[1300-1400]','Wed[1400-1500]','Wed[1500-1600]','Wed[1600-1700]','Wed[1700-1800]',
            'Thu[0800-0900]','Thu[0900-1000]','Thu[1000-1100]','Thu[1100-1200]','Thu[1200-1300]','Thu[1300-1400]','Thu[1400-1500]','Thu[1500-1600]','Thu[1600-1700]','Thu[1700-1800]',
            'Fri[0800-0900]','Fri[0900-1000]','Fri[1000-1100]','Fri[1100-1200]','Fri[1200-1300]','Fri[1300-1400]','Fri[1400-1500]','Fri[1500-1600]','Fri[1600-1700]','Fri[1700-1800]',
            ]
            
            
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
            let dataset = create2dArray(weekday,50,presentableData,50)
            console.log(dataset);
            
            
            
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

              downloadBlob(csv, 'ModifiedAntSystem_GeneratedSchedule.csv', 'text/csv;charset=utf-8;')
        
        }

        const lecturerGeneratedSchedule = () => {
            let testData = []
            let i = 0
            let LoopTable = []

            for(let i = 0 ; i < notDuplicatesLecturerArray.length; i++){
                const dupeData = [...byLectureData]
                testData = []

                for(let x = 0; x < dupeData.length ; x++){
                    try{
                            if(notDuplicatesLecturerArray[i] == dupeData[x][5]){
                            }
                            else{
                                dupeData[x] = []
                            }
                    }catch{}
                }
                    testData.push(dupeData);

                    const changeToPresentationData = (data) => {
                        
                        presentableDataLecturer = []
                        for(let i= 0; i <= data.length; i++){
                            try {
                                    presentableDataLecturer.push([data[i][1],data[i][5],data[i][6]])
                            } catch (error) {
                                
                            }
                        }
                    }
                    changeToPresentationData(testData[0])
        
                    let allRoomName = []
                    for(let i = 0; i < roomData[0].length; i++){
                        allRoomName.push(roomData[0][i][0])
                    }
                    allRoomName.unshift("Room");
                    if(allRoomName.pop() == undefined){
                    }

                    
                    let weekday = [
                    'Mon[0800-0900]','Mon[0900-1000]','Mon[1000-1100]','Mon[1100-1200]','Mon[1200-1300]','Mon[1300-1400]','Mon[1400-1500]','Mon[1500-1600]','Mon[1600-1700]','Mon[1700-1800]',
                    'Tue[0800-0900]','Tue[0900-1000]','Tue[1000-1100]','Tue[1100-1200]','Tue[1200-1300]','Tue[1300-1400]','Tue[1400-1500]','Tue[1500-1600]','Tue[1600-1700]','Tue[1700-1800]',
                    'Wed[0800-0900]','Wed[0900-1000]','Wed[1000-1100]','Wed[1100-1200]','Wed[1200-1300]','Wed[1300-1400]','Wed[1400-1500]','Wed[1500-1600]','Wed[1600-1700]','Wed[1700-1800]',
                    'Thu[0800-0900]','Thu[0900-1000]','Thu[1000-1100]','Thu[1100-1200]','Thu[1200-1300]','Thu[1300-1400]','Thu[1400-1500]','Thu[1500-1600]','Thu[1600-1700]','Thu[1700-1800]',
                    'Fri[0800-0900]','Fri[0900-1000]','Fri[1000-1100]','Fri[1100-1200]','Fri[1200-1300]','Fri[1300-1400]','Fri[1400-1500]','Fri[1500-1600]','Fri[1600-1700]','Fri[1700-1800]',
                    ]
                    
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
                    let dataset = create2dArray(weekday,50,presentableDataLecturer,50)

                    const insertRoomName = (roomData,array) => {
                        for(let i= 0; i<array.length; i++){
                            array[i].unshift(roomData[i]);
                        }
                        return array;
                    }
                    
                    insertRoomName(allRoomName,dataset)
                    LoopTable.push(dataset);
                }

                console.log(LoopTable)
                let csvData = []
                for(let i = 0; i < LoopTable.length; i++){
                    csvData.push(["Lecturer Name"])
                    csvData.push([notDuplicatesLecturerArray[i]])
                    csvData.push(["Lecturer Code"])
                    csvData.push([notDuplicatesLecturerCodeArray[i]])
                    for(let j =0; j< LoopTable[i].length; j++){
                        csvData.push(LoopTable[i][j]);
                    }
                    csvData.push([])
                }
                console.log(csvData)
            
            
            
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
                csvData
            );
            
            function downloadBlob(content, filename, contentType) {
                var blob = new Blob([content], { type: contentType });
                var url = URL.createObjectURL(blob);
              
                var pom = document.createElement('a');
                pom.href = url;
                pom.setAttribute('download', filename);
                pom.click();
              }

            downloadBlob(csv, 'ModifiedAntSystem_GeneratedSchedule_by_Lecturer.csv', 'text/csv;charset=utf-8;')

                
        }

        const courseGeneratedSchedule = () => {
            let testData = []
            let i = 0
            let LoopTable = []

            for(let i = 0 ; i < courseCodeArray.length; i++){
                const dupeData = [...byCourseData]
                testData = []

                for(let x = 0; x < dupeData.length ; x++){
                    try{
                            if(courseCodeArray[i] == dupeData[x][1]){
                            }
                            else{
                                dupeData[x] = []
                            }
                    }catch{}
                }
                    testData.push(dupeData);

                    const changeToPresentationData = (data) => {
                        
                        presentableDataLecturer = []
                        for(let i= 0; i <= data.length; i++){
                            try {
                                    presentableDataLecturer.push([data[i][1],data[i][6],data[i][11]])
                            } catch (error) {
                                
                            }
                        }
                    }
                    changeToPresentationData(testData[0])
                    
                    let allRoomName = []
                    for(let i = 0; i < roomData[0].length; i++){
                        allRoomName.push(roomData[0][i][0])
                    }
                    allRoomName.unshift("Room");
                    if(allRoomName.pop() == undefined){
                    }
                    
                    
                    let weekday = [
                    'Mon[0800-0900]','Mon[0900-1000]','Mon[1000-1100]','Mon[1100-1200]','Mon[1200-1300]','Mon[1300-1400]','Mon[1400-1500]','Mon[1500-1600]','Mon[1600-1700]','Mon[1700-1800]',
                    'Tue[0800-0900]','Tue[0900-1000]','Tue[1000-1100]','Tue[1100-1200]','Tue[1200-1300]','Tue[1300-1400]','Tue[1400-1500]','Tue[1500-1600]','Tue[1600-1700]','Tue[1700-1800]',
                    'Wed[0800-0900]','Wed[0900-1000]','Wed[1000-1100]','Wed[1100-1200]','Wed[1200-1300]','Wed[1300-1400]','Wed[1400-1500]','Wed[1500-1600]','Wed[1600-1700]','Wed[1700-1800]',
                    'Thu[0800-0900]','Thu[0900-1000]','Thu[1000-1100]','Thu[1100-1200]','Thu[1200-1300]','Thu[1300-1400]','Thu[1400-1500]','Thu[1500-1600]','Thu[1600-1700]','Thu[1700-1800]',
                    'Fri[0800-0900]','Fri[0900-1000]','Fri[1000-1100]','Fri[1100-1200]','Fri[1200-1300]','Fri[1300-1400]','Fri[1400-1500]','Fri[1500-1600]','Fri[1600-1700]','Fri[1700-1800]',
                    ]
                    
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
                    let dataset = create2dArray(weekday,50,presentableDataLecturer,50)
                    
                    
                    
                    const insertRoomName = (roomData,array) => {
                        for(let i= 0; i<array.length; i++){
                            array[i].unshift(roomData[i]);
                        }
                        return array;
                    }
                    
                    insertRoomName(allRoomName,dataset)
                    LoopTable.push(dataset);
                }

                console.log(LoopTable)
                let csvData = []
                for(let i = 0; i < LoopTable.length; i++){
                    csvData.push(["Course Name"])
                    csvData.push([courseNameArray[i]])
                    csvData.push(["Course Couse"])
                    csvData.push([courseCodeArray[i]])
                    for(let j =0; j< LoopTable[i].length; j++){
                        csvData.push(LoopTable[i][j]);
                    }
                    csvData.push([])
                }
                console.log(csvData)
            
            
            
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
                csvData
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

            downloadBlob(csv, 'ModifiedAntSystem_GeneratedSchedule_by_Course.csv', 'text/csv;charset=utf-8;')
        }

    return(
        <React.Fragment>
            <div className="generate-schedule">
                <h1>
                    Please wait while generating schedule(Slot In Heuristic)
                </h1>
                <button  onClick={mainGeneratedSchedule} disabled={disbaleButton}   className="generate-schedule-button">Download Main Schedule</button>
                <button  onClick={lecturerGeneratedSchedule} disabled={disbaleButton}  className="generate-schedule-button">Download Schedule by Lecturer</button>
                <button  onClick={courseGeneratedSchedule}  disabled={disbaleButton} className="generate-schedule-button">Download Schedule by Course</button>
            </div>

        </React.Fragment>
    );
}


export default SlotIn;