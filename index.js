require("./config/conexion");

const express = require('express');
const port = (process.env.port || 3000)

const app = express();

app.set('port',port)

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});

app.listen(app.get('port'),(error)=>{
    if(error){
        console.log("Error al inciar el servidor"+error)
    }else{
        console.log('Servidor inciado en el puerto: '+port)
    }
})

