const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const MONGO_URL = 'mongodb+srv://priyaagarwalbgn19:PxMFvq9kmfw52ugw@priyanka.egqlius.mongodb.net/reminders';
const DB_NAME = 'reminders'; // Database name
const COLLECTION_NAME = 'reminders_data'; // Collection name

// Middleware to parse JSON bodies
app.use(bodyParser.json());

MongoClient.connect(MONGO_URL)
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db(DB_NAME);
        const remindersCollection = db.collection(COLLECTION_NAME);

        app.post('/api/reminders', async (req, res) => {
            const { date, time, message } = req.body;

            if (!date || !time || !message) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Create reminder object
            const reminder = {
                date,
                time,
                message
            };

            // Insert reminder into MongoDB
            try {
                const result = await remindersCollection.insertOne(reminder);
                reminder.id = result.insertedId;
                res.status(201).json(reminder);
            } catch (error) {
                console.error('Error saving reminder to database:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });