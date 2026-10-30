const playButton = document.getElementById("playButton");
const statusText = document.getElementById("status");

playButton.addEventListener("click", () => {
  statusText.textContent = "Chargement de la nouvelle partie...";

  playButton.textContent = "CHARGEMENT...";
  playButton.disabled = true;

  setTimeout(() => {
    statusText.textContent =
      "Bienvenue sur RED ISLAND. L'aventure commence bientôt !";

    playButton.textContent = "PARTIE EN PRÉPARATION";
  }, 1500);
});
