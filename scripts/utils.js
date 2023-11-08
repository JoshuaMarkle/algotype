import { elapsedTime } from './main.js';

const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

function calculateWPM(correctChars, totalChars) {
  // Calculate WPM based on correct words typed
  const timeSpent = elapsedTime / 60;
  console.log("timeSpent:", timeSpent)
  const wpm = timeSpent > 0 ? (correctChars / timeSpent).toFixed(0) : '0';
  wpmDisplay.textContent = wpm;

  // Calculate accuracy
  const accuracy = (correctChars / totalChars) * 100;
  accuracyDisplay.textContent = isNaN(accuracy) ? '0.0' : accuracy.toFixed(0);
}

export { calculateWPM };
