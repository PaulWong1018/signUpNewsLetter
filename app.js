//jshint esversion: 6

const response = require("express");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/03053962a3";

  const options = {
    method: "POST",
    auth: "paul:2ef265c0b13bd0545aebab0202f61183-us18",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const receivedData = JSON.parse(data);
      if (receivedData.error_count != 0) {
        //Very Important to check whether the contact is sent to the list.
        res.sendFile(__dirname + "/failure.html");
      } else {
        res.sendFile(__dirname + "/success.html");
      }
      console.log(receivedData);
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {     //dynamic port, listen to Heroku port or || 3000 local port
  console.log("Server is running on port 3000.");
});

//API key 2ef265c0b13bd0545aebab0202f61183-us18
//Audience ID 03053962a3
//where you want to put your subscriber into
