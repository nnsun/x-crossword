$(document).ready(function() {
    var letterBoxes = document.getElementsByClassName('letter');
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    
    for (i = 0; i < letterBoxes.length; i++) {
        letterBox = letterBoxes[i];
        letterBox.addEventListener('input', function (e) {
            socket.emit('keypress', {"box": i, "letter": e.data});
        });        
    }



 });