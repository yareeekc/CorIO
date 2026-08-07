let topZIndex = 10;

function createWindow(title, appUrl) {
  	const template = document.getElementById('window-template');
  	const clone = template.content.cloneNode(true);
  
  	const win = clone.querySelector('.window');
  	const header = win.querySelector('.window-header');
  	const resizer = win.querySelector('.resizer');
	const closeBtn = win.querySelector('.close-btn');
	const iframe = win.querySelector('.window-iframe');
  
  	win.querySelector('.window-title').textContent = title;
	iframe.src = appUrl;
  
  	topZIndex++;
  	win.style.zIndex = topZIndex;


  	win.addEventListener('mousedown', () => {
    	topZIndex++;
    	win.style.zIndex = topZIndex;
  	});

	header.addEventListener('mousedown', (e) => {
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
      		iframe.style.pointerEvents = 'auto'; // Возвращаем клики в iframe
    	}, { once: true });
  	});

  	closeBtn.addEventListener('click', () => {
  	  	win.remove();
  	});

  	document.getElementById('desktop').appendChild(win);
}
