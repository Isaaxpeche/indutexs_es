// Indutexs - Inicio de sesión. El registro público fue deshabilitado.
function show(id){
  ["landing","login","app"].forEach(x=>document.getElementById(x).classList.toggle("hidden",x!==id));
  window.scrollTo(0,0);
}
function goLogin(){show("login");document.getElementById("usr").focus()}
function startSession(u){
  if(!u||!DB||!USERS.includes(u))return;
  if(u.rol!=="SUPERADMIN"&&(!u.empresa||!DB[u.empresa]||DB[u.empresa].activa===false)){
    document.getElementById("msgPwd").textContent="La empresa de esta cuenta no está disponible. Contacta al SuperAdmin.";
    return;
  }
  session=u;
  co=u.rol==="SUPERADMIN"?(Object.keys(DB).find(k=>DB[k].activa!==false)||Object.keys(DB)[0]||""):u.empresa;
  ui={add:false,edit:null,empAdd:false,inviteManage:false,uForm:null};
  view="Dashboard";
  show("app");
  draw();
}
function logout(){session=null;show("login");document.getElementById("usr").value="";document.getElementById("pwd").value="";document.getElementById("msgUsr").textContent="";document.getElementById("msgPwd").textContent=""}
function login(){
  const userInput=document.getElementById("usr"),passInput=document.getElementById("pwd");
  const msgUsr=document.getElementById("msgUsr"),msgPwd=document.getElementById("msgPwd");
  const username=userInput.value.trim(),password=passInput.value;
  msgUsr.textContent="";msgPwd.textContent="";
  if(!username){msgUsr.textContent="Ingresa tu usuario";userInput.focus();return}
  if(!password){msgPwd.textContent="Ingresa tu contraseña";passInput.focus();return}
  const accountByUser=USERS.find(x=>String(x.user).trim().toLowerCase()===username.toLowerCase());
  const account=accountByUser&&String(accountByUser.pass)===password?accountByUser:null;
  if(!account){msgPwd.textContent=accountByUser?"La contraseña no coincide con ese usuario. Revisa la contraseña que definiste al crear la empresa.":"Ese usuario no existe en este navegador. Si acabas de crear la empresa, comprueba el usuario administrador que apareció en el panel.";return}
  if(account.activo===false){msgPwd.textContent="Esta cuenta está desactivada. Contacta al administrador de tu empresa.";return}
  if(account.rol!=="SUPERADMIN"&&(!account.empresa||!DB[account.empresa])){msgPwd.textContent="La cuenta no está vinculada a una empresa válida. Contacta al SuperAdmin.";return}
  if(account.rol!=="SUPERADMIN"&&DB[account.empresa].activa===false){msgPwd.textContent="La empresa está suspendida. Contacta al SuperAdmin.";return}
  if(account.mustChangePassword){
    const next=prompt("El administrador restableció tu contraseña. Define una nueva contraseña (mínimo 8 caracteres, un @ y dos números):");
    if(next===null)return;
    const error=passError(next);
    if(error){alert(error);return}
    account.pass=next;delete account.mustChangePassword;persistAppData();
    if(typeof audit==="function")audit("Cambio de contraseña obligatorio",`Cuenta ${account.user}`);
  }
  startSession(account);
}
document.getElementById("go").addEventListener("click",login);
document.getElementById("out").addEventListener("click",logout);
["usr","pwd"].forEach(id=>document.getElementById(id).addEventListener("keydown",e=>{if(e.key==="Enter")login()}));
document.getElementById("backHome").addEventListener("click",e=>{e.preventDefault();show("landing")});
