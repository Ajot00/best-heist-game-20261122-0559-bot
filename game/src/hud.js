// The compact gallery HUD: prize value, alarm, tools, time, and guard states.
import { PALETTE } from './config.js';
const p=PALETTE;
function label(ctx,text,x,y,size=14,color=p.ink,weight=600) {
  ctx.font=`${weight} ${size}px system-ui,sans-serif`; ctx.fillStyle=color; ctx.fillText(text,x,y);
}
function panel(ctx,x,y,w,h) {
  ctx.fillStyle='rgba(11,20,31,.94)'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#405466'; ctx.lineWidth=1.5; ctx.strokeRect(x+.75,y+.75,w-1.5,h-1.5);
}
export function drawHud(ctx,g) {
  panel(ctx,0,0,1280,78);
  label(ctx,'SUNSPIRE   /   NIGHT SHIFT',24,27,13,p.muted,700);
  label(ctx,`$${g.loot.value.toLocaleString()}`,24,62,30,p.gold,800);
  label(ctx,g.loot.taken?'IDOL IN HAND':'SUNSPIRE IDOL',156,58,12,p.ink,700);
  label(ctx,`ALARM  ${Math.round(g.alarm.value)}%`,705,25,12,g.alarm.value>70?p.red:p.ink,700);
  ctx.fillStyle='#263543'; ctx.fillRect(705,34,362,16);
  const fill=Math.max(0,Math.min(1,g.alarm.value/100));
  ctx.fillStyle=fill>.72?p.red:fill>.38?p.amber:'#e2a653'; ctx.fillRect(705,34,362*fill,16);
  ctx.strokeStyle='#d7e0dc'; ctx.lineWidth=1; ctx.strokeRect(705,34,362,16);
  label(ctx,`TIME  ${formatTime(g.elapsed)}`,1090,27,13,p.ink,700);
  label(ctx,`NOISE  ${g.tools.noise}/3`,1090,56,12,p.teal,700);
  panel(ctx,20,91,208,137);
  label(ctx,'FIELD NOTES',35,114,11,p.muted,700);
  label(ctx,'Q  NOISE-MAKER',35,139,12,p.ink,700); label(ctx,'3 charges · loud',35,157,11,p.amber,500);
  label(ctx,'F  CAMERA LOOP',35,184,12,p.ink,700); label(ctx,'$250 · freezes 10s',35,202,11,p.gold,500);
  panel(ctx,1050,90,210,132);
  label(ctx,'WATCH STATUS',1066,114,11,p.muted,700);
  g.guards.forEach((guard,i)=>{
    const y=140+i*24; ctx.fillStyle=guard.tint; ctx.beginPath(); ctx.arc(1073,y-4,5,0,Math.PI*2); ctx.fill();
    const name=['WEST','EAST','LOWER'][i]; label(ctx,`${name}  ${guard.state.toUpperCase()} ${guard.marker}`,1087,y,11,guard.tint,700);
  });
  panel(ctx,403,650,474,49);
  const action=g.state==='getaway'?'GET TO THE SKYLIGHT  →':g.loot.taken?'REACH THE SKYLIGHT  →':'REACH THE PLINTH  ·  PRESS E';
  label(ctx,action,640-(action.length*4.15),670,13,p.gold,800);
  label(ctx,'WASD MOVE   SHIFT SNEAK   SPACE SPRINT   P PAUSE   R RESTART',424,689,10,p.muted,500);
  if (g.banner>0 && g.loot.taken) {
    ctx.fillStyle='rgba(8,15,25,.62)'; ctx.fillRect(0,245,1280,244);
    label(ctx,'IDOL SECURED',385,333,50,p.gold,850);
    label(ctx,'GET OUT  /  SKYLIGHT EXIT',447,375,20,p.ink,750);
    label(ctx,`LOCKDOWN IN ${Math.max(0,Math.ceil((100-g.alarm.value)/13))}s`,516,415,14,p.red,700);
  }
}
function formatTime(seconds) { return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`; }
export { formatTime };
