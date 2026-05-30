# Shotgame – Hur spelet skapades
### En enkel förklaring för klasskamrater

---

## Innehåll
1. Vad är spelet?
2. Vilka verktyg används?
3. Hur startades projektet?
4. Hur fungerar 3D-världen?
5. Hur rör sig spelaren?
6. Hur fungerar skjutningen?
7. Hur ser vapnet ut?
8. Hur är kartan byggd?
9. Hur fungerar figurerna?
10. Hur fungerar kollisionen?
11. Hur fungerar fiendernas AI (chase)?
12. Hur fungerar livsystemet och game over?
13. Lärdomar och utmaningar
14. Reflektioner

---

## 1. Vad är spelet?

Shotgame är ett enkelt 3D first-person shooter-spel som körs direkt i webbläsaren. Det betyder att man inte behöver ladda ner något — man bara öppnar en länk och spelar. Spelaren rör sig runt i en arena, siktar med musen och skjuter figurer som springer runt på kartan.

Spelet är byggt från grunden med kod. Det finns ingen färdig spelmall — varje funktion är skriven för hand.

---

## 2. Vilka verktyg används?

| Verktyg | Vad det är | Varför det valdes |
|---|---|---|
| **JavaScript** | Programmeringsspråk | Körs i webbläsaren, enkelt att starta med |
| **Three.js** | 3D-bibliotek | Hanterar all 3D-grafik utan att man behöver kunna avancerad matematik |
| **Vite** | Utvecklingsserver | Uppdaterar webbläsaren automatiskt när man sparar kod |
| **VSCode** | Kodredigerare | All kod skrivs här |
| **GitHub** | Versionshantering | Sparar koden i molnet, kan återgå till tidigare versioner |

**Från början planerades Unity** (ett populärt spelprogram), men det visade sig att Unity kräver en separat editor för att bygga scener — man kan inte göra allt i VSCode. Beslutet togs att byta till Three.js, som låter en skriva allt i kod utan extra program.

---

## 3. Hur startades projektet?

Det första steget var att koppla projektet till GitHub så att koden sparas säkert online.

```
git init                          ← Skapar ett git-projekt lokalt
git remote add origin [länk]      ← Kopplar till GitHub
git push -u origin main           ← Laddar upp koden
```

Sedan installerades de verktyg som behövs:
```
npm install three vite            ← Installerar Three.js och Vite
npm run dev                       ← Startar utvecklingsservern
```

**En utmaning som uppstod:** GitHub tillåter inte längre vanliga lösenord — man måste skapa något som kallas en *Personal Access Token* (en lång nyckelkod) för att kunna ladda upp kod. Detta var något som inte var känt i förväg och tog tid att lösa.

---

## 4. Hur fungerar 3D-världen?

Three.js bygger på tre grundpelare:

```
SCENE      → Den osynliga "behållaren" där alla 3D-objekt placeras
CAMERA     → Ögonen i spelet — bestämmer vad som syns och från vilken vinkel
RENDERER   → Ritar ut det kameran ser på skärmen, 60 gånger per sekund
```

Tänk dig scenen som en tom teaterscen, kameran som en kameraoperatör, och renderaren som en TV som visar vad kameran filmar.

Varje 3D-objekt i spelet (väggar, figurer, lådor) är en **Mesh** — en kombination av:
- **Geometry** — formen (t.ex. en kub eller sfär)
- **Material** — utseendet (t.ex. färg eller textur)

**Game loop — hjärtat i spelet:**
Spelet uppdateras konstant i en loop:
```javascript
function animate() {
    requestAnimationFrame(animate);   // Kör igen nästa frame
    // Uppdatera spelare, figurer, kulor...
    renderer.render(scene, camera);   // Rita ut scenen
}
```
Detta sker ~60 gånger per sekund. Varje uppdatering kallas en *frame*.

**Lärdom:** Det är viktigt att multiplicera all rörelse med `deltaTime` (tid sedan förra frame). Annars rör sig spelet dubbelt så fort på en snabb dator.

---

## 5. Hur rör sig spelaren?

Spelaren rör sig med **WASD** och siktar med musen. Detta hanteras av ett verktyg som heter `PointerLockControls` — det låser muspekaren inuti spelfönstret och omvandlar musrörelser till kamerarotation.

Rörelselogiken ser ungefär ut så här:
```javascript
// Hämta kamerans riktning
camera.getWorldDirection(forward);

// Beräkna förflyttning baserat på tangenttryckningar
if (W trycks) → flytta framåt
if (S trycks) → flytta bakåt
if (A trycks) → flytta vänster
if (D trycks) → flytta höger
```

**Hopp och gravitation:**
```javascript
if (Mellanslag trycks och spelaren är på marken) {
    velY = 7;         // Skjut uppåt
}
velY += -18 * dt;     // Gravitation drar ner
position.y += velY * dt;
```

