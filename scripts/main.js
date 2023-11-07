// main.js - The entry point for the typing test functionality

import { setTextDisplay, updateTextDisplay } from './display.js';
import { startTimer } from './timer.js';
import { calculateWPM } from './utils.js';
import { getRandomFunction } from './generator.js';

// Initial setup
let startTime;
let timerInterval;
const testDuration = 60;
let timeRemaining = { value: testDuration };
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
  timerInterval = startTimer(timeRemaining, timeDisplay, typingArea, { interval: timerInterval });
}

function resetTest() {
  currentText = getRandomFunction();
  clearInterval(timerInterval);
  startTime = null;
  typingArea.contentEditable = 'true';
  typingArea.innerText = '';
  timeDisplay.textContent = testDuration;
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '100';
  timeRemaining.value = testDuration;
  setTextDisplay(textDisplay, currentText); // Set the initial display text
  typingArea.focus();
}

typingArea.addEventListener('input', () => {
  startTest();
  updateTextDisplay(typingArea, textDisplay, currentText, timerInterval);
  calculateWPM(testDuration, timeRemaining.value, typingArea, textDisplay, wpmDisplay, accuracyDisplay);
});

typingArea.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault(); // Prevent focusing away from typingArea
    // Handle the tab input here
    let currentText = typingArea.innerText;
    typingArea.innerText = currentText + '    '; // Adding four spaces
    updateTextDisplay(); // Call your update function
  }
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

resetButton.addEventListener('click', resetTest);

document.addEventListener('DOMContentLoaded', () => {
  setTextDisplay(textDisplay, currentText);
});
