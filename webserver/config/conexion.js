const mysql = require("mysql")

var con = mysql.createConnection({
    host:'localhost',
    user: 'SS',
    password: '1234',
    database: 'pgenx-cmsqb',
    server: 'localhost',
});

con.connect(
    (err)=>{
        if(!err){
            console.log('Conexión con bd establecida')
        }else{
            console.log('Error bd: '+err);
        }
    }
);

module.exports = con;