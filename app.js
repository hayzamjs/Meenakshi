var torrentStream = require('torrent-stream');

var engine = {};

var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('public'))

app.get('/get-videos/:magnet', function(req, res) {

  var decoded = new Buffer(req.params.magnet, 'base64').toString('ascii')
  var filesArray = [];
  engine = torrentStream(decoded);
  console.log("created get video engine");
  engine.on('ready', function() {
      engine.files.forEach(function(file) {
          filesArray.push(file.name);
      });
      console.log("filesarray");
      console.log(filesArray);
      res.send(filesArray);
  });
  
});

app.get('/streamMagnet/:magnet', function (req, res) {
console.log('Starting new stream');
var decoded = new Buffer(req.params.magnet, 'base64').toString('ascii')
engine = torrentStream(decoded);

engine.on('ready', function() {
    engine.files.forEach(function(file) {
	var containMKV = file.name.includes('.mkv');
	var containMP4 = file.name.includes('.mp4');
        if(containMP4 == true || containMKV == true) {
  			file.createReadStream().pipe(res);
		    }
        else{
          //Do nothing as it as unstreamable file.
        }
    });
});
})

app.get('/endstream', function(req, res) {
	engine.destroy(function() {
		res.send('sucess');
	});
});

app.listen(port, function () {
  console.log('Meenakshi running on port ' + port);
})
