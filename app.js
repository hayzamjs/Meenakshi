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
  engine.on('ready', function() {
      engine.files.forEach(function(file) {
          filesArray.push(file.name);
      });
      res.send(filesArray);
  });
  
});

app.get('/streamMagnet/:magnet/:name', function (req, res) {
  console.log('Starting new stream');
  var decoded = new Buffer(req.params.magnet, 'base64').toString('ascii')
  if (req.params.magnet) {
    var name = Buffer.from(req.params.name, 'base64').toString();
  }
  engine = torrentStream(decoded);

  engine.on('ready', function() {
    engine.files.forEach(function(file) {
      if (name) {
          if (name == file.name) {
            console.log("Playing: "+name);
            file.createReadStream().pipe(res);
          }
      } else {
        var containMKV = file.name.includes('.mkv');
        var containMP4 = file.name.includes('.mp4');
        if(containMP4 == true || containMKV == true) {
          file.createReadStream().pipe(res);
        } else {
          //Do nothing as it as unstreamable file.
        }
      }
    });
  });
})

app.get('/endstream', function(req, res) {
	engine.destroy(function() {
		res.send('success');
	});
});

app.listen(port, function () {
  console.log('Meenakshi running on port ' + port);
})
