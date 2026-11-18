// Indutexs - Datos demo multiempresa y configuración de módulos
const DB={
 "Grupo Logístico Andino S.A.":{
  mat:[{nombre:"Tela antifluido azul",unidad:"Metro",disponible:420,minimo:80,precio:18500},{nombre:"Hilo poliéster alta resistencia",unidad:"Cono",disponible:36,minimo:50,precio:7200},{nombre:"Cremallera industrial 60 cm",unidad:"Unidad",disponible:280,minimo:100,precio:2400},{nombre:"Cinta reflectiva 2 pulgadas",unidad:"Metro",disponible:95,minimo:120,precio:8900}],
  ped:[{cliente:"Operadora de Transporte Metropolitano",entrega:"18 nov 2026",estado:"En producción"},{cliente:"Servicios Integrales del Oriente",entrega:"22 nov 2026",estado:"Pendiente"},{cliente:"Consorcio Vial Santander",entrega:"15 nov 2026",estado:"Entregado"},{cliente:"Terminales Regionales S.A.S.",entrega:"28 nov 2026",estado:"En producción"}],
  pro:[{operario:"María Fernanda Rojas",prenda:"Chaqueta reflectiva industrial",cantidad:85,fecha:"10 nov 2026"},{operario:"Carlos Andrés Pérez",prenda:"Pantalón cargo antifluido",cantidad:120,fecha:"11 nov 2026"},{operario:"Diana Marcela Suárez",prenda:"Camisa operativa",cantidad:64,fecha:"11 nov 2026"}],
  emp:[{nombre:"María Fernanda Rojas",cargo:"Supervisora de producción",salario:2850000},{nombre:"Carlos Andrés Pérez",cargo:"Operario de confección",salario:1950000},{nombre:"Diana Marcela Suárez",cargo:"Control de calidad",salario:2250000},{nombre:"Andrés Felipe Gómez",cargo:"Cortador",salario:2100000},{nombre:"Laura Camila Ortiz",cargo:"Auxiliar de bodega",salario:1800000}],
  ven:[{cliente:"Operadora de Transporte Metropolitano",producto:"Chaqueta reflectiva industrial",cantidad:85,total:11050000,fecha:"10 nov 2026"},{cliente:"Consorcio Vial Santander",producto:"Pantalón cargo antifluido",cantidad:120,total:10200000,fecha:"08 nov 2026"},{cliente:"Terminales Regionales S.A.S.",producto:"Camisa operativa",cantidad:64,total:4480000,fecha:"06 nov 2026"}]},
 "Soluciones Tecnológicas Globales":{
  mat:[{nombre:"Tela algodón premium",unidad:"Metro",disponible:310,minimo:70,precio:16200},{nombre:"Hilo nylon industrial",unidad:"Cono",disponible:62,minimo:25,precio:8100},{nombre:"Botón de presión metálico",unidad:"Unidad",disponible:900,minimo:250,precio:380}],
  ped:[{cliente:"Instituto Técnico del Caribe",entrega:"20 nov 2026",estado:"En producción"},{cliente:"Clínica Central del Norte",entrega:"25 nov 2026",estado:"Pendiente"},{cliente:"Red Educativa Nacional",entrega:"30 nov 2026",estado:"Pendiente"}],
  pro:[{operario:"Julián David Castro",prenda:"Bata antifluido",cantidad:95,fecha:"11 nov 2026"},{operario:"Paola Andrea León",prenda:"Uniforme institucional",cantidad:140,fecha:"09 nov 2026"}],
  emp:[{nombre:"Julián David Castro",cargo:"Jefe de planta",salario:3200000},{nombre:"Paola Andrea León",cargo:"Operaria líder",salario:2400000},{nombre:"Natalia Vargas",cargo:"Diseñadora textil",salario:2800000},{nombre:"Sergio Méndez",cargo:"Auxiliar de producción",salario:1850000}],
  ven:[{cliente:"Instituto Técnico del Caribe",producto:"Bata antifluido",cantidad:95,total:6175000,fecha:"11 nov 2026"},{cliente:"Red Educativa Nacional",producto:"Uniforme institucional",cantidad:140,total:12600000,fecha:"09 nov 2026"}]},
 "Distribuidora del Norte":{
  mat:[{nombre:"Dril algodón  pesado",unidad:"Metro",disponible:185,minimo:60,precio:21400},{nombre:"Hilo poliéster blanco",unidad:"Cono",disponible:18,minimo:30,precio:6800},{nombre:"Elástico tejido 3 cm",unidad:"Metro",disponible:540,minimo:150,precio:1900}],
  ped:[{cliente:"Almacenes Regionales S.A.S.",entrega:"19 nov 2026",estado:"Pendiente"},{cliente:"Comercializadora San Martín",entrega:"21 nov 2026",estado:"En producción"},{cliente:"Abastecimientos del Oriente",entrega:"27 nov 2026",estado:"Entregado"}],
  pro:[{operario:"Óscar Mauricio Díaz",prenda:"Pantalón de dotación",cantidad:110,fecha:"10 nov 2026"},{operario:"Luisa Fernanda Rincón",prenda:"Camisa formal",cantidad:72,fecha:"11 nov 2026"}],
  emp:[{nombre:"Óscar Mauricio Díaz",cargo:"Coordinador de planta",salario:2950000},{nombre:"Luisa Fernanda Rincón",cargo:"Operaria de confección",salario:2050000},{nombre:"Mateo Cárdenas",cargo:"Auxiliar logístico",salario:1900000}],
  ven:[{cliente:"Almacenes Regionales S.A.S.",producto:"Pantalón de dotación",cantidad:110,total:9350000,fecha:"10 nov 2026"},{cliente:"Comercializadora San Martín",producto:"Camisa formal",cantidad:72,total:5040000,fecha:"07 nov 2026"}]},
 "Operaciones Industriales del Oriente S.A.S.":{
  mat:[{nombre:"Tela drill azul oscuro",unidad:"Metro",disponible:260,minimo:90,precio:19800},{nombre:"Hilo poliéster negro",unidad:"Cono",disponible:44,minimo:20,precio:6900},{nombre:"Cinta de ribete",unidad:"Metro",disponible:75,minimo:100,precio:3200}],
  ped:[{cliente:"Empresa de Servicios Públicos Regional",entrega:"24 nov 2026",estado:"En producción"},{cliente:"Seguridad Industrial Colombiana",entrega:"29 nov 2026",estado:"Pendiente"}],
  pro:[{operario:"Valentina Pardo",prenda:"Overol industrial",cantidad:58,fecha:"11 nov 2026"},{operario:"David Esteban Mora",prenda:"Chaleco operativo",cantidad:90,fecha:"08 nov 2026"}],
  emp:[{nombre:"Valentina Pardo",cargo:"Supervisora",salario:2750000},{nombre:"David Esteban Mora",cargo:"Operario",salario:2000000},{nombre:"Camila Torres",cargo:"Control de calidad",salario:2300000}],
  ven:[{cliente:"Seguridad Industrial Colombiana",producto:"Overol industrial",cantidad:58,total:8410000,fecha:"11 nov 2026"}]}
};
const FIELDS={
 mat:[{k:'nombre',l:'Material',t:'text'},{k:'unidad',l:'Unidad',t:'select',o:['Metro','Cono','Unidad']},{k:'disponible',l:'Disponible',t:'number'},{k:'minimo',l:'Mínimo',t:'number'},{k:'precio',l:'Precio',t:'number'}],
 ped:[{k:'cliente',l:'Cliente',t:'text'},{k:'entrega',l:'Entrega',t:'text'},{k:'estado',l:'Estado',t:'select',o:['Pendiente','En producción','Entregado']}],
 pro:[{k:'operario',l:'Operario',t:'text'},{k:'prenda',l:'Prenda',t:'text'},{k:'cantidad',l:'Cantidad',t:'number'},{k:'fecha',l:'Fecha',t:'text'}],
 emp:[{k:'nombre',l:'Nombre',t:'text'},{k:'cargo',l:'Cargo',t:'text'},{k:'salario',l:'Salario',t:'number'}],
 ven:[{k:'cliente',l:'Cliente',t:'text'},{k:'producto',l:'Producto',t:'text'},{k:'cantidad',l:'Cantidad',t:'number'},{k:'total',l:'Total',t:'number'},{k:'fecha',l:'Fecha',t:'text'}]
};
const KEYOF={Inventario:'mat',Pedidos:'ped',"Producción":'pro',Empleados:'emp',Ventas:'ven'};
const MONEY=['precio','salario','total'];
const NAVI=[["Dashboard","▦"],["Inventario","▤"],["Pedidos","▣"],["Producción","◈"],["Ventas","▥"],["Empleados","◉"]];
const MODS=['Inventario','Pedidos','Producción','Ventas','Empleados'];
const NIVELES=[['','Sin acceso'],['ver','Solo ver'],['edit','Ver y editar']];
const PLANTILLAS={'Ventas':{Ventas:'edit'},'Bodega':{Inventario:'edit'},'Producción':{'Producción':'edit'},'Recursos humanos':{Empleados:'edit'}};
// Códigos de invitación exclusivamente demostrativos. En producción deben emitirse y validarse en servidor.
const INVITES={
 'GLA-2026':{empresa:'Grupo Logístico Andino S.A.',usos:20},
 'STG-2026':{empresa:'Soluciones Tecnológicas Globales',usos:20},
 'DDN-2026':{empresa:'Distribuidora del Norte',usos:20},
 'OIO-2026':{empresa:'Operaciones Industriales del Oriente S.A.S.',usos:20}
};
const AUDIT=[];
// Solicitudes comerciales demo: se guardan localmente en este navegador.
const SOLICITUDES=[];
const USERS=[
 {user:'indutexs_superadmin',pass:'Indutexs@2026',rol:'SUPERADMIN',empresa:null,nombre:'Administrador general'},
 {user:'gla_admin',pass:'Andino@2026',rol:'EMPRESA',empresa:'Grupo Logístico Andino S.A.',nombre:'Administrador corporativo'},
 {user:'gla.ventas',pass:'Ventas@2026',rol:'USUARIO',empresa:'Grupo Logístico Andino S.A.',nombre:'Laura Méndez',perms:{Ventas:'edit',Pedidos:'ver'},activo:true},
 {user:'gla.bodega',pass:'Bodega@2026',rol:'USUARIO',empresa:'Grupo Logístico Andino S.A.',nombre:'Felipe Ramírez',perms:{Inventario:'edit'},activo:true},
 {user:'gla.produccion',pass:'Produccion@26',rol:'USUARIO',empresa:'Grupo Logístico Andino S.A.',nombre:'Andrea Castillo',perms:{'Producción':'edit',Pedidos:'ver'},activo:true},
 {user:'stg_admin',pass:'Global@2026',rol:'EMPRESA',empresa:'Soluciones Tecnológicas Globales',nombre:'Administrador corporativo'},
 {user:'stg.rrhh',pass:'Recursos@26',rol:'USUARIO',empresa:'Soluciones Tecnológicas Globales',nombre:'Natalia Vargas',perms:{Empleados:'edit'},activo:true},
 {user:'stg.ventas',pass:'Comercial@26',rol:'USUARIO',empresa:'Soluciones Tecnológicas Globales',nombre:'Julián Castro',perms:{Ventas:'edit',Pedidos:'edit'},activo:true},
 {user:'ddn_admin',pass:'Norte@2026',rol:'EMPRESA',empresa:'Distribuidora del Norte',nombre:'Administrador corporativo'},
 {user:'ddn.bodega',pass:'Almacen@26',rol:'USUARIO',empresa:'Distribuidora del Norte',nombre:'Mateo Cárdenas',perms:{Inventario:'edit'},activo:true},
 {user:'ddn.produccion',pass:'Planta@2026',rol:'USUARIO',empresa:'Distribuidora del Norte',nombre:'Óscar Díaz',perms:{'Producción':'edit'},activo:true},
 {user:'oio_admin',pass:'Oriente@2026',rol:'EMPRESA',empresa:'Operaciones Industriales del Oriente S.A.S.',nombre:'Administrador corporativo'},
 {user:'oio.rrhh',pass:'Personal@26',rol:'USUARIO',empresa:'Operaciones Industriales del Oriente S.A.S.',nombre:'Camila Torres',perms:{Empleados:'ver'},activo:true}
];

