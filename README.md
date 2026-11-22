# Sunspire Heist

A one-room museum stealth game built with canvas 2D and browser-native JavaScript.

Open `game/index.html` in a desktop browser. The title screen starts the game.
Move with WASD or the arrow keys; hold Shift to sneak and Space to sprint. Press
E at the plinth to take the idol, Q to throw a noise-maker, F to loop a camera,
P to pause, and R to restart. Clicking throws a noise-maker toward the pointer.

For the four deterministic staged frames, add `?shot=start|play|alarm|getaway&seed=1`
to the page URL. The image captures are scheduled for round 2.

Run the entry program with `MAKEFUN_OUTPUT_DIR=out node main.ts` after the
screenshots have been captured.
