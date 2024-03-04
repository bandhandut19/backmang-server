const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('management server working')
})
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttptxjd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('backmang').collection('user');



    app.post('https://backmang-server-fwmw5k38m-bandhandut19.vercel.app/users', async (req, res) => {
        try {
            const { userName, userEmail, userPassword } = req.body;
            const newUser = { userName, userEmail, userPassword };
            const result =await userCollection.insertOne(newUser);
            res.send(result)
        } catch (error) {
            console.error('Error inserting user data:', error);
            res.status(500).json({ error: "Facing problem inserting user data" });
        }
    });

    app.get('https://backmang-server-fwmw5k38m-bandhandut19.vercel.app/users', async (req,res) =>{
        const cursor = userCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



