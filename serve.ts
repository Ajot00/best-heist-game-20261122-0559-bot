// Small loopback static server for offline play and local inspection.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(fileURLToPath(new URL('./game',import.meta.url)));
const portArg=process.argv.indexOf('--port');const port=portArg<0?8080:Number(process.argv[portArg+1])||8080;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json'};
createServer((req,res)=>{
  let name;try{name=decodeURIComponent(new URL(req.url,'http://local').pathname);}catch{name='/';}
  const path=resolve(root,`.${name==='/'?'/index.html':name}`);
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try{if(!statSync(path).isFile())throw Error();res.writeHead(200,{'content-type':types[extname(path)]||'application/octet-stream','cache-control':'no-store'});createReadStream(path).pipe(res);}
  catch{res.writeHead(404);res.end('not found');}
}).listen(port,'127.0.0.1');
