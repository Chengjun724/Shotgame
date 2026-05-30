import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.autoClear = false; // vi hanterar clear manuellt för vapnet
document.body.appendChild(renderer.domElement);

// --- World scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.Fog(0x111111, 15, 55);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 1.7, 0);

// --- Weapon scene (renderas ovanpå, ignorerar djupbufferten) ---
const weaponScene = new THREE.Scene();
weaponScene.add(new THREE.AmbientLight(0xffffff, 0.9));
const weaponSun = new THREE.DirectionalLight(0xffffff, 1.2);
weaponSun.position.set(1, 2, 1);
weaponScene.add(weaponSun);

// Pivot som följer kameran varje frame
const weaponPivot = new THREE.Group();
weaponScene.add(weaponPivot);

// Vapen-grupp, offset från pivot (nedre högra hörnet av vyn)
const gun = new THREE.Group();
gun.position.set(0.22, -0.22, -0.42);
weaponPivot.add(gun);

const metalMat  = new THREE.MeshLambertMaterial({ color: 0x222222 });
const darkMat   = new THREE.MeshLambertMaterial({ color: 0x111111 });
const woodMat   = new THREE.MeshLambertMaterial({ color: 0x6b3a1f });
const skinMat   = new THREE.MeshLambertMaterial({ color: 0xd4956a });
const slideMat  = new THREE.MeshLambertMaterial({ color: 0x2d2d2d });

// Pistolkropp (slide)
const body = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.075, 0.26), slideMat);
gun.add(body);

// Pipa
const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.18), darkMat);
barrel.position.set(0, 0.022, -0.21);
gun.add(barrel);

// Mynning
const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.034, 0.04), metalMat);
muzzle.position.set(0, 0.022, -0.31);
gun.add(muzzle);

// Greppram (frame)
const frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.055, 0.2), metalMat);
frame.position.set(0, -0.065, -0.03);
gun.add(frame);

// Grepp (trä)
const grip = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.11, 0.075), woodMat);
grip.position.set(0, -0.125, 0.065);
grip.rotation.x = 0.18;
gun.add(grip);

// Triggerbygel
const guard = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.04, 0.07), metalMat);
guard.position.set(0, -0.105, -0.005);
gun.add(guard);

// Arm (underarm)
const arm = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.068, 0.38), skinMat);
arm.position.set(0, -0.13, 0.2);
gun.add(arm);

// Ärm (kläder)
const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.074, 0.074, 0.22), new THREE.MeshLambertMaterial({ color: 0x3a5a8a }));
sleeve.position.set(0, -0.13, 0.32);
gun.add(sleeve);

// Magasin (sitter i greppet, animeras ut vid laddning)
const magazine = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.13, 0.038), metalMat);
magazine.position.set(0, -0.155, 0.062);
gun.add(magazine);

// Magasinets botten (synlig detalj)
const magBase = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.012, 0.042), darkMat);
magBase.position.set(0, -0.222, 0.062);
gun.add(magBase);

// Mynningsflamma (gömd tills man skjuter)
const flashMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
const muzzleFlash = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), flashMat);
muzzleFlash.position.set(0, 0.022, -0.34);
muzzleFlash.visible = false;
gun.add(muzzleFlash);

// --- World lighting ---
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

function addLight(x, y, z, color = 0xffffff, intensity = 1.2) {
  const l = new THREE.PointLight(color, intensity, 28);
  l.position.set(x, y, z);
  l.castShadow = true;
  scene.add(l);
}
addLight(0,   7,  0,  0xfff5e0, 1.5);   // center
addLight(-20, 7, -20, 0xffe0c0, 1.0);   // NV
addLight( 20, 7, -20, 0xffe0c0, 1.0);   // NÖ
addLight(-20, 7,  20, 0xc0d0ff, 1.0);   // SV
addLight( 20, 7,  20, 0xc0d0ff, 1.0);   // SÖ

// --- Arena ---

