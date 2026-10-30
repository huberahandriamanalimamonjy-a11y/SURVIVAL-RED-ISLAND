
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// ==========================================
// SURVIVAL: RED ISLAND
// VERSION 5 - MEGA ISLAND 2000
// Optimisation mobile
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 900, 3600);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 5000
);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
document.body.appendChild(renderer.domElement);

// ==========================================
// LUMIERES
// ==========================================

scene.add(new THREE.HemisphereLight(0xffffff, 0x426044, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(300, 500, 200);
scene.add(sunlight);

// ==========================================
// OCEAN
// ==========================================

const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(6000, 6000),
  new THREE.MeshStandardMaterial({
    color: 0x087eaa,
    roughness: 0.4
  })
);

ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -2;
scene.add(ocean);

// ==========================================
// ILE : ENVIRON 2000 x 1640
// ==========================================

const islandShape = new THREE.Shape();

for (let i = 0; i <= 160; i++) {
  const angle = (i / 160) * Math.PI * 2;

  const variation =
    1 +
    0.045 * Math.sin(angle * 5) +
    0.025 * Math.cos(angle * 9) +
    0.015 * Math.sin(angle * 17);

  const x = Math.cos(angle) * 1000 * variation;
  const z = Math.sin(angle) * 820 * variation;

  if (i === 0) islandShape.moveTo(x, z);
  else islandShape.lineTo(x, z);
}

const island = new THREE.Mesh(
  new THREE.ShapeGeometry(islandShape, 2),
  new THREE.MeshStandardMaterial({
    color: 0x638f3d,
    side: THREE.DoubleSide,
    roughness: 1
  })
);

island.rotation.x = -Math.PI / 2;
scene.add(island);

// ==========================================
// PLAGE
// ==========================================

const beach = new THREE.Mesh(
  new THREE.RingGeometry(850, 1000, 160),
  new THREE.MeshStandardMaterial({
    color: 0xd9bd83,
    side: THREE.DoubleSide,
    roughness: 1
  })
);

beach.scale.y = 0.82;
beach.rotation.x = -Math.PI / 2;
beach.position.y = 0.04;
scene.add(beach);

// ==========================================
// OUTILS ALEATOIRES
// ==========================================

const random = (min, max) =>
  min + Math.random() * (max - min);

function randomIslandPosition(minRadius = 0, maxRadius = 0.88) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(
    random(minRadius * minRadius, maxRadius * maxRadius)
  );

  return {
    x: Math.cos(angle) * radius * 930,
    z: Math.sin(angle) * radius * 760
  };
}

// ==========================================
// ARBRES TROPICAUX
// InstancedMesh pour limiter les appels graphiques
// ==========================================

const treeCount = 260;

const trunkGeometry = new THREE.CylinderGeometry(3, 5, 35, 7);
const leafGeometry = new THREE.SphereGeometry(22, 8, 7);

const trunkMaterial = new THREE.MeshStandardMaterial({
  color: 0x79502c
});

const leafMaterial = new THREE.MeshStandardMaterial({
  color: 0x286b32
});

const trunks = new THREE.InstancedMesh(
  trunkGeometry, trunkMaterial, treeCount
);

const leaves = new THREE.InstancedMesh(
  leafGeometry, leafMaterial, treeCount
);

const dummy = new THREE.Object3D();

for (let i = 0; i < treeCount; i++) {
  const p = randomIslandPosition(0.18, 0.86);
  const scale = random(0.75, 1.4);

  dummy.position.set(p.x, 18 * scale, p.z);
  dummy.rotation.y = random(0, Math.PI * 2);
  dummy.scale.setScalar(scale);
  dummy.updateMatrix();
  trunks.setMatrixAt(i, dummy.matrix);

  dummy.position.set(p.x, 48 * scale, p.z);
  dummy.scale.setScalar(scale);
  dummy.updateMatrix();
  leaves.setMatrixAt(i, dummy.matrix);
}

scene.add(trunks);
scene.add(leaves);

// ==========================================
// BUISSONS
// ==========================================

const bushCount = 140;

const bushGeometry = new THREE.DodecahedronGeometry(10, 0);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x326b2d
});

const bushes = new THREE.InstancedMesh(
  bushGeometry, bushMaterial, bushCount
);

for (let i = 0; i < bushCount; i++) {
  const p = randomIslandPosition(0.12, 0.88);
  const size = random(0.7, 1.8);

  dummy.position.set(p.x, 7, p.z);
  dummy.rotation.set(random(0, 1), random(0, 6), random(0, 1));
  dummy.scale.set(size, size * 0.7, size);
  dummy.updateMatrix();
  bushes.setMatrixAt(i, dummy.matrix);
}

scene.add(bushes);

// ==========================================
// ROCHERS
// ==========================================

const rockCount = 100;

