var fs = require('fs');
var https = require('https');
var path = require('path');

var dir = process.cwd();

function downloadFile(url) {
	https.get(url,function (res) {
		if (res.statusCode !== 200) return;
		var p = path.join(dir, 'test.sh');
		console.log(res);
		fs.writeFileSync(p, res);
	}).on('error', function (e) {
		console.error(e);
	});
}

downloadFile('https://raw.githubusercontent.com/drkraken/dev-setup/master/setup.sh');
