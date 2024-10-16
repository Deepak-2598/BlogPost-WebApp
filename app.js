const express = require("express");
const mongoose =  require("mongoose");
const morgan =  require("morgan");
const cors = require("cors");
const { MongoClient } = require('mongodb');
require("dotenv").config();

const app = express();
app.use(cors({
    origin: 'https://blogpostwebapp-fm2e.onrender.com/'
}));
app.use(express.json());

const uri = process.env.URI;
const dbName = "blogpostdb";
const collectionName = "blog_post";

const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        
        const existingUser = await collection.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        };
        console.log(newUser,'newUser')
        
        await collection.insertOne(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
        console.log('finally')
    }
});


const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});