// Rutigt golv via canvas-textur
function makeCheckerTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    ctx.fillStyle = (i + j) % 2 === 0 ? '#4a4a4a' : '#333333';
    ctx.fillRect(i * 16, j * 16, 16, 16);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(12, 12);
  return t;
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshLambertMaterial({ map: makeCheckerTexture() })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Tak
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshLambertMaterial({ color: 0x222222, side: THREE.BackSide })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 8;
scene.add(ceiling);

const concreteMat = new THREE.MeshLambertMaterial({ color: 0x777777 });
const brickMat    = new THREE.MeshLambertMaterial({ color: 0x7a5230 });
const crateMat    = new THREE.MeshLambertMaterial({ color: 0x9b7a2e });
const darkCrateMat = new THREE.MeshLambertMaterial({ color: 0x6b5520 });

const walls = [];

function makeWall(w, h, d, x, z, mat = concreteMat) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, h / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  walls.push(mesh);
  return mesh;
}

function makeCrate(w, h, d, x, y, z) {
  const mat = Math.random() > 0.5 ? crateMat : darkCrateMat;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  walls.push(mesh); // kulor studsar på lådor
}

// Yttermurar
makeWall(62, 8, 1.2,  0, -30);
makeWall(62, 8, 1.2,  0,  30);
makeWall(1.2, 8, 60, -30,  0);
makeWall(1.2, 8, 60,  30,  0);

// Centralt torn (fyrkant med öppning mot söder)
makeWall(10, 6, 1,  0, -6, brickMat);   // norr
makeWall(1, 6, 7, -5, -3, brickMat);    // väster
makeWall(1, 6, 7,  5, -3, brickMat);    // öster
// söder: öppen (ingen vägg)

// Norr: två parallella korridorsväggar
makeWall(1, 5, 12, -10, -18, concreteMat);
makeWall(1, 5, 12,  10, -18, concreteMat);
makeWall(8, 5, 1,  -18, -14, concreteMat);
makeWall(8, 5, 1,   18, -14, concreteMat);

// Väster: L-formad mur
makeWall(10, 5, 1, -18,  5, brickMat);
makeWall(1, 5, 8, -23, 9, brickMat);

// Öster: L-formad mur (speglad)
makeWall(10, 5, 1,  18, -5, brickMat);
makeWall(1, 5, 8,  23, -9, brickMat);

// Söder: mittmur med gap
makeWall(10, 5, 1, -14, 18, concreteMat);
makeWall(10, 5, 1,  14, 18, concreteMat);

// Extra täckväggar
makeWall(6, 4, 1, 0, 14, concreteMat);
makeWall(1, 4, 6, -20, 0, concreteMat);
makeWall(1, 4, 6,  20, 0, concreteMat);

// Lådor (NV-kluster)
makeCrate(1.5, 1.5, 1.5, -20, 0.75, -22);
makeCrate(1.5, 1.5, 1.5, -21.5, 0.75, -22);
makeCrate(1.5, 1.5, 1.5, -20, 2.25, -22);

// Lådor (NÖ-kluster)
makeCrate(2, 2, 2,  22, 1, -20);
makeCrate(1.2, 1.2, 1.2,  22, 2.2, -20);
makeCrate(2, 1.2, 2, 24, 0.6, -22);

// Lådor (mitten-öster)
makeCrate(1.5, 1.5, 1.5, 18, 0.75, 3);
makeCrate(1.5, 1.5, 1.5, 18, 0.75, 5);

// Lådor (söder)
makeCrate(2, 2, 2, -5, 1, 22);
makeCrate(1.5, 1.5, 1.5, -7, 0.75, 22);
makeCrate(2, 1, 2,  8, 0.5, 24);

// Pelare (fyra stycken runt tornets utsida)
makeWall(1.5, 6, 1.5, -12, -8, brickMat);
makeWall(1.5, 6, 1.5,  12, -8, brickMat);
makeWall(1.5, 4, 1.5, -12,  4, concreteMat);
makeWall(1.5, 4, 1.5,  12,  4, concreteMat);

// --- Kollision ---
const wallBoxes = walls.map(w => new THREE.Box3().setFromObject(w));

