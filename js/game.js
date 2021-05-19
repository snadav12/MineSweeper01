'use strict'
const MINE = '💣'
const MARKED = '🚩'

var gBorad;
var isFirstClick = true;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    gBorad = buildBoard();
    addMinesToBoard(gBorad);
    renderBoard(gBorad);
}

function buildBoard() {
    var size = gLevel.size;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board;
}

function addMinesToBoard(board) {
    //              random
    for (var i = 0; i < gLevel.mines; i++) {
        var row = getRandomInt(0, gLevel.size - 1);
        var col = getRandomInt(0, gLevel.size - 1);
        if (i === 1) {

            while (board[row][col].isMine) {
                var row = getRandomInt(0, gLevel.size - 1);
                var col = getRandomInt(0, gLevel.size - 1);
            }
        }
        board[row][col].isMine = true;
    }
    // board[1][3].isMine = true;
    // board[2][3].isMine = true;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            countMinesNegs(board, i, j);
        }
    }
}

function cellClicked(elCell) {
    //First click is never a Mine
    // if (isFirstClick) {
    //     addMinesToBoard(gBorad);
    //     isFirstClick = false;
    // }
    var cellId = elCell.id.split('-');
    var row = cellId[1];
    var col = cellId[2];
    if (gBorad[row][col].isMarked) return;
    if (gBorad[row][col].isShown) return;
    if (!gBorad[row][col].isMine) {
        if (gBorad[row][col].minesAroundCount) {
            elCell.innerText = gBorad[row][col].minesAroundCount;
            elCell.style.backgroundColor = 'lightgray'
            gBorad[row][col].isShown = true;
        } else expandShown(gBorad, elCell, row, col);
    } else {
        elCell.innerText = gBorad[row][col].minesAroundCount;
        elCell.style.backgroundColor = 'red'
        gBorad[row][col].isShown = true;
    }

    if (checkGameOver()) {
        console.log('game over');
    }


}

function cellMarked(elCell) {
    window.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);
    var cellId = elCell.id.split('-');
    var row = cellId[1];
    var col = cellId[2];
    if (gBorad[row][col].isShown) return;
    if (gBorad[row][col].isMarked) {
        gBorad[row][col].isMarked = false;
        elCell.innerText = null;
    } else {

        gBorad[row][col].isMarked = true;
        elCell.innerText = MARKED;

    }
    if (checkGameOver()) {
        console.log('game over');
    }
}

function checkGameOver() {
    for (var i = 0; i < gBorad.length; i++) {
        for (var j = 0; j < gBorad[0].length; j++) {
            if (gBorad[i][j].isMine) {
                if (!gBorad[i][j].isMarked) return false;
            } else if (!gBorad[i][j].isShown) return false;
        }
    }
    return true

}

function expandShown(board, elCell, row, col) {
    row = parseInt(row);
    col = parseInt(col);
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (!board[i][j].isShown) {
                var elCurrCell = document.getElementById(`cell-${i}-${j}`);
                elCurrCell.style.backgroundColor = 'lightgray'
                board[i][j].isShown = true;
                if (board[i][j].minesAroundCount) elCurrCell.innerText = board[i][j].minesAroundCount;
            }
        }
    }
}