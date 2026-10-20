import {exercises,cases} from './catalog.js';
const $=id=>document.getElementById(id);
let sources,active=1,busy=false,worker,timer,dotnetReady,jobReject;
const results=new Map();
const nav=$('nav');
for(const [id,e] of Object.entries(exercises)){const a=document.createElement('a');a.href='#'+id;a.innerHTML=`<span class="num">${String(id).padStart(2,'0')} /</span><b>${e.short}</b><small>${e.lang||'PENDIENTE'}</small>`;nav.append(a);}
function render(){
 if(busy)return;
 active=Number(location.hash.slice(1))||1;if(!exercises[active])active=1;
 const e=exercises[active];
 for(const a of nav.children){const current=a.hash==='#'+active;a.classList.toggle('active',current);if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
 document.title=`${e.title} — CodeLab Fidélitas`;
 $('label').textContent=`ESTACIÓN ${String(active).padStart(2,'0')} / 06`;
 $('title').textContent=e.title;$('description').textContent=e.description;
 $('runtime').textContent=e.lang?(e.lang==='Python'?'Python · Pyodide / WASM':'C# · .NET / WASM'):'Fuente pendiente';
 $('workspace').hidden=!e.lang;$('pending').hidden=!!e.lang;$('test-all').hidden=!e.lang;
 $('output').textContent='Tu resultado aparecerá aquí.';
 $('engine-status').textContent='Carga bajo demanda';
 if(e.lang){
  $('input').value=e.example;
  const s=sources[active];$('filename').textContent=s.file;$('download').href='originales/'+encodeURIComponent(s.file);
  const code=$('code');code.replaceChildren();
  const lines=s.code.replace(/\r/g,'').split('\n');
  lines.forEach(line=>{const span=document.createElement('span');span.className='code-line'+(/^\s*(#|\/\/)/.test(line)?' comment':'');span.textContent=line||' ';code.append(span);});
  $('blocks').replaceChildren();
  e.blocks.forEach(([title,anchor,text],i)=>{const start=Math.max(0,lines.findIndex(l=>l.startsWith(anchor)));const next=e.blocks[i+1];let end=next?lines.findIndex((l,n)=>n>start&&l.startsWith(next[1])):lines.length;if(end<0)end=lines.length;const button=document.createElement('button');button.className='block';const strong=document.createElement('strong');strong.innerHTML=`<span>${String(i+1).padStart(2,'0')} · L${start+1}–${end}</span>`;strong.append(document.createTextNode(title));const p=document.createElement('p');p.textContent=text;button.append(strong,p);button.onclick=()=>{[...code.children].forEach((l,n)=>l.classList.toggle('selected',n>=start&&n<end));code.scrollTop=code.children[start].offsetTop-code.firstElementChild.offsetTop;};$('blocks').append(button);});
 }else{const ul=document.createElement('ul');e.requirements.forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li);});$('requirements').replaceChildren(ul);}
 renderTests();
}
function renderTests(){const body=$('test-body');body.replaceChildren();const list=cases.filter(c=>c.id===active);if(!list.length){const tr=body.insertRow();const td=tr.insertCell();td.colSpan=4;td.textContent='Pendiente de implementación: no hay pruebas ejecutadas ni resultados atribuidos. Los criterios están descritos arriba.';return;}for(const c of list){const tr=body.insertRow();tr.insertCell().textContent=c.name;tr.insertCell().textContent=c.expect.join('\n');const cell=tr.insertCell();const result=results.get(c);cell.textContent=result?(result.pass?'✓ Aprobado':'✕ Falló'):'Sin ejecutar';if(result){cell.className=result.pass?'pass':'fail';const d=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Ver salida obtenida';const pre=document.createElement('pre');pre.textContent=result.output;d.append(summary,pre);cell.append(d);}const btn=document.createElement('button');btn.textContent='Cargar';btn.disabled=busy;btn.onclick=()=>{$('input').value=c.input;$('input').focus();};tr.insertCell().append(btn);}}
function setBusy(value){busy=value;for(const id of ['run','reset','test-all'])$(id).disabled=value;nav.setAttribute('aria-busy',String(value));renderTests();}
nav.addEventListener('click',e=>{if(busy)e.preventDefault();});
async function execute(id,input){
 if(exercises[id].lang==='C#'){
  $('engine-status').textContent='Descargando .NET…';
  if(!dotnetReady)dotnetReady=Blazor.start().catch(e=>{dotnetReady=null;throw e;});
  await dotnetReady;$('engine-status').textContent='.NET WebAssembly listo';
  return await DotNet.invokeMethodAsync('Runtime','Run',id,input);
 }
 return await new Promise((resolve,reject)=>{
  jobReject=reject;$('engine-status').textContent='Descargando Python…';worker=new Worker('python-worker.js');
  const finish=()=>{clearTimeout(timer);worker?.terminate();worker=null;jobReject=null;};
  timer=setTimeout(()=>{finish();reject(new Error('Se alcanzó el límite de 20 segundos. Reintenta si la descarga inicial fue lenta.'));},20000);
  worker.onerror=e=>{finish();reject(new Error(e.message||'No se pudo cargar Python.'));};
  worker.onmessage=({data})=>{if(data.status)$('engine-status').textContent=data.status;if(data.output!==undefined){finish();resolve(data.output);}if(data.error){finish();reject(new Error(data.error));}};
  worker.postMessage({code:sources[id].code,input});
 });
}
function stop(){if(jobReject){const reject=jobReject;clearTimeout(timer);worker?.terminate();worker=null;jobReject=null;reject(new Error('Ejecución detenida.'));}else if(busy){$('engine-status').textContent='C# está ejecutándose; el límite de entradas detiene los menús.';}}
$('run').onclick=async()=>{setBusy(true);$('output').textContent='Preparando el runtime…';try{$('output').textContent=await execute(active,$('input').value);}catch(e){$('output').textContent='No se completó la ejecución: '+e.message;}finally{setBusy(false);if(Number(location.hash.slice(1))!==active)render();}};
$('reset').onclick=()=>{$('input').value=exercises[active].example;};$('stop').onclick=stop;
$('test-all').onclick=async()=>{setBusy(true);try{for(const c of cases.filter(c=>c.id===active)){let output;try{output=await execute(active,c.input);}catch(e){output='Error de infraestructura: '+e.message;}results.set(c,{output,pass:c.expect.every(s=>output.includes(s))&&!(c.absent||[]).some(s=>output.includes(s))&&!output.includes('[Adaptador:')&&!output.includes('Error de infraestructura:')});renderTests();}$('output').textContent='Pruebas completadas. Consulta los estados y las salidas obtenidas en la mesa de pruebas.';}finally{setBusy(false);}};
window.addEventListener('hashchange',render);
try{const response=await fetch('sources.json');if(!response.ok)throw Error('No se pudieron cargar los originales.');sources=await response.json();render();}catch(e){$('title').textContent='No se pudo abrir el taller';$('description').textContent=e.message;}
