import { SURVIVAL_MISSIONS } from "./missions.js";

const menu = document.createElement("div");
menu.id = "missionMenu";

menu.innerHTML = `
  <h2>📜 MISSIONS DE SURVIE</h2>
  <p style="text-align:center">
    Accomplis les objectifs pour gagner des récompenses.
  </p>
  <div id="missionList"></div>
  <button id="closeMissions">RETOURNER AU MENU</button>
`;

document.body.appendChild(menu);

const missionList = document.getElementById("missionList");

SURVIVAL_MISSIONS.forEach(mission => {
  const card = document.createElement("div");
  card.className = "mission-card";

  card.innerHTML = `
    <h3>${mission.title}</h3>
    <p>${mission.description}</p>
    <p><strong>Objectif :</strong> ${mission.objective}</p>
    <p><strong>Récompense :</strong> ${mission.reward} points</p>
    <p class="mission-progress">Statut : À accomplir</p>
  `;

  missionList.appendChild(card);
});

document.getElementById("closeMissions").addEventListener("click", () => {
  menu.style.display = "none";
});

window.openMissionMenu = () => {
  menu.style.display = "block";
};