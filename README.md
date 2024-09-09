# Setup Guide

Follow the below steps for setting up the project and testing APIs:

## Local Setup ##

* Clone the repository in your local by using the below command

```
https://github.com/Jatin-11022002/promact_nodejs_assignment_1.git
```

## Database Setup ##

* Step 1: Download and install PostgreSQL locally using the URL below.

```
https://www.postgresql.org/download/
```

## Project Setup ##

* Step 1: Navigate to your code editor and open a terminal that points to the Project's root folder.

* Step 2: Now run the below command for installing dependencies required by the application:

```
npm install
```
* Step 3: Change the extension of **.env.sample** to **.env**. This file contains all the values required for the project.
  
* Step 4: Now run the below command to create the required tables in PostgreSQL:

```
node dbMigration.js
```

You will see **Tables Created** message indicating that the required tables are created
  
* Step 4: Now run the below command to start the project server:

```
node server.js
```
You will see a message indicating that the server has started.

Now you can test the Project
