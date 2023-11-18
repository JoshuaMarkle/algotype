const allCommands = [
    "Algorithms", "Language", "Time", "Themes", "More"
    // Add all other commands here
  ];
  
  document.addEventListener('DOMContentLoaded', function() {
    var commandInput = document.querySelector('.command-prompt input');
    var commandPromptOpen = document.querySelector('.command-prompt-open');
    var commandButtons = commandPromptOpen.querySelectorAll('.command-button');
  
    function updateCommandButtons(filter) {
      // Filter and sort commands based on the input
      const filteredCommands = allCommands.filter(cmd => cmd.toLowerCase().includes(filter.toLowerCase()));
      
      // Update button texts and functionalities
      commandButtons.forEach((button, index) => {
        if (index < filteredCommands.length) {
          button.textContent = filteredCommands[index];
          button.style.display = 'block';
          // You can also add event listeners or data attributes here based on the command
        } else {
          button.style.display = 'none';
        }
      });
    }
  
    commandInput.addEventListener('input', function() {
      updateCommandButtons(commandInput.value);
    });
  
    commandInput.addEventListener('focus', function() {
      commandPromptOpen.style.display = 'flex';
      updateCommandButtons(commandInput.value);
    });
  
    document.addEventListener('click', function(event) {
      if (!commandInput.contains(event.target) && !commandPromptOpen.contains(event.target)) {
        commandPromptOpen.style.display = 'none';
      }
    });
  });
  