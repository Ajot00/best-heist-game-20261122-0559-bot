// Patrol paths, clipped vision cones, and suspicion FSM for three sentries.
import { TUNE } from './config.js';
import { distance, clearSight, moveCircle } from './world.js';

const patrols = [
  [[320,166],[390,166],[390,272],[320,272]],
  [[895,390],[966,390],[966,442],[895,442]],
  [[670,566],[850,566],[850,620],[670,620]],
];
export function createGuards() {
  return patrols.map((points, id) => ({ id, x:points[0][0], y:points[0][1], points, wp:1, pause:0.7+id*.35,
    angle:id===0?Math.PI/2:id===1?Math.PI:0, suspicion:0, state:'patrol', lastKnown:null,
    search:0, glimpse:0, speed:TUNE.guard, marker:'', tint:'#87939b' }));
}
export function inSight(guard, target) {
  const dx=target.x-guard.x, dy=target.y-guard.y, d=Math.hypot(dx,dy);
  if (d>TUNE.sight*(target.visibility??1) || d<1 || !clearSight(guard,target)) return false;
  const angle=Math.atan2(dy,dx), diff=Math.atan2(Math.sin(angle-guard.angle),Math.cos(angle-guard.angle));
  return Math.abs(diff)<TUNE.cone;
}
export function inHearing(guard, sound) { return Boolean(sound && distance(guard,sound)<sound.radius); }
function walkToward(guard, target, speed, dt) {
  const dx=target.x-guard.x, dy=target.y-guard.y, d=Math.hypot(dx,dy);
  if (d>3) { guard.angle=Math.atan2(dy,dx); moveCircle(guard,dx/d*speed*dt,dy/d*speed*dt,13); }
  return d;
}
export function updateGuards(guards, thief, sound, dt) {
  for (const guard of guards) {
    const sees=inSight(guard,thief), hears=inHearing(guard,sound);
    if (sees) { guard.lastKnown={x:thief.x,y:thief.y}; guard.glimpse=0; guard.suspicion=Math.min(1,guard.suspicion+TUNE.suspicion*dt); }
    else { guard.suspicion=Math.max(0,guard.suspicion-TUNE.suspicionFade*dt); }
    if (hears && !sees) { guard.lastKnown={x:sound.x,y:sound.y}; guard.suspicion=Math.max(guard.suspicion,.35); }
    if (guard.state==='patrol' && guard.suspicion>.09) guard.state='glance';
    if (guard.state==='glance' && guard.suspicion>.42) { guard.state='investigate'; guard.search=0; }
    if (sees && guard.suspicion>.74) { guard.state='chase'; guard.search=0; }
    if (guard.state==='patrol' || guard.state==='glance') {
      guard.pause=Math.max(0,guard.pause-dt);
      if (guard.pause===0) {
        const target=guard.points[guard.wp];
        if (walkToward(guard,{x:target[0],y:target[1]},TUNE.guard,dt)<7) { guard.wp=(guard.wp+1)%guard.points.length; guard.pause=.65; }
      }
      if (guard.state==='patrol' && guard.suspicion<.02) guard.angle=Math.atan2(guard.points[guard.wp][1]-guard.y,guard.points[guard.wp][0]-guard.x);
    } else if (guard.state==='investigate') {
      if (guard.lastKnown && walkToward(guard,guard.lastKnown,TUNE.investigate,dt)<15) { guard.state='search'; guard.search=4.1; }
      if (sees && guard.suspicion>.74) guard.state='chase';
    } else if (guard.state==='chase') {
      if (guard.lastKnown) walkToward(guard,guard.lastKnown,TUNE.chase,dt);
      if (!sees) guard.glimpse+=dt;
      if (guard.glimpse>2.4) { guard.state='search'; guard.search=4.6; }
    } else if (guard.state==='search') {
      guard.search-=dt;
      guard.angle+=dt*.9;
      if (sees && guard.suspicion>.74) { guard.state='chase'; guard.glimpse=0; }
      else if (guard.search<=0) { guard.state='patrol'; guard.lastKnown=null; guard.suspicion=0; guard.wp=(guard.wp+1)%guard.points.length; }
    }
    guard.marker=guard.state==='glance'||guard.state==='investigate'?'?':guard.state==='chase'?'!':guard.state==='search'?'…':'';
    guard.tint=guard.state==='chase'?'#f04f51':guard.state==='glance'||guard.state==='investigate'?'#f6a344':'#9aa4a5';
  }
}
