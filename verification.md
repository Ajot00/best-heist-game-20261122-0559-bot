# Round 1 verification

## Baseline

The kit starter passed its mechanical checks: game tree 9 files/directories,
22,260 bytes; index 817 bytes; 3 screenshots within image caps; dossier 109,574
bytes. Its cover has no heist elements, so it fails the criterion-1 checklist.

## Current build

- PASS: `game/` has 14 files/directories and 33,016 bytes; `index.html` is 541 bytes.
- PASS: 12 JavaScript modules parse as ES modules.
- PASS: no network-looking references in the game modules or HTML.
- PASS: source contains all four staged shot names, readiness hook, and state hook.
- DEFERRED: screenshot count, image dimensions, per-image size, actual pixel checklist,
  thumbnail legibility, and visual review. The user explicitly scheduled image capture
  for round 2.
- BLOCKED: full `main.ts` double-run and dossier identity. `buildDossier` rejects an
  empty `screenshots/` directory (`screenshots/ holds no image: the first is the cover`).
  The game copy step runs before that rejection.
- BLOCKED: browser smoke and bot playthrough. Chrome exited before startup with
  `Hatch WebGL domain policy is required for browser startup`; no Chrome process was
  listening on port 9223. These need the environment's policy switches in round 2.

No screenshot or dossier placeholder was added. Round 2 must capture the four real
renders, then rerun the complete verifier, browser smoke, bot route, and double build.
