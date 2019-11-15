![](https://github.com/cymushier/teamwork-be/workflows/Teamwork%20BE%20CI/badge.svg)
# Teamwork Backend
This is the backend for Teamwork; an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding. 

## Setup
The following are the steps to run this locally:
1. Install `PostgreSQL` DB
2. Setup the `.env` file accordingly.
    1. `DB_NAME` - The database name to Postgreql.
    2. `DB_USER` - The database user to connect to.
    3. `DB_PASSWORD` - The database password for the database.
    4. `TOKEN_SECRET` - The token generation secret. Random string.
    5. `CLOUDINARY_CLOUD_NAME` - The cloudinary cloud name for uploading files.
    6. `CLOUDINARY_API_KEY` - The cloudinary `API` key.
    7. `CLOUDINARY_API_SECRET` - The cloudinary API secret.
3. Run `npm install` to install the dependencies.
4. Run `npm create` to create the database tables.
5. Run `npm seeduser` to create admin user with default credentials.
6. Run `npm start` to run the server.
7. Run `npm test` to test the application.