function hasCollision(x, z, halfW = 0.4) {
  const box = new THREE.Box3(
    new THREE.Vector3(x - halfW, 0.05, z - halfW),
    new THREE.Vector3(x + halfW, 2.2,  z + halfW)
  );
  for (const wb of wallBoxes) {
    if (box.intersectsBox(wb)) return true;
  }
  return false;
}

function randomValidPos() {
  for (let i = 0; i < 50; i++) {
    const x = randomPos();
    const z = randomPos();
    if (!hasCollision(x, z, 0.6)) return { x, z };
  }
  return { x: 0, z: 10 }; // fallback
}

const targets = [];

function makePerson(x, z) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  scene.add(group);

  const skin   = new THREE.MeshLambertMaterial({ color: 0xf4c28a });
  const shirt  = new THREE.MeshLambertMaterial({ color: 0x2255cc });
  const pants  = new THREE.MeshLambertMaterial({ color: 0x222244 });
  const hair   = new THREE.MeshLambertMaterial({ color: 0x221100 });

  // Huvud
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.45), skin);
  head.position.y = 1.75;
  group.add(head);

  // Hår
  const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.15, 0.47), hair);
  hairTop.position.y = 2.08;
  group.add(hairTop);

  // Kropp
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.3), shirt);
  body.position.y = 1.15;
  group.add(body);

  // Vänster arm
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), shirt);
  armL.position.set(-0.37, 1.12, 0);
  group.add(armL);

  // Höger arm
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), shirt);
  armR.position.set(0.37, 1.12, 0);
  group.add(armR);

  // Vänster ben
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), pants);
  legL.position.set(-0.15, 0.45, 0);
  group.add(legL);

  // Höger ben
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.22), pants);
  legR.position.set(0.15, 0.45, 0);
  group.add(legR);

  // Vapen i höger hand
  const eGunMat  = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const eBarrMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  const eGun = new THREE.Group();
  eGun.position.set(0.42, 1.05, -0.1);
  const eGunBody = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.22), eGunMat);
  eGun.add(eGunBody);
  const eGunBarrel = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.034, 0.14), eBarrMat);
  eGunBarrel.position.z = -0.18;
  eGun.add(eGunBarrel);
  const eFlash = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0xffdd44 })
  );
  eFlash.position.z = -0.26;
  eFlash.visible = false;
  eGun.add(eFlash);
  group.userData.gunFlash = eFlash;
  group.add(eGun);

  group.traverse(c => { if (c.isMesh) c.castShadow = true; });

  targets.push(group);
  return group;
}

// --- Livsystem ---
let playerHP = 100;
let damageCooldown = 0;
let gameOver = false;
const hpEl         = document.getElementById('hp');
const damageFlash  = document.getElementById('damage-flash');
const gameoverEl   = document.getElementById('gameover');
const finalScoreEl = document.getElementById('final-score');

function takeDamage(amount) {
  if (gameOver) return;
  playerHP = Math.max(0, playerHP - amount);
  hpEl.textContent = playerHP;

  // Starta om animationen varje gång
  damageFlash.classList.remove('active');
  void damageFlash.offsetWidth;
  damageFlash.classList.add('active');

  if (playerHP <= 0) {
    gameOver = true;
    finalScoreEl.textContent = score;
    finalTimeEl.textContent  = formatTime(survivalTime);
    gameoverEl.classList.remove('hidden');
    document.getElementById('hud').style.display = 'none';
    document.getElementById('bottom-right').style.display = 'none';
    timerEl.style.display = 'none';
    controls.unlock();
  }
}

// --- Mode ---
let movingMode = false;
const modeEl = document.getElementById('mode');

document.addEventListener('keydown', e => {
  if (e.code === 'KeyM') {
    movingMode = !movingMode;
    modeEl.textContent = movingMode ? 'Jaga' : 'Statiskt';
  }
});

function randomPos() { return Math.random() * 44 - 22; }


const PERSON_SPEED = 2.5;
const DAMAGE_RANGE = 1.2;
const MAX_ENEMIES  = 3;
let spawnTimer = 0;

