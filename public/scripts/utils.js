import { getCurrentText, getElaspedTime } from "./main.js";

const typingArea = document.getElementById("input-area");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

function calculateWPM() {
  const currentText = getCurrentText();
  let textEntered = typingArea.innerText.replace(/\n\n/g, "\n");
  let enteredIndex = 0;

  // Find correct characters and total characters
  let correctChars = 0;
  for (let i = 0; i < currentText.length; i++) {
    const currentChar = currentText[i];
    const enteredChar = textEntered[enteredIndex] || "";

    // Add to the running sum
    if (enteredChar === currentChar) {
      enteredIndex++;
      correctChars++;
    } else if (enteredChar) {
      enteredIndex++;
    } else {
      break;
    }
  }

  // Why is there a diff here, idk but there is
  const diff = enteredIndex - textEntered.length;
  correctChars -= diff;
  const totalChars = enteredIndex - diff;

  // Calculate WPM based on correct characters per second
  const timeSpent = getElaspedTime();
  const wpm =
    timeSpent > 0 ? ((correctChars / timeSpent) * 12).toFixed(0) : "0";
  wpmDisplay.textContent = wpm;

  // Calculate accuracy
  const accuracy = (correctChars / totalChars) * 100;
  accuracyDisplay.textContent = isNaN(accuracy) ? "0.0" : accuracy.toFixed(0);
}

export { calculateWPM };
