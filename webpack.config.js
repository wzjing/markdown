const HtmlPlugin = require('html-webpack-plugin');
const MarkdownPlugin = require('./components/webpack-markdown-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: path.join(__dirname, './src/main.js')
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['main']
        }),
        new MarkdownPlugin({
            src: './data/**/*.md',
            base: './data/',
            dest: './dist/articles',
        })
    ]
};