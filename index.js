const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// this is a comment i wrote to check vercel 
app.use(cors({
  origin:[
    // 'http://localhost:5173',
   
    'https://bengali-vhoj.web.app',
    'https://bengali-vhoj.firebaseapp.com',
  ],
  credentials: true
}))
// console.log(process.env.DB_PASS)

// mongo db start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmpng5e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //collection
    const foodCollection = client.db("bengaliVhoj").collection("bengali-vhoj");
    const foodCartCollection = client.db("foodCartdb").collection('foodCart');

    // app.get("/foods", async (req, res) => {
    //   const cursor = foodCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

      // sending the data with email query in added components
      app.get("/foods", async (req, res) => {
        let query ={}
        if(req.query.email){
           query= {email: req.query.email}

        }
      const cursor = foodCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      });

        // updating a product
        app.put('/foods/:id', async(req,res)=>{
          const id = req.params.id;
          const filter = {_id : new ObjectId(id)}
          const options =   {upsert : true}
          const updatedProduct = req.body;
          const product ={
            $set:{
              name : updatedProduct.name,
              image : updatedProduct.image   ,
              category : updatedProduct.category,
              quantity : updatedProduct.quantity,
              details : updatedProduct.details,
              price : updatedProduct.price,
              made_by : updatedProduct.made_by,
              short_details : updatedProduct.short_details,
            }
          }
          const result = await foodCollection.updateOne(filter , product , options);
          res.send(result);
      }) 




    // add a food item in foodCollection
    app.post('/food', async(req , res)=>{
      const newProduct = req.body;
      // console.log(newProduct); 
      const result = await foodCollection.insertOne(newProduct);
      res.send(result);

  })

    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });
    // sending data to cart by post 
    app.post('/food-cart', async(req,res)=>{
      const addCartProduct = req.body;
      const addCart = await foodCartCollection.insertOne(addCartProduct);
      console.log(addCart);
      res.send(addCart);
    });
      // showing all the booked products with email query
    app.get('/food-cart', async(req,res)=>{
      console.log(req.query);
      let query ={}
        if(req.query.email){
           query= {email: req.query.email}

        }
      const cursor = foodCartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete from cart 
    app.delete('/food-cart/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id : new ObjectId(id)}
      const result = await foodCartCollection.deleteOne(query);
      res.send(result);
    });
    // find cart data by email

    // app.get('/food-cart', async(req,res)=>{
    //   // console.log(req.query.email);
    //   console.log(req.query);
    //   // let query = {};
    //   // if(req.query?.email){
    //   //   query = {email:req.query.email}
    //   //   // const cursor = foodCartCollection.find(query);
    //   //   // const result = await cursor.toArray();
    //   //   // res.send(result);
        
    //   // }

    //   const cursor = foodCartCollection.find(query);
    //     const result = await cursor.toArray();
    //     res.send(result);
    // })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongo  end
app.get("/", (req, res) => {
  res.send("vhoj is running");
});

app.listen(port, () => {
  console.log(`bengali-vhoj is running on port ${port}`);
});
