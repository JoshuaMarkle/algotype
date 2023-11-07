function calculateWPM(elapsedTime, typingArea, textDisplay, wpmDisplay, accuracyDisplay) {
  const textEntered = typingArea.innerText;
  const words = textDisplay.innerText.split(/\s+/);
  const wordsEntered = textEntered.trim().split(/\s+/);

  // Calculate the number of correct words entered
  let correctWordCount = 0;
  for (let i = 0; i < wordsEntered.length; i++) {
    if (wordsEntered[i] === words[i]) {
      correctWordCount++;
    }
  }

  // Time spent is now the elapsed time divided by 60 to convert to minutes
  const timeSpent = elapsedTime / 60;
  // Calculate WPM based on correct words typed
  const wpm = timeSpent > 0 ? (correctWordCount / timeSpent).toFixed(2) : '0.00';
  wpmDisplay.textContent = wpm;

  // Update accuracy
  // Calculate the number of correctly typed characters
  const correctChars = [...textEntered].reduce((acc, char, idx) => {
    return char === textDisplay.textContent[idx] ? acc + 1 : acc;
  }, 0);
  // Calculate accuracy
  const accuracy = ((correctChars / textDisplay.textContent.length) * 100);
  accuracyDisplay.textContent = isNaN(accuracy) ? '0.00' : accuracy.toFixed(2);
}

export { calculateWPM };
