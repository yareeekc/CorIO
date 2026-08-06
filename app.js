let startPanelFrame = document.getElementById('start-panel-span');
let startBtn = document.getElementById('start-btn');

function setStartPanel() {
	startPanelFrame.classList.toggle('vis');
}

startBtn.addEventListener('click', setStartPanel);

async function sendCommand(cmd) {
	await fetch(`http://127.0.0.1:2345/${cmd}`);
}