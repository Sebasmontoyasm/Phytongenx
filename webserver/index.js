const express = require('express');
var con = require("./config/conexion");
const bodyParser = require("body-parser");
var multer = require('multer');
var upload = multer();

const app = express();

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

/**
 * Obtiene la información para la View Master Data
 */
app.get('/api/data', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","*");

  con.query('SELECT * FROM data', (error, result) => {
    if (error) throw error;
    response.send(result);
  });
});

/**
 * Consulta DB para obtener los cms que requieren 
 * procesamiento manual por fallo.
 */

app.get('/api/cms/manually', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;
  con.query('call cmsupmanualprocedure()', function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});

/**
 * Consulta el detalle de las PO Relacionadas
 */

 app.get('/api/cms/detail/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;

  con.query('call cms_data(?)',id, function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});

/**
 * Obtiene toda la informacion del Performace para mostrar 
 */
app.get('/api/cms/performance', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;
  con.query('call cms_performance()', function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});


/**
 * Consulta DB para obtener los qb que requieren 
 * procesamiento manual por fallo.
 */

 app.get('/api/qb/manually', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;
  con.query('call qbmanually()', function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});

/**
 * Muestra toda la informacion de QB_Performance.
 */
app.get('/api/qb/performance', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;
  con.query('call qb_performance()', function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});


/**
 * Consulta DB para obtener los qb que requieren 
 * procesamiento manual por fallo.
 */

 app.get('/api/qb/duplicated', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;
  con.query('call qbduplicated()', function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});

app.get('/api/qb/detail/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', '*');
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");
  const id = request.params.id;

  con.query('call qb_data(?)',id, function (err, result) {
    if (err) throw err;
    response.send(result[0]);
  });
});



/**
 * Backup de data eliminada
 */
app.get('/api/data/data_delete/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', "*");
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","GET");

  const id = Number(request.params.id);
  con.query("CALL databackup(?)",id, function (error, res) {
    if (error){
      response.send({status: 1, info: "Lo sentimos algo ha salido mal."});
      throw error;
    } 
    response.send(res[0][0]);
  });
});

/**
 * 
 */

app.post('/api/userlogs/post', (req, response)=> {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","POST");

  userlog = Object.values(req.body);

  con.query('INSERT INTO userlogs(USER,ROL,ACTION,DATEACTION,IDDATA,IDPO,IDINVOICE,COMMENTS)VALUES(?);',[userlog], (error) => {
    if (error){
      response.send({status: 1, info: "Lo sentimos algo ha salido mal."});
      throw error;
      
    } 
    response.send({status: 0, info: "El reporte del cambio ha sido guardado con exito."});
  });
   
});

/**
 * Eliminar Archivo en el Master Data por ID.
 */
app.get('/api/data/delete/:id', (request, response) => {
  //Revisar como ponerlo contra el localhost:4200
  response.header('Access-Control-Allow-Origin', "*");
  response.header("Access-Control-Allow-Headers","*");
  response.header("Access-Control-Allow-Methods","DELETE");

  const id = request.params.id;
  con.query('DELETE FROM data WHERE ID='+id, (error) => {
    if (error){
      response.send({status: 1, info: "Lo sentimos algo ha salido mal."});
      throw error;
    } 
    response.send({status: 0, info: "La información ha sido eliminada con exito."});
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

