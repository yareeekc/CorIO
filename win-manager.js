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
