
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// ==========================================
// SURVIVAL: RED ISLAND
// VERSION 4 - XXL OPEN WORLD
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 65, 180);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 250
);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// ==========================================
// LUMIERES
// ==========================================

scene.add(new THREE.HemisphereLight(0xffffff, 0x426044, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(30, 50, 20);
scene.add(sunlight);

// ==========================================
// OCEAN XXL
// ==========================================

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(300, 300),
  new THREE.MeshStandardMaterial({
    color: 0x087eaa,
    roughness: 0.4
  })
);

ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.5;
scene.add(ocean);

// ==========================================
// ILE XXL
// ==========================================

const islandShape = new THREE.Shape();

for (let i = 0; i <= 100; i++) {
  const angle = (i / 100) * Math.PI * 2;

  const variation =
    1 +
    0.08 * Math.sin(angle * 5) +
    0.05 * Math.cos(angle * 9) +
    0.025 * Math.sin(angle * 13);

  const x = Math.cos(angle) * 42 * variation;
  const z = Math.sin(angle) * 34 * variation;

  if (i === 0) islandShape.moveTo(x, z);
  else islandShape.lineTo(x, z);
}

const island = new THREE.Mesh(
  new THREE.ShapeGeometry(islandShape),
  new THREE.MeshStandardMaterial({
    color: 0x638f3d,
    side: THREE.DoubleSide
  })
);

island.rotation.x = -Math.PI / 2;
scene.add(island);

// ==========================================
// GRANDE PLAGE
// ==========================================

const beach = new THREE.Mesh(
  new THREE.RingGeometry(36, 42, 100),
  new THREE.MeshStandardMaterial({
    color: 0xd9bd83,
    side: THREE.DoubleSide
  })
);

beach.scale.z = 0.81;
beach.rotation.x = -Math.PI / 2;
beach.position.y = 0.03;
scene.add(beach);

// ==========================================
// OUTILS DE CREATION DU DECOR
// ==========================================

const random = (min, max) =>
  min + Math.random() * (max - min);

// Position aléatoire dans l'île
function randomIslandPosition(minRadius = 0, maxRadius = 0.82) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(random(minRadius * minRadius, maxRadius * maxRadius));

  return {
    x: Math.cos(angle) * radius * 40,
    z: Math.sin(angle) * radius * 32
  };
}

// ==========================================
// ARBRES TROPICAUX
// ==========================================

function createTree(x, z, scale = 1) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.32, 3, 7),
    new THREE.MeshStandardMaterial({ color: 0x79502c })
  );

  trunk.position.y = 1.5;
  tree.add(trunk);

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() > 0.5 ? 0x246b32 : 0x397c35
  });

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 8, 7),
    leafMaterial
  );

  leaves.position.y = 3.6;
  tree.add(leaves);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 7, 6),
    leafMaterial
  );

  crown.position.set(0.65, 4.1, 0);
  tree.add(crown);

  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);

  scene.add(tree);
}

// 110 arbres
for (let i = 0; i < 110; i++) {
  const p = randomIslandPosition(0.20, 0.78);

  if (Math.hypot(p.x, p.z) < 9) continue;

  createTree(
    p.x,
    p.z,
    random(0.75, 1.35)
  );
}

// ==========================================
// BUISSONS
// ==========================================

const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x326b2d
});

for (let i = 0; i < 65; i++) {
  const p = randomIslandPosition(0.12, 0.78);

  if (Math.hypot(p.x, p.z) < 5) continue;

  const bush = new THREE.Mesh(
    new THREE.DodecahedronGeometry(random(0.4, 0.9), 0),
    bushMaterial
  );

  bush.position.set(p.x, 0.45, p.z);
  bush.scale.y = 0.8;
  scene.add(bush);
}

// ==========================================
// ROCHERS
// ==========================================

for (let i = 0; i < 45; i++) {
  const p = randomIslandPosition(0.15, 0.85);

  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(random(0.5, 1.5), 0),
    new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 1
    })
  );

  rock.position.set(p.x, 0.4, p.z);
  rock.rotation.set(
    Math.random(),
    Math.random(),
    Math.random()
  );

  scene.add(rock);
}

// ==========================================
// COLLINES
// ==========================================

