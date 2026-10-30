
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// SCÈNE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 35, 90);

const camera = new THREE.PerspectiveCamera(
  65, window.innerWidth / window.innerHeight, 0.1, 150
);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// LUMIÈRE
scene.add(new THREE.HemisphereLight(0xffffff, 0x426044, 2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(15, 25, 10);
scene.add(sunlight);

// OCÉAN
const ocean = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshStandardMaterial({ color: 0x087eaa })
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -0.5;
scene.add(ocean);

// ÎLE
const islandShape = new THREE.Shape();
const points = 64;

for (let i = 0; i <= points; i++) {
  const angle = (i / points) * Math.PI * 2;
  const variation = 1 + 0.08 * Math.sin(angle * 5)
                     + 0.05 * Math.cos(angle * 7);
  const x = Math.cos(angle) * 19 * variation;
  const y = Math.sin(angle) * 16 * variation;

  if (i === 0) islandShape.moveTo(x, y);
  else islandShape.lineTo(x, y);
}

const island = new THREE.Mesh(
  new THREE.ShapeGeometry(islandShape),
  new THREE.MeshStandardMaterial({
    color: 0x75a64b,
    side: THREE.DoubleSide
  })
);

island.rotation.x = -Math.PI / 2;
island.position.y = 0;
scene.add(island);

// SABLE
const beach = new THREE.Mesh(
  new THREE.RingGeometry(17, 19, 64),
  new THREE.MeshStandardMaterial({
    color: 0xd9c18a,
    side: THREE.DoubleSide
  })
);
beach.rotation.x = -Math.PI / 2;
beach.position.y = 0.03;
scene.add(beach);

// ARBRES TROPICAUX
function createTree(x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 2, 7),
    new THREE.MeshStandardMaterial({ color: 0x79502c })
  );
  trunk.position.y = 1;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 7, 6),
    new THREE.MeshStandardMaterial({ color: 0x246b32 })
  );
  leaves.position.y = 2.4;
  tree.add(leaves);

  tree.position.set(x, 0, z);
  scene.add(tree);
}

for (let i = 0; i < 45; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 6 + Math.random() * 10;
  createTree(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius
  );
}

// ROCHERS
for (let i = 0; i < 15; i++) {
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.5 + Math.random()),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
  );

  rock.position.set(
    (Math.random() - 0.5) * 28,
    0.3,
    (Math.random() - 0.5) * 23
  );

  scene.add(rock);
}

// PERSONNAGE
const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.45, 1, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0x9b3d25 })
);
body.position.y = 1;
player.add(body);

scene.add(player);

// COMMANDES
const keys = {};
let gameStarted = false;

window.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

// BOUTONS TACTILES
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

// LANCEMENT
const playButton = document.getElementById("playButton");
const menu = document.getElementById("menu");
const statusText = document.getElementById("status");

playButton.addEventListener("click", () => {
  gameStarted = true;
  menu.style.display = "none";
  controls.style.display = "grid";
});

// CAMÉRA ET MOUVEMENT
camera.position.set(0, 7, 10);

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

    if (length > 0) {
      dx /= length;
      dz /= length;

      player.position.x += dx * 0.10;
      player.position.z += dz * 0.10;

      player.rotation.y = Math.atan2(dx, dz);
    }

    // Limites de l'île
    const distance = Math.hypot(
      player.position.x,
      player.position.z
    );

    if (distance > 17) {
      player.position.x *= 17 / distance;
      player.position.z *= 17 / distance;
    }

    // Caméra qui suit le personnage
    const targetCamera = new THREE.Vector3(
      player.position.x,
      player.position.y + 7,
      player.position.z + 10
    );

    camera.position.lerp(targetCamera, 0.08);
    camera.lookAt(
      player.position.x,
      player.position.y + 1,
      player.position.z
    );
  }

  renderer.render(scene, camera);
}

animate();

// ADAPTATION À L'ÉCRAN
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

