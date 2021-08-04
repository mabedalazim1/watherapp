// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());
// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 5000;
app.listen(port, () => {
  // Callback to debug
  console.log(`App is running on => http://localhost:${port}/`);
});

// Initialize route with a callback function
app.get("/get-data", getDataObject);

// Callback function to complete GET route
function getDataObject(req, res) {
  console.log(projectData);
  res.send(projectData);
}

// Post Route
app.post("/post-data", (req, res) => {
  // Check if the city is found or not
  if (req.body.msg) {
    projectData = { msg: `${req.body.msg}` };
    console.log(`Error ${req.body.msg}.`);
    res.send(projectData);
  } else if (req.body.name) {
    // Store weather information in the 'js object'
    let data = req.body;
    projectData = {
      name: `${data.name}, ${data.sys.country}`,
      temp: `${parseFloat(data.main.temp - 273.15).toFixed(0)} °C`,
      description: `${data.weather[0].description}`,
    };
    console.log(`'Sucsses' city is : ${data.name}.`);
    res.send(projectData);
  } else {
    console.log("Unknown error!");
    res.send({ msg: "Unknown error!" });
  }
});
