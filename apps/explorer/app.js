const explorerWin = document.getElementById('explorer-win');
const editorWin = document.getElementById('editor-win');
const closeEditor = document.getElementById('close-editor');
const pwdLine = document.getElementById('pwd');
const fileList = document.getElementById('file-list');
const backBtn = document.getElementById('back-btn');
const editorArea = document.getElementById('text');
const saveBtn = document.getElementById('save-btn');
const videoplayerWin = document.getElementById('videoplayer-win');
const closeVideoplayer = document.getElementById('close-videoplayer');
const videoPlayerFile = document.getElementById('videofilename');
const videoplayer = document.getElementById('video');
const picturePreviewWin = document.getElementById('picture-preview-win');
const closePicture = document.getElementById('close-picture');
const pictureFileName = document.getElementById('picturefilename');
const pictureFile = document.getElementById('picture-file')

let currentPath = '';
let currentDirs = [];

async function runCmd(cmd) {
    try {
        const safeCmd = encodeURIComponent(cmd);
        let request = await fetch(`http://127.0.0.1:2345/exec/${safeCmd}`);
        let result = decodeURIComponent(await request.text());

        return result;
    } catch (error) {
        console.error(`Localhost error: ${error}`);
        return error;
    }
}

async function pwdStart() {
    currentPath = '/home/yareeek'
    pwdLine.textContent = currentPath;
    currentPath = currentPath.trim();
}

pwdStart();

async function cdBack() {
    currentDirs = currentPath.split('/');
    currentDirs.pop();
    currentPath = currentDirs.join('/');

    if (!currentPath) {
        currentPath = '/';
    }

    pwdLine.textContent = currentPath;
    renderFiles();
}

backBtn.addEventListener('click', cdBack);

async function ls() {
    let filelist = await runCmd(`ls -mF ${currentPath}`);
    let filelistmassive = filelist.split(',').map(elem => elem.trim());

    let files = [];
    let dirs = [];

    filelistmassive.forEach(elem => {
        if (elem.endsWith('/')) {
            dirs.push(elem);
        } else {
            files.push(elem);
        }
    });

    files.sort();
    dirs.sort();

    return { files, dirs };
}

