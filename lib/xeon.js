import { EventEmitter } from 'events';
import chokidar from 'chokidar';
import resolver from './resolver';
import buildDesGraph from './deps-graph';
import { getData, getPathes, mergeData } from './file';
import { dirname, basename } from 'path';
import outputFileSync from 'output-file-sync';
import { resolvePath } from './utils';
import prettyjson from 'prettyjson';

export default class Xeon extends EventEmitter {
  constructor(config = {}) {
    super();
    this.entry = resolvePath(config.entry);
    this.output = resolvePath(config.output || './bundle.sh');
    this._allowExternal = config.allowExternal || false;
  }

  // build main deps graph
  buildDesGraph() {
   try {
     this.emit('building_graph');
     this.graph = buildDesGraph(this.entry, this._allowExternal);
     return this;
   } catch (error) {
     console.log(`Error while building graph\n ${prettyjson.render(error)}`);
   }
  }

  // resolve dependecies order
  resolveDepsGraph() {
    try {
      this.emit('resolving_deps');
      this.resolvedGraph = resolver(this.graph.getNode(this.entry));
      return this;
    } catch (error) {
      console.log(`Error while resolving graph\n ${prettyjson.render(error)}`);
    }
  }

  // write main bundle file
  writeBundle() {
    try {
      const dataList = getData(this.resolvedGraph);
      outputFileSync(this.output, mergeData(dataList), 'utf-8');
      this.emit('bundle', { file: basename(this.output), output: dirname(this.output) });
      return this;
    } catch (error) {
      console.log(`Error while writing bundle\n ${prettyjson.render(error)}`);
    }
  }

  // watch deps and run callback on change
  watchDeps(callback) {
    const watcher = chokidar.watch(getPathes(this.resolvedGraph), { ignoreInitial: true });
    watcher.on('ready', () => { this.emit('start_watch') });
    watcher.on('change', (file) => {
      this.emit('changes_detected', { file: basename(file) });
      callback(file);
    });
    return this;
  }
}
