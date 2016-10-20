const chalk = require('chalk')

module.exports = (app) => {
  app.on('building_graph', (data) => {
    console.log(`${chalk.blue('[xeon]')} building dependency graph`);
  });

  app.on('resolving_deps', (data) => {
    console.log(`${chalk.blue('[xeon]')} resolving dependencies`);
  });

  app.on('bundle', (data) => {
    console.log(`${chalk.blue('[xeon]')} file ${chalk.bgGreen(data.file)} was written at ${chalk.magenta(data.output)}`);
  });

  app.on('start_watch', (data) => {
    console.log(`${chalk.blue('[xeon]')} watching files...`);
  });

  app.on('changes_detected', (data) => {
    console.log(`${chalk.blue('[xeon]')} ${chalk.bgCyan('changes')} at ${chalk.magenta(data.file)}`);
  });
}
