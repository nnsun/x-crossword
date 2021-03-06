"use strict";

let isAcross = true;
let squares = [];
let timestamps = [];
let numRows = 15;
let numCols = 15;


function setDir(document, dir, row, col) {
    // dir = true => across, down otherwise
    isAcross = dir
    for (let i = 0; i < numRows; i++ ) {
        for (let j = 0; j < numCols; j++) {
            squares[i][j].classList.remove('selected-group');
        }
    }

    if (isAcross) {
        for (let i = col; i < numCols && !squares[row][i].classList.contains('black-square'); i++) {
            squares[row][i].classList.add('selected-group');
        }
        for (let i = col-1; i >= 0 && !squares[row][i].classList.contains('black-square'); i--) {
            squares[row][i].classList.add('selected-group');
        }
    }
    else {
        for (let i = row; i < numRows && !squares[i][col].classList.contains('black-square'); i++) {
            squares[i][col].classList.add('selected-group');
        }
        for (let i = row-1; i >= 0 && !squares[i][col].classList.contains('black-square'); i--) {
            squares[i][col].classList.add('selected-group');
        }
    }
    highlightClue(document, squares[row][col], row, col)
}


function highlightClue(document, square, row, col) {
    let highlighted = document.getElementsByClassName('highlighted-clue');
    for (let i = 0; i < highlighted.length; i++) {
        highlighted[i].classList.remove('highlighted-clue');
    }

    if (isAcross) {
        let i = col;
        while (i > 0 && !square.classList.contains('black-square')) {
            i--;
            square = squares[row][i];
        }
        if (square.classList.contains('black-square')) {
            square = squares[row][i+1];
        }
    }
    else {
        let i = row;
        while (i > 0 && !square.classList.contains('black-square')) {
            i--;
            square = squares[i][col];
        }
        if (square.classList.contains('black-square')) {
            square = squares[i+1][col];
        }
    }
    let dir = isAcross ? 'a' : 'd';
    document.getElementById(square.childNodes[0].innerHTML + dir).classList.add('highlighted-clue');
}


