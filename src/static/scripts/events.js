$(document).ready(function() {
    let socket = io.connect('http://' + document.domain + ':' + location.port);

    let squares = [];


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
                        socket.emit('update', {"row": letterDiv.getAttribute("data-row"), "col": letterDiv.getAttribute("data-col"), "letter": e.data});
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

 });