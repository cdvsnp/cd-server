const express = require('express');
const compress = require('compression');
const formidable = require('formidable');
const bodyParser = require('body-parser');
//const http = require('http');
//const https = require('https');
const fs = require('fs');
const path = require('path');


// Configuracion de certificado SSL (HTTPS)
//const fs = require('fs');
/*
const sslopt = {
  cert: fs.readFileSync('./sslcert/certificate.crt', 'utf8'),
  key: fs.readFileSync('./sslcert/private.key', 'utf8'),
  ca: fs.readFileSync('./sslcert/ca_bundle.crt', 'utf8'),
}
*/

const app = express();

app.use(compress());


//<------ Inicio Listar Archivos (/files) ----->

//const fs = require('fs');
//const path = require('path');


app.get('/files', function(req, res) {
  let fileList=[];
  const pathToFiles = path.join('/data/files-server');
  fs.readdir(pathToFiles, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    files.forEach((file) => {
      let LIO = file.lastIndexOf('.');
      let stats = fs.statSync(path.join(pathToFiles,file));
      fileList.push( {
        name: file,
        //Si existe '.' en el nombre y no se encuentra al final del nombre
        //Devuelve la extension +1 (sin el '.') sino devuelve un '-' por cada operador terciario
        type: LIO != -1 ? ((LIO + 1) < file.length ? file.slice(LIO + 1) : '-') : '-',
        size: Number((stats.size/1024).toFixed(2)),
        mtime: stats.mtime,
      } );
    });
    res.json(fileList);
  })
})

//<--------- Fin Listar Archivos -------->
app.use(express.static('./dist'));
app.use('/files', express.static('/data/files-server'));

//<------- Inicio File Upload ------>

//const formidable = require('formidable');
//const bodyParser = require('body-parser');
//const fs = require('fs');

app.post('/upload', function(req, res){
  var form = new formidable.IncomingForm();
  form.maxFileSize = 1024 * 1024 * 1024; // 1024*1024 = MegaBytes
  form.parse(req);
  form.on('fileBegin', function(name, file){
    file.path = '/data/files-server/' + file.name;
  });
  form.on('file', function(name, file){
    console.log(`uploaded ${file.name} succesfully!`);
  });
})
//<------ Fin File Upload ------->

app.listen(8080, () => console.log('http escuchando en puerto 8080'));
// https.createServer(sslopt,app).listen(443, () => console.log('https escuchando en puerto 443'));