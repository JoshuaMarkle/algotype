const partialsToLoad = [
    { name: 'command-prompt', containerId: 'command-prompt-container' },
    { name: 'navbar', containerId: 'navbar-container' },
  ];
  
  function loadPartial(partialName, containerId) {
    const url = `partials/${partialName}.html`;
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = html;
        }
      })
      .catch(error => console.error(`Error loading partial '${partialName}':`, error));
  }
  
  // Automatically load all defined partials
  document.addEventListener('DOMContentLoaded', () => {
    partialsToLoad.forEach(partial => loadPartial(partial.name, partial.containerId));
  });
  