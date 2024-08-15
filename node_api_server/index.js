const express = require('express');
const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const winston = require('winston');
const moment = require('moment');
const cors = require('cors');

// Configure winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

redis.on('error', (err) => {
    logger.error('Redis error: ', err);
});

redis.ping()
    .then(result => {
        logger.info('Connected to Redis:', result);
    })
    .catch(err => {
        logger.error('Could not connect to Redis:', err);
    });

const uri = "";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 10 });

client.connect(async err => {
    if (err) {
        logger.error('Failed to connect to MongoDB', err);
    } else {
        logger.info('Connected to MongoDB');

        const db = client.db("runes");
        const runes_collection = db.collection("GinidataRunes");

        // Prefetch and cache "BILLION•DOLLAR•CAT" data immediately after MongoDB connection
        await prefetchRuneData("BILLION•DOLLAR•CAT");

        function preprocessData(data) {
            return data.map(item => {
                if (item.timestamp) {
                    item.timestamp = moment(item.timestamp).isValid()
                        ? moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')
                        : null;
                }
                return item;
            });
        }

        async function fetchDataWithRetry(collection, filter, project = {}, sort = {}, retryCount = 3) {
            for (let i = 0; i < retryCount; i++) {
                try {
                    const cursor = collection.find(filter).project(project).sort(sort);
                    const data = await cursor.toArray();  // Fetch all matching documents
                    return data;
                } catch (error) {
                    if (error.codeName === 'CursorNotFound' && i < retryCount - 1) {
                        logger.warn(`Cursor not found, retrying ${i + 1}/${retryCount}`);
                    } else {
                        throw error;
                    }
                }
            }
            throw new Error('Failed to fetch data after retries');
        }

        async function prefetchRuneData(runeName) {
            try {
                const filter = { 'rune_name': runeName };
                const project = { 'rune_name': 1, 'timestamp': 1, 'price_sats': 1, 'volume_1d_btc': 1, 'holders': 1, '_id': 0 };
                const sort = { 'timestamp': 1 };  // Sort by timestamp ascending
                const data = await fetchDataWithRetry(runes_collection, filter, project, sort);

                if (data.length === 0) {
                    logger.warn(`No data found for rune ${runeName}`);
                    return;
                }

                const preprocessedData = preprocessData(data);
                await redis.set(`rune_data_${runeName}`, JSON.stringify(preprocessedData), 'EX', 3600);
                logger.info(`Data for rune ${runeName} prefetched and cached in Redis`);
            } catch (error) {
                logger.error(`Error prefetching data for rune ${runeName}`, error);
            }
        }

        async function fetchAndUpdateCache(runeName) {
            try {
                const filter = { 'rune_name': runeName };
                const project = { 'rune_name': 1, 'timestamp': 1, 'price_sats': 1, 'volume_1d_btc': 1, 'holders': 1, '_id': 0 };
                const sort = { 'timestamp': 1 };  // Sort by timestamp ascending
                const data = await fetchDataWithRetry(runes_collection, filter, project, sort);

                if (data.length === 0) {
                    logger.warn(`No data found for rune ${runeName}`);
                    return;
                }

                const preprocessedData = preprocessData(data);
                await redis.set(`rune_data_${runeName}`, JSON.stringify(preprocessedData), 'EX', 3600);
                logger.info(`Data for rune ${runeName} updated and cached in Redis`);
            } catch (error) {
                logger.error(`Error updating cache for rune ${runeName}`, error);
            }
        }

        async function prefetchData() {
            await prefetchRuneData("BILLION•DOLLAR•CAT");
            await prefetchRuneLogs();
            await prefetchForecastData();
            await prefetchRuneNames();
        }

        async function prefetchRuneLogs() {
            try {
                const rune_logs_collection = db.collection("RUNELOGS");
                const filter = {};
                const sort = { '_id': -1 };
                const limit = 50;
                const cursor = rune_logs_collection.find(filter).sort(sort).limit(limit);
                const logData = await cursor.toArray();

                await redis.set('rune_logs', JSON.stringify(logData), 'EX', 3600);
                logger.info('Rune logs prefetched and cached in Redis');
            } catch (error) {
                logger.error('Error prefetching rune logs', error);
            }
        }

        async function prefetchForecastData() {
            try {
                const forecast_collection = db.collection("forecast");
                const filter = {};
                const sort = { 'dates': -1 };
                const limit = 1;
                const cursor = forecast_collection.find(filter).sort(sort).limit(limit);
                const forecastData = await cursor.toArray();

                if (forecastData.length === 0) {
                    logger.warn('No forecast data found to prefetch');
                    return;
                }

                const predictions = forecastData[0].predictions.map(pred => pred[0]);
                const dates = forecastData[0].dates;
                const data = { dates, predictions };

                await redis.set('forecast_data', JSON.stringify(data), 'EX', 3600);
                logger.info('Forecast data prefetched and cached in Redis');
            } catch (error) {
                logger.error('Error prefetching forecast data', error);
            }
        }

        async function prefetchRuneNames() {
            try {
                const runes_collection = db.collection("GinidataRunes");
                const filter = {
                    'holders': { '$gte': 100 }
                };
                const projection = {
                    'rune_name': 1,
                    'price_sats': 1,
                    'volume_1d_btc': 1,
                    'timestamp': 1,
                    '_id': 0
                };
                const sort = { 'rune_name': 1 };
                const limit = 1000;

                const cursor = runes_collection.find(filter).project(projection).sort(sort).limit(limit);
                const runeNames = await cursor.toArray();

                await redis.set('rune_names', JSON.stringify(runeNames), 'EX', 3600);
                logger.info('Rune names prefetched and cached in Redis');
            } catch (error) {
                logger.error('Error prefetching rune names', error);
            }
        }

        app.get('/', (req, res) => {
            res.send('Welcome to the Rune API');
        });

        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        app.get('/api1/rune-data', async (req, res) => {
            const runeName = req.query.rune_name;
            logger.info(`Fetching data for rune: ${runeName}`);
            try {
                const cachedData = await redis.get(`rune_data_${runeName}`);
                if (cachedData) {
                    logger.info(`Data for rune ${runeName} retrieved from Redis cache`);
                    res.json(JSON.parse(cachedData));

                    // Fetch latest data in background and update cache
                    fetchAndUpdateCache(runeName);
                } else {
                    // No cached data, fetch all matching data from MongoDB and cache it
                    const filter = { 'rune_name': runeName };
                    const project = { 'rune_name': 1, 'timestamp': 1, 'price_sats': 1, 'volume_1d_btc': 1 };
                    const sort = { 'timestamp': 1 };  // Sort by timestamp ascending
                    const cursor = runes_collection.find(filter).project(project).sort(sort);
                    const data = await cursor.toArray();  // Fetch all documents matching the query

                    if (data.length === 0) {
                        return res.status(404).json({ error: `No data found for rune ${runeName}` });
                    }

                    const preprocessedData = preprocessData(data);
                    await redis.set(`rune_data_${runeName}`, JSON.stringify(preprocessedData), 'EX', 3600);
                    logger.info(`Data for rune ${runeName} fetched from MongoDB and cached in Redis`);
                    res.json(preprocessedData);
                }
            } catch (error) {
                logger.error(`Error fetching data for rune ${runeName}`, error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Additional routes

        app.get('/api1/rune-logs', async (req, res) => {
            logger.info('Fetching rune logs');
            try {
                const cachedData = await redis.get('rune_logs');
                if (cachedData) {
                    logger.info('Rune logs retrieved from Redis cache');
                    return res.json(JSON.parse(cachedData));
                }

                const rune_logs_collection = db.collection("RUNELOGS");
                const filter = {};
                const sort = { '_id': -1 };
                const limit = 50;
                const cursor = rune_logs_collection.find(filter).sort(sort).limit(limit);
                const logData = await cursor.toArray();

                await redis.set('rune_logs', JSON.stringify(logData), 'EX', 3600);
                logger.info('Rune logs fetched from MongoDB and cached in Redis');
                res.json(logData);
            } catch (error) {
                logger.error('Error fetching rune logs', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api1/forecast', async (req, res) => {
            logger.info('Fetching forecast data');
            try {
                const cachedData = await redis.get('forecast_data');
                if (cachedData) {
                    logger.info('Forecast data retrieved from Redis cache');
                    return res.json(JSON.parse(cachedData));
                }

                const forecast_collection = db.collection("forecast");
                const filter = {};
                const sort = { 'dates': -1 };
                const limit = 1;
                const cursor = forecast_collection.find(filter).sort(sort).limit(limit);
                const forecastData = await cursor.toArray();
                if (forecastData.length === 0) {
                    return res.status(404).json({ error: 'No forecast data found' });
                }

                const predictions = forecastData[0].predictions.map(pred => pred[0]);
                const dates = forecastData[0].dates;
                const data = { dates, predictions };

                await redis.set('forecast_data', JSON.stringify(data), 'EX', 3600);
                logger.info('Forecast data fetched from MongoDB and cached in Redis');
                res.json(data);
            } catch (error) {
                logger.error('Error fetching forecast data', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api1/rune-names', async (req, res) => {
            logger.info('Fetching unique rune names');
            try {
                const cachedData = await redis.get('rune_names');
                if (cachedData) {
                    logger.info('Rune names retrieved from Redis cache');
                    return res.json(JSON.parse(cachedData));
                }

                const runes_collection = db.collection("GinidataRunes");
                const filter = {
                    'holders': { '$gte': 100 }
                };
                const projection = {
                    'rune_name': 1,
                    'price_sats': 1,
                    'volume_1d_btc': 1,
                    'timestamp': 1,
                    '_id': 0
                };
                const sort = { 'rune_name': 1 };
                const limit = 1000;

                const cursor = runes_collection.find(filter).project(projection).sort(sort).limit(limit);
                const runeNames = await cursor.toArray();

                await redis.set('rune_names', JSON.stringify(runeNames), 'EX', 3600);
                logger.info('Rune names fetched from MongoDB and cached in Redis');
                res.json(runeNames);
            } catch (error) {
                logger.error('Error fetching rune names', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api1/rune-name2', async (req, res) => {
            logger.info('Fetching unique rune names');
            try {
                const cachedData = await redis.get('rune_names');
                if (cachedData) {
                    logger.info('Rune names retrieved from Redis cache');
                    return res.json(JSON.parse(cachedData));
                }

                const runes_collection = db.collection("GinidataRunes");
                const filter = {};
                const projection = { 'rune_name': 1, '_id': 0 };
                const sort = { 'rune_name': 1 };
                const cursor = runes_collection.find(filter).project(projection).sort(sort);
                const runeNames = await cursor.toArray();

                await redis.set('rune_names', JSON.stringify(runeNames), 'EX', 3600); // Cache for 1 hour
                logger.info('Rune names fetched from MongoDB and cached in Redis');
                res.json(runeNames);
            } catch (error) {
                logger.error('Error fetching rune names', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.get('/api1/log-data', async (req, res) => {
            logger.info('Fetching log data');
            try {
                const cachedData = await redis.get('log_data');
                if (cachedData) {
                    logger.info('Log data retrieved from Redis cache');
                    return res.json(JSON.parse(cachedData));
                }

                const logs_collection = db.collection("logs");
                const filter = {};
                const sort = { '_id': -1 };
                const limit = 50;
                const cursor = logs_collection.find(filter).sort(sort).limit(limit);
                const logData = await cursor.toArray();

                await redis.set('log_data', JSON.stringify(logData), 'EX', 600);
                logger.info('Log data fetched from MongoDB and cached in Redis');
                res.json(logData);
            } catch (error) {
                logger.error('Error fetching log data', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        process.on('SIGINT', async () => {
            logger.info('SIGINT signal received: closing MongoDB connection');
            await client.close();
            logger.info('MongoDB connection closed');
            process.exit(0);
        });

        // Prefetch data on startup
        prefetchData();
    }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
});
