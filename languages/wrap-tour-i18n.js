const fs = require('fs');
const path = require('path');

const tourPath = path.join(__dirname, '..', 'assets', 'tour.js');
const distPath = path.join(__dirname, '..', 'dist', 'tour.js');
let s = fs.readFileSync(tourPath, 'utf8');

if (!s.includes('const tourT =')) {
	s = s.replace(
		"if (typeof Shepherd === 'undefined' || typeof karaviAiAssistantTourData === 'undefined') {",
		"const tourT = (text) => {\n\t\tconst map = (karaviAiAssistantTourData && karaviAiAssistantTourData.uiStrings) ? karaviAiAssistantTourData.uiStrings : {};\n\t\treturn map[text] || text;\n\t};\n\n\tif (typeof Shepherd === 'undefined' || typeof karaviAiAssistantTourData === 'undefined') {"
	);
}

function wrapProp(prop, quote) {
	const other = quote === "'" ? '"' : "'";
	const re = new RegExp(`\\b${prop}:\\s*${quote}((?:\\\\${quote}|[^${quote}])*)${quote}`, 'g');
	s = s.replace(re, (_, inner) => `${prop}: tourT(${quote}${inner}${quote})`);
}

wrapProp('title', "'");
wrapProp('title', '"');
wrapProp('text', "'");
wrapProp('text', '"');

s = s.replace(/tourT\(tourT\(/g, 'tourT(');

fs.writeFileSync(tourPath, s);
fs.copyFileSync(tourPath, distPath);

const keys = new Set();
const re = /tourT\((['"])((?:\\.|(?!\1)[\s\S])*?)\1\)/g;
let m;
while ((m = re.exec(s)) !== null) {
	keys.add(
		m[2]
			.replace(/\\'/g, "'")
			.replace(/\\"/g, '"')
			.replace(/\\n/g, '\n')
	);
}

fs.writeFileSync(path.join(__dirname, 'tour-ui-keys.json'), JSON.stringify([...keys].sort(), null, 2));
console.log('Tour keys:', keys.size);
