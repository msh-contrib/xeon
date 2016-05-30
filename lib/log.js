export default (app) => {
  app.on('init', (data) => {
    console.log(`starting application...`);
  });

  app.on('end', (data) => {
    console.log(`finising application...`);
  });
}