// Persistencia local para la demo: empresas, usuarios e invitaciones del navegador actual.
const STORAGE_KEY='indutexs_demo_v2';
function persistAppData(){
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify({DB,USERS,INVITES,AUDIT,SOLICITUDES}));return true}
 catch(err){console.warn('No fue posible guardar los datos localmente:',err);return false}
}
function restoreAppData(){
 try{
  const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;
  const saved=JSON.parse(raw);if(!saved||typeof saved!=='object')return;
  if(saved.DB&&typeof saved.DB==='object'){
   Object.keys(DB).forEach(k=>{if(!(k in saved.DB))delete DB[k]});
   Object.entries(saved.DB).forEach(([k,v])=>{if(v&&typeof v==='object')DB[k]=v});
  }
  if(Array.isArray(saved.USERS)){USERS.splice(0,USERS.length,...saved.USERS)}
  if(Array.isArray(saved.AUDIT)){AUDIT.splice(0,AUDIT.length,...saved.AUDIT)}
  if(Array.isArray(saved.SOLICITUDES)){SOLICITUDES.splice(0,SOLICITUDES.length,...saved.SOLICITUDES)}
  if(saved.INVITES&&typeof saved.INVITES==='object'){
   Object.keys(INVITES).forEach(k=>delete INVITES[k]);
   Object.entries(saved.INVITES).forEach(([k,v])=>{if(v&&typeof v==='object')INVITES[k]=v});
  }
 }catch(err){console.warn('Los datos locales no pudieron recuperarse:',err)}
}
restoreAppData();
