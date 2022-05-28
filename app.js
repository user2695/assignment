const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json())
app.use(express.static("public"));
app.set("view engine", "ejs");

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');


app.get("/", function (req, res) {
  const key = "key here";
  const query = req.body.book;
  const url =
    "https://www.googleapis.com/books/v1/volumes?q=" + query + "&key=" + key;
  https.get(url, (response) => {
    const chunks = [];
    console.log("statusCode:", res.statusCode);
    response.on("data", (d) => {
      chunks.push(d);
    });
    response.on("end", function () {
      const data = Buffer.concat(chunks);
      const got = JSON.parse(data);
      // const item = got.items;
      // item.forEach((element) => {
      //    var obj = {
      //     title: element.volumeInfo.title,
      //     authors: element.volumeInfo.authors,
      //     publishedDate: element.volumeInfo.publishedDate,
      //     description: element.volumeInfo.description,
      //   };
      //   console.log(obj);       
      // });
      res.json({got})
    });
  })
});



app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);
app.listen(3000, function () {
  console.log("Running on: http://localhost:3000/api-docs");
});
