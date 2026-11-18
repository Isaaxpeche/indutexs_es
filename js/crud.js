// Indutexs - Validaciones y acciones: agregar, editar, eliminar registros y crear empresas
function collectAndValidate(key,prefix){
 const F=FIELDS[key];let ok=true;const vals={};
 F.forEach(f=>{
  const id=prefix+key+'_'+f.k;
  const el=document.getElementById(id);
  let v=el.value.trim();
  const msgId=(prefix==='a_'?'msg_':'m_')+id;
  const msgEl=document.getElementById(msgId);
  let err='';
  if(f.t==='number'){ if(v===''||isNaN(v)||Number(v)<0) err='Número ≥ 0 requerido'; else v=Number(v) }
  else { if(!v) err='Campo requerido' }
  if(err) ok=false;
  if(msgEl) msgEl.textContent=err;
  vals[f.k]=v;
 });
 return ok?vals:null;
}
function saveAdd(key){if(!canEdit(MODOF[key]))return;const v=collectAndValidate(key,'a_');if(!v)return;DB[co][key].push(v);persistAppData();ui.add=false;draw()}
function saveEdit(key,idx){if(!canEdit(MODOF[key]))return;const v=collectAndValidate(key,'e_');if(!v)return;DB[co][key][idx]=v;persistAppData();ui.edit=null;draw()}
function delRow(key,idx){if(!canEdit(MODOF[key]))return;DB[co][key].splice(idx,1);persistAppData();if(ui.edit===idx)ui.edit=null;draw()}
function saveEmpresa(){
 if(!session||session.rol!=='SUPERADMIN'||!ui.empAdd)return;
 const n=document.getElementById('ne_nombre').value.trim(),u=document.getElementById('ne_user').value.trim().toLowerCase(),p=document.getElementById('ne_pass').value,code=document.getElementById('ne_code').value.trim().toUpperCase();
 const m1=document.getElementById('msg_ne_nombre'),mu=document.getElementById('msg_ne_user'),m2=document.getElementById('msg_ne_pass'),m3=document.getElementById('msg_ne_code');
 m1.textContent=n?(DB[n]?'Ya existe una empresa con ese nombre':''):'Campo requerido';
 mu.textContent=!u?'Define el usuario administrador':!/^[a-z0-9._-]{3,50}$/.test(u)?'Usa 3–50 caracteres: letras, números, punto, guion o guion bajo':USERS.some(x=>String(x.user).toLowerCase()===u)?'Ese usuario ya existe':'';
 m2.textContent=passError(p);
 m3.textContent=!/^[A-Z0-9-]{4,32}$/.test(code)?'Usa entre 4 y 32 caracteres: letras, números o guiones':Object.keys(INVITES).some(x=>x.toUpperCase()===code)?'Ese código ya está registrado':'';
 if(m1.textContent||mu.textContent||m2.textContent||m3.textContent)return;
 DB[n]={mat:[],ped:[],pro:[],emp:[],ven:[],activa:true};
 USERS.push({user:u,pass:p,rol:'EMPRESA',empresa:n,nombre:'Administrador corporativo',activo:true});
 INVITES[code]={empresa:n,usos:20,creadoEn:new Date().toISOString()};
 const saved=persistAppData();co=n;ui.empAdd=false;view='Dashboard';
 ui.note=`Empresa creada. Usuario administrador: ${u}. Usa la contraseña que acabas de definir. Código de invitación: ${code}`+(saved?'':' · ADVERTENCIA: el navegador no permitió guardar los datos; no cierres ni recargues esta página.');
 draw();if(!saved)alert('La empresa se creó en esta sesión, pero el navegador no permitió guardar los datos. Ejecuta el proyecto con Live Server y vuelve a crearla.');
}
function createInviteForSelected(){
 if(!session||session.rol!=='SUPERADMIN'||!ui.inviteManage||!DB[co])return;
 const code=document.getElementById('new_inv_code').value.trim().toUpperCase();
 const uses=Number(document.getElementById('new_inv_uses').value);
 if(!/^[A-Z0-9-]{4,32}$/.test(code)){alert('El código debe tener entre 4 y 32 caracteres: letras, números o guiones.');return}
 if(Object.keys(INVITES).some(x=>x.toUpperCase()===code)){alert('Ese código ya existe.');return}
 if(!Number.isInteger(uses)||uses<1||uses>10000){alert('La cantidad de cupos debe ser un entero entre 1 y 10000.');return}
 INVITES[code]={empresa:co,usos:uses,creadoEn:new Date().toISOString()};persistAppData();ui.note='Código creado: '+code+' · Cupos: '+uses;draw();
}
function deleteInvite(code){
 if(!session||session.rol!=='SUPERADMIN'||!ui.inviteManage)return;
 if(!INVITES[code]||INVITES[code].empresa!==co)return;
 if(!confirm('¿Eliminar el código '+code+'?'))return;
 delete INVITES[code];persistAppData();ui.note='Código eliminado';draw();
}
