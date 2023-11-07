import { setTextDisplay, updateTextDisplay } from './display.js';
import { startTimer } from './timer.js';
import { calculateWPM } from './utils.js';
import { getRandomFunction } from './generator.js';

// Initial setup
let startTime;
let timerInterval;
let elapsedTime = { value: 0 };
const typingArea = document.getElementById('input-area');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resetButton = document.getElementById('reset-button');
const textDisplay = document.getElementById('text-display');

let currentText = getRandomFunction();

export function getCurrentText() {
  return currentText;
}

function startTest() {
  if (startTime) return; // Prevent restarting the timer if it's already running
  startTime = new Date();
  timerInterval = startTimer(elapsedTime, timeDisplay, typingArea, { interval: timerInterval });
}

function resetTest() {
  currentText = getRandomFunction();
  clearInterval(timerInterval);
  timerInterval = null;
  startTime = null;
  elapsedTime.value = 0;
  typingArea.contentEditable = 'true';
  typingArea.innerText = '';
  timeDisplay.textContent = '0';
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  setTextDisplay(textDisplay, currentText); // Set the initial display text
  typingArea.focus();
}

typingArea.addEventListener('input', () => {
  if (!timerInterval) startTest();
  updateTextDisplay(typingArea, textDisplay, currentText, timerInterval);
  calculateWPM(elapsedTime, typingArea, textDisplay, wpmDisplay, accuracyDisplay);
});

// Keep the typing area always focused
document.addEventListener('click', function() {
  typingArea.focus();
});

document.addEventListener('keydown', function(event) {
  // Check if the focus is not already on the typingArea
  if (document.activeElement !== typingArea) {
    typingArea.focus();
  }
});

typingArea.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault(); // Prevent focusing away from typingArea
  }
});

resetButton.addEventListener('click', resetTest);

document.addEventListener('DOMContentLoaded', () => {
  resetTest();
});

export { timerInterval };