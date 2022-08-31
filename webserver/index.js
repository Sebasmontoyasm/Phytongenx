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

app.get('/pedro/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  var id = request.params.id;
  con.query('SELECT * FROM data WHERE ID='+id, (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});

app.get('/pedro/qb/duplicated', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  con.query('SELECT * FROM data', (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});

app.get('/pedro/cms/manually', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  con.query('call cmsupmanualprocedure2();', (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