// Vinklar fienden provar i ordning när den kör fast
const STEER_OPTS = [0, 65, -65, 105, -105, 145, -145];

function updatePersons(dt) {
  if (!movingMode || gameOver) return;
  if (damageCooldown > 0) damageCooldown -= dt;

  for (const p of targets) {
    const dx = camera.position.x - p.position.x;
    const dz = camera.position.z - p.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < DAMAGE_RANGE) {
      if (damageCooldown <= 0) { takeDamage(10); damageCooldown = 1.0; }
      continue;
    }

    // Initiera state
    if (p.userData.steerOffset === undefined) {
      p.userData.steerOffset  = 0;
      p.userData.steerTime    = 0;
      p.userData.steerIdx     = 0;
      p.userData.progressTimer = 0;
      p.userData.lastDist     = dist;
    }

    if (p.userData.steerTime > 0) {
      p.userData.steerTime -= dt;
    } else {
      p.userData.steerOffset = 0;
    }

    // Kolla progress var 0.5s — har fienden kommit närmre?
    p.userData.progressTimer += dt;
    if (p.userData.progressTimer >= 0.5) {
      if (dist < p.userData.lastDist - 0.3) {
        // Bra framsteg — återställ till direkt riktning
        p.userData.steerIdx    = 0;
        p.userData.steerOffset = 0;
        p.userData.steerTime   = 0;
      } else {
        // Ingen framsteg — prova nästa vinkel i listan
        p.userData.steerIdx = (p.userData.steerIdx + 1) % STEER_OPTS.length;
        p.userData.steerOffset = STEER_OPTS[p.userData.steerIdx];
        p.userData.steerTime   = 0.6;
      }
      p.userData.lastDist      = dist;
      p.userData.progressTimer = 0;
    }

    // Beräkna rörelseriktning med steering-offset
    const baseAngle  = Math.atan2(dx, dz);
    const steerAngle = baseAngle + p.userData.steerOffset * Math.PI / 180;
    const dirX = Math.sin(steerAngle);
    const dirZ = Math.cos(steerAngle);

    const step = PERSON_SPEED * dt;
    const nx = p.position.x + dirX * step;
    const nz = p.position.z + dirZ * step;

    const hitX = hasCollision(nx, p.position.z, 0.35);
    const hitZ = hasCollision(p.position.x, nz, 0.35);

    if (!hitX) p.position.x = nx;
    if (!hitZ) p.position.z = nz;

    // Helt blockerad på nuvarande vinkel — byt direkt till nästa
    if (hitX && hitZ) {
      p.userData.steerIdx    = (p.userData.steerIdx + 1) % STEER_OPTS.length;
      p.userData.steerOffset = STEER_OPTS[p.userData.steerIdx];
      p.userData.steerTime   = 0.6;
    }

    p.lookAt(camera.position.x, p.position.y, camera.position.z);

    if (p.userData.shootTimer === undefined) p.userData.shootTimer = Math.random() * ENEMY_SHOOT_INTERVAL;
    p.userData.shootTimer -= dt;
    if (p.userData.shootTimer <= 0 && dist > DAMAGE_RANGE && dist < 30) {
      spawnEnemyBullet(p);
      p.userData.shootTimer = ENEMY_SHOOT_INTERVAL;
    }
  }
}

// --- Controls ---
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.object);

const blocker    = document.getElementById('blocker');
const startMenu  = document.getElementById('start-menu');
const pauseMenu  = document.getElementById('pause-menu');

const timerEl    = document.getElementById('timer');
const finalTimeEl = document.getElementById('final-time');

let gameStarted   = false;
let survivalTime  = 0;

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

// Börja om-knapp — stoppa bubblingen så att blocker inte triggas
document.getElementById('restart-btn').addEventListener('click', e => {
  e.stopPropagation();
});

// Klick var som helst på blocker (inkl. startknappen) startar/återupptar spelet
blocker.addEventListener('click', () => {
  if (!gameOver) controls.lock();
});

controls.addEventListener('lock', () => {
  gameStarted = true;
  blocker.classList.add('hidden');
});

