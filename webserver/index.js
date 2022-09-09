const express = require('express');
var con = require("./config/conexion");

const app = express();

app.get('/api/data/delete/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', "*");
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","DELETE");

  const id = request.params.id;
  con.query('DELETE FROM data WHERE ID='+id, (error, result) => {
    if (error) throw error;
    response.send({status: "Elemento "+id+" eliminado satisfactoriamente."});
  })
});


app.get('/api/data', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");

  con.query('SELECT * FROM data', (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});

app.get('/api/data/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");

  var id = request.params.id;
  con.query('SELECT * FROM data WHERE ID='+id, (error, result) => {
    if (error) throw error;
    response.send(result[0]);
  })
});

app.get('/api/qb/duplicated', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");

  con.query('SELECT * FROM data', (error, result) => {
    if (error) throw error;
    response.send(result);
  })
});

app.get('/api/cms/manually', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200/get/id
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");

  con.query('call cmsupmanualprocedure()', (error, result) => {
    if (error) throw error;
    response.send(result[0]);
  })
});



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


