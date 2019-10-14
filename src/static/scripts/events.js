$(document).ready(function() {
    let letterBoxes = document.getElementsByClassName('letter');

    let socket = io.connect('http://' + document.domain + ':' + location.port);


    socket.on('connect', function(data) {
        socket.emit('create');
    });


    socket.on('board', function(data) {
        let tbody = document.getElementById('crossword');
        let parsedData = JSON.parse(data);
        console.log(typeof(data));
        for (let i = 0; i < parsedData.length; i++) {
            let tr = document.createElement('tr');
            tbody.appendChild(tr);
            for (let j = 0; j < parsedData[i].length; j++) {
                let square = parsedData[i][j];
                let td = document.createElement('td');
                if (square.is_black) {
                    td.setAttribute('class', 'black-square');
                }
                else {
                    numDiv = document.createElement('div');
                    numDiv.setAttribute('class', 'num');
                    numDiv.innerHTML = square.num;

                    letterDiv = document.createElement('div');
                    letterDiv.setAttribute('class', 'letter');
                    letterDiv.setAttribute('data-row', i);
                    letterDiv.setAttribute('data-col', j);

                    td.appendChild(numDiv);
                    td.appendChild(letterDiv);
                }
                tr.appendChild(td);
            }
        }
    })

    // document.getElementById('crossword').innerHTML = s



    
    for (i = 0; i < letterBoxes.length; i++) {
        let letterBox = letterBoxes[i];
        letterBox.addEventListener('input', function (e) {
            socket.emit('keypress', {"row": letterBox.getAttribute("data-row"), "col": letterBox.getAttribute("data-col"), "letter": e.data});
        });
    }



 });