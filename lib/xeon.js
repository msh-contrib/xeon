import {EventEmitter} from './events';
import chokidar from 'chokidar';
import resolver from './resolver';
import buildDesGraph from './buildDesGraph';
import file from './file';
import {isAbsolute, resolve} from 'path';
import * as outputFileSync from 'output-file-sync';

export default class Xeon extends EventEmitter {
  constructor(entry, output = './bundle.sh') {
    super();
    this.entry = this._resolvePath(entry);
    this.output = this._resolvePath(output);
    this.emit('init');
  }

  _resolvePath(file) {
    return isAbsolute(file) ? file : resolve(process.cwd(), file);
  }

  // build main deps graph
  buildDesGraph() {
    try {
      this.emit('building_graph');
      this.graph = buildDesGraph(this.entry);
      return this;
    } catch (error) {
      console.log(`Error while building dependecies graph ${JSON.stringify(error)}`);
    }
  }

  // resolve dependecies order
  resolveDepsGraph() {
    try {
      this.emit('resolving_deps');
      this.resolvedDeps = resolver(this.graph.getNode(this.entry));
      return this;
    } catch (error) {
      console.log(`Error while resolving dependecies ${JSON.stringify(error)}`);
    }
  }

  // write main bundle file
  writeBundle() {
    try {
      let dataList = file.getData(this.resolvedGraph);
      outputFileSync(this.output, file.mergeData(dataList), 'utf-8');
      this.emit('bundling');
      return this;
    } catch(error) {
      console.log(`Error while writing bundle: ${JSON.stringify(error)}`);
    }
  }

  // watch deps and run callback on change
  watchDeps(callback) {
    const watcher = chokidar.watch(file.getPathes(this.resolvedGraph), { ignoreInitial: true });
    watcher.on('ready', () => { this.emit('start_watch') });
    watcher.on('change', (file) => {
      this.emit('changes_detected', {file: file});
      callback(file);
    });
    return this;
  }
}
