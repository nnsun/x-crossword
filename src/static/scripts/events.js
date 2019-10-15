$(document).ready(function() {
    let socket = io.connect('http://' + document.domain + ':' + location.port);

    let squares = [];

    let button = document.getElementById('check-button');
    button.addEventListener('click', function() {
        let toCheck = []
        for (let i = 0; i < squares.length; i++) {
            for (let j = 0; j < squares[i].length; j++) {
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

        for (let i = 0; i < parsedData.length; i++) {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);

            let row = [];
            for (let j = 0; j < parsedData[i].length; j++) {
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

                    letterDiv.addEventListener('input', function (e) {
                        socket.emit('update', {'row': letterDiv.getAttribute('data-row'), 'col': letterDiv.getAttribute('data-col'), 'letter': e.data});
                    });

                    letterDiv.addEventListener('keydown', function(e) {
                        let key = e.keyCode;
                        if (key === 37) {
                            // left arrow
                            if (j <= 0) {
                                return;
                            }
                            for (let k = j - 1; k >= 0; k--) {
                                console.log(k)
                                if (row[k].classList.contains('black-square') || row[k].childNodes[1].classList.contains('correct')) {
                                    continue;
                                }
                                else {
                                    row[k].childNodes[1].focus();
                                    return;
                                }
                            }
                        }
                        else if (key === 38) {
                            // up arrow
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
                            if (j >= parsedData.length - 1) {
                                return;
                            }
                            for (let k = j + 1; k <= parsedData.length - 1; k++) {
                                console.log(k)
                                if (row[k].classList.contains('black-square') || row[k].childNodes[1].classList.contains('correct')) {
                                    continue;
                                }
                                else {
                                    row[k].childNodes[1].focus();
                                    return;
                                }
                            }
                        }
                        else if (key === 40) {
                            // down arrow
                            if (i >= parsedData.length - 1) {
                                return;
                            }
                            for (let k = i + 1; k <= parsedData.length - 1; k++) {
                                if (squares[k][j].classList.contains('black-square') || squares[k][j].childNodes[1].classList.contains('correct')) {
                                    continue;
                                }
                                else {
                                    squares[k][j].childNodes[1].focus();
                                    return;
                                }
                            }
                        }
                    })

                    letterDiv.addEventListener('focus', function () {
                        td.classList.add('selected');
                    });

                    letterDiv.addEventListener('blur', function () {
                        td.classList.remove('selected');
                    });

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