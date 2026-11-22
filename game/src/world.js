// Gallery geometry, the three routes, collision, and wall-occluded sight.
export const room = { x: 42, y: 78, w: 1196, h: 600 };
export const covers = [
  {x:104,y:198,w:148,h:116,label:'bronze screen'}, {x:1028,y:196,w:148,h:116,label:'stone screen'},
  {x:104,y:474,w:176,h:120,label:'night cabinet'}, {x:1000,y:470,w:176,h:124,label:'blue cabinet'},
  {x:447,y:288,w:62,h:114,label:'pillar'}, {x:770,y:288,w:62,h:114,label:'pillar'},
  {x:464,y:482,w:62,h:90,label:'plinth'}, {x:754,y:482,w:62,h:90,label:'plinth'},
];
export const vault = { x: 640, y: 164, r: 54 };
export const exit = { x: 1122, y: 112, r: 44 };
export const routes = [
  { name:'MAIN FLOOR', color:'#d5b887', points:[[640,650],[640,390],[640,230]], note:'fast · exposed' },
  { name:'SHADOW GALLERY', color:'#78a6bc', points:[[150,632],[340,632],[370,370],[355,170],[560,170]], labelAt:[340,632], note:'slow · concealed' },
  { name:'SERVICE VENT', color:'#87c1a9', points:[[194,650],[194,386],[194,124],[926,124],[1050,124]], note:'one way · bypasses west watch' },
];
export function blocked(x, y, radius = 14) {
  if (x < room.x + radius || y < room.y + radius || x > room.x + room.w - radius || y > room.y + room.h - radius) return true;
  return covers.some(rect => x + radius > rect.x && x - radius < rect.x + rect.w && y + radius > rect.y && y - radius < rect.y + rect.h);
}
export function moveCircle(actor, dx, dy, radius = 14) {
  const nx = actor.x + dx, ny = actor.y + dy;
  if (!blocked(nx, actor.y, radius)) actor.x = nx;
  if (!blocked(actor.x, ny, radius)) actor.y = ny;
}
function segmentRect(a, b, rect) {
  const dx = b.x - a.x, dy = b.y - a.y;
  let lo = 0, hi = 1;
  for (const [p, q] of [[-dx,a.x-rect.x],[dx,rect.x+rect.w-a.x],[-dy,a.y-rect.y],[dy,rect.y+rect.h-a.y]]) {
    if (!p) { if (q < 0) return false; continue; }
    const t = q / p;
    if (p < 0) lo = Math.max(lo, t); else hi = Math.min(hi, t);
    if (lo > hi) return false;
  }
  return hi > 0.02 && lo < 0.98;
}
export function clearSight(a, b) { return !covers.some(rect => segmentRect(a, b, rect)); }
export function distance(a,b) { return Math.hypot(a.x-b.x,a.y-b.y); }
