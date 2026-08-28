const reloadBtn = document.getElementById('reload-btn');
const urlArea = document.getElementById('url-area');
const webFrame = document.getElementById('frame');
let url = ''

function loadPage(pageUrl) {
    webFrame.src = `${pageUrl}`;
    urlArea.value = pageUrl;
}

function updatePage() {
    console.log('update');
    loadPage(url);
}

reloadBtn.addEventListener('click', updatePage);

function getUrl() {
    url = urlArea.value;
    return url;
}

urlArea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        console.log('enter');
        loadPage(getUrl());
    }
});