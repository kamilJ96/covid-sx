# Requirements
- Node.JS >= 14.7.0
- NPM >= 6.14.0
- Yarn >= 1.22.0
- PostgresQL >= 11.0

# Setup
## Database
First the database must be created. Either in the psql terminal or using the _createdb_ command in terminal, create a database called **asx_data**

```psql~$ CREATE DATABASE asx_data;``` or ```~$ createdb asx_data```

Next, copy the schema located in ```./backend/db/schema.sql``` using the psql command in terminal:

```psql asx_data < schema.sql```

This will automatically create the tables, and populate the top ~200 ASX symbols.

## Backend
Once the database has been created, don't forget to update the DB Config in the backend with your username/password. This is located in ```./backend/src/utils/utils.ts```, within the _dbConf_ variable that gets exported.

Install the required packages using npm in the backend folder:

```cd backend && npm i```

Compile the typescript files:

```tsc```

Start the websocket + data downloader

```npm start```

This will create a websocket server that accepts connections, and sends ASX quotes + symbol data, whilst fetching new quotes at the end of each working day.

## Frontend
In a separate terminal, navigate to the frontend folder and install the required packages:

```cd asx-web && yarn install```

(yea i'm using both npm and yarn nobody likes a monopoly 😾)

Start the project:

```yarn start```

Once the dev build has finished compiling, head on over to http://localhost:3000 and start making big bucks!
