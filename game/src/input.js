// Keyboard and pointer state, with edge-triggered action helpers.
export function makeInput(canvas) {
  const held = new Set(), pressed = new Set();
  const pointer = { x: 640, y: 360, clicked: false };
  const keys = new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift',' ','e','q','f','r','p','enter']);
  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (keys.has(key)) event.preventDefault();
    if (!held.has(key)) pressed.add(key);
    held.add(key);
  });
  window.addEventListener('keyup', event => held.delete(event.key.toLowerCase()));
  const locate = event => {
    const box = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - box.left) * 1280 / box.width;
    pointer.y = (event.clientY - box.top) * 720 / box.height;
  };
  canvas.addEventListener('pointermove', locate);
  canvas.addEventListener('pointerdown', event => { locate(event); pointer.clicked = true; });
  return {
    down: (...names) => names.some(name => held.has(name)),
    take: (...names) => { const found = names.some(name => pressed.has(name)); names.forEach(name => pressed.delete(name)); return found; },
    vector: () => ({ x: Number(held.has('d') || held.has('arrowright')) - Number(held.has('a') || held.has('arrowleft')), y: Number(held.has('s') || held.has('arrowdown')) - Number(held.has('w') || held.has('arrowup')) }),
    pointer,
    clearFrame: () => { pressed.clear(); pointer.clicked = false; },
  };
}
