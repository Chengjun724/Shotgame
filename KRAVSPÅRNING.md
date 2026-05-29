# Kravspårning – Shotgame

Det här dokumentet kopplar varje krav från projektbeskrivningen till var i koden det är implementerat.

---

## Checkpoint 1 – Krav och implementation

| # | Krav | Status | Var i koden |
|---|------|--------|-------------|
| 1 | 3D-miljö med golv, väggar och tak | ✅ Klar | `main.js` — funktionen `buildArena()`, BoxGeometry för alla väggar, CanvasTexture för golvet |
| 2 | First-person kamera | ✅ Klar | `main.js` — `PointerLockControls`, kamera på position `(0, 1.7, 0)` |
| 3 | Spelarrörelse (WASD) | ✅ Klar | `main.js` — tangenttryckning med `keydown`/`keyup`, `camera.getWorldDirection()` för riktning |
| 4 | Skjutmekanik | ✅ Klar | `main.js` — `spawnBullet()` skapar en CylinderGeometry, `updateBullets(dt)` flyttar dem varje frame |
| 5 | Synliga kulor | ✅ Klar | `main.js` — `CylinderGeometry` roterad 90° längs X-axeln, gul färg, `activeBullets[]` array |
| 6 | Humanoidfigurer som mål | ✅ Klar | `main.js` — `makePerson(x, z)` bygger huvud, hår, kropp, armar, ben med BoxGeometry |
| 7 | Kollisionsdetektering (kula → figur) | ✅ Klar | `main.js` — `Raycaster.intersectObjects(targets, true)` i `updateBullets()` |
| 8 | Kollisionsdetektering (spelare → väggar) | ✅ Klar | `main.js` — `hasCollision(x, z)` med AABB, axlar testas separat för väggsliding |
| 9 | Hopp med gravitation | ✅ Klar | `main.js` — `GRAVITY = -18`, `JUMP_FORCE = 7`, `velocityY` uppdateras varje frame |
| 10 | Vapensyn (pistol + armar) | ✅ Klar | `main.js` — separat `weaponScene`, renderas ovanpå världen med `clearDepth()`-trick |
| 11 | Poängräknare i HUD | ✅ Klar | `index.html` — `<span id="score">`, uppdateras i `main.js` via `document.getElementById('score')` |
| 12 | Figurer respawnar | ✅ Klar | `main.js` — `spawnAll()` anropas när `targets.length === 0` i animate-loopen |
| 13 | Rörelsesläge för figurer (M-tangent) | ✅ Klar | `main.js` — `movingMode` boolean, `updatePersons(dt)` med slumpmässig vandring och kollision |
| 14 | Crosshair (siktet) | ✅ Klar | `index.html` — CSS `::before` och `::after` på `#crosshair` |

---

## Checkpoint 2 – Krav och implementation

| # | Krav | Status | Var i koden |
|---|------|--------|-------------|
| 15 | Fiender rör sig mot spelaren (chase AI) | ⬜ Ej klar | Planeras i `updatePersons()` — jämför figur-position med `camera.position` |
| 16 | Livsystem — spelaren har HP | ⬜ Ej klar | Planeras som `playerHP = 100` i `main.js` |
| 17 | Spelaren tar skada när fiende är nära | ⬜ Ej klar | Planeras som `takeDamage()` funktion i `main.js` |
| 18 | HP-display i HUD | ⬜ Ej klar | Planeras i `index.html` — ny `<span id="hp">` |
| 19 | Skärmen blinkar rött vid skada | ⬜ Ej klar | Planeras som CSS-overlay med animation i `index.html` |
| 20 | Game over-skärm med omstart | ⬜ Ej klar | Planeras som ny `div#gameover` i `index.html` + logik i `main.js` |

---

## Slutmål – Krav och implementation

| # | Krav | Status | Var i koden |
|---|------|--------|-------------|
| 21 | Vågsystem med ökande svårighet | ⬜ Ej klar | Planeras som `wave`-variabel, fler/snabbare figurer per våg |
| 22 | Överlevnadstimer i HUD | ⬜ Ej klar | Planeras som `<span id="timer">` i `index.html` |
| 23 | Poäng-sammanfattning på game over | ⬜ Ej klar | Planeras i `#gameover`-overlay |
| 24 | Startmeny | ⬜ Ej klar | Planeras som ny startskärm i `index.html` |

---

## Tekniska krav (generella)

| Krav | Status | Var |
|------|--------|-----|
| Koden hanteras via GitHub | ✅ Klar | [github.com/Chengjun724/Shotgame](https://github.com/Chengjun724/Shotgame) |
| Spelet körs i webbläsaren utan plugin | ✅ Klar | Three.js + Vite, öppnas på localhost:5173 |
| Projektet dokumenterat | ✅ Klar | `DOKUMENTATION.md`, `PROJEKTPLAN.md`, `README.md` |

---

*Senast uppdaterad: 2026-05-29*