controls.addEventListener('unlock', () => {
  if (gameOver) return;
  // Visa pausmeny (inte startmeny) efter att spelet startat
  startMenu.classList.add('hidden');
  pauseMenu.classList.remove('hidden');
  blocker.classList.remove('hidden');
});

// --- Movement ---
const keys = {};
document.addEventListener('keydown', e => { keys[e.code] = true; });
document.addEventListener('keyup',   e => { keys[e.code] = false; });

const SPEED = 6;
const GRAVITY = -18;
const JUMP_FORCE = 7;
const GROUND_Y = 1.7;
let velY = 0;
let onGround = true;

// --- Shooting ---
const raycaster = new THREE.Raycaster();
let score = 0;
const scoreEl = document.getElementById('score');

let recoil = 0;
let flashTimer = 0;

// Ammo
const MAX_AMMO = 12;
let ammo = MAX_AMMO;
let reloading = false;
let reloadTimer = 0;
const RELOAD_TIME = 1.5;
const ammoEl      = document.getElementById('ammo');
const ammoDisplay = document.getElementById('ammo-display');

function reload() {
  if (reloading || ammo === MAX_AMMO) return;
  reloading = true;
  reloadTimer = RELOAD_TIME;
  ammoEl.textContent = 'Laddar...';
  ammoDisplay.classList.add('reloading');
}

document.addEventListener('keydown', e => {
  if (e.code === 'KeyR' && controls.isLocked && !gameOver) reload();
});

// Bullets
const BULLET_SPEED = 40;
const BULLET_MAX_DIST = 60;
const bulletGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 6);
bulletGeo.rotateX(Math.PI / 2); // peka framåt längs Z
const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffee44 });
const activeBullets = []; // { mesh, dir, dist }

function spawnBullet() {
  const mesh = new THREE.Mesh(bulletGeo, bulletMat);

  // Starta vid mynningen i världsrymden
  const muzzleWorld = new THREE.Vector3();
  muzzleFlash.getWorldPosition(muzzleWorld);
  mesh.position.copy(muzzleWorld);

  // Riktning = kamerans framåt-vektor
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  mesh.quaternion.copy(camera.quaternion);

  scene.add(mesh);
  activeBullets.push({ mesh, dir, dist: 0 });
}

document.addEventListener('mousedown', e => {
  if (!controls.isLocked || e.button !== 0 || gameOver || reloading || ammo <= 0) return;

  ammo--;
  ammoEl.textContent = ammo;
  if (ammo === 0) reload();

  recoil = 0.06;
  muzzleFlash.visible = true;
  flashTimer = 0.07;
  spawnBullet();
});

function updateBullets(dt) {
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const b = activeBullets[i];
    const step = BULLET_SPEED * dt;
    b.mesh.position.addScaledVector(b.dir, step);
    b.dist += step;

    // Kollision
    raycaster.set(b.mesh.position, b.dir);
    raycaster.near = 0;
    raycaster.far = step + 0.2;
    const hits = raycaster.intersectObjects([...walls, ...targets], true);

    let remove = b.dist > BULLET_MAX_DIST;

    if (hits.length > 0) {
      const hit = hits[0];
      const person = targets.find(g => g === hit.object || g === hit.object.parent);
      if (person) {
        score++;
        scoreEl.textContent = score;
        person.traverse(c => { if (c.isMesh) { c.material = c.material.clone(); c.material.color.set(0xffaa00); } });
        setTimeout(() => scene.remove(person), 200);
        targets.splice(targets.indexOf(person), 1);
      }
      remove = true;
    }

    if (remove) {
      scene.remove(b.mesh);
      activeBullets.splice(i, 1);
    }
  }
}

// --- Fiendens skott ---
const ENEMY_SHOOT_INTERVAL = 2.0;
const ENEMY_BULLET_SPEED   = 18;
const ENEMY_BULLET_MAX_DIST = 65;
const enemyBulletGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.2, 6);
enemyBulletGeo.rotateX(Math.PI / 2);
const enemyBulletMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
const activeEnemyBullets = [];