const rockGeometry = new THREE.DodecahedronGeometry(13, 0);
const rockMaterial = new THREE.MeshStandardMaterial({
  color: 0x777777,
  roughness: 1
});

const rocks = new THREE.InstancedMesh(
  rockGeometry, rockMaterial, rockCount
);

for (let i = 0; i < rockCount; i++) {
  const p = randomIslandPosition(0.15, 0.9);
  const size = random(0.6, 2);

  dummy.position.set(p.x, 8, p.z);
  dummy.rotation.set(random(0, 2), random(0, 6), random(0, 2));
  dummy.scale.set(size, size * 0.7, size);
  dummy.updateMatrix();
  rocks.setMatrixAt(i, dummy.matrix);
}

scene.add(rocks);

// ==========================================
// COLLINES
// ==========================================

const hillMaterial = new THREE.MeshStandardMaterial({
  color: 0x547f36,
  roughness: 1
});

const hillPositions = [
  [-550, -250, 130, 65, 150],
  [520, -350, 170, 85, 190],
  [-480, 420, 150, 75, 160],
  [450, 390, 190, 90, 145],
  [100, -620, 210, 100, 170],
  [-180, 610, 180, 90, 160],
  [680, 80, 120, 65, 130],
  [-700, -60, 140, 70, 150]
];

for (const [x, z, sx, sy, sz] of hillPositions) {
  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(1, 16, 12),
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

const skin = new THREE.MeshStandardMaterial({ color: 0xb97850 });
const shirt = new THREE.MeshStandardMaterial({ color: 0x455d45 });
const pants = new THREE.MeshStandardMaterial({ color: 0x343b43 });
const boots = new THREE.MeshStandardMaterial({ color: 0x29231e });
const backpackMaterial = new THREE.MeshStandardMaterial({ color: 0x75502e });
const hair = new THREE.MeshStandardMaterial({ color: 0x211a15 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
const eyeBlack = new THREE.MeshStandardMaterial({ color: 0x171717 });
const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x542c25 });

// Torse
const torso = new THREE.Mesh(
  new THREE.BoxGeometry(0.85, 0.95, 0.48),
  shirt
);
torso.position.y = 1.75;
player.add(torso);

// Cou
const neck = new THREE.Mesh(
  new THREE.CylinderGeometry(0.13, 0.15, 0.22, 12),
  skin
);
neck.position.y = 2.25;
player.add(neck);

// Tete
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.28, 20, 16),
  skin
);
head.position.y = 2.42;
player.add(head);

// Yeux, sourcils et oreilles
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

// Nez
const nose = new THREE.Mesh(
  new THREE.SphereGeometry(0.055, 12, 10),
  skin
);
nose.position.set(0, 2.385, 0.305);
player.add(nose);

// Bouche
const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(0.12, 0.025, 0.035),
  mouthMaterial
);
mouth.position.set(0, 2.30, 0.275);
player.add(mouth);

// Cheveux
const hairMesh = new THREE.Mesh(
  new THREE.SphereGeometry(
    0.29, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55
  ),
  hair
);
hairMesh.position.y = 2.48;
player.add(hairMesh);

// Sac à dos
const backpack = new THREE.Mesh(
  new THREE.BoxGeometry(0.62, 0.75, 0.3),
  backpackMaterial
);
backpack.position.set(0, 1.85, -0.36);
player.add(backpack);

// Bretelles
for (const side of [-1, 1]) {
  const strap = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.8, 0.08),
    backpackMaterial
  );
  strap.position.set(side * 0.27, 1.85, -0.12);
  strap.rotation.z = side * -0.12;
  player.add(strap);
}

// Bras
const arms = [];

for (const side of [-1, 1]) {
  const pivot = new THREE.Group();
  pivot.position.set(side * 0.53, 2.08, 0);
  player.add(pivot);

  const arm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.48, 4, 8),
    shirt
  );
  arm.position.y = -0.3;
  pivot.add(arm);

  const hand = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 10, 8),
    skin
  );
  hand.position.y = -0.64;
  pivot.add(hand);

  arms.push(pivot);
}

// Jambes
const legs = [];

for (const side of [-1, 1]) {
  const pivot = new THREE.Group();
  pivot.position.set(side * 0.23, 1.3, 0);
  player.add(pivot);

  const leg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.16, 0.48, 4, 8),
    pants
  );
  leg.position.y = -0.32;
  pivot.add(leg);

  const boot = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.42),
    boots
  );
  boot.position.set(0, -0.68, 0.1);
  pivot.add(boot);

  legs.push(pivot);
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

// Commandes tactiles
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
    button.addEventListener(event, () => {
      keys[key] = false;
    });
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

      const nextX = player.position.x + dx * 0.75;
      const nextZ = player.position.z + dz * 0.75;

      // Limites de l'île
      const islandDistance =
        (nextX * nextX) / (950 * 950) +
        (nextZ * nextZ) / (780 * 780);

      if (islandDistance < 0.96) {
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
