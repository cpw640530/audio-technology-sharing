// Regenerate after editing Chinese copy; requires ICU's uconv (icu-devtools).
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

const strings = new Set();
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.tsx?$/.test(file) || file.includes('.test.')) continue;
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function visit(node) {
      if (ts.isStringLiteralLike(node) && /[\u3400-\u9fff]/u.test(node.text)) strings.add(node.text);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
scan('src');
// Single-character fallback covers interpolation and newly added copy.
for (let code = 0x3400; code <= 0x9fff; code++) strings.add(String.fromCharCode(code));
const original = [...strings].sort();
const converted = JSON.parse(execFileSync('uconv', ['-x', 'Hans-Hant'], {
  input: JSON.stringify(original), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024
}));
if (original.length !== converted.length) throw new Error('Unexpected ICU conversion result');
const characters = Object.fromEntries(original.flatMap((value, index) => value.length === 1 && value !== converted[index] ? [[value, converted[index]]] : []));
const entries = original.flatMap((value, index) => {
  const fallback = Array.from(value, char => characters[char] ?? char).join('');
  return value.length === 1 ? (value === converted[index] ? [] : [[value, converted[index]]])
    : fallback === converted[index] ? [] : [[value, converted[index]]];
});
fs.writeFileSync('src/content/traditional.generated.json', JSON.stringify(Object.fromEntries(entries), null, 2) + '\n');