function addKeydownListener(document, letterDiv, i, j, socket) {
    letterDiv.addEventListener('keydown', function(e) {
        let key = e.keyCode;
        if (key == 8) {
            // backspace
            if (letterDiv.innerHTML !== '') {
                letterDiv.innerHTML = '';
                timestamps[i][j] = Date.now();
                socket.emit('update', {'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': '', 'ts': Date.now()});
            }
            else {
                if (isAcross) {
                    setDir(document, true, i, j);
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
                    setDir(document, false, i, j);
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
            setDir(document, true, i, j);
            if (!wasAcross) {
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
            setDir(document, false, i, j);
            if (wasAcross) {
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
            setDir(document, true, i, j);
            if (!wasAcross) {
                return;
            }
            for (let k = j + 1; k < numCols; k++) {
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
            setDir(document, false, i, j);
            if (wasAcross) {
                return;
            }
            for (let k = i + 1; k < numRows; k++) {
                if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                    continue;
                }
                else {
                    squares[k][j].childNodes[1].focus();
                    return;
                }
            }
        }
        else if (key === 13) {
            // enter
            let diffWord = false;
            if (isAcross) {
                for (let k = i; k < numRows; k++) {
                    for (let l = k == i ? j + 1 : 0; l < numCols; l++) {
                        let square = squares[k][l];
                        if (!diffWord) {
                            if (square.classList.contains('black-square')) {
                                diffWord = true;
                            }
                        }
                        else if (!square.classList.contains('black-square') && square.childNodes[1].innerHTML === '') {
                            square.childNodes[1].focus();
                            return;
                        }
                    }
                    diffWord = true;
                }
            }
            else {
                for (let l = j; l < numCols; l++) {
                    for (let k = l == j ? i + 1 : 0; k < numRows; k++) {
                        let square = squares[k][l];
                        if (!diffWord) {
                            if (square.classList.contains('black-square')) {
                                diffWord = true;
                            }
                        }
                        else if (!square.classList.contains('black-square') && square.childNodes[1].innerHTML === '') {
                            square.childNodes[1].focus();
                            return;
                        }
                    }
                    diffWord = true;
                }
            }
        }
    });
}


function addDoubleClickListener(letterDiv, i, j) {
    letterDiv.addEventListener('dblclick', function() {
        setDir(document, !isAcross, i, j);
    });
}


function addInputListener(letterDiv, i, j, socket) {
    letterDiv.addEventListener('input', function (e) {
        timestamps[i][j] = Date.now();
        if (e.data !== null && e.data !== '') {
            socket.emit('update', {'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': e.data.trim(), 'ts': Date.now()});
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
        else {
            letterDiv.innerHTML = '';
        }
    });
}


function addLetterBoxEventListeners(document, letterDiv, numDiv, td, i, j, socket) {
    addInputListener(letterDiv, i, j, socket);
    addKeydownListener(document, letterDiv, i, j, socket);
    addDoubleClickListener(letterDiv, i, j);

    letterDiv.addEventListener('focus', function () {
        setDir(document, isAcross, i, j);
        td.classList.add('selected');
    });

    letterDiv.addEventListener('blur', function () {
        td.classList.remove('selected');
    });

    numDiv.addEventListener('focus', function () {
        setDir(document, isAcross, i, j);
        td.classList.add('selected');
        letterDiv.focus()
    });

    numDiv.addEventListener('blur', function () {
        td.classList.remove('selected');
    });

    numDiv.addEventListener('dblclick', function() {
        let dblclick = document.createEvent('MouseEvents');
        dblclick.initEvent('dblclick', true, true);
        letterDiv.dispatchEvent(dblclick);
    });

}




function addButtonEventListener(socket) {
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
}


function addClueBoxEventListeners(document) {
    let boxes = document.getElementsByClassName('clue-box');
    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let id = box.id.split('-')[0];
        let dir = id.slice(id.length-1, id.length) === 'a' ? true : false;
        let square = document.getElementById(id.slice(0, id.length-1));
        let row = square.parentNode.getAttribute('data-row');
        let col = square.parentNode.getAttribute('data-col');
        box.addEventListener('click', function() {
            setDir(document, dir, row, col);
            squares[row][col].childNodes[1].focus();
        });
    }
}


document.addEventListener("DOMContentLoaded", function(e) {
    let socket = io.connect('http://' + document.domain + ':' + location.port);

    addButtonEventListener(socket);

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

            let boardRow = [];
            let tsRow = [];
            for (let j = 0; j < numCols; j++) {
                let square = parsedData[i][j];
                let td = document.createElement('td');
                td.setAttribute('data-row', i);
                td.setAttribute('data-col', j);
                if (square.is_black) {
                    td.setAttribute('class', 'black-square');
                }
                else {
                    let numDiv = document.createElement('div');
                    numDiv.setAttribute('class', 'num');
                    numDiv.setAttribute('contenteditable', true);
                    numDiv.id = square.num;
                    numDiv.innerHTML = square.num;

                    let letterDiv = document.createElement('div');
                    letterDiv.setAttribute('class', 'letter');
                    letterDiv.setAttribute('data-row', i);
                    letterDiv.setAttribute('data-col', j);
                    letterDiv.setAttribute('contenteditable', true);
                    letterDiv.innerHTML = square.letter

                    if (square.checked) {
                        letterDiv.classList.add('correct')
                        letterDiv.setAttribute('contenteditable', false);
                    }

                    td.appendChild(numDiv);
                    td.appendChild(letterDiv);

                    addLetterBoxEventListeners(document, letterDiv, numDiv, td, i, j, socket);
                }
                boardRow.push(td);
                tr.appendChild(td);
                tsRow.push(0);
            }
            squares.push(boardRow);
            timestamps.push(tsRow);
        }
        addClueBoxEventListeners(document);
    });


    socket.on('update', function(data) {
        if (squares === []) {
            return;
        }
        let parsedData = JSON.parse(data);
        if (parsedData.ts >= timestamps[parsedData.row][parsedData.col]) {
            squares[parsedData.row][parsedData.col].childNodes[1].innerHTML = parsedData.letter;
        }
    });


    socket.on('check', function(data) {
        if (squares === []) {
            return;
        }
        let parsedData = JSON.parse(data);
        for (let i = 0; i < parsedData.length; i++) {
            let square = squares[parsedData[i].row][parsedData[i].col];
            square.childNodes[1].classList.add('correct')
            square.childNodes[1].setAttribute('contenteditable', false);
        }
    });

 });