**Utmaning:** I den första versionen var W och S omvända — W gick bakåt och S framåt. Problemet var ett fel tecken (`+` istället för `-`) i riktningsvektorn. Det är ett bra exempel på hur en liten bugg kan ge konstiga resultat som är svåra att förstå utan att testa noggrant.

---

## 6. Hur fungerar skjutningen?

Skjutningen fungerar i två delar:

**Del 1 — Synlig kula:**
När spelaren klickar skapas en liten gul cylinder (kulan) vid pistolmynningen. Den flyger framåt med hög hastighet längs kamerans riktning tills den träffar något.

```javascript
// Kulans rörelse varje frame:
kula.position += riktning * 40 * deltaTime
```

**Del 2 — Kollisionskontroll:**
Varje frame kontrolleras om kulan är nära ett objekt med hjälp av en `Raycaster` — en osynlig stråle som skjuts framför kulan:

```javascript
// Om strålen träffar en figur:
→ Öka poäng
→ Ta bort figuren
→ Ta bort kulan

// Om strålen träffar en vägg:
→ Ta bara bort kulan
```

**Lärdom:** Från början testades träff direkt från kameran (ingen synlig kula). Det fungerade tekniskt men kändes inte bra att spela — det fanns ingen feedback. Att lägga till synliga kulor gjorde spelet mycket roligare utan att kräva mycket extra kod.

---

## 7. Hur ser vapnet ut?

Pistolen och armen är byggda av enkla 3D-lådor (BoxGeometry) — ingen avancerad modell:

```
Pistolkropp  → en grå låda
Pipa         → en smalare mörkare låda
Grepp        → en brun låda (trä-färg)
Arm          → en hudfärgad låda
Ärm          → en blå låda (kläder)
```

**Teknisk utmaning — klippning:**
När pistolen renderades som en del av 3D-världen försvann den in i väggar när spelaren gick nära dem. Lösningen var att rendera vapnet i en *separat scen* och rensa djupbufferten mellan renderingarna:

```javascript
renderer.render(världsScen, kamera);    // Rita världen
renderer.clearDepth();                  // Rensa djupminnet
renderer.render(vapenScen, kamera);     // Rita vapnet OVANPÅ
```

Detta gör att pistolen alltid syns, oavsett vad som finns bakom den.

**Extra detaljer som lades till:**
- **Rekyl** — pistolen hoppar bakåt vid skott och återgår mjukt
- **Mynningsflamma** — en liten gul sfär blinkar till vid skott
- **Bob-animation** — pistolen gungar lite när spelaren går

---

## 8. Hur är kartan byggd?

Kartan består av enkla 3D-lådor placerade på specifika koordinater. En hjälpfunktion används för att slippa upprepa kod:

```javascript
function makeWall(bredd, höjd, djup, x, z) {
    // Skapa en låda med given storlek på given position
}

// Exempel:
makeWall(62, 8, 1.2,  0, -30);   // Norra ytterväggen
makeWall(10, 6, 1,    0, -6);    // Norra väggen i centralt torn
```

**Golvtextur:**
Istället för ett enkelt grått golv skapades ett rutigt mönster med hjälp av ett `<canvas>`-element i JavaScript — som en digital ritbok som genererar en textur automatiskt.

**Kartan innehåller:**
- 4 yttermurar
- Ett centralt torn med öppning söderut
- L-formade murar för skydd
- Korridorer i norr
- 10+ lådor i kluster
- 4 pelare
- 5 punktljuskällor med olika färger

**Utmaning:** Det var svårt att placera väggar rätt utan att se dem i realtid. Man fick starta servern, titta, ändra koordinater, spara, titta igen — många gånger. Ett riktigt 3D-program som Unity har ett visuellt verktyg för detta, men i kod gör man det "blint".

---

## 9. Hur fungerar figurerna?

Varje figur är en grupp av enkla lådor som sätts ihop till en människa:

```
Huvud   → liten kub + hårkub ovanpå
Kropp   → bredare kub (blå skjorta)
Armar   → två smala kuber på sidorna
Ben     → två kuber undertill (mörka byxor)
```

**Spawning (hur de dyker upp):**
Figurerna placeras på slumpmässiga platser i arenaen. När alla figurer är nedskjutna spawnas nya direkt:

```javascript
if (targets.length === 0) spawnAll();
```

**Rörelsesläge (AI):**
Spelaren kan trycka **M** för att aktivera ett läge där figurerna jagar spelaren aktivt. Se avsnitt 11 för hur det fungerar.

---

## 10. Hur fungerar kollisionen?

Kollision betyder att objekt inte kan gå igenom varandra. Metoden som används heter **AABB** (Axis-Aligned Bounding Box) — en osynlig rektangulär låda runt varje objekt.

