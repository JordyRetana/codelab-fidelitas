import {exercises,cases} from './catalog.js';
const $=id=>document.getElementById(id);
let sources,active=1,busy=false,worker,timer,dotnetReady,jobReject,blockIndex=-1,toastTimer,cancelled=false,lastReport=null,reportURL,uploadedFiles;
const csvPanel=document.createElement('div');csvPanel.className='csv-panel';csvPanel.hidden=true;csvPanel.innerHTML='<label for="csv-upload">Tu archivo de ventas (UTF-8)</label><input id="csv-upload" type="file" accept=".csv,text/csv"><p id="csv-status">Ejemplo ventas.csv listo para ejecutar.</p><a href="ejemplos/ventas.csv" download>↓ CSV de ejemplo</a> <a id="report-download" hidden download="reporte_ventas.csv">↓ Descargar último reporte</a>';$('input').before(csvPanel);
$('csv-upload').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>1024*1024){toast('Usa un CSV de hasta 1 MB.');e.target.value='';return;}uploadedFiles={'ventas.csv':await file.text()};$('input').value='ventas.csv';$('csv-status').textContent=`${file.name} cargado como ventas.csv · ${file.size} bytes`;updateInput();};
const results=new Map();
const nav=$('nav');
for(const [id,e] of Object.entries(exercises)){const a=document.createElement('a');a.href='#'+id;a.innerHTML=`<span class="num">${String(id).padStart(2,'0')} /</span><b>${e.short}</b><small>${e.lang}${e.isNew?' · NUEVO':''}</small>`;nav.append(a);}
function render(){
 if(busy)return;
 const requested=Number(location.hash.slice(1));if(exercises[requested])active=requested;
 const e=exercises[active];blockIndex=-1;$('block-caption').textContent='Explora el código por bloques →';
 for(const a of nav.children){const current=a.hash==='#'+active;a.classList.toggle('active',current);if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
 document.title=`${e.title} — CodeLab Fidélitas`;
 $('label').textContent=`ESTACIÓN ${String(active).padStart(2,'0')} / 06`;
 $('title').textContent=e.title;$('description').textContent=e.description;
 $('runtime').textContent=(e.lang==='Python'?'Python · Pyodide / WASM':'C# · .NET / WASM')+(e.isNew?' · NUEVO':'');
 csvPanel.hidden=active!==6;$('report-download').hidden=true;
 $('workspace').hidden=!e.lang;$('pending').hidden=!!e.lang;$('test-all').hidden=!e.lang;
 $('output').textContent='Tu resultado aparecerá aquí.';
 $('engine-status').textContent='Carga bajo demanda';
 if(e.lang){
  $('input').value=e.example;updateInput();
  const s=sources[active];$('filename').textContent=s.file;$('download').href=s.path.split('/').map(encodeURIComponent).join('/');$('download').textContent=s.kind==='nuevo'?'↓ Fuente nueva':'↓ Original';document.querySelector('.filebar span:last-child').textContent=s.kind==='nuevo'?'NUEVO · CODEX':'ORIGINAL · SOLO LECTURA';
  const code=$('code');code.setAttribute('aria-label','Código fuente de la estación');code.replaceChildren();
  const lines=s.code.replace(/\r/g,'').split('\n');
  lines.forEach(line=>{const span=document.createElement('span');span.className='code-line'+(/^\s*(#|\/\/)/.test(line)?' comment':'');span.textContent=line||' ';code.append(span);});
  $('blocks').replaceChildren();
  e.blocks.forEach(([title,anchor,text],i)=>{const start=Math.max(0,lines.findIndex(l=>l.startsWith(anchor)));const next=e.blocks[i+1];let end=next?lines.findIndex((l,n)=>n>start&&l.startsWith(next[1])):lines.length;if(end<0)end=lines.length;const button=document.createElement('button');button.className='block';const strong=document.createElement('strong');strong.innerHTML=`<span>${String(i+1).padStart(2,'0')} · L${start+1}–${end}</span>`;strong.append(document.createTextNode(title));const p=document.createElement('p');p.textContent=text;button.append(strong,p);button.onclick=()=>{blockIndex=i;[...$('blocks').children].forEach((b,n)=>{b.classList.toggle('active',n===i);b.setAttribute('aria-pressed',String(n===i));});$('block-caption').textContent=`Bloque ${i+1} de ${e.blocks.length} · ${title}`;[...code.children].forEach((l,n)=>l.classList.toggle('selected',n>=start&&n<end));code.scrollTop=code.children[start].offsetTop-code.firstElementChild.offsetTop;};$('blocks').append(button);});
 }else{const ul=document.createElement('ul');e.requirements.forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li);});$('requirements').replaceChildren(ul);}
 renderTests();
}
function renderTests(){const body=$('test-body');body.replaceChildren();const list=cases.filter(c=>c.id===active);if(!list.length){const tr=body.insertRow();const td=tr.insertCell();td.colSpan=4;td.textContent='Pendiente de implementación: no hay pruebas ejecutadas ni resultados atribuidos. Los criterios están descritos arriba.';return;}for(const c of list){const tr=body.insertRow();tr.insertCell().textContent=c.name;tr.insertCell().textContent=c.expect.join('\n');const cell=tr.insertCell();const result=results.get(c);cell.textContent=result?(result.pass?'✓ Aprobado':'✕ Falló'):'Sin ejecutar';if(result){cell.className=result.pass?'pass':'fail';const d=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Ver salida obtenida';const pre=document.createElement('pre');pre.textContent=result.output;d.append(summary,pre);cell.append(d);}const btn=document.createElement('button');btn.textContent='Cargar';btn.disabled=busy;btn.onclick=()=>{$('input').value=c.input;updateInput();if(c.files){uploadedFiles=c.files;$('csv-status').textContent='Archivos de prueba listos: '+Object.keys(c.files).join(', ');}$('input').focus();};tr.insertCell().append(btn);}}
function setBusy(value){busy=value;document.body.classList.toggle('running',value);for(const id of ['run','reset','test-all','random-case'])$(id).disabled=value;nav.setAttribute('aria-busy',String(value));renderTests();}
nav.addEventListener('click',e=>{if(busy)e.preventDefault();});
async function execute(id,input,files){
 lastReport=null;
 if(exercises[id].lang==='C#'){
  $('engine-status').textContent='Descargando .NET…';
  if(!dotnetReady)dotnetReady=new Promise((resolve,reject)=>{window.codeLabDotnetReady=resolve;Blazor.start().catch(reject);setTimeout(()=>reject(new Error('El inicio de .NET tardó demasiado. Recarga la página.')),60000);}).catch(e=>{throw e;});
  await dotnetReady;$('engine-status').textContent='.NET WebAssembly listo';
  return await DotNet.invokeMethodAsync('Runtime','Run',id,input);
 }
 return await new Promise((resolve,reject)=>{
  jobReject=reject;$('engine-status').textContent='Descargando Python…';worker=new Worker('python-worker.js');
  const finish=()=>{clearTimeout(timer);worker?.terminate();worker=null;jobReject=null;};
  timer=setTimeout(()=>{finish();reject(new Error('Se alcanzó el límite de 20 segundos. Reintenta si la descarga inicial fue lenta.'));},20000);
  worker.onerror=e=>{finish();reject(new Error(e.message||'No se pudo cargar Python.'));};
  worker.onmessage=({data})=>{if(data.status)$('engine-status').textContent=data.status;if(data.output!==undefined){lastReport=data.report;if(data.report!==null&&data.report!==undefined){if(reportURL)URL.revokeObjectURL(reportURL);reportURL=URL.createObjectURL(new Blob([data.report],{type:'text/csv;charset=utf-8'}));$('report-download').href=reportURL;$('report-download').hidden=false;}finish();resolve(data.output);}if(data.error){finish();reject(new Error(data.error));}};
  worker.postMessage({code:sources[id].code,input,files:files||(id===6?(uploadedFiles||cases.find(c=>c.id===6).files):{})});
 });
}
function stop(){cancelled=true;if(jobReject){const reject=jobReject;clearTimeout(timer);worker?.terminate();worker=null;jobReject=null;reject(new Error('Ejecución detenida.'));}else if(busy){$('engine-status').textContent='C# está ejecutándose; el límite de entradas detiene los menús.';}}
$('run').onclick=async()=>{setBusy(true);$('output').textContent='Preparando el runtime…';try{$('output').textContent=await execute(active,$('input').value);}catch(e){$('output').textContent='No se completó la ejecución: '+e.message;}finally{setBusy(false);if(Number(location.hash.slice(1))!==active)render();}};
$('reset').onclick=()=>{$('input').value=exercises[active].example;if(active===6){uploadedFiles=null;$('csv-status').textContent='Ejemplo ventas.csv listo para ejecutar.';}updateInput();};$('stop').onclick=stop;
$('test-all').onclick=async()=>{cancelled=false;setBusy(true);try{for(const c of cases.filter(c=>c.id===active)){if(cancelled)break;let output;try{output=await execute(active,c.input,c.files);}catch(e){output='Error de infraestructura: '+e.message;}results.set(c,{output:output+(c.report!==undefined?'\n[Archivo comprobado]\n'+lastReport:''),pass:c.expect.every(s=>output.includes(s))&&!(c.absent||[]).some(s=>output.includes(s))&&!output.includes('[Adaptador:')&&!output.includes('Error de infraestructura:')&&(c.report===undefined||lastReport===c.report)});renderTests();updateProgress();}$('output').textContent=cancelled?'Pruebas detenidas.':'Pruebas completadas. Consulta los estados y las salidas obtenidas en la mesa de pruebas.';const list=cases.filter(c=>c.id===active);if(!cancelled&&list.every(c=>results.get(c)?.pass)){celebrate();toast(`¡Misión comprobada! ${list.length} pruebas superadas ✓`);}}finally{setBusy(false);}};
function updateInput(){const n=$('input').value.split('\n').length;$('input-count').textContent=`${n} respuesta${n===1?'':'s'} lista${n===1?'':'s'}`;}
$('input').addEventListener('input',updateInput);
$('next-block').onclick=()=>{const blocks=$('blocks').children;blocks[(blockIndex+1)%blocks.length]?.click();};
$('random-case').onclick=()=>{const list=cases.filter(c=>c.id===active);const c=list[Math.floor(Math.random()*list.length)];$('input').value=c.input;if(c.files){uploadedFiles=c.files;$('csv-status').textContent='Archivos de prueba cargados: '+Object.keys(c.files).join(', ');}updateInput();toast('Reto cargado: '+c.name);};
function toast(text){clearTimeout(toastTimer);document.querySelector('.feedback-note')?.remove();if(!text?.trim())return;const note=document.createElement('p');note.className='feedback-note';note.setAttribute('role','status');note.textContent=text;$('output').before(note);toastTimer=setTimeout(()=>note.remove(),3500);}
function updateProgress(){const passed=[...results.values()].filter(r=>r.pass).length;$('progress-label').textContent=`${passed} / ${cases.length} pruebas superadas`;$('progress-fill').style.width=`${100*passed/cases.length}%`;for(const a of nav.children){const list=cases.filter(c=>c.id===Number(a.hash.slice(1)));a.classList.toggle('complete',list.length>0&&list.every(c=>results.get(c)?.pass));}}
function celebrate(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<26;i++){const p=document.createElement('i');p.className='confetti';p.style.left=Math.random()*100+'vw';p.style.background=['#2748ed','#f7f166','#ff8754','#a3edc5'][i%4];p.style.animationDelay=Math.random()*.4+'s';document.body.append(p);setTimeout(()=>p.remove(),2300);}}
window.addEventListener('hashchange',render);
try{const response=await fetch('sources.json');if(!response.ok)throw Error('No se pudieron cargar los originales.');sources=await response.json();render();}catch(e){$('title').textContent='No se pudo abrir el taller';$('description').textContent=e.message;}
// Detecta una publicación nueva al abrir una copia HTML guardada por el navegador.
try{const current=document.querySelector('meta[name="codelab-build"]')?.content;const response=await fetch('version.json',{cache:'no-store'});if(response.ok){const latest=(await response.json()).version;if(current&&latest!==current&&sessionStorage.getItem('codelab-refresh')!==latest){sessionStorage.setItem('codelab-refresh',latest);await fetch(location.href,{cache:'reload'});location.reload();}}}catch{/* El taller sigue disponible si no hay conexión. */}
