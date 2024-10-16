const express = require("express");
const { MongoClient } = require('mongodb');
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors({
    origin: 'https://blogpostwebapp-fm2e.onrender.com'
}));
app.use(express.json());

const uri = process.env.URI;
const dbName = "blogpostdb";
const collectionName = "blog_post";

const client = new MongoClient(uri);
let collection;

(async () => {
    try {
        await client.connect();
        console.log("Connected to the database");
        const database = client.db(dbName);
        collection = database.collection(collectionName);
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
    }
})();

app.get('/api/data', async (req, res) => {
    try {
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const existingUser = await collection.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };
        await collection.insertOne(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error signing up:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
