# Shotgame – 3D First-Person Shooter

Ett webbläsarbaserat 3D-skjutspel byggt med Three.js och JavaScript. Körs direkt i webbläsaren utan installation.

---

## Kom igång

### Krav
- [Node.js](https://nodejs.org/) (version 18 eller nyare)
- En modern webbläsare (Chrome, Firefox, Edge)

### Starta spelet

```bash
# 1. Klona projektet
git clone https://github.com/Chengjun724/Shotgame.git
cd Shotgame

# 2. Installera beroenden
npm install

# 3. Starta utvecklingsservern
npm run dev
```

Öppna sedan **http://localhost:5173** i webbläsaren.

---

## Kontroller

| Knapp | Funktion |
|-------|----------|
| `Klick` | Lås musen / skjut |
| `W A S D` | Rörelse |
| `Mus` | Sikta |
| `Mellanslag` | Hoppa |
| `M` | Byt läge (statiska / rörliga figurer) |
| `Esc` | Pausa / lås upp musen |

---

## Funktioner

- 3D first-person kamera med mussikte
- Synlig pistol och armar i first-person
- Synliga kulor som flyger mot målet
- Humanoidfigurer som mål (huvud, kropp, armar, ben)
- Rörelsesläge — figurerna vandrar runt kartan
- Komplex karta med väggar, lådor, pelare och korridorer
- Kollisionsdetektering för spelare och figurer
- Hopp med gravitation
- Poängräknare i HUD

---

## Teknisk stack

| Verktyg | Syfte |
|---------|-------|
| [Three.js](https://threejs.org/) | 3D-rendering i webbläsaren |
| [Vite](https://vitejs.dev/) | Utvecklingsserver med hot reload |
| JavaScript (ES Modules) | Spellogik |
| GitHub | Versionshantering |

---

## Projektstruktur

```
Shotgame/
├── src/
│   └── main.js          # All spellogik (rendering, rörelse, AI, kollision)
├── index.html           # HTML-skal + HUD
├── package.json         # Beroenden och skript
├── PROJEKTPLAN.md       # Projektplan med checklistor
├── DOKUMENTATION.md     # Teknisk dokumentation på svenska
└── KRAVSPÅRNING.md      # Krav från projektbeskrivningen kopplat till kod
```

---

## Dokumentation

- **[DOKUMENTATION.md](DOKUMENTATION.md)** — enkel förklaring av hur spelet fungerar, skriven för klasskamrater
- **[PROJEKTPLAN.md](PROJEKTPLAN.md)** — vad som är klart och vad som återstår
- **[KRAVSPÅRNING.md](KRAVSPÅRNING.md)** — kopplar varje krav till kod

---

*Skolprojekt – Chengjun Yan, 2026*