```
[Spelaren]         [Vägg]
  ┌─────┐         ┌──────────┐
  │     │  →→→   │          │
  └─────┘         └──────────┘
  
Om spelarens låda överlappar väggens låda → stoppa rörelsen
```

**Axis-separation** — en viktig detalj:
X och Z-axeln testas separat. Det gör att spelaren kan *glida* längs en vägg istället för att fastna:

```javascript
// Testa rörelse i X-led
if (!kollision(nyX, nuvarandeZ)) flytta X

// Testa rörelse i Z-led  
if (!kollision(nuvarandeX, nyZ)) flytta Z
```

**Utmaning:** Den första versionen av kollisionen fick spelaren att fastna helt i hörn. Det tog ett tag att förstå att man måste testa axlarna separat. Detta är ett klassiskt problem i spelutveckling.

---

## 11. Hur fungerar fiendernas AI (chase)?

När spelaren trycker **M** aktiveras "Jaga"-läget. Då slutar figurerna stå stilla — istället springer varje figur direkt mot spelaren varje frame.

Logiken är enkel men effektiv:

```javascript
// Beräkna riktning från figuren mot spelaren
const dx = spelare.x - figur.x;
const dz = spelare.z - figur.z;
const avstånd = Math.sqrt(dx*dx + dz*dz);

// Normalisera (gör om till en riktning med längd 1)
const dirX = dx / avstånd;
const dirZ = dz / avstånd;

// Flytta figuren ett litet steg i den riktningen
figur.x += dirX * hastighet * deltaTime;
figur.z += dirZ * hastighet * deltaTime;
```

Figuren tittar också mot spelaren automatiskt med `lookAt()`, så den alltid "vänder ansiktet" mot dig.

**Väggar stoppar fienderna:**
Precis som spelaren använder figurerna AABB-kollision (se avsnitt 10). Om vägen till spelaren blockeras av en vägg stannar de — de är inte smarta nog att gå runt hinder.

**Lärdom:** Chase-AI lät avancerat men visade sig vara ett av de enklaste systemen att implementera. Det enda som krävs är en riktningsvektor och lite matematik. Det är ett bra exempel på hur spel-AI i grunden är enkel matematik, inte magi.

---

## 12. Hur fungerar livsystemet och game over?

Spelaren börjar med **100 HP** (hälsopoäng). Om en fiende i jaga-läge kommer tillräckligt nära tar spelaren skada.

**Skadelogik:**
```javascript
// Om fienden är inom 1.2 meter:
if (avstånd < 1.2 && avkylningstid <= 0) {
    spelaren.hp -= 10;
    avkylningstid = 1.0;  // vänta 1 sekund innan nästa träff
}
```

`avkylningstid` är viktigt — utan den hade spelaren tappat alla 100 HP på under en sekund eftersom spelet uppdateras 60 gånger per sekund.

**Skade-feedback (röd blink):**
När spelaren tar skada blinkar hela skärmen rött i en bråkdel av en sekund. Det är en CSS-animation som startas om varje gång skada sker:

```css
@keyframes flash {
    0%   { opacity: 1; }   /* Helt röd */
    100% { opacity: 0; }   /* Tonar bort */
}
```

**Game over:**
Om HP når 0 visas en svart skärm med texten "GAME OVER", antal träffar och en knapp för att starta om. Spelet stoppas och musen låses upp så spelaren kan klicka på knappen.

**HP visas i HUD:**
Längst upp till vänster på skärmen syns alltid ❤ och aktuella HP, uppdaterat i realtid.

---

## 13. Lärdomar och utmaningar

### Lärdomar

**Planering är viktigt:**
Bytet från Unity till Three.js tidigt i projektet var rätt beslut, men det hade sparats tid om teknikvalet gjorts från början. Det lönar sig att tänka igenom verktygen innan man börjar koda.

**Testa ofta och tidigt:**
Varje gång en ny funktion lades till testades den direkt. Det är mycket lättare att hitta en bugg i en liten ny bit kod än att leta i hela projektet efteråt.

**Små funktioner är bättre:**
Istället för att skriva all kod på ett ställe skapades hjälpfunktioner som `makeWall()` och `makePerson()`. Det gör koden lättare att läsa och ändra.

**DeltaTime är ett måste:**
Utan deltaTime rör sig spelet olika fort på olika datorer. Det är en liten sak som gör stor skillnad.

### Utmaningar

