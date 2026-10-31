import { SURVIVAL_KITS } from "./kits.js";

const menu = document.createElement("div");
menu.id = "kitMenu";

menu.innerHTML = `
  <h2>CHOISIS TON KIT</h2>
  <p>Prépare ton équipement avant de survivre sur l'île.</p>
  <div class="kit-grid" id="kitGrid"></div>
  <button id="confirmKit">CONFIRMER MON KIT</button>
`;

document.body.appendChild(menu);

let selectedKit = SURVIVAL_KITS[0];

const grid = document.getElementById("kitGrid");

SURVIVAL_KITS.forEach(kit => {
  const card = document.createElement("div");
  card.className = "kit-card";

  card.innerHTML = `
    <h3>${kit.name}</h3>
    <p>${kit.items.join(" • ")}</p>
    <p>Bonus : ${kit.bonus}</p>
    <button type="button">CHOISIR</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    selectedKit = kit;

    document.querySelectorAll(".kit-card").forEach(c => {
      c.classList.remove("selected");
    });

    card.classList.add("selected");
  });

  grid.appendChild(card);
});

document.getElementById("confirmKit").addEventListener("click", () => {
  localStorage.setItem("selectedSurvivalKit", selectedKit.id);
  menu.style.display = "none";
  document.getElementById("playButton").click();
});

window.openKitMenu = () => {
  menu.style.display = "block";
};