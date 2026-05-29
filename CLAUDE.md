# CLAUDE.md – Instruktioner för Claude

## Om projektet
Shotgame är ett 3D first-person shooter-spel byggt med Three.js + JavaScript i VSCode.
All spelkod finns i `src/main.js`. HUD finns i `index.html`.
Projektplan finns i `PROJEKTPLAN.md`. Dokumentation finns i `DOKUMENTATION.md`.
Kravspårning finns i `KRAVSPÅRNING.md`. Projektöversikt finns i `README.md`.

## Automatisk dokumentationsuppdatering

Efter att en ny funktion är färdigimplementerad och fungerar ska Claude uppdatera
`DOKUMENTATION.md` med ett nytt avsnitt som beskriver funktionen på ett enkelt sätt.

### När ska dokumentationen uppdateras?
Uppdatera när något av följande är klart:
- En ny spelfunktion är implementerad (t.ex. livsystem, fiende-AI, game over)
- En befintlig funktion är omskriven eller förbättrad på ett märkbart sätt
- En bugg är löst som var svår eller intressant

### Vad ska uppdateras?

1. **Nytt avsnitt** under "Hur fungerar X?" — förklara funktionen enkelt som om man
   förklarar för någon utan programmeringsbakgrund. Inkludera:
   - Vad funktionen gör i spelet
   - Hur den fungerar tekniskt (enkelt förklarat, gärna med ett litet kodexempel)
   - Eventuell utmaning eller lärdom kopplad till implementationen

2. **Lägg till i innehållsförteckningen** om det är ett nytt avsnitt.

3. **Uppdatera utmanings-tabellen** i avsnitt 11 om något nytt problem uppstod och löstes.

4. **Uppdatera reflektionerna** i avsnitt 12 vid större milstolpar
   (t.ex. när Checkpoint 2 är klar).

5. **Uppdatera PROJEKTPLAN.md** — markera avklarade punkter med [x].

6. **Uppdatera KRAVSPÅRNING.md** — ändra ⬜ till ✅ för varje krav som är klart,
   och fyll i var i koden det är implementerat (funktion + fil).

7. **Uppdatera README.md** — om nya kontroller, funktioner eller kommandon tillkommer
   ska de läggas till i rätt tabell eller lista.

### Meddela användaren när dokumenten är uppdaterade
Efter att alla dokument är uppdaterade ska Claude alltid skriva ett kort meddelande
till användaren i slutet av svaret, till exempel:

> Dokumentationen är nu uppdaterad — DOKUMENTATION.md, KRAVSPÅRNING.md, PROJEKTPLAN.md och README.md är alla synkade med det vi just implementerade.

Meddelandet ska vara kort (en mening), tydligt och alltid komma sist i svaret.

### Hur ska det skrivas?
- Enkelt och lättförståeligt svenska — inga tekniska termer utan förklaring
- Samma stil som resten av dokumentet
- Kortfattat men komplett — hellre tre tydliga meningar än tio otydliga
