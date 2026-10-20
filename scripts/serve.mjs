import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.wasm':'application/wasm','.dll':'application/octet-stream','.dat':'application/octet-stream'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let name=decodeURIComponent(url.pathname);if(name.endsWith('/'))name+='index.html';const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404).end('Not found');}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://localhost:4173'));
