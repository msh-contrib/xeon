/**
 * Build single file from resolved path
 */
var fs = require('fs');

function Builder(files, outputLoc, opts) {
	opts = opts || {};
	this.files = files || [];
	this.outputLoc = outputLoc || process.cwd();
}

Builder.prototype.concatFiles = function () {
	return resolvedGraph.reduce(function (acc, current) {
		var content = fs.readFileSync(current, 'utf-8');
		return acc += '#build with shellify\n'.concat(content, '\n');
	}, '');
};

Builder.prototype.genOutput = function () {
	fs.writeFileSync('build.sh', concatedContent);
};

module.exports = Builder;
