// Indutexs - Navegación de la página de presentación. No existe registro público.
document.querySelectorAll("[data-go]").forEach(button=>button.addEventListener("click",event=>{
  event.preventDefault();
  const target=button.dataset.go;
  if(target==="login"){goLogin();return}
  const section=document.getElementById(target);
  if(section)section.scrollIntoView({behavior:"smooth"});
}));


// Captura de solicitudes comerciales para la demostración local
const solicitudForm=document.getElementById('solicitudForm');
if(solicitudForm)solicitudForm.addEventListener('submit',event=>{
 event.preventDefault();
 const data=Object.fromEntries(new FormData(solicitudForm).entries());
 const empresa=(data.empresa||'').trim(),representante=(data.representante||'').trim(),correo=(data.correo||'').trim();
 if(!empresa||!representante||!correo)return;
 const now=new Date();
 SOLICITUDES.push({...data,empresa,representante,correo,estado:'Nueva',fecha:now.toLocaleString('es-CO'),creadaISO:now.toISOString()});
 const ok=persistAppData();
 const msg=document.getElementById('solicitudMsg');
 if(ok){solicitudForm.reset();msg.textContent='Solicitud registrada. Gracias por tu interés en INDUTEXS.';msg.style.color='var(--denim)';}
 else{SOLICITUDES.pop();msg.textContent='No fue posible guardar la solicitud en este navegador.';msg.style.color='crimson';}
});
