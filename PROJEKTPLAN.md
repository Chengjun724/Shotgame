# Projektplan – Shotgame (3D FPS)

## Om projektet
Ett enkelt 3D first-person shooter-spel byggt med **Three.js + JavaScript** i VSCode.
Körs direkt i webbläsaren. Kod hanteras via GitHub.

**Teknikstack:** Three.js, Vite, JavaScript, VSCode, GitHub
**Fil:** `src/main.js` — all spellogik finns här

---

## VAD SOM ÄR KLART ✅

### Checkpoint 1 — KLAR (2026-05-13)
- [x] 3D-miljö: komplex karta med golv, tak, väggar, lådor, pelare
- [x] First-person kamera med mussikte (PointerLockControls)
- [x] Spelarrörelse WASD med kollisionsdetektering (AABB)
- [x] Hopp med gravitation (Mellanslag)
- [x] Synliga kulor som flyger och träffar objekt
- [x] Figurer (huvud, kropp, armar, ben) som mål
- [x] Poängräknare i HUD
- [x] Figurer respawnar på slumpmässiga platser
- [x] Rörelsesläge för figurer — [M] togglar AI-vandring
- [x] Pistol + armar synliga i first-person med rekyyl och mynningsflamma
- [x] Kollision för figurer mot väggar och lådor
- [x] Crosshair (siktet) i mitten av skärmen
- [x] Koden pushad till GitHub

---

## VAD SOM ÅTERSTÅR

### Checkpoint 2 — MÅL
Från projektbeskrivningen: *"fiender med enkel AI samt ett fungerande livsystem. Spelet ska kännas som en spelbar prototyp."*

- [ ] **Fiendens AI** — fiender rör sig aktivt mot spelaren (chase-beteende)
- [ ] **Livsystem** — spelaren har 100 HP, förlorar HP när fiende når spelaren
- [ ] **HP-display i HUD** — visa spelarens liv (t.ex. "❤ 100")
- [ ] **Skada-feedback** — skärmen blinkar rött när spelaren tar skada
- [ ] **Game over-skärm** — visas när HP når 0, med alternativ att starta om

### Slutmål — Slutpresentation
Från projektbeskrivningen: *"ett fungerande spel där alla grundfunktioner finns på plats"*

- [ ] **Vågrörelser** — svårigheten ökar per omgång (fler/snabbare fiender)
- [ ] **Överlevnadstid** — visa hur länge spelaren klarat sig
- [ ] **Poäng-sammanfattning** på game over-skärmen
- [ ] **Startmeny** — enkel skärm innan spelet börjar
- [ ] Buggfritt och spelbart från start till slut

---

## AVGRÄNSNINGAR (byggs INTE)
- Multiplayer
- Onlinefunktioner
- Avancerad AI
- Stora kartor
- Detaljerad grafik

---

## Kritisk fil
- `src/main.js` — all spelkod (rendering, rörelse, skjutning, AI, kollision)
- `index.html` — HUD-element läggs till här

## Nästa steg (Checkpoint 2)
1. Uppgradera `updatePersons()` i `main.js` — lägg till chase-logik mot `camera.position`
2. Lägg till `playerHP`, `takeDamage()` och skada-timer i `main.js`
3. Uppdatera HUD i `index.html` med HP-visning
4. Skapa game over-overlay i `index.html` med restart-knapp
