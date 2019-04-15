// const glob = require('glob');
//
// glob('./data/**/*.md', (err, files) => {
//     console.log(files)
// });

// console.log(`cwd: ${process.cwd()}`);

// let files = ['a.txt', 'b.doc', 'c.jpg'];
//
// files.forEach(value => {
//     console.log(`Filename: ${value}`);
// });
const path = require('path');
console.log(`Path: ${path.join('./src/lib/')}`);