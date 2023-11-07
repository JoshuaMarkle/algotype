// timer.js - Handles the timing functionality of the typing test

function startTimer(timeRemaining, timeDisplay, typingArea, updateCallback) {
    return setInterval(() => {
      timeRemaining.value--;
      timeDisplay.textContent = timeRemaining.value;
      if (timeRemaining.value === 0) {
        clearInterval(updateCallback.interval);
        typingArea.contentEditable = 'false'; // Disable editing when time is up
      }
    }, 1000);
  }
  
  export { startTimer };
  