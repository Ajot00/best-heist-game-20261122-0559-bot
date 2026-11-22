// Fixed-seed showcase poses; each URL gives a deliberate, repeatable argument.
export function stageShot(game, query, random) {
  const shot=query.get('shot');
  if(!shot) return false;
  game.shot=shot;game.elapsed=41;game.state='play';game.thief={x:550,y:420,angle:-.4,visibility:1};
  game.alarm.value=47;game.alarm.events=2;game.loot.taken=false;game.loot.opened=false;
  game.guards.forEach((guard,i)=>{
    const poses=[[352,248,.12],[914,424,2.8],[701,582,-2.1]];
    [guard.x,guard.y,guard.angle]=poses[i];guard.state='patrol';guard.suspicion=0;guard.lastKnown=null;
  });
  const trim=(random?.()??.5)*.02;
  game.cameras[0].angle=.38+trim;game.cameras[1].angle=2.76-trim;game.banner=0;
  if(shot==='play'){
    game.thief={x:760,y:355,angle:-2.1,visibility:.8};game.alarm.value=33;
    game.guards[0].x=370;game.guards[0].y=250;game.guards[0].angle=.12;
    game.guards[1].x=835;game.guards[1].y=405;game.guards[1].angle=3.05;
    game.guards[1].state='investigate';game.guards[1].suspicion=.51;game.guards[1].lastKnown={x:820,y:365};
    game.sound={x:820,y:365,radius:250};game.tools.noiseActive=.9;game.tools.noise=2;
    game.cameras[0].angle=.1;game.cameras[1].angle=2.9;
  } else if(shot==='alarm'){
    game.loot.taken=true;game.loot.opened=true;game.state='getaway';game.alarm.value=86;game.alarm.events=4;
    game.thief={x:670,y:263,angle:-1.4,visibility:.8};game.banner=5;
    game.guards.forEach((guard,i)=>{guard.state=i===0?'chase':'investigate';guard.tint=i===0?'#f04f51':'#f6a344';guard.marker=i===0?'!':'?';guard.lastKnown={x:670,y:263};guard.angle=Math.atan2(263-guard.y,670-guard.x);});
  } else if(shot==='getaway'){
    game.loot.taken=true;game.loot.opened=true;game.state='win';game.alarm.value=69;game.alarm.events=3;
    game.thief={x:1122,y:112,angle:-1.5,visibility:.7};
    game.transitions=['title','play','loot-taken','getaway','win'];
  }
  game.shotReady=true;
  return true;
}
