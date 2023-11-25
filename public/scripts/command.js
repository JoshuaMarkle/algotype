import { focusOnTypingTest } from "./main.js";

const allCommands = [
  "Algorithms",
  "Words",
  "Python",
  "C",
  "C++",
  "C#",
  "JavaScript",
  "Command Prompt",
  "Themes",
  "Time",
  "More",
  // Add all other commands here
];

document.addEventListener("DOMContentLoaded", function () {
  var commandInput = document.querySelector(".command-prompt-open input");
  var commandPromptOpen = document.querySelector(".command-prompt-open");
  var commandButtons = commandPromptOpen.querySelectorAll(".command-button");
  const openCommandPromptButton = document.getElementById(
    "open-command-prompt"
  );

  function updateCommandButtons() {
    const inputValue = commandInput.value.trim().toLowerCase();

    if (inputValue === "") {
      // If input is empty or whitespace, use default commands
      commandButtons.forEach((button, index) => {
        button.innerHTML = allCommands[index]
          ? `<span>${allCommands[index]}</span>`
          : "";
        button.style.display = button.textContent ? "block" : "none";
      });
    } else {
      // Filter and format commands based on input
      const filteredCommands = allCommands.filter((command) =>
        command.toLowerCase().startsWith(inputValue)
      );

      // Update buttons with formatted HTML
      commandButtons.forEach((button, index) => {
        if (filteredCommands[index]) {
          const partMatched = filteredCommands[index].slice(
            0,
            inputValue.length
          );
          const partUnmatched = filteredCommands[index].slice(
            inputValue.length
          );
          button.innerHTML = `<span class="correct">${partMatched}</span><span>${partUnmatched}</span>`;
          button.style.display = "block";
        } else {
          button.innerHTML = "";
          button.style.display = "none";
        }
      });
    }
  }

  commandInput.addEventListener("input", updateCommandButtons);

  commandInput.addEventListener("focus", function () {
    commandPromptOpen.style.display = "flex";
    updateCommandButtons();
  });
});
