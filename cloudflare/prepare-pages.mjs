import fs from 'node:fs';
for(const name of ['_worker.js','_routes.json','_headers','_redirects'])fs.copyFileSync('cloudflare/'+name,'out/'+name);
