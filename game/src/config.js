// Central tuning and palette for the Sunspire gallery.
export const SIZE = { w: 1280, h: 720, step: 1 / 60 };
export const TUNE = {
  walk: 176, sneak: 94, sprint: 258, guard: 76, investigate: 104, chase: 122,
  sight: 330, cone: 0.92, suspicion: 0.34, suspicionFade: 0.19,
  hearing: 245, alarmSight: 13, alarmCamera: 10, alarmDecay: 2.5,
  noiseRadius: 430, noiseCost: 1, loopCost: 250, loopSeconds: 10,
  lootValue: 1200, lootAlarm: 29, caughtAt: 100, exitRadius: 54,
};
export const PALETTE = {
  void: '#080f19', floor: '#182636', floorAlt: '#1c2c3d', wall: '#344352',
  trim: '#71818b', cover: '#26394b', coverEdge: '#4c6272', shadow: '#101e2c',
  ink: '#e8eee9', muted: '#9cabb2', amber: '#f6a344', red: '#f04f51',
  gold: '#ffd65b', goldDeep: '#bd7624', teal: '#78d7ca', panel: '#101a27',
};
