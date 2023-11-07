function calculateWPM(elapsedTime, typingArea, textDisplay, wpmDisplay, accuracyDisplay) {
  const textEntered = typingArea.innerText;
  const wordCount = textEntered.trim().split(/\s+/).length;
  // Time spent is now the elapsed time divided by 60 to convert to minutes
  const timeSpent = elapsedTime / 60;
  const wpm = timeSpent > 0 ? (wordCount / timeSpent).toFixed(2) : '0.00';
  wpmDisplay.textContent = wpm;

  // Update accuracy
  const errors = textDisplay.querySelectorAll('.incorrect').length;
  const accuracy = ((textEntered.length - errors) / textEntered.length) * 100;
  accuracyDisplay.textContent = isNaN(accuracy) ? '0.00' : accuracy.toFixed(2);
}

export { calculateWPM };
