var torrentStream = require('torrent-stream');
var PirateBay = require('thepiratebay')


var express = require('express');
var app = express();
var port = process.env.PORT || 1337;

app.use(express.static('public'))

app.get('/streamMagnet/:magnet', function (req, res) {
console.log('Starting new stream');
var decoded = new Buffer(req.params.magnet, 'base64').toString('ascii')
var engine = torrentStream(decoded);

engine.on('ready', function() {
    engine.files.forEach(function(file) {
	var containMKV = file.name.includes('.mkv');
	var containMP4 = file.name.includes('.mp4');

        if(containMP4 == true) {

	  		res.setHeader("Content-Type", "video/mp4");
  			file.createReadStream().pipe(res);
		}
    else if(containMKV == true) {
          res.setHeader("Content-Type", "video/x-matroska");
          file.createReadStream().pipe(res);
    }
    });
});
})

app.listen(port, function () {
  console.log('Magic happening on port ' + port);
})