const hillMaterial = new THREE.MeshStandardMaterial({
  color: 0x547f36,
  roughness: 1
});

const hillPositions = [
  [-24, -12, 5, 3, 7],
  [25, -17, 7, 4, 8],
  [-22, 20, 6, 3, 7],
  [24, 18, 8, 4, 6],
  [5, -25, 9, 5, 8]
];

for (const [x, z, sx, sy, sz] of hillPositions) {
  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(1, 12, 9),
    hillMaterial
  );

  hill.position.set(x, sy * 0.45, z);
  hill.scale.set(sx, sy, sz);

  scene.add(hill);
}

// ==========================================
// PERSONNAGE
// ==========================================

const player = new THREE.Group();
scene.add(player);

// MATERIAUX
const skin = new THREE.MeshStandardMaterial({ color: 0xb97850 });
const shirt = new THREE.MeshStandardMaterial({ color: 0x455d45 });
const pants = new THREE.MeshStandardMaterial({ color: 0x343b43 });
const boots = new THREE.MeshStandardMaterial({ color: 0x29231e });
const backpackMaterial = new THREE.MeshStandardMaterial({ color: 0x75502e });
const hair = new THREE.MeshStandardMaterial({ color: 0x211a15 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
const eyeBlack = new THREE.MeshStandardMaterial({ color: 0x171717 });
const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x542c25 });

// TORSE
const torso = new THREE.Mesh(
  new THREE.BoxGeometry(0.85, 0.95, 0.48),
  shirt
);
torso.position.y = 1.75;
player.add(torso);

// COU
const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.13, 0.15, 0.22, 12),
  skin
);
neck.position.y = 2.25;
player.add(neck);

// TETE
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 20, 16),
  skin
);
head.position.y = 2.42;
player.add(head);

// YEUX, PUPILLES, SOURCILS ET OREILLES
for (const side of [-1, 1]) {
  const eye = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 10),
    eyeWhite
  );

  eye.position.set(side * 0.09, 2.46, 0.255);
  player.add(eye);

  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 12, 10),
    eyeBlack
  );

  pupil.position.set(side * 0.09, 2.46, 0.298);
  player.add(pupil);

  const eyebrow = new THREE.Mesh(
    new THREE.BoxGeometry(0.105, 0.025, 0.035),
    hair
  );

  eyebrow.position.set(side * 0.09, 2.535, 0.265);
  player.add(eyebrow);

  const ear = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 10),
    skin
  );

  ear.position.set(side * 0.275, 2.42, 0);
  player.add(ear);
}

// NEZ
const nose = new THREE.Mesh(
  new THREE.SphereGeometry(0.055, 12, 10),
  skin
);
nose.position.set(0, 2.385, 0.305);
player.add(nose);

// BOUCHE
const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.025, 0.035),
  mouthMaterial
);
mouth.position.set(0, 2.30, 0.275);
player.add(mouth);

// CHEVEUX
const hairMesh = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.29, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55
  ),
  hair
);
hairMesh.position.y = 2.48;
player.add(hairMesh);

// SAC A DOS
const backpack = new THREE.Mesh(
  new THREE.BoxGeometry(0.62, 0.75, 0.3),
  backpackMaterial
);
backpack.position.set(0, 1.85, -0.36);
player.add(backpack);

// BRETELLES
for (const side of [-1, 1]) {
  const strap = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.8, 0.08),
    backpackMaterial
  );

  strap.position.set(side * 0.27, 1.85, -0.12);
  strap.rotation.z = side * -0.12;
  player.add(strap);
}

// BRAS
const arms = [];

for (const side of [-1, 1]) {
  const armPivot = new THREE.Group();
  armPivot.position.set(side * 0.53, 2.08, 0);
  player.add(armPivot);

  const arm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.48, 4, 8),
    shirt
  );

  arm.position.y = -0.3;
  armPivot.add(arm);

  const hand = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 8),
    skin
  );

  hand.position.y = -0.64;
  armPivot.add(hand);

  arms.push(armPivot);
}

// JAMBES
const legs = [];

