// Canvas art: architectural gallery, occluded danger fields, thief, and screens.
import { SIZE, PALETTE as p } from './config.js';
import { room,covers,vault,exit,routes,blocked } from './world.js';
import { drawHud,formatTime } from './hud.js';

function text(ctx,value,x,y,size,color,weight=700,align='left') {
  ctx.font=`${weight} ${size}px system-ui,sans-serif`; ctx.textAlign=align; ctx.fillStyle=color; ctx.fillText(value,x,y); ctx.textAlign='left';
}
function rounded(ctx,x,y,w,h,r,fill,stroke) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle=fill; ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}
}
function roomArt(ctx,g) {
  ctx.fillStyle=p.void; ctx.fillRect(0,0,SIZE.w,SIZE.h);
  ctx.fillStyle='#293744'; ctx.fillRect(25,72,1230,621);
  ctx.fillStyle=p.floor; ctx.fillRect(room.x,room.y,room.w,room.h);
  // Wide fitted floor panels suggest a single designed room, not a tile field.
  ctx.strokeStyle='rgba(156,174,180,.13)'; ctx.lineWidth=2;
  for(let x=72;x<1225;x+=192){ctx.beginPath();ctx.moveTo(x,81);ctx.lineTo(x,675);ctx.stroke();}
  for(let y=126;y<678;y+=178){ctx.beginPath();ctx.moveTo(43,y);ctx.lineTo(1237,y);ctx.stroke();}
  ctx.strokeStyle='#81909a'; ctx.lineWidth=4; ctx.strokeRect(42,78,1196,600);
  // Upper skylight gallery and the visible one-way service vent.
  ctx.fillStyle='#273a49'; ctx.fillRect(253,84,742,48);
  ctx.fillStyle='#172939'; ctx.fillRect(274,91,697,28);
  for(let x=292;x<955;x+=36){ctx.fillStyle='#354b5b';ctx.fillRect(x,91,5,28);}
  text(ctx,'SERVICE VENT  →  ONE WAY',618,110,11,'#9bc6b4',700,'center');
  // Route suggestions, deliberately broad and labelled.
  ctx.save(); ctx.setLineDash([5,10]); ctx.lineWidth=3;
  routes.forEach((route,index)=>{
    ctx.strokeStyle=route.color; ctx.globalAlpha=.43;
    ctx.beginPath(); route.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)); ctx.stroke();
    const [x,y]=route.points[Math.floor(route.points.length/2)];
    ctx.globalAlpha=.9; rounded(ctx,x-54,y-13,108,25,'rgba(12,23,34,.86)',route.color);
    text(ctx,route.name,x,y+4,9,route.color,800,'center');
  }); ctx.restore();
  // Built-in gallery landmarks fill the zones without obscuring movement.
  drawArch(ctx,92,348,'WEST WING'); drawArch(ctx,1086,350,'EAST WING');
  drawDisplay(ctx,332,355,'CELESTIAL MAP'); drawDisplay(ctx,948,355,'BLUE RELIQUARY');
  covers.forEach(rect=>{
    const isPillar=rect.label==='pillar';
    rounded(ctx,rect.x,rect.y,rect.w,rect.h,isPillar?11:7,isPillar?'#354858':p.cover,p.coverEdge);
    ctx.fillStyle='rgba(157,178,190,.17)'; ctx.fillRect(rect.x+8,rect.y+8,rect.w-16,5);
    if(!isPillar){ text(ctx,rect.label.toUpperCase(),rect.x+rect.w/2,rect.y+rect.h/2+4,9,'#8b9ba6',700,'center'); }
  });
  drawExit(ctx,g); drawVault(ctx,g);
}
function drawArch(ctx,x,y,name){
  ctx.strokeStyle='#526676';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,46,Math.PI,0);ctx.stroke();
  ctx.fillStyle='rgba(71,101,118,.12)';ctx.fillRect(x-42,y-4,84,46); text(ctx,name,x,y+62,10,'#82929c',700,'center');
}
function drawDisplay(ctx,x,y,name){
  rounded(ctx,x-67,y-32,134,64,8,'#203445','#4b6273');
  ctx.strokeStyle='#829ba5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-19,y);ctx.lineTo(x+19,y);ctx.moveTo(x,y-19);ctx.lineTo(x,y+19);ctx.stroke();
  text(ctx,name,x,y+54,9,'#9eafb6',700,'center');
}
function drawExit(ctx,g){
  ctx.save();ctx.translate(exit.x,exit.y);
  ctx.fillStyle='#345158';ctx.fillRect(-64,-30,128,61);ctx.strokeStyle='#7dd4c1';ctx.lineWidth=3;ctx.strokeRect(-64,-30,128,61);
  ctx.fillStyle='#0c1d28';ctx.fillRect(-49,-20,98,41);
  for(let i=-30;i<=30;i+=15){ctx.strokeStyle='#638879';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i,-18);ctx.lineTo(i,19);ctx.stroke();}
  text(ctx,'SKYLIGHT',0,48,11,'#9de3d1',800,'center');ctx.restore();
  if(g.state==='getaway') {ctx.strokeStyle='#9de3d1';ctx.lineWidth=3;ctx.setLineDash([7,6]);ctx.beginPath();ctx.arc(exit.x,exit.y,60,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
}
function drawVault(ctx,g){
  ctx.save();ctx.translate(vault.x,vault.y);
  ctx.fillStyle='rgba(255,196,69,.12)';ctx.beginPath();ctx.arc(0,0,80,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#614b33';ctx.beginPath();ctx.ellipse(0,17,69,30,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#a17b43';ctx.beginPath();ctx.ellipse(0,9,59,24,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=g.loot.opened?'#f1c969':'#9a8151';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,49,0,Math.PI*2);ctx.stroke();
  if(!g.loot.taken){
    const pulse=.83+Math.sin(g.elapsed*3)*.1;ctx.save();ctx.scale(pulse,pulse);
    ctx.shadowBlur=30;ctx.shadowColor='#ffd34e';ctx.fillStyle=p.gold;
    ctx.beginPath();ctx.moveTo(-24,5);ctx.lineTo(-15,-17);ctx.lineTo(1,-24);ctx.lineTo(24,-8);ctx.lineTo(18,17);ctx.lineTo(-8,21);ctx.closePath();ctx.fill();ctx.restore();
    text(ctx,'SUNSPIRE IDOL',0,76,11,'#ffe08a',800,'center');
  }else{text(ctx,'VAULT OPEN',0,8,12,'#ffcf61',800,'center');}
  ctx.restore();
}
function rayEnd(origin,angle,range){
  for(let d=12;d<=range;d+=8){const x=origin.x+Math.cos(angle)*d,y=origin.y+Math.sin(angle)*d;if(blocked(x,y,3))return{x,y};}
  return{x:origin.x+Math.cos(angle)*range,y:origin.y+Math.sin(angle)*range};
}
function cone(ctx,origin,angle,range,half,color,alpha){
  ctx.beginPath();ctx.moveTo(origin.x,origin.y);
  const count=50;
  for(let i=0;i<=count;i++){const a=angle-half+half*2*i/count,end=rayEnd(origin,a,range);ctx.lineTo(end.x,end.y);}
  ctx.closePath();ctx.fillStyle=color;ctx.globalAlpha=alpha;ctx.fill();ctx.globalAlpha=1;
}
function drawDanger(ctx,g){
  g.cameras.forEach(camera=>{if(!camera.loop)cone(ctx,camera,camera.angle,camera.range,.55,'#ef8c3c',.15);});
  g.guards.forEach(guard=>{
    const color=guard.state==='chase'?'#f04f51':guard.state==='glance'||guard.state==='investigate'?'#f6a344':'#a4afb3';
    cone(ctx,guard,guard.angle,330,.92,color,guard.state==='chase'?.27:guard.state==='patrol'?.16:.23);
  });
}
function drawCamera(ctx,camera){
  ctx.save();ctx.translate(camera.x,camera.y);ctx.rotate(camera.angle);
  ctx.fillStyle='#202d36';ctx.strokeStyle='#f4b263';ctx.lineWidth=3;ctx.fillRect(-13,-10,27,20);ctx.strokeRect(-13,-10,27,20);
  ctx.fillStyle='#f5a246';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.restore();
  text(ctx,camera.loop?'LOOPED':camera.name,camera.x,camera.y-18,9,camera.loop?'#83d9ca':'#f4bd79',800,'center');
}
function drawGuard(ctx,guard){
  ctx.save();ctx.translate(guard.x,guard.y);ctx.rotate(guard.angle);
  ctx.fillStyle='#18202b';ctx.beginPath();ctx.ellipse(0,3,18,14,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=guard.tint;ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f1e8d2';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(23,-6);ctx.lineTo(23,6);ctx.closePath();ctx.fill();ctx.restore();
  if(guard.marker){ctx.fillStyle=guard.tint;ctx.beginPath();ctx.arc(guard.x,guard.y-28,13,0,Math.PI*2);ctx.fill();text(ctx,guard.marker,guard.x,guard.y-23,15,'#17202b',900,'center');}
}
function drawThief(ctx,g){
  const t=g.thief;ctx.save();ctx.translate(t.x,t.y);
  ctx.fillStyle='rgba(5,10,18,.5)';ctx.beginPath();ctx.ellipse(0,10,19,12,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d5e0dd';ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#152435';ctx.beginPath();ctx.arc(0,2,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#7fced0';ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(19,-5);ctx.lineTo(19,5);ctx.closePath();ctx.fill();
  if(g.tools.noiseActive>0){ctx.strokeStyle='#dfc080';ctx.lineWidth=3;ctx.beginPath();ctx.arc(32,-16,8,0,Math.PI*2);ctx.stroke();}
  ctx.restore();text(ctx,'ROOK',t.x,t.y+30,9,'#d5e0dd',800,'center');
}
function drawNoise(ctx,g){if(g.sound){ctx.strokeStyle='rgba(247,191,100,.48)';ctx.lineWidth=2;for(let r=36;r<g.sound.radius;r+=56){ctx.beginPath();ctx.arc(g.sound.x,g.sound.y,r,0,Math.PI*2);ctx.stroke();}}}
function drawScreen(ctx,g){
  if(g.state==='title'){
    ctx.fillStyle='rgba(5,12,20,.67)';ctx.fillRect(0,0,1280,720);
    rounded(ctx,260,142,760,426,18,'rgba(13,24,36,.97)','#718896');
    text(ctx,'SUNSPIRE',640,228,25,'#93d5cc',800,'center');text(ctx,'HEIST',640,300,67,p.gold,900,'center');
    text(ctx,'One room. Three watches. Bring the idol to the skylight.',640,347,18,p.ink,600,'center');
    text(ctx,'WASD MOVE   ·   SHIFT SNEAK   ·   SPACE SPRINT',640,397,15,'#aab9bf',700,'center');
    text(ctx,'E TAKE   ·   Q NOISE   ·   F LOOP CAMERA   ·   P PAUSE',640,427,15,'#aab9bf',700,'center');
    rounded(ctx,500,469,280,60,'#bb812d','#ffe18a');text(ctx,'ENTER  /  BEGIN',640,507,20,'#171a1a',900,'center');
  } else if(g.state==='caught'||g.state==='win'){
    ctx.fillStyle='rgba(5,10,18,.83)';ctx.fillRect(0,0,1280,720);
    const win=g.state==='win';text(ctx,win?'CLEAN GETAWAY':'LOCKDOWN',640,248,58,win?p.gold:p.red,900,'center');
    text(ctx,win?`LOOT SECURED  ·  $${g.loot.value.toLocaleString()}`:'THE GALLERY SEALED',640,310,23,p.ink,700,'center');
    text(ctx,g.state==='win'?`TIME  ${formatTime(g.elapsed)}     /     ALARM EVENTS  ${g.alarm.events}`:`LAST PING  ${g.caughtBy||'LOCKDOWN'}   ·   ALARM ${Math.round(g.alarm.value)}%`,640,356,18,'#b7c3c7',650,'center');
    rounded(ctx,490,422,300,62,'#1b3542','#76d3c7');text(ctx,'R  RESTART',640,462,21,p.ink,800,'center');
  } else if(g.state==='paused'){
    ctx.fillStyle='rgba(5,10,18,.62)';ctx.fillRect(0,0,1280,720);text(ctx,'PAUSED',640,345,50,p.ink,900,'center');text(ctx,'P TO RESUME',640,390,16,p.gold,700,'center');
  }
}
export function draw(ctx,g){
  roomArt(ctx,g);drawDanger(ctx,g);g.cameras.forEach(camera=>drawCamera(ctx,camera));
  g.guards.forEach(guard=>drawGuard(ctx,guard));drawNoise(ctx,g);drawThief(ctx,g);drawHud(ctx,g);drawScreen(ctx,g);
}