async function renderFiles() {
    let { files, dirs } = await ls();

    fileList.innerHTML = '';

    for (let i=0; i < dirs.length; i++) {
        const elem = document.createElement('button');
        elem.classList.add('file-elem');
        const logo = document.createElement('img');
        logo.src = 'icons/folder.ico';
        elem.appendChild(logo);
        const title =document.createElement('span');
        title.textContent = dirs[i];
        elem.appendChild(title);

        elem.addEventListener('click', async () => {
            const folderName = dirs[i].replace(/\/$/, '');

            if (currentPath === '/') {
                currentPath = `/${folderName}`;
            } else {
                currentPath = `${currentPath}/${folderName}`;
            }

            pwdLine.textContent = currentPath;
            await renderFiles();
        });

        elem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const contextMenu = document.getElementById('custom-contex-menu');

            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;

            contextMenu.style.display = 'block';

            document.addEventListener('click', () => {
                contextMenu.style.display = 'none';
            });

            document.getElementById('menu-rename').addEventListener('click', async () => {
                contextMenu.style.display = 'none';
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('new-name').value = dirs[i];

                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('new-name').value = '';
                    document.getElementById('rename-menu').style.display = 'none';
                });

                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`mv ${currentPath}/${dirs[i]} ${currentPath}/${document.getElementById('new-name').value}`);
                    document.getElementById('new-name').value = '';
                    document.getElementById('rename-menu').style.display = 'none';
                    renderFiles();
                });
            });

            document.getElementById('menu-delete').addEventListener('click', async () => {
                await runCmd(`rm -rf ${currentPath}/${dirs[i]}`);
                renderFiles();
            });

            document.getElementById('menu-mkdir').addEventListener('click', () => {
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                });
                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`mkdir "${currentPath}/${document.getElementById('new-name').value}"`);
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                    renderFiles();
                });
            });

            document.getElementById('menu-mkfile').addEventListener('click', () => {
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                });
                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`touch "${currentPath}/${document.getElementById('new-name').value}"`);
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                    renderFiles();
                });
            });
        });

        fileList.appendChild(elem);
    }

    for (let i=0; i < files.length; i++) {
        const elem = document.createElement('button');
        elem.classList.add('file-elem');
        const logo = document.createElement('img');

        const imgFiles = ['png', 'svg', 'jpg', 'jpeg', 'webp', 'bpm', 'tiff', 'ico'];
        const webFiles = ['html', 'htm', 'xml', 'css', 'js', 'php'];
        const textFiles = ['txt', 'json', 'md'];
        const binFiles = ['sh', 'exe', 'appImage', 'bin'];
        const videoFiles = ['mp4', 'webm', 'ogg', 'ogv']
        const appFiles = ['ioa'];
        const zipFiles = ['zip'];

        let extension = files[i].split('.').pop();

        if (imgFiles.includes(extension)) {
            logo.src = 'icons/picture.ico';
            elem.addEventListener('click', () => {
                explorerWin.style.display = 'none';
                picturePreviewWin.style.display = 'block';

                pictureFileName.textContent = files[i];
                pictureFile.src = `${currentPath}/${files[i]}`;
            });
        } else if (webFiles.includes(extension)){
            logo.src = 'icons/web.ico';
        } else if (textFiles.includes(extension)) {
            logo.src = 'icons/text.ico';
            elem.addEventListener('click', async () => {
                explorerWin.style.display = 'none';
                editorWin.style.display = 'block';

                document.getElementById('filename').textContent = files[i];
                editorArea.value = await runCmd(`cat ${currentPath}/${files[i]}`);

                saveBtn.addEventListener('click', async () => {
                    await runCmd(`echo "${editorArea.value}" > ${currentPath}/${files[i]}`);
                });
            });
        } else if (binFiles.includes(extension)) {
            logo.src = 'icons/bin.ico';
        } else if (videoFiles.includes(extension)) {
            logo.src = 'icons/video.ico';
            elem.addEventListener('click', () => {
                explorerWin.style.display = 'none';
                videoplayerWin.style.display = 'block';

                videoPlayerFile.textContent = files[i];
                videoplayer.src = `${currentPath}/${files[i]}`;
                videoplayer.load();
            });
        } else if (appFiles.includes(extension)) {
            (async () => {
                logo.src = 'icons/application.ico';
                elem.addEventListener('click', async () => {
                    await runCmd(`unzip ${currentPath}/${files[i]} -d apps/tmp/`)
                    let newAppName = files[i].slice(0, -(extension.length + 1));
                    await runCmd(`echo ,${newAppName} >> apps/apps.list`);
                    await runCmd(`mkdir -p apps/${newAppName}/`);

                    await runCmd(`mv apps/tmp/${newAppName} apps/`);
                    renderFiles();
                    alert(`App ${newAppName} installed successfully`);
                });
            })();
        } else if (zipFiles.includes(extension)) {
            logo.src = 'icons/zip.ico';
            elem.addEventListener('click', async () => {
                await runCmd(`unzip ${currentPath}/${files[i]} -d ${currentPath}/`);
                renderFiles();
            });
        } else {
            logo.src = 'icons/file.ico';
        }

        elem.appendChild(logo);
        const title =document.createElement('span');
        title.textContent = files[i];
        elem.appendChild(title);

        elem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const contextMenu = document.getElementById('custom-contex-menu');

            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.left = `${e.clientX}px`;

            contextMenu.style.display = 'block';

            document.addEventListener('click', () => {
                contextMenu.style.display = 'none';
            });

            document.getElementById('menu-rename').addEventListener('click', async () => {
                contextMenu.style.display = 'none';
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('new-name').value = files[i];

                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('new-name').value = '';
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                });

                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`mv ${currentPath}/${files[i]} ${currentPath}/${document.getElementById('new-name').value}`);
                    document.getElementById('new-name').value = '';
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                    renderFiles();
                });
            });

            document.getElementById('menu-delete').addEventListener('click', async () => {
                await runCmd(`rm ${currentPath}/${files[i]}`);
                renderFiles();
            });

            document.getElementById('menu-mkdir').addEventListener('click', () => {
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                });
                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`mkdir "${currentPath}/${document.getElementById('new-name').value}"`);
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                    renderFiles();
                });
            });

            document.getElementById('menu-mkfile').addEventListener('click', () => {
                document.getElementById('rename-menu').style.display = 'grid';
                document.getElementById('cancel-rename').addEventListener('click', () => {
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                });
                document.getElementById('confirm-rename').addEventListener('click', async () => {
                    await runCmd(`touch "${currentPath}/${document.getElementById('new-name').value}"`);
                    document.getElementById('rename-menu').style.display = 'none';
                    document.getElementById('new-name').value = '';
                    renderFiles();
                });
            });
        });

        fileList.appendChild(elem);
    }
}

function closeEditorFunc() {
    editorWin.style.display = 'none';
    explorerWin.style.display = 'block';
}

closeEditor.addEventListener('click', closeEditorFunc);

function closeVideoplayerFunc() {
    videoplayerWin.style.display = 'none';
    explorerWin.style.display = 'block';
}

closeVideoplayer.addEventListener('click', closeVideoplayerFunc);

function closePictureFunc() {
    picturePreviewWin.style.display = 'none';
    explorerWin.style.display = 'block';
}

closePicture.addEventListener('click', closePictureFunc);

renderFiles();

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const documentContextMenu = document.getElementById('document-context-menu');
    const mkDirButton = document.getElementById('document-menu-mkdir');
    const mkFileButton = document.getElementById('document-menu-mkfile');
    const renameMenu = document.getElementById('rename-menu');
    const cancelRename = document.getElementById('cancel-rename');
    const confirmRename = document.getElementById('confirm-rename');
    const newName = document.getElementById('new-name');

    documentContextMenu.style.top = `${e.clientY}px`;
    documentContextMenu.style.left = `${e.clientX}px`;
    documentContextMenu.style.display = 'block';

    mkDirButton.addEventListener('click', () => {
        renameMenu.style.display = 'grid';

        cancelRename.addEventListener('click', () => {
            renameMenu.style.display = 'none';
            newName.value = '';
        });

        confirmRename.addEventListener('click', async () => {
            await runCmd(`mkdir ${currentPath}/${newName.value}`);
            renameMenu.style.display = 'none';
            newName.value = '';
            renderFiles();
        });
    });

    mkFileButton.addEventListener('click', () => {
        renameMenu.style.display = 'grid';

        cancelRename.addEventListener('click', () => {
            renameMenu.style.display = 'none';
            newName.value = '';
        });

        confirmRename.addEventListener('click', async () => {
            await runCmd(`touch ${currentPath}/${newName.value}`);
            renameMenu.style.display = 'none';
            newName.value = '';
            renderFiles();
        });
    });

    document.addEventListener('click', () => {
        documentContextMenu.style.display = 'none';
    });
});