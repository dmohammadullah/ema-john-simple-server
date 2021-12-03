const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xkz3z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());


const port = 5000

// console.log(process.env.DB_PASS)

app.get('/', (req, res) => {
  res.send("Hello from db it's working working")
})


const pass = "emaWatsonPotter81";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products"); 
  const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount); 
            res.send(result.insertedCount)
        })
    })

    // get all product from database
    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray( (err, documents) => {
        res.send(documents);
        })
    })

    // get single product
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) =>{
            res.send(documents[0]);
        })
    })

    //post cart key's
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result.insertedCount); 
            res.send(result.acknowledged)
        })
    })
});


app.listen(process.env.PORT || port)