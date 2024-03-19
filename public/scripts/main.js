const testingPage = document.getElementById('testing-page');
const completionPage = document.getElementById('completion-page');
const wpmDisplay = document.getElementById('wpm-final');
const accuracyDisplay = document.getElementById('accuracy-final');
const timeDisplay = document.getElementById('time-final');
const restartButton = document.getElementById('restart');

export function showCompletionPage(wpm, accuracy, time) {
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    timeDisplay.textContent = `${time}s`;

    completionPage.style.display = 'flex';
    completionPage.style.opacity = '0';

    setTimeout(() => {
        completionPage.style.opacity = '1';
    }, 10);

    testingPage.style.pointerEvents = 'none';
}

export function hideCompletionPage() {
    completionPage.style.opacity = '0';
    
    setTimeout(() => {
        completionPage.style.display = 'none';
    }, 300);

    testingPage.style.pointerEvents = 'all';
}
