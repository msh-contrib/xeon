export default (app) => {
  app.on('building_graph', (data) => {
    console.log('building deps graph');
  });

  app.on('resolving_deps', (data) => {
    console.log('resolving deps');
  });

  app.on('bundle', (data) => {
    console.log('file was written');
  });

  app.on('changes_detected', (data) => {
    console.log('detected changes');
  });
}
