const PluginName = 'webpack-markdown-plugin';
const glob = require('glob');
const md = require('markdown-it')();
const path = require('path');
const fs = require('fs');

let red = (msg) => `\x1B[31m${msg}\x1B[39m`;
let green = (msg) => `\x1B[36m${msg}\x1B[39m`;
let yellow = (msg) => `\x1B[33m${msg}\x1B[39m`;
let blue = (msg) => `\x1B[34m${msg}\x1B[39m`;
let magenta = (msg) => `\x1B[35m${msg}\x1B[39m`;

class WebpackMarkdownPlugin {

    constructor(options) {
        if (options === undefined) options = {};
        this.src = options.src !== undefined ? options.src : './src/**/*.md';
        this.base = options.base !== undefined ? options.base : './';
        this.inject = options.inject !== undefined ? options.dest : false;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            PluginName,
            (compilation, callback) => {
                console.log(`[${blue(PluginName)}]: start compiling markdown...`);

                glob(this.src, (err, files) => {
                    files.forEach(filename => {
                        // compile files
                        let buffer = fs.readFileSync(filename, {flag: 'r', encoding: 'utf-8'});
                        if (buffer) {
                            let html = md.render(buffer);
                            if (html) {
                                let destination = filename.replace(this.base, '');
                                console.log(`\t[${green('\u221A')}]compiled target: ${magenta(destination)}(${html.length}bytes)`);
                                compilation.assets[destination] = {
                                    source: () => html,
                                    size: () => html.length
                                };
                            } else {
                                console.log(`\t[${red('\u26CC')}]failed to compile file ${magenta(filename)}: ${red('render error')}`)
                            }
                        } else if(buffer === '') {
                            console.log(`\t[${yellow('~')}]skip empty file: ${filename}`);
                        } else {
                            console.log(`\t[${red('x')}]open file error: ${magenta(filename)}: ${red(err)}`);
                        }
                    });
                    console.log(`[${blue(PluginName)}]: complete compile.`);

                    callback();
                });

            }
        )
    }
}

module.exports = WebpackMarkdownPlugin;