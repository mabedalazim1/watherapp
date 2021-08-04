/* Global Variables */
//  Define Api & credentials
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
// Personal API Key for OpenWeatherMap API
const apiKey = "&appid=e3b451ce54b5a82230f31c5f4f95da42";
let zipCod = "";
// User input
const inputzip = document.getElementById("zip");
const submitBtn = document.getElementById("generate");
const feeling = document.getElementById("feelings");
// App output
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const date = document.getElementById("date");
/*****************************/

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

// Update user UI
const updateUI = async () => {
  let data = await getProjectData();
  // Check if there is data or not
  if (data.msg) {
    city.innerHTML = data.msg;
    console.log(`Error: ${data.msg}`);
    temp.innerHTML = "";
    content.innerHTML = "";
    date.innerHTML = "";
  } else {
    // If fetch return flied data , update UI
    city.innerHTML = `City : ${data.name}`;
    console.log(`success: You get information about ${data.name}`);
    temp.innerHTML = ` Temp is : ${data.temp} ,  ${data.description}`;
    date.innerHTML = ` On: ${newDate}`;
    // Add user input
    if (feeling.value.length) {
      content.innerHTML = ` Your feeling is :  ${feeling.value}`;
    } else {
      content.innerHTML = "";
    }
  }
};
// Event listener to add function to existing HTML DOM element
submitBtn.addEventListener("click", () => {
  zipCod = inputzip.value;
  getData();
});

/* Function called by event listener */
const getData = async () => {
  const res = await getWatherInfo(baseUrl, zipCod, apiKey);
  if (res.msg) {
    postDataToServer("/post-data", { msg: res.msg });
  } else {
    postDataToServer("/post-data", res);
  }
  updateUI();
};

/* Function to GET Web API Data*/
const getWatherInfo = async (url, zip, key) => {
  try {
    // Store Err message in a variable
    let msg = "";
    // Get data from api
    const response = await fetch(`${url}${zip}${key}`);
    const data = await response.json();
    msg = data.message;
    if (msg === undefined) {
      // Return Data if fetch is flied
      return await data;
    } else {
      //Return empty object -with err message- if fetch is not flied
      return { msg: data.message };
    }
  } catch (err) {
    console.log(`Error : ${err}`);
  }
};

/* Function to POST data */
const postDataToServer = async (url = "", data = {}) => {
  let response = await fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  response = await response.json();
  return response;
};

/* Function to GET Project Data */
const getProjectData = async () => {
  try {
    let response = await fetch("/get-data");
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
