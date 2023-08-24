'use strict'
const MINE = '💣'
const MARKED = '🚩'
const NORMAL = '😃'
const WIN = '😎'
const LOSE = '🤯'

var gBorad;
var gTimeStart;
var gInterval;
var isFirstClick;
var gLevel = {
    size: 4,
    mines: 2
};
var gLives;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function initGame() {
    clearInterval(gInterval);
    gInterval = null;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gLives = (gLevel.mines > 2) ? 3 : 2;
    isFirstClick = true;
    document.querySelector('.smiley').innerText = NORMAL;
    document.querySelector('.lives').innerText = gLives;
    document.querySelector('.time').innerText = 0;
    gBorad = buildBoard();
    renderBoard(gBorad);
}

function buildBoard() {
    var size = gLevel.size;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size/2; j++) {
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
    for (var i = 0; i < gLevel.mines; i++) {
        var row = getRandomInt(0, gLevel.size - 1);
        var col = getRandomInt(0, gLevel.size - 1);
        while (board[row][col].isShown || board[row][col].isMine) {
            var row = getRandomInt(0, gLevel.size - 1);
            var col = getRandomInt(0, gLevel.size - 1);
        }
        board[row][col].isMine = true;
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            countMinesNegs(board, i, j);
        }
    }
}

function cellClicked(elCell) {
    if (!gGame.isOn) return;
    var cellId = elCell.id.split('-');
    var row = +cellId[1];
    var col = +cellId[2];
    //First click is never a Mine
    if (isFirstClick) {
        gTimeStart = new Date();
        gInterval = setInterval(showTime, 1000);
        gBorad[row][col].isShown = true;
        gGame.shownCount++;
        addMinesToBoard(gBorad);
        isFirstClick = false;
        elCell.style.backgroundColor = 'lightgray';
        if (gBorad[row][col].minesAroundCount) elCell.innerText = gBorad[row][col].minesAroundCount
        else expandShown(gBorad, elCell);
        return;
    }
    if (gBorad[row][col].isShown) return;
    if (gBorad[row][col].isMarked) return;
    if (!gBorad[row][col].isMine) {
        if (gBorad[row][col].minesAroundCount) {
            elCell.innerText = gBorad[row][col].minesAroundCount;
            elCell.style.backgroundColor = 'lightgray';
            gBorad[row][col].isShown = true;
            gGame.shownCount++;
        } else expandShown(gBorad, elCell);
    } else {
        gLives--;
        document.querySelector('.lives').innerText = gLives;
        elCell.innerText = gBorad[row][col].minesAroundCount;
        elCell.style.backgroundColor = 'red'
        gBorad[row][col].isShown = true;
        gGame.shownCount++;
    }
    checkGameOver();
}

function cellMarked(elCell) {
    if (!gGame.isOn) return;
    //disable context menu
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
        gGame.markedCount--;
    } else {

        gBorad[row][col].isMarked = true;
        gGame.markedCount++;
        elCell.innerText = MARKED;

    }
    checkGameOver();
}

function checkGameOver() {
    if (!gLives) {
        gGame.isOn = false;
        document.querySelector('.smiley').innerText = LOSE;
        clearInterval(gInterval);
        gInterval = null;
    }
    var lives = (gLevel.mines > 2) ? 3 : 2;
    if (gGame.markedCount === gLevel.mines - (lives - gLives)) {
        if (gGame.shownCount === (gLevel.size ** 2) - gGame.markedCount) {
            clearInterval(gInterval);
            gInterval = null;
            gGame.isOn = false;
            document.querySelector('.smiley').innerText = WIN;
        }
    }
}

function expandShown(board, elCell) {
    var cellId = elCell.id.split('-');
    var row = +cellId[1];
    var col = +cellId[2];
    if (!board[row][col].minesAroundCount) {
        for (var i = row - 1; i <= row + 1; i++) {
            if (i < 0 || i > board.length - 1) continue;
            for (var j = col - 1; j <= col + 1; j++) {
                if (j < 0 || j > board[0].length - 1) continue;
                if (!board[i][j].isShown) {
                    var elCurrCell = document.getElementById(`cell-${i}-${j}`);
                    elCurrCell.style.backgroundColor = 'lightgray'
                    board[i][j].isShown = true;
                    gGame.shownCount++;
                    if (board[i][j].minesAroundCount) elCurrCell.innerText = board[i][j].minesAroundCount;
                    else expandShown(board, elCurrCell)
                }
            }
        }
    } else return;
}

function changeLevel(elBtn) {
    var btnText = elBtn.innerText;
    switch (btnText) {
        case 'Beginner':
            gLevel.size = 4;
            gLevel.mines = 2;
            break;
        case 'Medium':
            gLevel.size = 8;
            gLevel.mines = 12;
            break;
        case 'Expert':
            gLevel.size = 30;
            gLevel.mines = 60;
            break;
    }
    initGame();
}
