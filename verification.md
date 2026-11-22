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

## Round 3 — capture, browser verification, and kit check

### Capture and visual review

- Fixed the capture script to load `game/index.html` and probe both CDP hosts. Each
  shot was captured twice in separate browser targets at seed 1; raw PNG SHA-256
  values matched byte-for-byte:
  - `1-cover.jpg`: `79da9b5fe06f3b08a4d8e583d4ca9dcf44754e0bd257da338d7ce98d01dd42ad`
  - `2-routes.jpg`: `6ec1d9e540078611b0202ec166fa8cbeba079b5a52f54700d5618090973280d6`
  - `3-alarm.jpg`: `c7750173a4166fd6eba386341572ccff8200d02f68cb1bcf23db318d6cd0e1dc`
  - `4-getaway.jpg`: `b62a04561e8569bc62d15a377c16a85d259e42debb80bb21812a2c33fa749080`
- Staged JPEGs, all 1280×720: `1-cover.jpg` 82,159 bytes; `2-routes.jpg`
  93,361 bytes; `3-alarm.jpg` 90,520 bytes; `4-getaway.jpg` 53,422 bytes.
  Full images were visually inspected. Cover elements: thief YES; 3 guards with
  cones YES; 2 camera beams YES; gold loot YES; alarm meter YES. All five appear
  together in the cover frame.
- At approximately 300px wide, cover loot YES, cone YES, alarm meter YES. Per-shot
  thumbnail legibility (loot / cone / alarm): cover YES / YES / YES; routes YES /
  YES / YES; alarm YES / YES / YES; getaway YES (secured-loot text) / NO / NO.
  Getaway's dark overlay makes the cone and alarm bar too faint to identify at
  thumbnail size; this does not affect the cover checklist.

### Full verifier (V0–V3)

`node /home/hatch/workspace/makefun/best-heist-game-20261122-0559-prep/verifier/verify.mjs /home/hatch/workspace/makefun/best-heist-game-20261122-0559-bot`
passed all checks:

- **V0 PASS:** 14 game files/directories, 33,016 bytes; index 541 bytes; 4 valid
  JPEGs within size and dimension limits. No network-looking references; all 12
  JavaScript modules parse. Verifier's two main runs produced identical output
  trees; dossier 461,092 bytes.
- **V1 PASS:** title → play; all 4 fixed-seed shots ready with expected states,
  3 guards and 2 cameras each; zero console errors, failed requests, or external
  requests. Route A bot won with `title → play → loot-taken → getaway → win`,
  $1,200 loot, alarm 28.
- **V2 PASS:** cover state has thief, 3 guards, 2 cameras, loot, and alarm meter.
  Pixel checklist: 2,268 gold pixels in the loot region, 2,366 alarm-bar pixels,
  warm danger pixels in 5 grid cells; max dominant-color fraction across the 12
  density cells is 0.432 (below the 0.90 empty-cell limit). Play HUD state includes
  $1,200 loot, alarm 33, 2 noise charges, 41-second timer, and 3 guards.
- **V3 PASS:** 12 source modules; largest is 9,733 bytes.

### Independent build repeat and kit check

- `MAKEFUN_OUTPUT_DIR=out node main.ts` ran twice. Both output trees contained 18
  files and matched byte-for-byte; `dossier.json` is 461,092 bytes.
- Kit `check --repo` result: **5 passed, 1 failed, 16 skipped, 3 checked at
  submission**. Pass: `competition_open`, `snapshot`, `license_osi`, `entrypoint`,
  `repo_created_after_open`. Fail: `transcripts_present` (expected; no transcripts
  were bundled in this build-only round). Skipped: `prerequisites`, `strategy_note`,
  `committed_secret`, `transcripts_recorded`, `thinking_wellformed`,
  `thinking_in_window`, `thinking_committed`, `thinking_reproduces`,
  `thinking_on_task`, `thinking_turns`, `thinking_priced`, `thinking_revised`,
  `thinking_fresh`, `transcripts_run_record`, `thinking_own_work`, `repo_public`.
  Checked at submission: `repo_owner`, `source_bundle`, `duplicate_snapshot`.
  The kit reports that transcripts are required for readiness; submission was not
  attempted. Node is v24.22.1.

### Screenshot-only win-rate estimate

Estimated dev win rate: **82–88%**, from the four staged frames only and discounted
for the known ~8-point historical overestimate. The cover proves strong composition,
readable threats and HUD, the gold objective, and clear palette separation at full
size and the 300px thumbnail; the getaway thumbnail is substantially darker. This
estimate is visual only and is not a measured leaderboard result.
