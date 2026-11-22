// Tiny procedural WebAudio cues; audio starts only after a user gesture.
export function makeAudio() {
  let context=null, alarmOsc=null, alarmGain=null;
  function ensure() {
    if (!context) { const Audio=window.AudioContext||window.webkitAudioContext; if (Audio) context=new Audio(); }
    if (context?.state==='suspended') context.resume();
  }
  function tone(freq,duration,wave='sine',volume=.07,delay=0) {
    ensure(); if (!context) return;
    const osc=context.createOscillator(), gain=context.createGain(), start=context.currentTime+delay;
    osc.type=wave; osc.frequency.setValueAtTime(freq,start); gain.gain.setValueAtTime(volume,start);
    gain.gain.exponentialRampToValueAtTime(.001,start+duration); osc.connect(gain); gain.connect(context.destination);
    osc.start(start); osc.stop(start+duration);
  }
  return {
    play(kind) {
      if (kind==='step') tone(95,.045,'triangle',.015);
      if (kind==='vault') { tone(180,.36,'square',.07); tone(74,.52,'sine',.08,.12); }
      if (kind==='alarm') { tone(660,.24,'sawtooth',.028); tone(510,.24,'sawtooth',.028,.26); }
      if (kind==='win') { tone(440,.28,'triangle',.06); tone(554,.34,'triangle',.06,.18); tone(659,.54,'triangle',.07,.36); }
    },
    setAlarm(level) {
      ensure(); if (!context) return;
      if (level<58) { if (alarmOsc) { alarmOsc.stop(); alarmOsc=null; } return; }
      if (!alarmOsc) { alarmOsc=context.createOscillator(); alarmGain=context.createGain(); alarmOsc.type='sine'; alarmGain.gain.value=0; alarmOsc.connect(alarmGain); alarmGain.connect(context.destination); alarmOsc.start(); }
      alarmOsc.frequency.setTargetAtTime(360+level*4,context.currentTime,.18);
      alarmGain.gain.setTargetAtTime(Math.min(.035,(level-52)/1300),context.currentTime,.25);
    },
  };
}
