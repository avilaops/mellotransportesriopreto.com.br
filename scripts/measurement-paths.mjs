import { readdir, readFile, writeFile } from 'node:fs/promises';
const out = new URL('../out/', import.meta.url);
const target = new URL('measurement/sites.json', out);
const config = JSON.parse(await readFile(target));
const paths = (await readdir(out, { recursive: true })).map(path => path.replaceAll('\\', '/'));
config.sites[0].publicPaths = paths.filter(path => path.endsWith('.html') && !['404.html', '404/index.html'].includes(path)).map(path => '/' + path.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')).sort();
if (!config.sites[0].publicPaths.includes('/')) throw new Error('Public root missing');
await writeFile(target, JSON.stringify(config, null, 2) + '\n');
console.log('Medição • ' + config.sites[0].publicPaths.length + ' rotas públicas');
