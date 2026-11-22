// Two sweeping security eyes; their wedge detection is separate from guard sight.
import { TUNE } from './config.js';
import { clearSight } from './world.js';
export function createCameras() {
  return [
    {x:286,y:91,base:.45,sweep:1.05,phase:.2,range:352,angle:0,loop:0,name:'WEST EYE'},
    {x:948,y:91,base:2.55,sweep:1.0,phase:2.4,range:350,angle:0,loop:0,name:'EAST EYE'},
  ];
}
export function updateCameras(cameras, thief, dt, alarm, onSpot) {
  for (const camera of cameras) {
    camera.loop=Math.max(0,camera.loop-dt);
    camera.angle=camera.base+Math.sin(alarm.clock*0.78+camera.phase)*camera.sweep;
    if (!camera.loop && sees(camera,thief)) onSpot(camera);
  }
}
export function sees(camera,target) {
  const dx=target.x-camera.x,dy=target.y-camera.y,d=Math.hypot(dx,dy);
  if (d>camera.range*(target.visibility??1) || d<2 || !clearSight(camera,target)) return false;
  const a=Math.atan2(dy,dx),diff=Math.atan2(Math.sin(a-camera.angle),Math.cos(a-camera.angle));
  return Math.abs(diff)<.55;
}
