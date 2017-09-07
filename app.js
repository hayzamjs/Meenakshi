var torrentStream = require('torrent-stream');
var PirateBay = require('thepiratebay')


var express = require('express');
var app = express();

app.use(express.static('public'))

app.get('/top', function (req, res) {
         var toSend = [{}];

  PirateBay.search('Malayalam', {
    category: 200
  })
  .then(results =>
    results.forEach(function(s) {
         var dataTo = s.name + '[MARY]' + s.magnetLink;
         var xx = JSON.stringify(dataTo);
         toSend.push(xx);
         console.log(toSend);
       })
     )
  .catch(err => console.log(err))

  setTimeout(function() {
    var swq = JSON.stringify(toSend);
    res.json(swq);
}, 3000);

})

app.get('/streamMagnet/:magnet', function (req, res) {
var decoded = new Buffer(req.params.magnet, 'base64').toString('ascii')
var engine = torrentStream(decoded);

engine.on('ready', function() {
    engine.files.forEach(function(file) {
	var containMKV = file.name.includes('.mkv');
	var containMP4 = file.name.includes('.mp4');

        if(containMKV == true || containMP4 == true) {

	  		res.setHeader('Content-Length', file.length); // this is important for vlc
  			file.createReadStream().pipe(res);
		}
    });
});
})

app.listen(1337, function () {
  console.log('Magic happening on port 1337');
})
