/*
Consigna tarea:

web server que escuche en localhost:3000
debe:

- devolver las páginas solicitadas (html) de una subcarpeta static solo por método get
- dar error por web (404) si no existe la pagina
- dar error por web (405) si usa otro method distinto de get
- escribir en un archivo mycoolserver.log las request (method, url, timestamp y resultado de la respuesta con codigo y mensaje)
- dar error 500 si no puede hacer algo
- mostrar por consola cuando el server arranca
- mostrar por consola cuando no puede escribir en le log de errores
- si se hace un request a localhost:3000/,localhost:3000/home, localhost:3000/home.html localhost:3000/index debe mostrar localhost:3000/index.html
*/

// hacer node --watch server.js


//hacer los import ya que estamos en type:module
import http from 'node:http';
import fs from 'node:fs/promises';

const hostname = 'localhost';
const port = 3000;

//funcion async de lectura
async function readResource(filePath) {
 const data =await fs.readFile(`.${filePath}`,{encoding:'utf8'})
 return data
}

const server = http.createServer(async (req, res) => {

  //armar la ruta del archivo solicitado y la consulta
  const filePath = '/static' + req.url;
  let consulta = 'Nueva consulta a las: '+ new Date().toISOString() + ' Método usado: ' + req.method +' Url pedida: ' + req.url; 


  //- devolver las páginas solicitadas (html) de una subcarpeta static solo por método get
  //- dar error por web (405) si usa otro method distinto de get
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Metodo no permitido, pelotudo');

  //- si se hace un request a localhost:3000/,localhost:3000/home, localhost:3000/home.html localhost:3000/index debe mostrar localhost:3000/index.html
  //redirecciona x eso el codigo 301 y el location en el head
  }else if (req.url == '/' ||
            req.url == '/index' || 
            req.url == '/home' ||
            req.url == '/home.html') {
    res.writeHead(301, { 'Location': '/index.html' });
    res.end();

  //carga index
  }else if (req.url == '/index.html') {
    try{
      const data = await readResource(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);

    //- dar error 500 si no puede hacer algo
    }catch(err){
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno del servidor');
    }

    //en caso de que no haya ingresado a index.html ni similares
  }else{
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Recurso no encontrado, pelotudo');
  }

  //termina de armar la consulta
  consulta += ' resultado: ' +res.statusCode + ' ' + res.statusMessage + '\n';
  console.log(consulta);

  // - escribir en un archivo mycoolserver.log las request (method, url, timestamp y resultado de la respuesta con codigo y mensaje)
  // - mostrar por consola cuando no puede escribir en le log de errores
  // HAY QUE PONER AWAIT!!!
  try {
    await fs.writeFile('mycoolserver.log', consulta, { flag: 'a' });
  } catch (err) {
    console.error('Error al escribir el archivo de log', err);
  }
});

//- mostrar por consola cuando el server arranca
server.listen(port, hostname, () => {
  console.log(`Arrancó el server`);
});

//Hacer un método que reciba un objeto (en terminos de javascript) y me imprima por consola toda la cadena de prototipos hasta llegar a null.

function verPrototipos(obje){
  while (obje.__proto__ !== null) {
    console.log(obje.__proto__);
    obje = obje.__proto__;
  }
}