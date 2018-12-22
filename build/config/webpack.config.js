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
  buildConfigLoc: joinPath('.', 'build', 'config'),
  sourceLoc:      joinPath('.', 'src')
};

const production = true;
const webpackMode = production ? 'production' : 'development'; // 'none'

// Main

module.exports = (env, argv) => ({
  mode: webpackMode,
  entry: joinPath(paths.sourceLoc, 'ts', 'index.ts'),
  module: { rules: getTypescriptRules(argv) },
  devtool: 'inline-source-map',
  output: {
    path: resolvePath(paths.projectRootAbs, paths.buildOutputLoc, 'js'),
    filename: 'index.js'
  },
  plugins: [
    createCleanPlugin(paths.buildOutputLoc),
    new WebpackPlugins.Copy([
      {
        from: joinPath(paths.sourceLoc, 'index.html'),
        to: resolvePath(paths.projectRootAbs, paths.buildOutputLoc)
      }
    ])
  ]
});

// Plugins

function createCleanPlugin(localPathsToClean) {
  return new WebpackPlugins.Clean(
    localPathsToClean,
    {
      root: paths.projectRootAbs,
      verbose: true,
      dry: false
    }
  );
}

// Rules

function getTypescriptRules(argv) {

  const tsFilesRegex   = /\.ts$/;
  const tsExcludeRegex = /node_modules/;
  const tsConfigFile     = joinPath(paths.projectRootAbs, paths.buildConfigLoc, 'tsconfig.json');
  const tsLintConfigFile = joinPath(paths.projectRootAbs, paths.buildConfigLoc, 'tslint.json');

  return [
    getTypescriptLintRule(argv),
    getTypescriptRule()
  ];

  function getTypescriptLintRule(argv) {
    const tsLintVerbose = getArgumentBoolean(argv, 'tslint-verbose', false);
    return {
      test: tsFilesRegex,
      exclude: tsExcludeRegex,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader',
        options: {
          tsConfigFile: tsConfigFile,
          configFile: tsLintConfigFile,
          formatter: tsLintVerbose ? 'verbose' : undefined
        }
      }]
    };
  }

  function getTypescriptRule() {
    return {
      test: tsFilesRegex,
      exclude: tsExcludeRegex,
      use: [{
        loader: 'ts-loader',
        options: { configFile: tsConfigFile }
      }]
    };
  }
}

// Helpers

function joinPath(...args)    { return args.join(path.sep);   }
function resolvePath(...args) { return path.resolve(...args); }

function getArgumentBoolean(argv, argName, optDefaultValue) {
  if (argv.hasOwnProperty(argName)) {
    const valueInLowCaseStr = String(argv[argName]).toLowerCase();
    return ['0', 'false', 'f', 'no', 'n'].includes(valueInLowCaseStr) === false;
  } else {
    return optDefaultValue;
  }
}
