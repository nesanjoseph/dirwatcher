# DirWatcher- Node.JS application with REST APIs
Configure folder to be watched and get the count of magicword occurences persisted in MongoDB

#### Note:
This app has been tested in Mac v10.15.xx (Catalina)

## Prerequisite
- MongoDB server (Any latest version)
- Node.JS v12.x.x

## Quick Start
- Ensure MongoDB is running in local (do not set any password)
- Clone this repo and run the command ```npm i``` to install the dependency modules
- Now run the command ```npm start``` to start the application
- The application should now be listening at port ```3000```

## APIs - Postman Collection
In the repo, find the file ```postman/DirectoryWatcher.postman_collection.json``` and import in your PostMan application to test the routes

## How to test:
- Execute the **POST /v1/watcher/update** API from Postman to start watching a folder.
- As per the cron schedule set, the watcher will run.
- Add/remove files from the given folder and check the result by executing **GET /v1/watcher/history**
- Modify the magicword as many times as needed and test the application.

## Available Routes
#### Note:
To see the sample payload and response, import the postman collection mentioned above
| Route      | Description |
| ----------- | ----------- |
| GET /v1/watcher/status   | Get the current status of the watcher        |
| GET /v1/watcher/history   | Get the recent 100 watcher runs        |
| POST /v1/watcher/update      | Creates/Updates (Upsert) the watcher input (folder, cron, magicword)       |
| POST /v1/watcher/start   | Force start the watcher schedule      |
| POST /v1/watcher/stop   | Force stop the watcher schedule        |

## Rooms for improvement
- Pagination in getting watcher history
- Interrupt while folder scanning is in progress
- Persist file level word count in DB
- Add UT as needed
- Do ESlint
