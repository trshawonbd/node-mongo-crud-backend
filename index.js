const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // must
app.use(express.json()); //important


// dbuser1
// BDHDgiKTVQfQX9N6



const uri = "mongodb+srv://dbuser1:BDHDgiKTVQfQX9N6@cluster0.8zhi6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/* client.connect(err => {
  const collection = client.db("foodExpress").collection("user");
  console.log('db connected');
  // perform actions on the collection object
  client.close();
}); */

async function run (){
    try{
        await client.connect();
        const collection = client.db("foodExpress").collection("user");
/*         const user = {name: "mahi", email: 'mahi@gmail.com'};
        const result = await collection.insertOne(user);
        console.log(`User inserted with ID: ${result.insertedId}`) */
        //get all user
        app.get('/user', async(req, res) =>{
            const query = {};
            const cursor = collection.find(query);
            const users = await cursor.toArray();
            res.send(users);

        })

        // get a user

        app.get('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id:objectId(id) };
            const result = await collection.findOne(query);
            res.send(result);
        })



        // add a new user
        app.post('/user', async(req, res)=>{
            const newUser = req.body;
            console.log ('adding new user', newUser);
            const result = await collection.insertOne(newUser);
            res.send(result);

        })


        //update user

        app.put('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const query = { _id:objectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name: updatedUser.name,
                  email: updatedUser.email
                },
              };
            const result = await collection.updateOne(query, updateDoc, options );
            res.send(result);
           

        })
        
        


        //delete a user

        app.delete('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id:objectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);

        })

    }
    finally{
        /* await client.close(); */ // when you don't need to call if you want to contine the connection keep it commented
    }

}
// need to call for run (must)
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running my crud server');
});

app.listen(port, ()=>{
    console.log('Crud server running')
})