# Welcome to Modified Ant System Algorithm

This project provides an efficient solution for scheduling by leveraging the Modified Ant System Algorithm. Follow the steps below to set up and run the project on your local environment.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: Download the latest version from [Node.js official website](https://nodejs.org/en/download/current).
- **MongoDB**: Download the latest version from [MongoDB official website](https://www.mongodb.com/).

After installing the required software, you can either download the project as a zip file or clone it using Git in Visual Studio Code.

## Installation

1. **Open the Project**:
   - Open the frontend directory in a new Visual Studio Code window (`frontend`).
   - Open another window with the backend directory (`backend2`).

2. **Install Dependencies**:
   - In both windows, run the following command to install the required npm modules:
     ```
     npm install
     ```

3. **Fix Vulnerabilities** (if any):
   - Run the following command in both directories to fix vulnerabilities:
     ```
     npm audit fix --force
     ```
   Note: This command is used to resolve issues arising from using older versions of Node.js.

## Configuration

1. **Database Connection**:
   - In the `backend2` directory, locate the `app.js` file (`Modified-Ant-System-Algorithm/backend2/app.js`) and update the MongoDB connection string:
     ```javascript
     mongoose.connect('<Your_MongoDB_Connection_String>').then(() => {
       app.listen(5000);
     }).catch(err => {
       console.log(err);
     });
     ```
   - Replace `<Your_MongoDB_Connection_String>` with your actual MongoDB connection string. Ensure to update the username and password in the string.

2. **Screenshots**:
   - Below are screenshots demonstrating various pages of the application:
     - Homepage: ![Screenshot 2024-04-01 130548](https://github.com/rabdulmuqtasid/Modified-Ant-System-Algorithm/assets/107633774/e97671b4-4c5f-4644-8c77-c066c6c137c7)
     - Generate Schedule Page: ![Generate Schedule Screenshot](https://github.com/rabdulmuqtasid/Modified-Ant-System-Algorithm/assets/107633774/a98d8ec5-8487-46d3-949a-8c6368547277)
     - Download Generated Schedule Page: ![Screenshot 2024-04-01 130407](https://github.com/rabdulmuqtasid/Modified-Ant-System-Algorithm/assets/107633774/6c939c11-747d-4a21-b5c4-b95d913f8a9c)


## Running the Project

1. **Start the Application**:
   - Run the following command in both the frontend and backend directories:
     ```
     npm start
     ```
   - A window displaying the homepage should automatically open in your default web browser.

2. **Usage**:
   - First, insert the `Room dataset` followed by the `Course dataset`.
   - Click the "Generate Schedule" button to proceed.
   - The generated schedule can be downloaded and viewed from the "Download Generated Schedule" page.
