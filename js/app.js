// Indutexs - Sistema: estado, permisos, pintado del panel y secciones, menú y selector de empresa
let co=Object.keys(DB)[0],view="Dashboard",session=null;
let ui={add:false,edit:null,empAdd:false,inviteManage:false,uForm:null};

// Permisos: SUPERADMIN y EMPRESA (admin) hacen todo; USUARIO solo lo que su admin le asignó ('ver' o 'edit' por módulo)
const MODOF=Object.fromEntries(Object.entries(KEYOF).map(([m,k])=>[k,m]));
const isAdmin=()=>!!session&&(session.rol==='SUPERADMIN'||session.rol==='EMPRESA');
const nivel=m=>isAdmin()?'edit':(((session&&session.perms)||{})[m]||'');
const canView=m=>!!nivel(m);
const canEdit=m=>nivel(m)==='edit';

function sectionHTML(view){
 const key=KEYOF[view],rows=DB[co][key],F=FIELDS[key],ed=canEdit(view);
 const addHtml=ed&&ui.add?`<div class="formrow">${F.map(f=>fld(f,'a_'+key+'_'+f.k,'')).join('')}<div class="fbtns"><button class="ok" onclick="saveAdd('${key}')">Guardar</button><button class="cancel" onclick="ui.add=false;draw()">Cancelar</button></div></div>`:'';
 const body=rows.map((r,i)=>{
  if(ed&&ui.edit===i){
   return `<tr class="editing">${F.map(f=>{const id='e_'+key+'_'+f.k;return `<td data-label="${f.l}">${fieldInput(f,id,r[f.k])}<div class="msg" id="m_${id}"></div></td>`}).join('')}<td data-label="Acciones" class="actions"><button class="icobtn" onclick="saveEdit('${key}',${i})" title="Guardar">Guardar</button><button class="icobtn" onclick="ui.edit=null;draw()" title="Cancelar">Cancelar</button></td></tr>`;
  }
  return `<tr>${F.map(f=>`<td data-label="${f.l}">${fmt(f,r[f.k])}</td>`).join('')}${ed?`<td data-label="Acciones" class="actions"><button class="icobtn" onclick="ui.edit=${i};ui.add=false;draw()" title="Editar">Editar</button><button class="icobtn" onclick="delRow('${key}',${i})" title="Eliminar">Eliminar</button></td>`:''}</tr>`;
 }).join('');
 const head=`<button class="addbtn" onclick="exportModule('${key}')">Exportar Excel / CSV</button>`+(ed?` <button class="addbtn" onclick="ui.add=!ui.add;ui.edit=null;draw()">${ui.add?'Cerrar':'+ Agregar'}</button>`:` <span class="chip">Solo ver</span>`);
 return `<div class="bento solo"><div class="tablecard"><div class="thead-row"><h2>${view}</h2>${head}</div>${addHtml}<table><thead><tr>${F.map(f=>`<th>${f.l}</th>`).join('')}${ed?'<th></th>':''}</tr></thead><tbody>${body||`<tr><td colspan="${F.length+(ed?1:0)}" style="color:var(--muted)">Sin registros todavía.</td></tr>`}</tbody></table></div></div>`;
}
function dashboardHTML(d){
 const P=canView('Pedidos'),I=canView('Inventario'),PR=canView('Producción'),V=canView('Ventas'),E=canView('Empleados');
 const low=d.mat.filter(m=>Number(m.disponible)<Number(m.minimo));
 const stats=[];
 if(E)stats.push(`<div class="stat"><b id="h2">0</b><span>Empleados</span></div>`);
 if(PR)stats.push(`<div class="stat"><b id="h3">0</b><span>Prendas producidas</span></div>`);
 if(V)stats.push(`<div class="stat"><b style="font-size:20px">${money(d.ven.reduce((s,v)=>s+Number(v.total),0))}</b><span>Ventas registradas</span></div>`);
 const left=[];let html='';
 if(P){left.push('hero');html+=`<div class="hero"><span>Pedidos activos</span><b id="h1">0</b></div>`}
 if(stats.length){left.push('mini');html+=`<div class="mini">${stats.join('')}</div>`}
 if(I)html+=`<div class="stockcard"><h2>Insumos por reponer</h2>${low.length?`<ul>${low.map(m=>`<li><span>${m.nombre}</span><b>${m.disponible} ${m.unidad}</b></li>`).join("")}</ul>`:'<p style="color:var(--muted);font-size:13px">Todo el inventario está sobre el mínimo.</p>'}</div>`;
 if(P)html+=`<div class="tablecard"><div class="thead-row"><h2>Pedidos recientes</h2><button class="addbtn" onclick="exportModule('ped')">Exportar Excel / CSV</button></div>${tbl(["Cliente","Entrega","Estado"],d.ped.map(p=>[p.cliente,p.entrega,chip(p.estado)]))}</div>`;
 if(!html)return `<p style="color:var(--muted)">Todavía no tienes módulos asignados. Pídele al administrador de tu empresa que te dé acceso.</p>`;
 // el diseño del dashboard se arma según los módulos que la persona puede ver
 const rows=[];
 if(I){if(left.length)left.forEach(a=>rows.push(`"${a} stock"`));else rows.push('"stock stock"')}else left.forEach(a=>rows.push(`"${a} ${a}"`));
 if(P)rows.push('"table table"');
 return `<div class="bento" style='grid-template-areas:${rows.join(' ')}'>${html}</div>`;
}
function render(){
 const d=DB[co];
 if(!d){$("#view").innerHTML=session&&session.rol==="SUPERADMIN"?'<div class="tablecard"><h2>No hay empresas registradas</h2><p>Crea una empresa desde el botón “+ Nueva” para comenzar.</p></div>':'<p>La empresa asociada a esta cuenta ya no está disponible. Contacta al SuperAdmin.</p>';return;}
 if(view==="Dashboard"){
  $("#view").innerHTML=dashboardHTML(d);
  if($("#h1"))countUp($("#h1"),d.ped.length);
  if($("#h2"))countUp($("#h2"),d.emp.length);
  if($("#h3"))countUp($("#h3"),d.pro.reduce((a,p)=>a+Number(p.cantidad),0));
 } else if(view==="Usuarios"){
  $("#view").innerHTML=usersHTML();bindUsers();
 } else if(view==="Gestión de empresas"){
  $("#view").innerHTML=superAdminHTML();
 } else if(view==="Solicitudes de empresas"){
  $("#view").innerHTML=solicitudesHTML();
 } else {
  $("#view").innerHTML=sectionHTML(view);
 }
 $("#view").classList.remove("anim");void $("#view").offsetWidth;$("#view").classList.add("anim");
}
function drawTag(){
 const sa=session&&session.rol==='SUPERADMIN',note=ui.note||'';ui.note='';
 const who=session&&session.rol==='USUARIO'?`<span>· ${esc(session.nombre||session.user)}</span>`:'';
 $("#tag").innerHTML=sa?`<span>Administrador general · Empresa</span><select id="tenant" aria-label="Cambiar empresa">${Object.keys(DB).map(k=>`<option ${k===co?'selected':''}>${k}</option>`).join("")}</select><button class="icobtn" id="addEmpBtn" title="Agregar empresa">+ Nueva</button><button class="icobtn" id="inviteBtn" title="Administrar invitaciones">Códigos</button>`:`<span>Empresa</span><b>${esc(co)}</b>${who}`;
 if(sa){$("#tenant").onchange=e=>{co=e.target.value;ui.add=false;ui.edit=null;draw()};$("#addEmpBtn").onclick=()=>{ui.empAdd=!ui.empAdd;ui.inviteManage=false;draw()};$("#inviteBtn").onclick=()=>{ui.inviteManage=!ui.inviteManage;ui.empAdd=false;draw()}}
 let content='';
 if(sa&&ui.empAdd)content=`<div class="formrow" style="max-width:720px"><div style="grid-column:1/-1"><b>Nueva empresa</b><p class="note">Define también el código que usarán sus empleados para registrarse.</p></div>${fld({k:'nombre',l:'Empresa',t:'text'},'ne_nombre','')}${fld({k:'usuario',l:'Usuario del administrador',t:'text'},'ne_user','')}${fld({k:'pass',l:'Contraseña inicial (8+, @ y 2 números)',t:'password'},'ne_pass','')}${fld({k:'codigo',l:'Código de invitación personalizado',t:'text'},'ne_code','')}<div class="fbtns" style="grid-column:1/-1"><button class="ok" onclick="saveEmpresa()">Crear empresa y código</button><button class="cancel" onclick="ui.empAdd=false;draw()">Cancelar</button></div></div>`;
 if(sa&&ui.inviteManage){const rows=Object.entries(INVITES).filter(([code,v])=>v.empresa===co).map(([code,v])=>`<tr><td>${esc(code)}</td><td>${Number(v.usos)||0}</td><td><button class="icobtn" onclick="deleteInvite('${esc(code)}')">Eliminar</button></td></tr>`).join('');content=`<div class="tablecard" style="max-width:720px"><div class="thead-row"><h2>Códigos de ${esc(co)}</h2></div><div class="formrow">${fld({k:'codigo',l:'Nuevo código personalizado',t:'text'},'new_inv_code','')}${fld({k:'usos',l:'Cantidad de registros permitidos',t:'number'},'new_inv_uses','20')}<div class="fbtns" style="grid-column:1/-1"><button class="ok" onclick="createInviteForSelected()">Guardar código</button></div></div><table><thead><tr><th>Código</th><th>Cupos restantes</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="3">Esta empresa aún no tiene códigos.</td></tr>'}</tbody></table></div>`}
 $("#empFormWrap").innerHTML=(note?`<p class="note" style="margin:0 0 10px">${note}</p>`:'')+content;
 if(sa&&ui.empAdd){
  const nameInput=$("#ne_nombre"), userInput=$("#ne_user");
  if(nameInput&&userInput){
   nameInput.addEventListener("input",()=>{if(!userInput.dataset.edited)userInput.value=defaultUser(nameInput.value)});
   userInput.addEventListener("input",()=>{userInput.dataset.edited="1";userInput.value=userInput.value.toLowerCase().replace(/\s+/g,"")});
   if(nameInput.value&&!userInput.value)userInput.value=defaultUser(nameInput.value);
  }
 }
}
function draw(){
 if(!session||(session.rol!=='SUPERADMIN'&&(co!==session.empresa||!DB[session.empresa]||DB[session.empresa].activa===false))){logout();return}
 if(view==='Crear Empresa'&&session.rol!=='SUPERADMIN'){view='Dashboard';ui.empAdd=false}
 if((view==='Gestión de empresas'||view==='Solicitudes de empresas')&&session.rol!=='SUPERADMIN')view='Dashboard';
 // si la persona no tiene acceso a la pantalla pedida, vuelve al Dashboard
 if(view==='Usuarios'?session.rol!=='EMPRESA':(['Dashboard','Gestión de empresas','Solicitudes de empresas'].includes(view)?false:!canView(view))){view='Dashboard';ui.add=false;ui.edit=null;ui.uForm=null}
 const items=NAVI.filter(([k])=>k==='Dashboard'||canView(k));
 if(session.rol==='EMPRESA')items.push(['Usuarios','☰']);
 if(session.rol==='SUPERADMIN'){items.push(['Gestión de empresas','▦']);items.push(['Solicitudes de empresas','✉']);}
 $("#title").textContent=view;
 $("#nav").innerHTML=items.map(([k,i])=>`<button ${k===view?'aria-current="page"':''} data-v="${k}">${i}<b>${k}</b></button>`).join("");
 drawTag();render();
}
$("#nav").addEventListener("click",e=>{const b=e.target.closest("button");if(b){view=b.dataset.v;ui.add=false;ui.edit=null;ui.uForm=null;draw()}});