function spawnEnemyBullet(person) {
  const mesh = new THREE.Mesh(enemyBulletGeo, enemyBulletMat);
  mesh.position.set(person.position.x, 1.4, person.position.z);

  const dir = new THREE.Vector3(
    camera.position.x - person.position.x,
    camera.position.y - 1.4,
    camera.position.z - person.position.z
  ).normalize();

  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
  scene.add(mesh);
  activeEnemyBullets.push({ mesh, dir, dist: 0 });

  if (person.userData.gunFlash) {
    person.userData.gunFlash.visible = true;
    setTimeout(() => { if (person.userData.gunFlash) person.userData.gunFlash.visible = false; }, 80);
  }
}

function updateEnemyBullets(dt) {
  for (let i = activeEnemyBullets.length - 1; i >= 0; i--) {
    const b = activeEnemyBullets[i];
    const oldPos = b.mesh.position.clone();

    b.mesh.position.addScaledVector(b.dir, ENEMY_BULLET_SPEED * dt);
    b.dist += ENEMY_BULLET_SPEED * dt;

    let remove = b.dist > ENEMY_BULLET_MAX_DIST;

    if (!remove) {
      // Swept check: närmaste punkt på rörelselinjen till kameran
      const step = new THREE.Vector3().subVectors(b.mesh.position, oldPos);
      const toCamera = new THREE.Vector3().subVectors(camera.position, oldPos);
      const t = THREE.MathUtils.clamp(toCamera.dot(step) / step.lengthSq(), 0, 1);
      const closest = oldPos.clone().addScaledVector(step, t);
      if (closest.distanceTo(camera.position) < 0.55) {
        takeDamage(15);
        remove = true;
      }
    }

    if (!remove && hasCollision(b.mesh.position.x, b.mesh.position.z, 0.1)) {
      remove = true;
    }

    if (remove) {
      scene.remove(b.mesh);
      activeEnemyBullets.splice(i, 1);
    }
  }
}

