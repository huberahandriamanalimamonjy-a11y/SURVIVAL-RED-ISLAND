
import { SURVIVAL_KITS } from "./kits.js";

const menu = document.createElement("div");
menu.id = "kitMenu";

menu.innerHTML = `
  <h2>CHOISIS TON KIT</h2>
  <p>Prépare ton équipement avant de partir.</p>
  <div class="kit-grid" id="kitGrid"></div>
  <button id="confirmKit">CONFIRMER MON KIT</button>
  <button id="closeKit">RETOUR</button>
`;

document.body.appendChild(menu);

let selectedKit = SURVIVAL_KITS[0];

const grid = document.getElementById("kitGrid");

SURVIVAL_KITS.forEach((kit, index) => {
  const card = document.createElement("div");
  card.className = "kit-card";

  if (index === 0) card.classList.add("selected");

  card.innerHTML = `
    <h3>${kit.name}</h3>
    <p>${kit.items.join(" • ")}</p>
    <p><strong>Bonus :</strong> ${kit.bonus}</p>
    <button type="button">CHOISIR</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    selectedKit = kit;

    document.querySelectorAll(".kit-card").forEach(item => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
  });

  grid.appendChild(card);
});

document.getElementById("confirmKit").addEventListener("click", () => {
  localStorage.setItem("selectedSurvivalKit", selectedKit.id);
  menu.style.display = "none";

  const status = document.getElementById("status");
  if (status) {
    status.textContent = "Kit sélectionné : " + selectedKit.name;
  }
});

document.getElementById("closeKit").addEventListener("click", () => {
  menu.style.display = "none";
});

window.openKitMenu = () => {
  menu.style.display = "block";
};
