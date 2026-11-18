// Indutexs - Utilidades: selector $, formato de dinero, chips, tablas y campos de formulario
const $=s=>document.querySelector(s);
const money=n=>"$"+Number(n).toLocaleString("es-CO");
const chip=e=>`<span class="chip ${/Entreg/.test(e)?'ok':/Pend/.test(e)?'warn':''}">${e}</span>`;
function tbl(h,r){return `<table><thead><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${r.map(row=>`<tr>${row.map((c,i)=>`<td data-label="${h[i]}">${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`}
function countUp(el,to){let n=0;const s=Math.max(1,Math.ceil(to/24));(function step(){n=Math.min(to,n+s);el.textContent=n;if(n<to)requestAnimationFrame(step)})()}
function fieldInput(f,id,val){if(f.t==='select')return `<select id="${id}">${f.o.map(o=>`<option ${o===val?'selected':''}>${o}</option>`).join('')}</select>`;return `<input id="${id}" type="${f.t==='number'?'number':'text'}" value="${val??''}">`}
function fld(f,id,val){return `<div class="fld" id="w_${id}"><label>${f.l}</label>${fieldInput(f,id,val)}<div class="msg" id="msg_${id}"></div></div>`}
function fmt(f,val){if(MONEY.includes(f.k))return money(val);if(f.k==='estado')return chip(val);return val}

// Usuario por defecto de una empresa y regla de contraseña
const slug=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const defaultUser=n=>slug(n)?slug(n)+'_admin2026':'';
function passError(p){
 if(!p)return 'Campo requerido';
 if(p.length<8||!p.includes('@')||(p.match(/\d/g)||[]).length<2)return 'Mínimo 8 caracteres, un @ y al menos 2 números';
 return '';
}

function exportRows(rows,filename){
 if(!rows||!rows.length){alert('No hay datos para exportar.');return}
 const clean=rows.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,String(v??'')])));
 if(window.XLSX){const ws=XLSX.utils.json_to_sheet(clean),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Datos');XLSX.writeFile(wb,filename+'.xlsx');return}
 const keys=Object.keys(clean[0]),csv=[keys,...clean.map(r=>keys.map(k=>r[k]))].map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename+'.csv';a.click();URL.revokeObjectURL(a.href);
}
function exportModule(key){exportRows(DB[co]&&DB[co][key],slug(co)+'_'+key+'_2026')}
