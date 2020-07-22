require('dotenv').config();

// import environment variables
const { PORT, DATABASE_URL, NODE_ENV } = process.env;

// VALIDATE ENV VARS
require('./scripts/validateEnvs');

const debugMode = NODE_ENV === 'debug';

// REQUIRE ALL THE LIBS!
const express = require('express');
const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');

// init the libs
const app = express();

// import routes
const apiRouter = require('./api/index')

// //////////////////////
// GENERAL MIDDLEWARE ///
// //////////////////////
app.use(express.urlencoded({ limit: '25mb', extended: true }))
app.use(express.json({ limit: '25mb' }));

app.use(express.static(__dirname + '/public'));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    return next();
});

// SET REQUEST ID IF NOT INCLUDED
app.use((req, res, next) => {
    const requestUUID = req.get('requestUUID');
    req.requestUUID = (/[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/.test(requestUUID) ? requestUUID : uuidv1());
    next();
});

// //////////
// ROUTES ///
// //////////

app.use('/api', apiRouter);

// //////////////
// Error Handling
// //////////////

app.use((error, req, res, next) => {
    if (error.code === 'FILE_TYPE') {
        return res.status(400).json({
            message: 'Only images are allowed.',
            code: 'ONLY_IMAGES'
        })
    }
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: `File size too large. Max size is ${200000 / 1000}Kb`,
            code: 'MAX_SIZE'
        })
    }
})

const { createPosts } = require('./scripts/createDummyData');

app.post('/mockData/createPosts', async (req, res) => {
    await createPosts();
    res.sendStatus(201);
})

// ///////////////
// INIT SERVER ///
// ///////////////

let server;

const runServer = async (dbUrl, portNum) => {
    try {
        try {
            await mongoose.connect(dbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (error) => {
                if (error) throw error;
                console.log(`DB connected at ${dbUrl}`);
            });

            mongoose.connection.on('disconnected', () => {
                console.log(`DB disconnected at ${dbUrl}`);
            });

            mongoose.connection.on('reconnected', () => {
                console.log(`DB reconnected at ${dbUrl}`);
            });
        } catch (error) {
            throw error;
        }
        try {
            server = app.listen(portNum, () => {
                console.log(`Server is listening on port ${portNum}`);
            });
        } catch (error) {
            mongoose.disconnect();
            throw error;
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const closeServer = async () => {
    try {
        await mongoose.disconnect(() => {
            console.log('Disconnected from MongoDB');
        });
        logger.info('Disconnected from DB');
        server.close(() => {
            logger.info('Server closed');
        });
    } catch (err) {
        logger.error(err);
    }
};

// makes the file both an executable script, and a module.
if (require.main === module) {
    runServer(DATABASE_URL, PORT).catch(err => logger.error(err));
}

module.exports = { app, runServer, closeServer };
