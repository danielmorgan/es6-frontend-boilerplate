## Installation

1. `npm install` to get dependencies.
1. `npm install -g gulp` to install gulp globally.

## Developing

### Scripts

Babel is included to transpile ES2015 down to ES5. Browserify bundles all javascripts, starting with `scripts/index.js`. The output file is placed in the root, named `build.js` and is loaded in `index.html`.

### Styles

`styles/index.scss` is the entry point. Everything is written in SCSS formatted Sass. `_bootstrap-custom.scss` allows you to select only needed components of the twbs framework to be included in the final `build.css`.

### File watcher

Run `gulp serve` to start a BrowserSync server and open the project in your default browser. This will watch JS and SCSS files for changes and refresh the browser when a new build file is completed.