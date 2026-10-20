import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
for(const line of readFileSync('originales/SHA256SUMS.txt','utf8').trim().split(/\r?\n/)){
 const [,expected,name]=line.match(/^([a-f0-9]{64})  (.+)$/);
 const actual=createHash('sha256').update(readFileSync('originales/'+name)).digest('hex');
 if(actual!==expected)throw Error('El original cambió: '+name);
 console.log('SHA-256 verificado: '+name);
}
