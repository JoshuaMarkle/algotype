import { setTextDisplay, updateTextDisplay } from './display.js';
import { startTimer } from './timer.js';
import { getRandomFunction } from './generator.js';

// Initial setup
let startTime;
let timerInterval;
let elapsedTime = { value: 0 };
const typingArea = document.getElementById('input-area');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartButton = document.getElementById('restart-button');
const textDisplay = document.getElementById('text-display');

let currentGamemode = 'algorithms';
let currentLanguage = 'python';
let currentText = "hello there";

export function getCurrentText() {
  return currentText;
}

export function getElaspedTime() {
  return elapsedTime.value;
}

function startTest() {
  if (startTime) return; // Prevent restarting the timer if it's already running
  startTime = new Date();
  timerInterval = startTimer(elapsedTime, timeDisplay, typingArea, { interval: timerInterval });
}

async function restartTest() {
  currentText = await getRandomFunction(currentGamemode, currentLanguage);
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  elapsedTime.value = 0;
  timerInterval = startTimer(elapsedTime, timeDisplay, typingArea, { interval: timerInterval })
  typingArea.contentEditable = 'true';
  typingArea.innerText = '';
  timeDisplay.textContent = '0';
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  setTextDisplay(textDisplay, currentText); // Set the initial display text
  typingArea.focus();
}

function switchLanguage(language) {
  currentLanguage = language;
  restartTest();
}

function switchGamemode(gamemode) {
  currentGamemode = gamemode;
  restartTest();
}

typingArea.addEventListener('input', () => {
  if (!timerInterval) startTest();
  updateTextDisplay(typingArea, textDisplay, currentText, timerInterval);
});

// // Keep the typing area always focused
// document.addEventListener('click', function() {
//   typingArea.focus();
// });

// document.addEventListener('keydown', function(event) {
//   // Check if the focus is not already on the typingArea
//   if (document.activeElement !== typingArea) {
//     typingArea.focus();
//   }
// });

// typingArea.addEventListener('keydown', function(event) {
//   if (event.key === 'Tab') {
//     event.preventDefault(); // Prevent focusing away from typingArea
//   }
// });

restartButton.addEventListener('click', () => switchLanguage(currentLanguage));

// === Navigation Buttons === //

// const algorithmsGamemode = document.getElementById('algorithms-gamemode');
// const wordsGamemode = document.getElementById('words-gamemode');

// algorithmsGamemode.addEventListener('click', () => switchGamemode("algorithms"));
// wordsGamemode.addEventListener('click', () => switchGamemode("words"));

// const pythonButton = document.getElementById('python-language');
// const cppButton = document.getElementById('cpp-language');
// const javascriptButton = document.getElementById('javascript-language');
// const csharpButton = document.getElementById('csharp-language');
// const cButton = document.getElementById('c-language');

// pythonButton.addEventListener('click', () =>  switchLanguage("python"));
// cppButton.addEventListener('click', () => switchLanguage("cpp"));
// javascriptButton.addEventListener('click', () => switchLanguage("javascript"));
// csharpButton.addEventListener('click', () => switchLanguage("csharp"));
// cButton.addEventListener('click', () => switchLanguage("c"));

export { timerInterval };

restartTest();