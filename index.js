// Translingo Logic - Coming Soon
console.log("Translingo UI Loaded");

const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const panelA = document.getElementById('panel-a');
const panelB = document.getElementById('panel-b');

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
    panelA.classList.add('active');
    // More logic will be added in Execution phase
});

stopBtn.addEventListener('click', () => {
    stopBtn.style.display = 'none';
    startBtn.style.display = 'flex';
    panelA.classList.remove('active');
    panelB.classList.remove('active');
});
