// Idol ownership, vault opening, alarm spike, and exit condition.
import { TUNE } from './config.js';
import { vault, exit, distance } from './world.js';
export function createLoot() { return { x:vault.x,y:vault.y,value:TUNE.lootValue,taken:false,opened:false }; }
export function takeIdol(game) {
  if (game.loot.taken || distance(game.thief,game.loot)>62) return false;
  game.loot.taken=true; game.loot.opened=true; game.alarm.value=Math.min(93,game.alarm.value+TUNE.lootAlarm);
  game.state='getaway'; game.banner=2.6; game.transitions.push('loot-taken','getaway');
  game.audio?.play('vault'); return true;
}
export function atExit(thief) { return distance(thief,exit)<TUNE.exitRadius; }
export function checkGetaway(game) {
  if (game.state==='getaway' && atExit(game.thief)) { game.state='win'; game.transitions.push('win'); game.audio?.play('win'); return true; }
  return false;
}
