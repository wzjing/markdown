const PluginName = 'webpack-markdown-plugin';
const glob = require('glob');
const md = require('markdown-it')();
const path = require('path');
const fs = require('fs');

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
                console.log('Markdown-Plugin: start compiling markdown...');
                for (let name in compilation.assets) console.log(`\tFile: ${name}`);

                glob(this.src, (err, files) => {
                    files.forEach(filename => {
                        console.log(`Markdown-Plugin: compiling file ${filename}`);
                        let buffer = fs.readFileSync(filename, {flag: 'r', encoding: 'utf-8'});
                        if (buffer) {
                            let html = md.render(buffer);
                            if (html) {
                                // let target = path.resolve(process.cwd(), filename.replace(this.base, this.dest));
                                // console.log(`Markdown-Plugin: writing target ${target}`);
                                // fs.writeFileSync(target, html, {
                                //     flag: 'w+',
                                //     encoding: 'utf-8'
                                // });
                                console.log(`Markdown-Plugin: writing target: ${filename.replace(this.base, '')}(${html.length})`);
                                compilation.assets[filename.replace(this.base, '')] = {
                                    source: () => html,
                                    size: () => html.length
                                };
                            } else {
                                console.error(`Markdown-Plugin: failed to compile file ${filename}\n\t`)
                            }
                        } else {
                            console.error(`Markdown-Plugin: failed to open file: ${filename}:\n\t${err}`);
                        }
                    });
                    for (let name in compilation.assets) console.log(`\tFile: ${name}`);
                    console.log('Markdown-Plugin: compile complete');

                    callback();
                });

            }
        )
    }
}

module.exports = WebpackMarkdownPlugin;