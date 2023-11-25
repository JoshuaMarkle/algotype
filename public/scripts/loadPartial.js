const partialsToLoad = [
  { name: "command-prompt", containerId: "command-prompt-container" },
  { name: "navbar", containerId: "navbar-container" },
];

function loadPartial(partialName, containerId) {
  const url = `partials/${partialName}.html`;

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
        Array.from(container.querySelectorAll("script")).forEach((script) => {
          const newScript = document.createElement("script");
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
        });
      }
    })
    .catch((error) =>
      console.error(`Error loading partial '${partialName}':`, error)
    );
}

// Automatically load all defined partials
document.addEventListener("DOMContentLoaded", () => {
  partialsToLoad.forEach((partial) =>
    loadPartial(partial.name, partial.containerId)
  );
});
