## Test App and Backend

App running Ionic 5 on Angular 10, with Jest as test framework. Backend is made
with NestJS and TypeORM, testing ignored.

Settings for the database connection can be changed in the
`/backend/src/db/database.module.ts` file. Database needs to be created prior to
running the service.

### Starting the applications:

In the `app` folder: `ionic serve --no-open`  
In the `backend` folder: `npm run start:dev`
