// Fixed-step game loop, controls, alarm accounting, and public state hook.
import { SIZE,TUNE } from './config.js';
import { makeRandom } from './random.js';
import { makeInput } from './input.js';
import { blocked,moveCircle,distance,exit } from './world.js';
import { createGuards,updateGuards,inSight } from './guards.js';
import { createCameras,updateCameras,sees as cameraSees } from './cameras.js';
import { createLoot,takeIdol,checkGetaway } from './loot.js';
import { makeAudio } from './audio.js';
import { draw } from './render.js';
import { stageShot } from './shots.js';

const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const input=makeInput(canvas),random=makeRandom(new URLSearchParams(location.search).get('seed')||1);
const game={state:'title',elapsed:0,thief:{x:640,y:638,angle:-Math.PI/2,visibility:.75},guards:createGuards(),cameras:createCameras(),loot:createLoot(),
  alarm:{value:0,events:0,clock:0},tools:{noise:3,noiseActive:0},sound:null,banner:0,shotReady:false,shot:null,pausedFrom:'play',transitions:['title'],audio:makeAudio(),cameraPulse:0,senseWasActive:false,caughtBy:''};
stageShot(game,new URLSearchParams(location.search),random);
function resize(){canvas.width=Math.max(1,Math.round(innerWidth*devicePixelRatio));canvas.height=Math.max(1,Math.round(innerHeight*devicePixelRatio));}
addEventListener('resize',resize);resize();
function restart(){
  game.state='title';game.elapsed=0;game.thief={x:640,y:638,angle:-Math.PI/2,visibility:.75};game.guards=createGuards();game.cameras=createCameras();game.loot=createLoot();
  game.alarm={value:0,events:0,clock:0};game.tools={noise:3,noiseActive:0};game.sound=null;game.banner=0;game.transitions=['title'];game.shot=null;game.senseWasActive=false;game.caughtBy='';
}
function throwNoise(x=input.pointer.x,y=input.pointer.y){
  if(game.tools.noise<1)return;
  const dx=x-game.thief.x,dy=y-game.thief.y,d=Math.hypot(dx,dy)||1;
  game.sound={x:game.thief.x+dx/d*104,y:game.thief.y+dy/d*104,radius:TUNE.noiseRadius,life:2.4};
  game.tools.noise--;game.tools.noiseActive=.9;game.audio.play('alarm');
}
function useLoop(){
  if(game.loot.value<TUNE.loopCost)return;
  const camera=game.cameras.filter(item=>item.loop<=0).sort((a,b)=>distance(a,game.thief)-distance(b,game.thief))[0];
  if(!camera)return;camera.loop=TUNE.loopSeconds;game.loot.value-=TUNE.loopCost;game.audio.play('vault');
}
function begin(){if(game.state==='title'){game.state='play';game.transitions.push('play');game.audio.play('step');}}
function actions(){
  if(input.take('r')){restart();return;}
  if(game.state==='title'){if(input.take('enter',' '))begin();return;}
  if(game.state==='caught'||game.state==='win'){if(input.take('enter',' '))restart();return;}
  if(input.take('p')){game.state=game.state==='paused'?game.pausedFrom:'paused';if(game.state==='paused')game.pausedFrom='play';return;}
  if(game.state==='paused')return;
  if(input.take('q'))throwNoise();
  if(input.take('f'))useLoop();
  if(input.take('e'))takeIdol(game);
  if(input.pointer.clicked)throwNoise();
}
function update(dt){
  if(game.shot){if(input.take('r'))restart();return;}
  actions();if(game.state==='title'||game.state==='caught'||game.state==='win'||game.state==='paused')return;
  game.elapsed+=dt;game.alarm.clock+=dt;game.banner=Math.max(0,game.banner-dt);game.tools.noiseActive=Math.max(0,game.tools.noiseActive-dt);
  if(game.sound){game.sound.life-=dt;if(game.sound.life<=0)game.sound=null;}
  const vector=input.vector(),length=Math.hypot(vector.x,vector.y);
  if(length){
    const sneak=input.down('shift'),sprint=input.down(' '),speed=sneak?TUNE.sneak:sprint?TUNE.sprint:TUNE.walk;
    game.thief.visibility=sneak?.42:sprint?1.35:.76;game.thief.angle=Math.atan2(vector.y,vector.x);
    moveCircle(game.thief,vector.x/length*speed*dt,vector.y/length*speed*dt,13);
    if(Math.floor(game.elapsed*5)!==Math.floor((game.elapsed-dt)*5))game.audio.play('step');
    if(sprint&&!game.sound)game.sound={x:game.thief.x,y:game.thief.y,radius:150,life:.16};
  }else game.thief.visibility=.76;
  const before=game.alarm.value;
  updateGuards(game.guards,game.thief,game.sound,dt);
  let seen=false,source='';
  for(const guard of game.guards){if(inSight(guard,game.thief)){seen=true;source=`GUARD ${guard.id+1}`;game.alarm.value+=TUNE.alarmSight*dt;}}
  updateCameras(game.cameras,game.thief,dt,game.alarm,camera=>{
    seen=true;source=camera.name;game.alarm.value+=TUNE.alarmCamera*dt;
    camera.lastKnown={x:game.thief.x,y:game.thief.y};
  });
  if(seen&&!game.senseWasActive)game.alarm.events++;
  if(seen&&before<65&&game.alarm.value>=65)game.audio.play('alarm');
  game.senseWasActive=seen;
  if(!seen)game.alarm.value=Math.max(0,game.alarm.value-TUNE.alarmDecay*dt);
  game.alarm.value=Math.min(100,game.alarm.value);
  if(game.alarm.value>=TUNE.caughtAt){game.caughtBy=source||'ALARM LOCKDOWN';game.state='caught';game.transitions.push('caught');}
  checkGetaway(game);
}
function publish(){
  window.__gameState={state:game.state,shot:game.shot,thief:{x:game.thief.x,y:game.thief.y},guards:game.guards.map(g=>({x:g.x,y:g.y,state:g.state,angle:g.angle,suspicion:g.suspicion})),guardCount:game.guards.length,
    cameras:game.cameras.map(c=>({x:c.x,y:c.y,angle:c.angle,loop:c.loop})),cameraCount:game.cameras.length,loot:{x:game.loot.x,y:game.loot.y,taken:game.loot.taken,value:game.loot.value},alarm:Math.round(game.alarm.value),alarmValue:game.alarm.value,alarmMeter:true,
    elapsed:game.elapsed,tools:{noise:game.tools.noise,noiseActive:game.tools.noiseActive},transitions:[...game.transitions],routeCount:3,exit:{x:exit.x,y:exit.y},caughtBy:game.caughtBy,shotReady:game.shotReady};
}
let previous=0,accumulator=0;
function frame(time){
  if(!previous)previous=time;accumulator=Math.min(.12,accumulator+(time-previous)/1000);previous=time;
  while(accumulator>=SIZE.step){update(SIZE.step);accumulator-=SIZE.step;}
  ctx.setTransform(canvas.width/SIZE.w,0,0,canvas.height/SIZE.h,0,0);draw(ctx,game);publish();
  if(game.shotReady)window.__shotReady=true;
  input.clearFrame();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
