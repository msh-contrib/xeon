const updateNotifier = require('update-notifier')

module.exports = (pkg) => {
  const notifier = updateNotifier({
     pkg,
     updateCheckInterval: 1000 * 60 * 60 * 1
  });

  if (notifier.update) {
    notifier.notify();
  }
}
