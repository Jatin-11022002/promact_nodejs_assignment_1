# Setup Guide

Follow below steps for setting up the project and testing APIs:

## Local Setup ##

* Clone the repository in your local by using below command

```
https://github.com/Jatin-11022002/promact_nodejs_assignment_1.git
```

## Database Setup ##

* Step 1: Download and Install PostgreSQL in your local using below url.

```
https://www.postgresql.org/download/
```

## Project Setup ##

* Step 1: Navigate to your code editor and open a terminal which points to the Project's root folder.

* Step 2: Now run below command for installing dependencies required by application:

```
npm install
```

* Step 3: Now run below command to create required tables in PostgreSQL:

```
node dbMigration.js
```

You will see **Tables Created** message indicating that required tables are created
  
* Step 4: Now run below command to start the project server:

```
node server.js
```
You will see a message indicating that server has started.

Now you can use the Project