// --- Animation state ---
const clock = new THREE.Clock();
let bobTime = 0;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Rörelse
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

  let moving = false;
  if (controls.isLocked) {
    const disp = new THREE.Vector3();
    if (keys['KeyW'] || keys['ArrowUp'])    { disp.addScaledVector(forward,  SPEED * dt); moving = true; }
    if (keys['KeyS'] || keys['ArrowDown'])  { disp.addScaledVector(forward, -SPEED * dt); moving = true; }
    if (keys['KeyD'] || keys['ArrowRight']) { disp.addScaledVector(right,    SPEED * dt); moving = true; }
    if (keys['KeyA'] || keys['ArrowLeft'])  { disp.addScaledVector(right,   -SPEED * dt); moving = true; }

    // Försök röra sig på X och Z separat → kan glida längs väggar
    if (!hasCollision(camera.position.x + disp.x, camera.position.z))
      camera.position.x += disp.x;
    if (!hasCollision(camera.position.x, camera.position.z + disp.z))
      camera.position.z += disp.z;

    // Hopp
    if (keys['Space'] && onGround) {
      velY = JUMP_FORCE;
      onGround = false;
    }

    // Gravitation
    velY += GRAVITY * dt;
    camera.position.y += velY * dt;

    // Marklandning
    if (camera.position.y <= GROUND_Y) {
      camera.position.y = GROUND_Y;
      velY = 0;
      onGround = true;
    }

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -29, 29);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -29, 29);
  }

  // Laddning
  if (reloading) {
    reloadTimer -= dt;
    if (reloadTimer <= 0) {
      ammo = MAX_AMMO;
      reloading = false;
      ammoEl.textContent = ammo;
      ammoDisplay.classList.remove('reloading');
    }
  }

  updateBullets(dt);
  updateEnemyBullets(dt);
  updatePersons(dt);

  if (!gameOver && targets.length < MAX_ENEMIES) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      const pos = randomValidPos();
      makePerson(pos.x, pos.z);
      spawnTimer = 3.0; // vänta 3s innan nästa spawn
    }
  }

  // Timer — räknar bara när spelet är igång och inte game over
  if (gameStarted && controls.isLocked && !gameOver) {
    survivalTime += dt;
    timerEl.textContent = formatTime(survivalTime);
  }

  // Vapen-pivot följer kameran
  weaponPivot.position.copy(camera.position);
  weaponPivot.quaternion.copy(camera.quaternion);

  if (reloading) {
    const progress = 1 - (reloadTimer / RELOAD_TIME); // 0 → 1

    if (progress < 0.30) {
      // Fas 1: vapnet vinklas mot spelaren så magasinbrunnen syns
      const t = progress / 0.30;
      gun.position.y = THREE.MathUtils.lerp(-0.22, -0.32, t);
      gun.position.x = THREE.MathUtils.lerp( 0.22,  0.26, t);
      gun.rotation.x = THREE.MathUtils.lerp( 0,     1.15, t); // tippar greppet mot kameran
      gun.rotation.z = THREE.MathUtils.lerp( 0,    -0.30, t);
      // Magasin börjar åka ut
      magazine.position.y = THREE.MathUtils.lerp(-0.155, -0.155, t);
      magBase.position.y  = THREE.MathUtils.lerp(-0.222, -0.222, t);
    } else if (progress < 0.52) {
      // Fas 2: magasinet åker ut nedåt
      const t = (progress - 0.30) / 0.22;
      gun.position.y = -0.32; gun.position.x = 0.26;
      gun.rotation.x = 1.15;  gun.rotation.z = -0.30;
      magazine.position.y = THREE.MathUtils.lerp(-0.155, -0.38, t);
      magBase.position.y  = THREE.MathUtils.lerp(-0.222, -0.45, t);
    } else if (progress < 0.72) {
      // Fas 3: nytt magasin åker in
      const t = (progress - 0.52) / 0.20;
      gun.position.y = -0.32; gun.position.x = 0.26;
      gun.rotation.x = 1.15;  gun.rotation.z = -0.30;
      magazine.position.y = THREE.MathUtils.lerp(-0.38,  -0.155, t);
      magBase.position.y  = THREE.MathUtils.lerp(-0.45,  -0.222, t);
    } else {
      // Fas 4: vapnet åker tillbaka till startläget
      const t = (progress - 0.72) / 0.28;
      gun.position.y = THREE.MathUtils.lerp(-0.32, -0.22, t);
      gun.position.x = THREE.MathUtils.lerp( 0.26,  0.22, t);
      gun.rotation.x = THREE.MathUtils.lerp( 1.15,  0,    t);
      gun.rotation.z = THREE.MathUtils.lerp(-0.30,  0,    t);
      magazine.position.y = -0.155;
      magBase.position.y  = -0.222;
    }
    gun.position.z = -0.42;
  } else {
    // Bob när man går
    if (moving && controls.isLocked) {
      bobTime += dt * 8;
      gun.position.y = -0.22 + Math.sin(bobTime) * 0.012;
      gun.rotation.z = Math.sin(bobTime * 0.5) * 0.018;
    } else {
      bobTime = 0;
      gun.position.y = THREE.MathUtils.lerp(gun.position.y, -0.22, dt * 8);
      gun.rotation.z = THREE.MathUtils.lerp(gun.rotation.z, 0, dt * 8);
    }

    // Rekyl
    if (recoil > 0) {
      gun.position.z = -0.42 + recoil;
      gun.rotation.x = -recoil * 1.5;
      recoil = THREE.MathUtils.lerp(recoil, 0, dt * 18);
      if (recoil < 0.001) recoil = 0;
    } else {
      gun.position.z = THREE.MathUtils.lerp(gun.position.z, -0.42, dt * 12);
      gun.rotation.x = THREE.MathUtils.lerp(gun.rotation.x, 0, dt * 12);
    }
  }

  // Mynningsflamma
  if (flashTimer > 0) {
    flashTimer -= dt;
    if (flashTimer <= 0) muzzleFlash.visible = false;
  }

  // Render: värld → rensa djup → vapen (alltid synlig ovanpå)
  renderer.clear();
  renderer.render(scene, camera);
  renderer.clearDepth();
  renderer.render(weaponScene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
