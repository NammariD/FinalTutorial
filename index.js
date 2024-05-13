const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://FinalProj:FinalProj@cluster0.itndudq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "Final";
const collectionName = "Final";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

var mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://FinalProj:FinalProj@cluster0.itndudq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

var personSchema = mongoose.Schema({
  name: String,
  age: Number,
  nationality: String,
});
var Person = mongoose.model("Person", personSchema);

var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var app = express();

var personSchema = mongoose.Schema({
  name: String,
  age: Number,
  nationality: String,
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.get("/", function (req, res) {
  res.render("form");
});

app.get("/person", function (req, res) {
  res.render("person");
});

app.get("/people", function (req, res) {
  Person.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error in retrieving people" });
    });
});

app.get('/people/:id', async function(req, res) {
   try {
      // Log that a GET request was received
      console.log("GET request received for person with ID:", req.params.id);

      // Find the person by ID
      const person = await Person.findById(req.params.id);

      // If person is not found, return 404 Not Found
      if (!person) {
         return res.status(404).json({ message: "Person with id " + req.params.id + " not found." });
      }

      // If person is found, return it as JSON response
      res.json(person);
   } catch (err) {
      // Log any errors that occur during the operation
      console.error("Error occurred:", err);

      // Send a 500 Internal Server Error response with an error message
      res.status(500).json({ message: "Error in retrieving person with id " + req.params.id });
   }
});


app.put("/people/:id", async function (req, res) {
  try {
    console.log("PUT request received");
    console.log("ID parameter:", req.params.id);
    console.log("Request body:", req.body);

    const response = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("Response from database:", response);

    res.json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error in updating person with id " + req.params.id });
  }
});

app.delete("/people/:id", async function (req, res) {
  try {
    const response = await Person.findOneAndDelete({ _id: req.params.id });
    if (response === null) {
      res
        .status(404)
        .json({ message: "Person with id " + req.params.id + " not found." });
    } else {
      res.json({ message: "Person with id " + req.params.id + " removed." });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error in deleting record id " + req.params.id });
  }
});

app.patch("/people/:id", async function (req, res) {
  try {
    console.log("PATCH request received");
    console.log("ID parameter:", req.params.id);
    console.log("Request body:", req.body);

    // Find the person by ID and update only the specified fields
    const response = await Person.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log("Response from database:", response);

    // Check if the person with the given ID exists
    if (!response) {
      return res
        .status(404)
        .json({ message: "Person with id " + req.params.id + " not found." });
    }

    // Send the updated person data as a response
    res.json(response);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error in updating person with id " + req.params.id });
  }
});

app.set("view engine", "pug");
app.set("views", "./views");

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

app.post("/person", function (req, res) {
  var personInfo = req.body; // Get the parsed information

  if (!personInfo.name || !personInfo.age || !personInfo.nationality) {
    res.render("show_message", {
      message: "Sorry, you provided wrong info",
      type: "error",
    });
  } else {
    var newPerson = new Person({
      name: personInfo.name,
      age: personInfo.age,
      nationality: personInfo.nationality,
    });

    newPerson
      .save()
      .then((savedPerson) => {
        res.render("show_message", {
          message: "New person added",
          type: "success",
          person: personInfo,
        });
      })
      .catch((error) => {
        res.render("show_message", {
          message: "Database error",
          type: "error",
        });
      });
  }
});

app.post("/", function (req, res) {
  console.log(req.body);
  res.send("recieved your request!");
});

app.listen(3000);
