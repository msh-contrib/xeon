var chokidar = require('chokidar');

/**
 * watch file changes and pefrom action
 * on specific event
 * @param  {Array} files - list of files to watch
 */
module.exports = function (args, cb) {
  var watcher = chokidar.watch(args, { ignoreInitial: true });
  watcher.on('ready', function () {
    console.log(chalk.white(
      chalk.cyan('[br]'),
      'start watching files...'),
      chalk.gray('\n * press Ctrl+C to leave watch mode')
    );
  });
  watcher.on('change', cb);
};