| Utmaning | Vad som hände | Hur det löstes |
|---|---|---|
| GitHub-autentisering | Vanligt lösenord fungerar inte | Skapade en Personal Access Token |
| W/S omvänt | Spelaren gick bakåt med W | Ändrade tecknet på riktningsvektorn |
| Pistolen klippte väggar | Vapnet försvann in i väggar | Separat renderingsscen med clearDepth |
| Spelaren fastnade i hörn | Kollisionen blockerade helt | Testade X och Z separat (axis-separation) |
| Kartbygge utan visuellt verktyg | Svårt att placera väggar rätt | Testa → justera koordinater → testa igen |
| Figurer gick genom väggar | Ingen kollision för figurer | Lade till AABB-check i updatePersons() |
| Skada varje frame | Utan tidsbegränsning tömdes HP på 0,1 sekund | Lade till `damageCooldown` — max en träff per sekund |
| CSS-animation startade inte om | `classList.add('active')` fungerade inte om klassen redan fanns | Tvingade reflow med `void element.offsetWidth` innan animationen återstartades |

---

## 14. Reflektioner

### Vad gick bra?

Det som fungerade allra bäst var beslutet att byta från Unity till Three.js. I början kändes det som ett steg bakåt — Unity är ju ett "riktigt" spelutvecklingsverktyg. Men i efterhand var det helt rätt val. Jag fick kontroll över varje del av spelet och förstod faktiskt vad som hände i koden, istället för att bara klicka runt i ett program utan att förstå hur det fungerade inuti.

Att spelet körs i webbläsaren var också en stor fördel. Det var enkelt att visa upp för andra — ingen installation, bara en länk.

Strukturen på koden höll sig hanterbar under hela Checkpoint 1. Genom att skapa hjälpfunktioner som `makeWall()` och `makePerson()` slapp jag upprepa samma kod om och om igen. Det gjorde det lättare när kartan skulle bli mer komplex.

---

### Vad var svårare än förväntat?

**3D-tänkandet** var en utmaning. I 2D vet man att X är höger och Y är uppåt. I 3D tillkommer Z-axeln, och det är lätt att blanda ihop riktningarna, särskilt när man bygger kartan utan ett visuellt verktyg. Många gånger hamnade väggar på fel ställe och det tog tid att räkna ut varför.

**Kollisionsdetektering** visade sig vara svårare än det verkade. Det räcker inte med att bara stoppa spelaren — man måste tänka på vad som händer i hörn, hur spelaren ska kunna glida längs väggar och hur figurerna ska reagera på hinder. Det tog flera försök innan det fungerade bra.

**Tid** var också en utmaning. Att lägga till en sak ledde ofta till att något annat gick sönder. T.ex. när figurerna fick kollision slutade de att röra sig normalt. Man lär sig snabbt att alltid testa efter varje ändring, inte bara i slutet.

---

### Vad skulle jag gjort annorlunda?

Om jag börjat om från noll hade jag:

1. **Valt verktyg tidigare** — spenderat mer tid på att undersöka Three.js kontra Unity innan projektet startade, istället för att byta mitt i.

2. **Byggt kartan i etapper** — börja med en helt tom karta och testa rörelse och kollision först, sedan lägga till detaljer. Nu byggdes en komplex karta tidigt, vilket gjorde det svårare att felsöka.

3. **Separerat koden i fler filer** — just nu finns all kod i en enda fil (`main.js`). Det fungerar för Checkpoint 1, men blir svårare att hålla ordning på när spelet växer. Jag hade delat upp koden i t.ex. `player.js`, `enemies.js` och `world.js`.

---

### Vad har jag lärt mig om mig själv som programmerare?

Jag märkte att jag lär mig bäst genom att **prova och se vad som händer** — inte genom att läsa dokumentation. Varje gång något gick fel förstod jag hur det fungerade mycket bättre än om det hade fungerat direkt.

Jag lärde mig också att det är okej att inte veta svaret direkt. Programmering handlar mycket om att bryta ner ett stort problem i små delar och lösa en del i taget. Kollisionsdetektering lät omöjligt i början, men när man bröt ner det i "testa X separat, testa Z separat" blev det plötsligt hanterbart.

En annan lärdom är att **versionshantering med GitHub är ovärderlig**. Det hände ett par gånger att något gick sönder efter en ändring. Att veta att koden var sparad på GitHub gjorde att man kunde experimentera friare utan rädsla att förstöra allt.

---

### Blickar framåt

Checkpoint 2 handlar om att göra spelet till en riktig spelupplevelse — fiender som jagar spelaren, ett livsystem och en game over-skärm. Det är roligare funktioner att bygga än t.ex. kollision, men också svårare eftersom det kräver att många system samarbetar samtidigt.

Slutmålet är ett spel som är spelbart från start till slut utan buggar. Det är en högre ribba än det låter — ett spel som *nästan* fungerar är inte tillräckligt. Men Checkpoint 1 har visat att det är möjligt att ta ett projekt från en helt tom mapp till något faktiskt spelbart, vilket känns som den viktigaste lärdomen hittills.
