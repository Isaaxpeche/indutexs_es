// Centro de administración global. Solo SUPERADMIN puede ejecutar estas acciones.
let adminState={company:null,showAudit:false};
const isSuperAdmin=()=>!!session&&session.rol==='SUPERADMIN';
function audit(action,detail){
 if(!isSuperAdmin())return;
 AUDIT.unshift({fecha:new Date().toLocaleString('es-CO'),actor:session.user,accion:action,detalle:detail});
 if(AUDIT.length>300)AUDIT.length=300;
 persistAppData();
}
function superAdminHTML(){
 if(!isSuperAdmin())return '<p>Acceso denegado.</p>';
 const names=Object.keys(DB);
 const cards=names.map(name=>{
  const users=USERS.filter(u=>u.empresa===name),admins=users.filter(u=>u.rol==='EMPRESA').length;
  const active=DB[name].activa!==false;
  return `<tr><td data-label="Empresa"><b>${esc(name)}</b></td><td data-label="Usuarios">${users.length}</td><td data-label="Administradores">${admins}</td><td data-label="Estado"><span class="chip ${active?'ok':'bad'}">${active?'Activa':'Suspendida'}</span></td><td data-label="Acciones" class="actions"><button class="icobtn" onclick="selectAdminCompany(this.dataset.company)" data-company="${esc(name)}">Usuarios</button><button class="icobtn" onclick="renameCompany(this.dataset.company)" data-company="${esc(name)}">Editar</button><button class="icobtn" onclick="toggleCompany(this.dataset.company)" data-company="${esc(name)}">${active?'Suspender':'Reactivar'}</button><button class="icobtn" onclick="deleteCompany(this.dataset.company)" data-company="${esc(name)}">Eliminar</button></td></tr>`;
 }).join('');
 const selected=adminState.company&&DB[adminState.company]?adminState.company:null;
 const detail=selected?companyUsersHTML(selected):'';
 const log=adminState.showAudit?`<div class="tablecard" style="margin-top:14px"><div class="thead-row"><h2>Registro de auditoría</h2><button class="addbtn" onclick="exportRows(AUDIT,'indutexs_auditoria')">Exportar registro</button></div><table><thead><tr><th>Fecha</th><th>Actor</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>${AUDIT.map(a=>`<tr><td data-label="Fecha">${esc(a.fecha)}</td><td data-label="Actor">${esc(a.actor)}</td><td data-label="Acción">${esc(a.accion)}</td><td data-label="Detalle">${esc(a.detalle)}</td></tr>`).join('')||'<tr><td colspan="4">Sin movimientos registrados.</td></tr>'}</tbody></table></div>`:'';
 return `<div class="bento solo"><div class="tablecard"><div class="thead-row"><div><h2>Empresas registradas</h2><small style="color:var(--muted)">${names.length} empresas · ${USERS.length} cuentas de usuario</small></div><button class="addbtn" onclick="exportAdminCompanies()">Exportar empresas</button></div><table><thead><tr><th>Empresa</th><th>Usuarios</th><th>Administradores</th><th>Estado</th><th></th></tr></thead><tbody>${cards}</tbody></table></div>${detail}${log}<div class="tablecard" style="margin-top:14px"><div class="thead-row"><h2>Administración global</h2><button class="addbtn" onclick="adminState.showAudit=!adminState.showAudit;draw()">${adminState.showAudit?'Ocultar auditoría':'Ver auditoría'}</button></div><p style="padding:0 16px;color:var(--muted);font-size:13px">Desde este módulo puedes administrar el estado de las empresas, revisar sus cuentas y restablecer contraseñas. Cada acción queda registrada localmente.</p></div></div>`;
}
function selectAdminCompany(name){if(!isSuperAdmin()||!DB[name])return;adminState.company=name;draw()}
function exportAdminCompanies(){if(!isSuperAdmin())return;exportRows(Object.keys(DB).map(n=>({empresa:n,usuarios:USERS.filter(u=>u.empresa===n).length,administradores:USERS.filter(u=>u.empresa===n&&u.rol==='EMPRESA').length,estado:DB[n].activa===false?'Suspendida':'Activa'})),'indutexs_empresas')}
function companyUsersHTML(name){
 const rows=USERS.map((u,i)=>({u,i})).filter(x=>x.u.empresa===name).map(({u,i})=>`<tr><td data-label="Nombre">${esc(u.nombre||'')}</td><td data-label="Usuario">${esc(u.user)}</td><td data-label="Rol">${esc(u.rol)}</td><td data-label="Estado"><span class="chip ${(u.activo===false)?'bad':'ok'}">${u.activo===false?'Inactivo':'Activo'}</span></td><td data-label="Acciones" class="actions"><button class="icobtn" onclick="resetAccountPassword(${i})">Restablecer contraseña</button>${u.rol==='USUARIO'?`<button class="icobtn" onclick="adminToggleUser(${i})">${u.activo===false?'Activar':'Desactivar'}</button>`:''}</td></tr>`).join('');
 return `<div class="tablecard" style="margin-top:14px"><div class="thead-row"><h2>Cuentas de ${esc(name)}</h2><button class="icobtn" onclick="adminState.company=null;draw()">Cerrar</button></div><table><thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5">Esta empresa no tiene cuentas.</td></tr>'}</tbody></table></div>`;
}
function resetAccountPassword(index){
 if(!isSuperAdmin())return;
 const u=USERS[index];if(!u||u.rol==='SUPERADMIN')return;
 const next=prompt(`Nueva contraseña para ${u.user}. Debe tener mínimo 8 caracteres, un @ y dos números:`);
 if(next===null)return;
 const err=passError(next);if(err){alert(err);return}
 u.pass=next;u.mustChangePassword=true;persistAppData();audit('Restablecimiento de contraseña',`Cuenta ${u.user} · Empresa ${u.empresa}`);alert('Contraseña actualizada. Se solicitará cambiarla en el siguiente inicio de sesión.');draw();
}
function adminToggleUser(index){
 if(!isSuperAdmin())return;const u=USERS[index];if(!u||u.rol!=='USUARIO')return;
 u.activo=u.activo===false;persistAppData();audit(u.activo?'Activación de usuario':'Desactivación de usuario',`${u.user} · ${u.empresa}`);draw();
}
function toggleCompany(name){
 if(!isSuperAdmin()||!DB[name])return;
 const suspend=DB[name].activa!==false;
 if(!confirm(`${suspend?'¿Suspender':'¿Reactivar'} ${name}?`))return;
 DB[name].activa=!suspend;persistAppData();audit(suspend?'Suspensión de empresa':'Reactivación de empresa',name);draw();
}
function renameCompany(oldName){
 if(!isSuperAdmin()||!DB[oldName])return;
 const newName=prompt('Nuevo nombre de la empresa:',oldName);if(newName===null)return;
 const clean=newName.trim();if(!clean||clean===oldName)return;
 if(DB[clean]){alert('Ya existe una empresa con ese nombre.');return}
 DB[clean]=DB[oldName];delete DB[oldName];USERS.forEach(u=>{if(u.empresa===oldName)u.empresa=clean});Object.values(INVITES).forEach(v=>{if(v.empresa===oldName)v.empresa=clean});if(co===oldName)co=clean;if(adminState.company===oldName)adminState.company=clean;
 persistAppData();audit('Edición de empresa',`${oldName} → ${clean}`);draw();
}
function deleteCompany(name){
 if(!isSuperAdmin()||!DB[name])return;
 if(!confirm(`Se eliminarán ${name}, sus usuarios y sus invitaciones del almacenamiento local. Esta acción no se puede deshacer. ¿Continuar?`))return;
 delete DB[name];for(let i=USERS.length-1;i>=0;i--)if(USERS[i].empresa===name)USERS.splice(i,1);Object.keys(INVITES).forEach(k=>{if(INVITES[k].empresa===name)delete INVITES[k]});if(co===name)co=Object.keys(DB)[0]||'';adminState.company=null;
 audit('Eliminación de empresa',name);persistAppData();draw();
}


