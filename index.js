const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.2fsgp3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    await client.connect();

    const serviceCollection = client.db("serviceDb").collection("service");
    const bookedCollection = client.db("bookedDb").collection("booked");

    //service related api
    app.get("/services", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { providerEmail: req.query.email };
      }
      const result = await serviceCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const service = req.body;
      const updateService = {
        $set: {
          serviceName:service.serviceName,
          serviceImage:service.serviceImage,
          price:service.price,
          serviceArea:service.serviceArea,
          description:service.description,
        },
      };
      const result = await serviceCollection.updateOne(filter, updateService);
      res.send(result);
    });

    //booked related api

    app.get("/booked", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { userEmail: req.query.email };
      }
      const result = await bookedCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookedCollection.findOne(query);
      res.send(result);
    });

    app.post("/booked", async (req, res) => {
      const newBooked = req.body;
      const result = await bookedCollection.insertOne(newBooked);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Electro Care Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
