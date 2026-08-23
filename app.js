let startPanelFrame = document.getElementById('start-panel-span');
let startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
	startPanelFrame.classList.toggle('vis');
});

async function sendCommand(cmd) {
	try {
		let responce = await fetch(`http://127.0.0.1:2345/${cmd}`);
		let result = await responce.text();

		return result;
	} catch	(error) {
		console.log(`ERROR: ${error}`);
	}
}

async function sendSystemExec(exec) {
	try {
		let securedCmd = encodeURIComponent(exec);

		let result = await fetch(`http://127.0.0.1:2345/exec/${securedCmd}`);
		return result.text();
	} catch (error) {
		console.log('Any error in sendSystemExec function')
	}
}

async function pingStart() {
	try {
		if((await fetch('http://127.0.0.1:2345/ping')).text() === 'OK') {
			console.log('Successfully conected to backend.sh');
		}
	} catch (error) {
		alert(`Ping: ERROR. Please, start backend.sh as user (NOT ROOT!)\nerror: ${error}`);
		console.error(`Ping: ERROR. Please, start backend.sh as user (NOT ROOT!)\nerror: ${error}`);
		return error;
	}
}

pingStart();