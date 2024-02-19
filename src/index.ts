import { run } from './interpreter'

const html = require('./src.html');
(document as any).compile = run
console.log(Object.keys(html))
document.write(html.default)
