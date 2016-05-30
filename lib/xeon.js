import {EventEmitter} from './events';
import chokidar from 'chokidar';

export default class Xeon extends EventEmitter {
  constructor() {
    super();
  }

  watchFiles(pathes, callback) {
    const watcher = chokidar.watch(pathes, { ingoreInitial: true });
    watcher.on('ready', () => { this.emit('start:watch') });
    watcher.on('change', () => { this.emit('changes') })
  }
}