for (const side of [-1, 1]) {
  const legPivot = new THREE.Group();
  legPivot.position.set(side * 0.23, 1.3, 0);
  player.add(legPivot);

  const leg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.16, 0.48, 4, 8),
    pants
  );

  leg.position.y = -0.32;
  legPivot.add(leg);

  const boot = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.42),
    boots
  );

  boot.position.set(0, -0.68, 0.1);
  legPivot.add(boot);

  legs.push(legPivot);
}

// ==========================================
// COMMANDES
// ==========================================

const keys = {};
let gameStarted = false;
let walkingTime = 0;

window.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

// COMMANDES TACTILES
const controls = document.createElement("div");

controls.style.cssText = `
  position:fixed;
  bottom:25px;
  left:20px;
  z-index:10;
  display:none;
  grid-template-columns:55px 55px 55px;
  grid-template-rows:55px 55px;
  gap:5px;
`;

const buttons = [
  ["▲", "up", 1, 2],
  ["◀", "left", 2, 1],
  ["▼", "down", 2, 2],
  ["▶", "right", 2, 3]
];

buttons.forEach(([symbol, key, row, col]) => {
  const button = document.createElement("button");
  button.textContent = symbol;

  button.style.cssText = `
    grid-row:${row};
    grid-column:${col};
    background:#263b31;
    color:white;
    border:2px solid white;
    border-radius:12px;
    font-size:24px;
    touch-action:none;
  `;

  button.addEventListener("pointerdown", e => {
    e.preventDefault();
    keys[key] = true;
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach(event => {
    button.addEventListener(event, () => keys[key] = false);
  });

  controls.appendChild(button);
});

document.body.appendChild(controls);

// ==========================================
// INTERFACE DE SURVIE
// ==========================================

const playButton = document.getElementById("playButton");
const menu = document.getElementById("menu");
const survivalUI = document.getElementById("survivalUI");
const healthFill = document.getElementById("healthFill");

playButton.addEventListener("click", () => {
  gameStarted = true;
  menu.style.display = "none";
  controls.style.display = "grid";
  survivalUI.style.display = "block";
  healthFill.style.width = "100%";
});

// ==========================================
// CAMERA
// ==========================================

camera.position.set(0, 7, 10);

// ==========================================
// ANIMATION ET DEPLACEMENT
// ==========================================

function animate() {
  requestAnimationFrame(animate);

  if (gameStarted) {
    let dx = 0;
    let dz = 0;

    if (keys["arrowup"] || keys["w"] || keys["up"]) dz -= 1;
    if (keys["arrowdown"] || keys["s"] || keys["down"]) dz += 1;
    if (keys["arrowleft"] || keys["a"] || keys["left"]) dx -= 1;
    if (keys["arrowright"] || keys["d"] || keys["right"]) dx += 1;

    const length = Math.hypot(dx, dz);
    const moving = length > 0;

    if (moving) {
      dx /= length;
      dz /= length;

      const nextX = player.position.x + dx * 0.10;
      const nextZ = player.position.z + dz * 0.10;

      // LIMITES DE L'ILE XXL
      const islandDistance =
        (nextX * nextX) / (40 * 40) +
        (nextZ * nextZ) / (32 * 32);

      if (islandDistance < 0.82) {
        player.position.x = nextX;
        player.position.z = nextZ;
      }

      player.rotation.y = Math.atan2(dx, dz);

      walkingTime += 0.14;

      legs[0].rotation.x = Math.sin(walkingTime) * 0.65;
      legs[1].rotation.x = Math.sin(walkingTime + Math.PI) * 0.65;

      arms[0].rotation.x = Math.sin(walkingTime + Math.PI) * 0.45;
      arms[1].rotation.x = Math.sin(walkingTime) * 0.45;
    } else {
      legs.forEach(leg => leg.rotation.x *= 0.8);
      arms.forEach(arm => arm.rotation.x *= 0.8);
    }

    const targetCamera = new THREE.Vector3(
      player.position.x,
      player.position.y + 7,
      player.position.z + 10
    );

    camera.position.lerp(targetCamera, 0.08);

    camera.lookAt(
      player.position.x,
      player.position.y + 1.3,
      player.position.z
    );
  }

  renderer.render(scene, camera);
}

animate();

// ==========================================
// ADAPTATION ECRAN
// ==========================================

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
