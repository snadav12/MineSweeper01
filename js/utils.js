'use strict'


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function countMinesNegs(board, rowIdx, colIdx) {
    var cnt = 0;
    if (board[rowIdx][colIdx].isMine) {
        board[rowIdx][colIdx].minesAroundCount = MINE;
        return
    }
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMine) cnt++;
        }
    }
    board[rowIdx][colIdx].minesAroundCount = cnt;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            strHtml += `<td id="cell-${i}-${j}" onclick="cellClicked(this)" oncontextmenu="cellMarked(this)" ></td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}