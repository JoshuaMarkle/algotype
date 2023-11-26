import { switchGamemode, switchLanguage, updateTimeAmount, updateWordCount } from "./main.js";
import { applyTheme } from "./theme.js";

let allCommandsData = []; // Global variable to store command data
let currentCommand = null; // Variable to store the selected main command

// List of functions for each command
const commandHandlers = {
    Gamemodes: function (subcommand) {
        switchGamemode(subcommand.toLowerCase());
    },
    Languages: function (subcommand) {
        switchLanguage(subcommand.toLowerCase());
    },
    Time: function (subcommand) {
        updateTimeAmount(parseInt(subcommand.split(" ")[0], 10));
    },
    Words: function (subcommand) {
        updateWordCount(parseInt(subcommand.split(" ")[0], 10));
    },
    Difficulty: function (subcommand) {
        console.log("Difficulty selected:", subcommand);
    },
    Themes: function (subcommand) {
        applyTheme(subcommand.toLowerCase());
    },
};

document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/commands.json")
        .then((response) => response.json())
        .then((data) => {
            allCommandsData = data; // Store the data in the global variable
            updateCommandButtons(); // Initial update
        })
        .catch((error) => console.error("Error fetching commands:", error));

    var commandInput = document.querySelector(".command-prompt-open input");
    var commandPromptOpen = document.querySelector(".command-prompt-open");
    var commandButtons = commandPromptOpen.querySelectorAll(".command-button");

    function updateCommandButtons() {
        const inputValue = commandInput.value.trim().toLowerCase();
        let filteredCommands = [];

        if (currentCommand) {
            // If a main command is selected, filter its subcommands
            const subcommands = allCommandsData.find(
                (cmd) => cmd.command === currentCommand
            ).subcommands;
            subcommands.forEach((subcommand) => {
                if (subcommand.toLowerCase().startsWith(inputValue)) {
                    filteredCommands.push(subcommand);
                }
            });
        } else {
            // Filter and format main commands based on input
            allCommandsData.forEach((commandObj) => {
                if (commandObj.command.toLowerCase().startsWith(inputValue)) {
                    filteredCommands.push(commandObj.command);
                }
            });
        }

        // Update buttons with formatted HTML
        commandButtons.forEach((button, index) => {
            if (index === 0) {
                button.innerHTML = `<span class="correct">${filteredCommands[index]}</span>`;
                button.style.display = "block";
            } else if (filteredCommands[index]) {
                const partMatched = filteredCommands[index].slice(0, inputValue.length);
                const partUnmatched = filteredCommands[index].slice(inputValue.length);
                button.innerHTML = `<span class="correct">${partMatched}</span><span>${partUnmatched}</span>`;
                button.style.display = "block";
            } else {
                button.innerHTML = "";
                button.style.display = "none";
            }
        });
    }

    commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const firstItemText = commandButtons[0].textContent.trim();

            if (currentCommand && commandHandlers[currentCommand]) {
                // Call the handler for the main command with the selected subcommand
                commandHandlers[currentCommand](firstItemText);
                commandPromptOpen.style.display = "none"; // Close the command prompt
                commandInput.value = ""; // Clear the input field
                currentCommand = null; // Reset the current command
            } else if (!currentCommand) {
                // Handle main command selection
                const firstCommandObj = allCommandsData.find(
                    (cmd) => cmd.command === firstItemText
                );
                if (firstCommandObj) {
                    currentCommand = firstItemText;
                    commandInput.value = ""; // Reset input field
                    updateCommandButtons();
                }
            } else {
                // Close the command prompt if no valid subcommand is found
                commandPromptOpen.style.display = "none";
                commandInput.value = "";
                currentCommand = null;
            }
        }
    });

    commandInput.addEventListener("input", updateCommandButtons);

    commandInput.addEventListener("focus", function () {
        currentCommand = null;
        commandPromptOpen.style.display = "flex";
        updateCommandButtons();
    });
});
