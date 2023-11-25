import { setTextDisplay, updateTextDisplay } from "./display.js";
import { startTimer } from "./timer.js";
import { getRandomFunction } from "./generator.js";

// Typing test variables
const typingArea = document.getElementById("input-area");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const textDisplay = document.getElementById("text-display");
const restartButton = document.getElementById("restart-button");

// Timer variables
let startTime;
let timerInterval;
let elapsedTime = { value: 0 };

// Command prompt variables
const commandArea = document.getElementById("command-area");
const commandInput = document.querySelector(".command-prompt-open input");
const commandPromptOpen = document.querySelector(".command-prompt-open");
const commandPromptButton = document.getElementById("open-command-prompt");

// Focused inputbox state system
const States = {
    TYPING_TEST: "typingTest",
    COMMAND_PROMPT: "commandPrompt",
};
let currentState = States.TYPING_TEST;

// Default game settings
let currentGamemode = "algorithms";
let currentLanguage = "python";
let currentNumOfWords = 25;
let currentTimeAmount = 60;
let currentText = "Loading...";

// Buttons
restartButton.addEventListener("click", () => switchLanguage(currentLanguage));
commandPromptButton.addEventListener("click", () => focusOnCommandPrompt());

export function getCurrentText() {
    return currentText;
}

export function getElaspedTime() {
    return elapsedTime.value;
}

function startTest() {
    if (startTime) return; // If the test has started, don't start again
    startTime = new Date();
    timerInterval = startTimer(elapsedTime, timeDisplay, typingArea, {
        interval: timerInterval,
    });
}

async function restartTest() {
    // Search database for random text
    currentText = await getRandomFunction(currentGamemode, currentLanguage, currentNumOfWords);

    // Reset timer
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    elapsedTime.value = 0;
    timerInterval = startTimer(elapsedTime, timeDisplay, typingArea, {
        interval: timerInterval,
    });

    // Reset typing area
    typingArea.contentEditable = "true";
    typingArea.innerText = "";
    typingArea.focus();

    // Reset live displays
    timeDisplay.textContent = "0";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100";
    setTextDisplay(textDisplay, currentText); // Set the initial display text
}

// For every entered character, update the text display
typingArea.addEventListener("input", () => {
    if (!timerInterval) startTest();
    updateTextDisplay(typingArea, textDisplay, currentText, timerInterval);
});

// If the user clicks outside of the command prompt, focus on the typing test
document.addEventListener("click", function (event) {
    if (
        !commandInput.contains(event.target) &&
        !commandPromptOpen.contains(event.target) &&
        !commandPromptButton.contains(event.target)
    ) {
        commandPromptOpen.style.display = "none";
        focusOnTypingTest();
    }
});

// Focus on typing test and command prompt using tab and escape respectively
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (currentState === States.TYPING_TEST) {
            focusOnCommandPrompt();
        } else {
            focusOnTypingTest();
        }
    } else if (event.key === "Tab") {
        focusOnTypingTest();
        switchLanguage(currentLanguage);
    }
});

// Function to switch focus onto the main textbox
function focusOnTypingTest() {
    var commandPromptOpen = document.querySelector(".command-prompt-open");
    commandPromptOpen.style.display = "none";
    var commandInput = document.querySelector(".command-prompt-open input");
    commandInput.value = "";
    currentState = States.TYPING_TEST;
    typingArea.focus();
}

// Function to switch focus onto the command prompt
function focusOnCommandPrompt() {
    var commandPromptOpen = document.querySelector(".command-prompt-open");
    commandPromptOpen.style.display = "flex";
    currentState = States.COMMAND_PROMPT;
    commandArea.focus();
}

// NAVIGATION BUTTONS

const algorithmsGamemode = document.getElementById("algorithms-gamemode");
const wordsGamemode = document.getElementById("words-gamemode");

algorithmsGamemode.addEventListener("click", () => switchGamemode("algorithms"));
wordsGamemode.addEventListener("click", () => switchGamemode("words"));

const pythonButton = document.getElementById("python-language");
const cppButton = document.getElementById("cpp-language");
const javascriptButton = document.getElementById("javascript-language");
const csharpButton = document.getElementById("csharp-language");


pythonButton.addEventListener("click", () => switchLanguage("python"));
cppButton.addEventListener("click", () => switchLanguage("cpp"));
csharpButton.addEventListener("click", () => switchLanguage("csharp"));
javascriptButton.addEventListener("click", () => switchLanguage("javascript"));

// GAME SETTINGS FUNCTIONS

export function switchLanguage(language) {
    currentLanguage = language;
    restartTest();
}

export function switchGamemode(gamemode) {
    currentGamemode = gamemode;
    restartTest();
}

export function updateTimeAmount(timeAmount) {
    currentGamemode = "time";
    currentTimeAmount = timeAmount;
    restartTest();
}

export function updateWordCount(numOfWords) {
    currentGamemode = "words";
    currentNumOfWords = numOfWords;
    restartTest();
}

export { timerInterval, focusOnTypingTest };

restartTest();
