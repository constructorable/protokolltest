/* Copyright - Oliver Acker, acker_oliver@yahoo.de
progressbar.js
Version 3.34_beta */

let progressBar;
let progressText;
let animationInterval;
let startTime;
let currentProgress = 0;
let targetProgress = 0;

function initializeProgressBar() {
    progressBar = document.getElementById('progressBar');
    progressText = document.getElementById('progressText');
        document.getElementById('loadingOverlay').style.display = 'block';
      progressBar.style.width = '0%';
    progressText.innerHTML = '0% <span class="time-display">(0s)</span>';
    progressBar.style.backgroundColor = '#ff4d4d'; // Rot für Anfang
 /*    progressBar.style.boxShadow = '0 0 5px rgba(255, 77, 77, 0.3)'; */
    progressBar.classList.remove('progress-complete');
    
    currentProgress = 0;
    targetProgress = 0;
    startTime = Date.now();
    
    clearInterval(animationInterval);
    
    // Update-Intervall für Zeit-Anzeige
    animationInterval = setInterval(updateTimeDisplay, 200);
}

function updateProgress(completed, total) {
    targetProgress = Math.round((completed / total) * 100);
    
    // Sanfte Animation zum Zielwert
    const animationInterval = setInterval(() => {
        if (currentProgress < targetProgress) {
            currentProgress = Math.min(currentProgress + 1, targetProgress);
            updateProgressDisplay(currentProgress);
        } else {
            clearInterval(animationInterval);
        }
    }, 50);
}
function updateProgressDisplay(percentage) {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `Bildschirm und Tablet aktiv lassen, bis der Prozess abgeschlossen ist! <br><br>${percentage}% <span class="time-display">(${seconds}s)</span>`;
    progressText.style.fontSize = '22px';
    
    // Farbverlauf basierend auf Fortschritt
    if (percentage < 20) {
        progressBar.style.backgroundColor = 'rgb(255, 247, 0)'; // Rot
    
    } else if (percentage < 60) {
        progressBar.style.backgroundColor = 'rgb(180, 221, 0)'; // Gelb
     
    } else {
        progressBar.style.backgroundColor = 'rgb(13, 190, 0)'; // Grün
    
    }
    
    if (percentage >= 100) {
        completeProgressBar();
    }
}

function updateTimeDisplay() {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const percentage = currentProgress;
    progressText.innerHTML = `Bildschirm und Tablet aktiv lassen, bis der Prozess abgeschlossen ist! <br><br>${percentage}% <span class="time-display">(${seconds}s)</span>`;
}

function completeProgressBar() {
    clearInterval(animationInterval);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    progressText.innerHTML = `Bildschirm und Tablet aktiv lassen, bis der Prozess abgeschlossen ist! <br><br>${percentage}% <span class="time-display">(${seconds}s)</span>`;
    progressText.style.fontSize = '22px';
    progressBar.style.backgroundColor = '#2E7D32'; // Dunkelgrün
   /*  progressBar.style.boxShadow = '0 0 20px rgba(46, 125, 50, 0.7)'; */
    progressBar.classList.add('progress-complete');
}
