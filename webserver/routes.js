const { rows } = require("mssql");
const con = require("./config/conexion");

var express = require('express');
var app = express();

/**
 * HomePage
 */
app.get('/', function(req, res) {
  res.send('hello world');
});

router.get('/', function(req, res) {
});
/**
 * Pedro Get
 */
router.get('/Pedro',(req,res)=>{
    con.query(sql,(err,row,fields)=>{
        if(err) throw err;
        else{
            res.json(rows)
        }
    })
})
module.export= router;