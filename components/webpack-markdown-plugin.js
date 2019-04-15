const PluginName = 'webpack-markdown-plugin';
const glob = require('glob');
const md = require('markdown-it')();
const fs = require('fs');

class WebpackMarkdownPlugin {

    constructor(options) {
        this.src = options.src !== undefined ? options.src : './src/**/*.md';
        this.dest = options.dest !== undefined ? options.dest : './dest/**/*/md';
        this.base = options.base !== undefined ? options.base : './';
        this.inject = options.inject !== undefined ? options.dest : false;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            PluginName,
            (compilation, callback) => {
                console.log('Markdown plugin');

                glob('this.src', (err, files)=>{
                    // TODO: read write md files
                });

                callback();
            }
        )
    }
}

module.exports = WebpackMarkdownPlugin;