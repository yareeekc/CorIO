let startPanelFrame = document.getElementById('start-panel-span');
let startBtn = document.getElementById('start-btn');

function setStartPanel() {
	startPanelFrame.classList.toggle('vis');
}

startBtn.addEventListener('click', setStartPanel);

async function sendCommand(cmd) {
	try {
		let responce = await fetch(`http://127.0.0.1:2345/${cmd}`);
		let result = await responce.text();

		return result;
	} catch	(error) {
		console.log(`ERROR: ${error}`);
	}
}

