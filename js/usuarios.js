// Indutexs - Pantalla "Usuarios": el admin de la empresa crea usuarios y les asigna módulos y nivel de acceso
let uTouched=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isEmpAdmin=()=>!!session&&session.rol==='EMPRESA';
// solo se puede tocar a un USUARIO de la misma empresa del admin (el admin nunca se desactiva: siempre queda uno)
const mine=i=>{const u=USERS[i];return isEmpAdmin()&&u&&u.empresa===session.empresa&&u.rol==='USUARIO'?u:null};
const userDefault=n=>{const p=slug((n.trim().split(/\s+/)[0])||'');return p?p+'_'+slug(co):''};
const nivelTxt=v=>v==='edit'?'':' (solo ver)';
function permText(u){
 if(u.rol==='EMPRESA')return 'Todo (administrador)';
 const p=MODS.filter(m=>(u.perms||{})[m]).map(m=>m+nivelTxt(u.perms[m]));
 return p.length?p.join(', '):'Sin módulos';
}
function permGrid(p){
 return MODS.map(m=>`<div class="fld"><label>${m}</label><select id="pm_${m}">${NIVELES.map(([v,l])=>`<option value="${v}" ${(p[m]||'')===v?'selected':''}>${l}</option>`).join('')}</select></div>`).join('');
}
function readPerms(){const p={};MODS.forEach(m=>{const v=$('#pm_'+m).value;if(v)p[m]=v});return p}
const ubtns=(ok,label)=>`<div class="fbtns"><button class="ok" onclick="${ok}">${label}</button><button class="cancel" onclick="ui.uForm=null;draw()">Cancelar</button></div>`;
const wide='style="grid-column:1/-1"';

function usersHTML(){
 const f=ui.uForm;let form='';
 if(f&&f.mode==='new'){
  form=`<div class="formrow">${fld({l:'Nombre',t:'text'},'nu_nombre','')}${fld({l:'Usuario',t:'text'},'nu_user','')}${fld({l:'Contraseña inicial (8+, @ y 2 números)',t:'text'},'nu_pass','')}${fld({l:'Plantilla',t:'select',o:['Personalizado',...Object.keys(PLANTILLAS)]},'nu_tpl','')}<div ${wide}><small style="color:var(--muted)">Define a qué módulos entra y con qué nivel:</small></div>${permGrid({})}<div class="msg" id="msg_nu" ${wide}></div>${ubtns('saveNewUser()','Crear usuario')}</div>`;
 } else if(f&&f.mode==='perm'&&mine(f.idx)){
  const u=USERS[f.idx];
  form=`<div class="formrow"><div ${wide}>Permisos de <b>${esc(u.nombre||u.user)}</b></div>${permGrid(u.perms||{})}<div class="msg" id="msg_pm" ${wide}></div>${ubtns(`savePerms(${f.idx})`,'Guardar permisos')}</div>`;
 } else if(f&&f.mode==='pass'&&mine(f.idx)){
  const u=USERS[f.idx];
  form=`<div class="formrow"><div ${wide}>Nueva contraseña para <b>${esc(u.nombre||u.user)}</b></div>${fld({l:'Nueva contraseña (8+, @ y 2 números)',t:'text'},'np_pass','')}${ubtns(`savePass(${f.idx})`,'Guardar contraseña')}</div>`;
 }
 const rows=USERS.map((u,i)=>[u,i]).filter(([u])=>u.empresa===co).map(([u,i])=>{
  const adm=u.rol==='EMPRESA',on=u.activo!==false;
  const acts=adm?'':`<button class="icobtn" onclick="ui.uForm={mode:'perm',idx:${i}};draw()">Permisos</button><button class="icobtn" onclick="ui.uForm={mode:'pass',idx:${i}};draw()">Contraseña</button><button class="icobtn" onclick="toggleUser(${i})">${on?'Desactivar':'Activar'}</button>`;
  return `<tr><td data-label="Nombre">${esc(u.nombre||'Administrador')}</td><td data-label="Usuario">${esc(u.user)}</td><td data-label="Acceso">${esc(permText(u))}</td><td data-label="Estado"><span class="chip ${on?'ok':'bad'}">${on?'Activo':'Inactivo'}</span></td><td data-label="Acciones" class="actions">${acts}</td></tr>`;
 }).join('');
 return `<div class="bento solo"><div class="tablecard"><div class="thead-row"><h2>Usuarios de ${esc(co)}</h2><div><button class="addbtn" onclick="exportRows(USERS.filter(x=>x.empresa===co).map(({user,nombre,rol,empresa,activo,perms})=>({user,nombre,rol,empresa,activo:activo!==false,permisos:JSON.stringify(perms||{})})),slug(co)+'_usuarios')">Exportar Excel / CSV</button> <button class="addbtn" onclick="ui.uForm={mode:'new'};uTouched=false;draw()">+ Nuevo usuario</button></div></div>${form}<table><thead><tr><th>Nombre</th><th>Usuario</th><th>Acceso</th><th>Estado</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}
function bindUsers(){
 const t=$('#nu_tpl'),n=$('#nu_nombre'),u=$('#nu_user');
 if(t)t.onchange=()=>{const p=PLANTILLAS[t.value];if(p)MODS.forEach(m=>$('#pm_'+m).value=p[m]||'')};
 if(n&&u){n.oninput=()=>{if(!uTouched)u.value=userDefault(n.value)};u.oninput=()=>{uTouched=true}}
}
const setMsg=(id,t)=>{const e=$('#msg_'+id);if(e)e.textContent=t};
function saveNewUser(){
 if(!isEmpAdmin())return;
 const n=$('#nu_nombre').value.trim(),u=$('#nu_user').value.trim(),p=$('#nu_pass').value,perms=readPerms();
 setMsg('nu_nombre',n?'':'Campo requerido');
 setMsg('nu_user',!u?'Campo requerido':/\s/.test(u)?'Sin espacios':USERS.some(x=>x.user.toLowerCase()===u.toLowerCase())?'Ese usuario ya existe':'');
 setMsg('nu_pass',passError(p));
 setMsg('nu',Object.keys(perms).length?'':'Asigna al menos un módulo');
 if(['nu_nombre','nu_user','nu_pass','nu'].some(id=>$('#msg_'+id).textContent))return;
 USERS.push({user:u,pass:p,rol:'USUARIO',empresa:session.empresa,nombre:n,perms,activo:true});persistAppData();
 ui.uForm=null;ui.note='Usuario creado: '+esc(u);draw();
}
function savePerms(i){
 const u=mine(i);if(!u)return;
 const perms=readPerms();
 if(!Object.keys(perms).length){setMsg('pm','Asigna al menos un módulo');return}
 u.perms=perms;persistAppData();ui.uForm=null;ui.note='Permisos actualizados';draw();
}
function savePass(i){
 const u=mine(i);if(!u)return;
 const p=$('#np_pass').value,e=passError(p);
 setMsg('np_pass',e);if(e)return;
 u.pass=p;persistAppData();ui.uForm=null;ui.note='Contraseña actualizada';draw();
}
function toggleUser(i){
 const u=mine(i);if(!u)return;
 u.activo=u.activo===false;persistAppData();ui.uForm=null;draw();
}
