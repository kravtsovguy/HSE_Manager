'use strict';

var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

const PORT=80; 

var server = app.listen(process.env.PORT || 8080,'0.0.0.0', function(){
    //console.log("Server listening on: http://localhost:%s", PORT);
    console.log('App listening at http://%s:%s', server.address().address,
    server.address().port);
  console.log('Press Ctrl+C to quit.');
});