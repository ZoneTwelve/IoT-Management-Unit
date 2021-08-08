const express = require('express');
const router = express.Router();
const api_version = "v1";
const net = require("net");
const random = require("../modules/random");
var clients = new Object();
const server = net.createServer( ( socket ) => {
  console.log("Client connect");
  socket.on("data", ( buffer )=>{
    let data = buffer.toString()
    let CONN = data.match(/CONN (\S+)/);
    if( CONN != null ){
      socket.name = CONN[1];
      socket.uid = random( "ABCDEF0123456798", 12 );
      clients[ socket.uid ] = socket;
      console.log( Object.keys(clients) );
    }
  });
  socket.on("error", (e) => {
    delete clients[ socket.uid ];
    console.error(e);
  });
});

router.get('/', (req, res) => {
  res.send( {version: api_version} );
});

router.get("/devices", ( req, res ) => {
  let list = Object.keys( clients );
  for( let i = 0 ; i < list.length ; i++ ){
    list[ i ] = {
      name: clients[list[i]].name,
      uid: list[i]
    };
  }
  res.send( list );
});

router.post('/status', ( req, res ) => {
  let status = parseInt( req.body.status );
  let { uid } = req.body;
  console.log( req.body )
  if( status < 0 || status > 255 || isNaN( status ) ){
    console.log( "status", status );
    return res.status( 405 ).send({error:"Not allow this status"});
  }
  else if( clients[ uid ] == undefined )
    return res.status( 404 ).send({error:"Device not exists"});
  else{
    let client = clients[uid];
    res.send({message:"OK"});
    client.write(`SET ${status}\n`);
  }
    
});


server.listen( 54188 );
module.exports = router;