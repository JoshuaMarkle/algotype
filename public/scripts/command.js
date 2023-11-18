console.log("Hello from command.js!");
document.addEventListener("DOMContentLoaded", function () {
  var commandPromptOpen = document.querySelector(".command-prompt-open");
  var commandButtons = commandPromptOpen.querySelectorAll(".command-button");

  // Update all buttons to have the text "Hello Josh"
  commandButtons.forEach((button) => {
    button.textContent = "Hello Josh";
  });
});