// Bandeja comercial del SuperAdmin
function solicitudesHTML(){
 if(!isSuperAdmin())return '<p>Acceso denegado.</p>';
 const total=SOLICITUDES.length, nuevas=SOLICITUDES.filter(s=>s.estado==='Nueva').length;
 const rows=SOLICITUDES.slice().sort((a,b)=>b.creadaISO.localeCompare(a.creadaISO)).map((s)=>{
  const idx=SOLICITUDES.indexOf(s);
  const statusClass=s.estado==='Aceptada'?'ok':s.estado==='Rechazada'?'bad':s.estado==='Contactada'?'warn':'';
  return `<tr><td data-label="Fecha">${esc(s.fecha)}</td><td data-label="Empresa"><b>${esc(s.empresa)}</b><small style="display:block;color:var(--muted)">${esc(s.representante)}</small></td><td data-label="Contacto">${esc(s.correo)}<small style="display:block;color:var(--muted)">${esc(s.telefono||'Sin teléfono')}</small></td><td data-label="Empleados">${esc(s.empleados||'No indicado')}</td><td data-label="Estado"><span class="chip ${statusClass}">${esc(s.estado)}</span></td><td data-label="Acciones" class="actions"><button class="icobtn" onclick="verSolicitud(${idx})">Detalles</button><button class="icobtn" onclick="cambiarEstadoSolicitud(${idx})">Cambiar estado</button></td></tr>`;
 }).join('');
 return `<div class="bento solo"><div class="mini"><div class="stat"><b>${total}</b><span>Solicitudes recibidas</span></div><div class="stat"><b>${nuevas}</b><span>Nuevas por revisar</span></div><div class="stat"><b>${SOLICITUDES.filter(s=>s.estado==='Aceptada').length}</b><span>Aceptadas</span></div></div><div class="tablecard"><div class="thead-row"><div><h2>Solicitudes de empresas</h2><small style="color:var(--muted)">Interesados en contratar INDUTEXS</small></div><button class="addbtn" onclick="exportRows(SOLICITUDES.map(({creadaISO,...s})=>s),'indutexs_solicitudes')">Exportar solicitudes</button></div><table><thead><tr><th>Fecha</th><th>Empresa / representante</th><th>Contacto</th><th>Empleados</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${rows||'<tr><td colspan="6" style="color:var(--muted)">Todavía no hay solicitudes. Cuando un interesado complete el formulario comercial, aparecerá aquí.</td></tr>'}</tbody></table></div><div class="tablecard"><div class="thead-row"><h2>Flujo de atención</h2></div><p style="padding:0 16px;color:var(--muted);font-size:13px">Nueva → Contactada → Aceptada o Rechazada. Al aceptar una solicitud, crea la empresa desde <b>Gestión de empresas → + Nueva</b> y configura su administrador.</p></div></div>`;
}
function verSolicitud(index){
 if(!isSuperAdmin())return;const s=SOLICITUDES[index];if(!s)return;
 alert(`SOLICITUD DE EMPRESA\n\nEmpresa: ${s.empresa}\nRepresentante: ${s.representante}\nCorreo: ${s.correo}\nTeléfono: ${s.telefono||'No indicado'}\nEmpleados: ${s.empleados||'No indicado'}\nFecha: ${s.fecha}\nEstado: ${s.estado}\n\nNecesidades:\n${s.necesidades||'No indicó detalles.'}`);
}
function cambiarEstadoSolicitud(index){
 if(!isSuperAdmin())return;const s=SOLICITUDES[index];if(!s)return;
 const estados=['Nueva','Contactada','Aceptada','Rechazada'];
 const actual=estados.indexOf(s.estado);const opciones=estados.map((e,i)=>`${i+1}. ${e}`).join('\n');
 const elegido=prompt(`Estado actual: ${s.estado}\nEscribe el número del nuevo estado:\n${opciones}`,String(actual+1));
 if(elegido===null)return;const n=Number(elegido);if(!Number.isInteger(n)||n<1||n>estados.length){alert('Opción no válida.');return}
 s.estado=estados[n-1];s.actualizada=new Date().toLocaleString('es-CO');persistAppData();audit('Cambio de estado de solicitud',`${s.empresa} · ${s.estado}`);draw();
}
