// Reading variables

const configDirName = __dirname;

// Imports

const path = require('path');

const WebpackPlugins = {
  Clean: require('clean-webpack-plugin'),
  Copy:  require('copy-webpack-plugin')
};

// Config

const paths = {
  projectRootAbs: resolvePath(configDirName, '..', '..'),
  buildOutputLoc: joinPath('.', 'build', 'output'),
  sourceLoc:      joinPath('.', 'src')
};

const production = true;
const webpackMode = production ? 'production' : 'development'; // 'none'

//

module.exports = {
  mode: webpackMode,
  entry:  joinPath(paths.sourceLoc, 'js', 'index.js'),
  output: {
    path: resolvePath(paths.projectRootAbs, paths.buildOutputLoc, 'js'),
    filename: 'index.js'
  },
  plugins: [
    new WebpackPlugins.Clean(
      paths.buildOutputLoc,
      {
        root: paths.projectRootAbs,
        verbose: true,
        dry: false
      }
    ),
    new WebpackPlugins.Copy([
      {
        from: joinPath(paths.sourceLoc, 'index.html'),
        to: resolvePath(paths.projectRootAbs, paths.buildOutputLoc)
      }
    ])
  ]
};

// Helpers

function joinPath(...args)    { return args.join(path.sep);   }
function resolvePath(...args) { return path.resolve(...args); }
