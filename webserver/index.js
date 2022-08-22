const express = require('express');
var con = require("./config/conexion");

const app = express();

app.get('/pedro', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get
  response.header('Access-Control-Allow-Origin', '*');
  con.query('SELECT * FROM data', (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


