import fs from 'fs';

const css = fs.readFileSync('src/app.css', 'utf8');

const matches = [...css.matchAll(/--([\w-]+):\s*([^;]+);/g)];
const properties = matches.map(([, name, value]) => ({
	name: `--${name}`,
	description: value.trim()
}));

fs.writeFileSync('./css-custom-data.json', JSON.stringify({ properties }, null, 2));
