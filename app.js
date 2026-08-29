let startPanelFrame = document.getElementById('start-panel-span');
let startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
	startPanelFrame.classList.toggle('vis');
});

async function sendCommand(cmd) {
	try {
		let securedCmd = encodeURIComponent(cmd);

		let responce = await fetch(`http://127.0.0.1:2345/${securedCmd}`);
		let result = await responce.text();

		return result;
	} catch	(error) {
		console.log(`ERROR: ${error}`);
	}
}

async function sendSystemExec(exec) {
	try {
		let securedCmd = encodeURIComponent(exec);

		let responce = await fetch(`http://127.0.0.1:2345/exec/${securedCmd}`);
		let result = await responce.text();

		return result;
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

let topZIndex = 0;

function createWindow(title, appUrl, appLogo) {
  	const template = document.getElementById('window-template');
  	const clone = template.content.cloneNode(true);
  
  	const win = clone.querySelector('.window');
  	const header = win.querySelector('.window-header');
  	const resizer = win.querySelector('.resizer');
	const maxBtn = win.querySelector('.maximize-btn');
	const closeBtn = win.querySelector('.close-btn');
	const iframe = win.querySelector('.window-iframe');
  
  	win.querySelector('.window-title').textContent = title;
	iframe.src = appUrl;
  
  	topZIndex++;
  	win.style.zIndex = topZIndex;

	function focusWindow(win) {
		topZIndex++;
		win.style.zIndex = topZIndex;
	}

  	win.addEventListener('mousedown', () => {focusWindow(win)});

	let isMaximized = false;
	let oldCoords = {};

	maxBtn.addEventListener('click', () => {
		if (!isMaximized) {
			oldCoords = {
				left: win.style.left,
				top: win.style.top,
				width: win.style.width,
				height: win.style.height,
			}

			win.classList.add('maximized');
			isMaximized = true;
		} else {
			win.classList.remove('maximized');

			win.style.left = oldCoords.left;
			win.style.top = oldCoords.top;
			win.style.width = oldCoords.width;
			win.style.height = oldCoords.height;

			isMaximized = false;
		}
	});

	header.addEventListener('mousedown', (e) => {
		if (isMaximized) {return;}

    	e.preventDefault();
    	let shiftX = e.clientX - win.getBoundingClientRect().left;
    	let shiftY = e.clientY - win.getBoundingClientRect().top;

    	function moveAt(clientX, clientY) {
    		win.style.left = (clientX - shiftX) + 'px';
      		win.style.top = (clientY - shiftY) + 'px';
    	}

    	function onMouseMove(e) { moveAt(e.clientX, e.clientY); }
    	document.addEventListener('mousemove', onMouseMove);

    	document.addEventListener('mouseup', () => {
    		document.removeEventListener('mousemove', onMouseMove);
    	}, { once: true });
  	});

  	resizer.addEventListener('mousedown', (e) => {
    	e.preventDefault();
    	e.stopPropagation();
    
    	iframe.style.pointerEvents = 'none';

    	let startWidth = win.offsetWidth;
    	let startHeight = win.offsetHeight;
    	let startX = e.clientX;
    	let startY = e.clientY;

    	function onMouseMove(e) {
    	  	const newWidth = startWidth + (e.clientX - startX);
      		const newHeight = startHeight + (e.clientY - startY);
      		if (newWidth > 200) win.style.width = newWidth + 'px';
      		if (newHeight > 150) win.style.height = newHeight + 'px';
    	}

    	document.addEventListener('mousemove', onMouseMove);

    	document.addEventListener('mouseup', () => {
      		document.removeEventListener('mousemove', onMouseMove);
      		iframe.style.pointerEvents = 'auto';
    	}, { once: true });
  	});

	document.getElementById('desktop').appendChild(win);

	const taskbarApps = document.getElementById('working-apps-list');
	const taskItem = document.createElement('button');
	taskItem.className = 'circle-button';
	const taskLogo = document.createElement('img');
	taskLogo.src = appLogo;
	taskLogo.alt = title;
	taskItem.appendChild(taskLogo);
	taskbarApps.appendChild(taskItem);

	taskItem.addEventListener('click', () => {focusWindow(win)});
	topZIndex++;
	win.style.zIndex = topZIndex;

  	closeBtn.addEventListener('click', () => {
  	  	win.remove();
		taskItem.remove();
  	});

}

(async () => {
	let appsLet = await sendSystemExec('cat apps/apps.list');
	let apps = appsLet.split(',');

	const customContextMenu = document.getElementById('custom-context-menu');
	const deleteAppButton = document.getElementById('menu-delete');

	apps.forEach((app) => {
		let btn = document.createElement('button');
		btn.classList.add('circle-button');

		btn.addEventListener('click', () => {
			createWindow(app, `apps/${app}/index.html`, `apps/${app}/icons/logo.ico`);
		});

		btn.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();

			customContextMenu.style.top = `${e.clientY}px`;
			customContextMenu.style.left = `${e.clientX}px`;
			customContextMenu.style.display = 'block';

			deleteAppButton.addEventListener('click', async () => {
				if (confirm(`are you sure want to delete ${app}?`)) {
					let appIndex = apps.indexOf(app);
					if (appIndex !== -1) {
						apps.splice(appIndex, 1);
					}
					let appsString = apps.join(',');
					await sendSystemExec(`echo ${appsString} > apps/apps.list`);
					await sendSystemExec(`rm -r apps/${app}`);
				}
			});
		});

		document.addEventListener('click', () => {
			customContextMenu.style.display = 'none';
		});

		let btnLogo = document.createElement('img');
		btnLogo.src = `apps/${app}/icons/logo.ico`;
		btnLogo.alt = app;
		btn.appendChild(btnLogo);
		document.getElementById('app-list').appendChild(btn);
	});

	startPanelFrame.classList.remove('vis');
})();
