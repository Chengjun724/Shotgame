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

  group.traverse(c => { if (c.isMesh) c.castShadow = true; });

  // Spara gruppen som target (kollision testas mot alla barn)
  targets.push(group);
  return group;
}

// --- Mode ---
let movingMode = false;
const modeEl = document.getElementById('mode');

document.addEventListener('keydown', e => {
  if (e.code === 'KeyM') {
    movingMode = !movingMode;
    modeEl.textContent = movingMode ? 'Rörligt' : 'Statiskt';
  }
});

function randomPos() { return Math.random() * 44 - 22; }
function randomDir() {
  const a = Math.random() * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
}

function spawnAll() {
  for (let i = 0; i < 5; i++) makePerson(randomPos(), randomPos());
}

const PERSON_SPEED = 2.5;

function updatePersons(dt) {
  if (!movingMode) return;
  for (const p of targets) {
    if (!p.userData.dir) p.userData.dir = randomDir();

    const step = PERSON_SPEED * dt;
    const nx = p.position.x + p.userData.dir.x * step;
    const nz = p.position.z + p.userData.dir.z * step;

    const hitX = hasCollision(nx, p.position.z, 0.35);
    const hitZ = hasCollision(p.position.x, nz, 0.35);

    if (!hitX) p.position.x = nx;
    if (!hitZ) p.position.z = nz;

    if (hitX || hitZ || Math.random() < dt / 3) {
      p.userData.dir = randomDir();
    }

    const lookTarget = p.position.clone().add(p.userData.dir);
    p.lookAt(lookTarget);
  }
}

spawnAll();

// --- Kollision ---
// Förberäknade AABB för alla väggar/lådor (statiska objekt)
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

// --- Controls ---
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.object);

const blocker = document.getElementById('blocker');
blocker.addEventListener('click', () => controls.lock());
controls.addEventListener('lock',   () => blocker.classList.add('hidden'));
controls.addEventListener('unlock', () => blocker.classList.remove('hidden'));

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
  if (!controls.isLocked || e.button !== 0) return;

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

  updateBullets(dt);
  updatePersons(dt);

  if (targets.length === 0) spawnAll();

  // Vapen-pivot följer kameran
  weaponPivot.position.copy(camera.position);
  weaponPivot.quaternion.copy(camera.quaternion);

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

  // Recoyl (pistolen hoppar bakåt och återgår)
  if (recoil > 0) {
    gun.position.z = -0.42 + recoil;
    gun.rotation.x = -recoil * 1.5;
    recoil = THREE.MathUtils.lerp(recoil, 0, dt * 18);
    if (recoil < 0.001) recoil = 0;
  } else {
    gun.position.z = THREE.MathUtils.lerp(gun.position.z, -0.42, dt * 12);
    gun.rotation.x = THREE.MathUtils.lerp(gun.rotation.x, 0, dt * 12);
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
