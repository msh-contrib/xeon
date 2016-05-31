import updateNotifier from 'update-notifier';

export default (pkg) => {
  const notifier = updateNotifier({
     pkg,
     updateCheckInterval: 1000 * 60 * 60 * 1
  });

  if (notifier.update) {
    notifier.notify();
  }
}
