var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

const PORT=8000; 
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});