import updateNotifier from 'update-notifier';

export default (pkg) => {
  const notifier = updateNotifier({
     packageName: pkg.name,
     packageVersion: pkg.version,
     updateCheckInterval: 1000 * 60 * 60 * 1
  });

  if (notifier.update) {
    notifier.notify();
  }
}
