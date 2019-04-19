const through = require('through2');
const MarkdownIt = require('markdown-it');
const fancyLog = require('fancy-log');
const Vinyl = require('vinyl');
const PluginError = require('plugin-error');

let md = new MarkdownIt();

module.exports = function (suffix) {
    let config = {
        type: 'article',
        data: []
    };
    let compile = function (file, encoding, cb) {
        if (file.isStream()) {
            if (file.extname === '.md') {
                let mdStream = through(function (chunk, _, next) {
                    this.push(md.render(chunk.toString()));
                    next();
                });
                mdStream.on('error', this.emit.bind(this, 'error'));
                file.contents = file.contents.pipe(mdStream);
                if (suffix === undefined) suffix = '';
                file.extname = '.src';
                file.path = file.path.replace(file.relative, file.stem);
                console.log(`
                Cwd:        ${file.cwd}
                Path:       ${file.path}
                Base:       ${file.base}
                Relative:   ${file.relative}
                dirname:    ${file.dirname}
                basename:   ${file.basename}
                ext:        ${file.extname}
                stem:       ${file.stem}
                `);
                this.push(file);
            } else if (file.extname === '.json') {
                file.contents.pipe(through(function (chunk, _, next) {
                    config.data.push(JSON.parse(chunk.toString()));
                    console.log('Compile: ', config);
                    next();
                }));
            }
            cb();
        } else {
            this.emit('drain', new PluginError('debug', 'need stream format chunk'));
            cb();
        }
    };
    let configure = function (cb) {
        console.log('Configure: ', config);
        this.push(new Vinyl({
            cwd: '/',
            base: '/',
            path: '/configure.json',
            contents: Buffer.from(JSON.stringify(config))
        }));
        cb();
    };

    return through.obj(compile, configure);
};