let isAcross = true;
let squares = [];
let numRows = 15;
let numCols = 15;


function setDir(dir, row, col) {
    // dir = true => across, down otherwise
    isAcross = dir
    for (let i = 0; i < numRows; i++ ) {
        for (let j = 0; j < numCols; j++) {
            squares[i][j].classList.remove('selected-group');
        }
    }

    if (dir) {
        for (let i = 0; i < numCols; i++) {
            let square = squares[row][i];
            if (!square.classList.contains('black-square')) {
                square.classList.add('selected-group');
            }
        }
    }
    else {
        for (let i = 0; i < numRows; i++) {
            let square = squares[i][col];
            if (!square.classList.contains('black-square')) {
                square.classList.add('selected-group');
            }
        }
    }
}


function getClueId(row, col) {
    if (isAcross) {
        let i = col;
        let square;
        while (square.childNodes[0].innerHTML === '') {
            square = squares[row][i];
            i--;
        }
    }
    else {
        let i = row;
        while (square.childNodes[0].innerHTML === '') {
            square = squares[i][col];
            i--;
        }
    }
    return square.childNodes[0].innerHTML;
}


function addKeydownListener(letterDiv, i, j, socket) {
    letterDiv.addEventListener('keydown', function(e) {
        let key = e.keyCode;
        if (key == 8) {
            // backspace
            if (letterDiv.innerHTML !== '') {
                letterDiv.innerHTML = '';
                socket.emit('update', {'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': ''});
            }
            else {
                if (isAcross) {
                    setDir(true, i, j);
                    if (j <= 0) {
                        return;
                    }
                    for (let k = j - 1; k >= 0; k--) {
                        if (squares[i][k].classList.contains('black-square') || squares[i][k].childNodes[1].classList.contains('correct')) {
                            continue;
                        }
                        else {
                            squares[i][k].childNodes[1].focus();
                            return;
                        }
                    }
                }
                else {
                    setDir(false, i, j);
                    if (i <= 0) {
                        return;
                    }
                    for (let k = i - 1; k >= 0; k--) {
                        if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                            continue;
                        }
                        else {
                            squares[k][j].childNodes[1].focus();
                            return;
                        }
                    }
                }
            }
        }
        if (key === 37) {
            // left arrow
            let wasAcross = isAcross;
            setDir(true, i, j);
            if (!wasAcross) {
                return;
            }
            if (j <= 0) {
                return;
            }
            for (let k = j - 1; k >= 0; k--) {
                if (squares[i][k].classList.contains('black-square') || squares[i][k].childNodes[1].classList.contains('correct')) {
                    continue;
                }
                else {
                    squares[i][k].childNodes[1].focus();
                    return;
                }
            }
        }
        else if (key === 38) {
            // up arrow
            let wasAcross = isAcross;
            setDir(false, i, j);
            if (wasAcross) {
                return;
            }
            if (i <= 0) {
                return;
            }
            for (let k = i - 1; k >= 0; k--) {
                if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                    continue;
                }
                else {
                    squares[k][j].childNodes[1].focus();
                    return;
                }
            }
        }
        else if (key === 39) {
            // right arrow
            let wasAcross = isAcross;
            setDir(true, i, j);
            if (!wasAcross) {
                return;
            }
            if (j >= numCols - 1) {
                return;
            }
            for (let k = j + 1; k <= numCols - 1; k++) {
                if (squares[i][k].classList.contains('black-square') || squares[i][k].childNodes[1].classList.contains('correct')) {
                    continue;
                }
                else {
                    squares[i][k].childNodes[1].focus();
                    return;
                }
            }
        }
        else if (key === 40) {
            // down arrow
            let wasAcross = isAcross;
            setDir(false, i, j);
            if (wasAcross) {
                return;
            }
            if (i >= numRows - 1) {
                return;
            }
            for (let k = i + 1; k <= numRows - 1; k++) {
                if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                    continue;
                }
                else {
                    squares[k][j].childNodes[1].focus();
                    return;
                }
            }
        }
    });
}


function addDoubleClickListener(letterDiv, i, j) {
    letterDiv.addEventListener('dblclick', function(e) {
        setDir(!isAcross, i, j);
    });
}


function addInputListener(letterDiv, i, j, socket) {
    letterDiv.addEventListener('input', function (e) {
        socket.emit('update', {'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': e.data});
        if (e.data !== '') {
            if (isAcross) {
                if (j >= numCols - 1) {
                    return;
                }
                for (let k = j + 1; k <= numCols - 1; k++) {
                    if (squares[i][k].classList.contains('black-square') || squares[i][k].childNodes[1].classList.contains('correct')) {
                        continue;
                    }
                    else {
                        squares[i][k].childNodes[1].focus();
                        return;
                    }
                }
            }
            else {
                if (i >= numRows - 1) {
                    return;
                }
                for (let k = i + 1; k <= numRows - 1; k++) {
                    if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                        continue;
                    }
                    else {
                        squares[k][j].childNodes[1].focus();
                        return;
                    }
                }
            }
        }
    });
}


function addEventListeners(letterDiv, td, i, j, socket) {
    addInputListener(letterDiv, i, j, socket);

    addKeydownListener(letterDiv, i, j, socket);

    addDoubleClickListener(letterDiv, i, j);

    letterDiv.addEventListener('focus', function () {
        setDir(isAcross, i, j);
        td.classList.add('selected');
    });

    letterDiv.addEventListener('blur', function () {
        td.classList.remove('selected');
    });
}


$(document).ready(function() {
    let socket = io.connect('http://' + document.domain + ':' + location.port);

    let button = document.getElementById('check-button');
    button.addEventListener('click', function() {
        let toCheck = []
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let square = squares[i][j];
                if (square.getAttribute('class') !== 'black-square') {
                    let letterDiv = square.childNodes[1];
                    if (letterDiv.innerHTML !== '' && !letterDiv.classList.contains('correct')) {
                        toCheck.push({'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': letterDiv.innerHTML});
                    }
                }
            }
        }

        socket.emit('check', toCheck);
    });

    socket.on('connect', function(data) {
        socket.emit('create');
    });


    socket.on('board', function(data) {
        let tbody = document.getElementById('crossword');
        let parsedData = JSON.parse(data);

        numRows = parsedData.length;
        numCols = parsedData[0].length;

        for (let i = 0; i < numRows; i++) {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);

            let row = [];
            for (let j = 0; j < numCols; j++) {
                let square = parsedData[i][j];
                let td = document.createElement('td');
                if (square.is_black) {
                    td.setAttribute('class', 'black-square');
                }
                else {
                    let numDiv = document.createElement('div');
                    numDiv.setAttribute('class', 'num');
                    numDiv.innerHTML = square.num;

                    let letterDiv = document.createElement('div');
                    letterDiv.setAttribute('class', 'letter');
                    letterDiv.setAttribute('data-row', i);
                    letterDiv.setAttribute('data-col', j);
                    letterDiv.setAttribute('contenteditable', true);

                    addEventListeners(letterDiv, td, i, j, socket);

                    td.appendChild(numDiv);
                    td.appendChild(letterDiv);
                }
                row.push(td);
                tr.appendChild(td);
            }
            squares.push(row);
        }
    });


    socket.on('update', function(data) {
        let parsedData = JSON.parse(data);
        let square = squares[parsedData.row][parsedData.col];
        square.childNodes[1].innerHTML = parsedData.letter;
    });


    socket.on('check', function(data) {
        let parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
            let square = squares[parsedData[i].row][parsedData[i].col];
            square.childNodes[1].classList.add('correct')
            square.childNodes[1].setAttribute('contenteditable', false);
        }
    })

 });