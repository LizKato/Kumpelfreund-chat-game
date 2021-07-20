const unsetCheckerValue = 'none';
const playerCheckerValue = 'player';
const kiCheckerValue = 'ki';
let availableColumns
let playerWon;
let kiWon;
let board;

function initializeConnectFour() {
    document.getElementById("inputGame").style.display = "none";
    let connectFourGame = document.getElementById("connect-four");

    if (connectFourGame) {
        connectFourGame.removeAttribute('id');
    }

    connectFourGame = document.createElement('div');
    connectFourGame.id = 'connect-four';
    connectFourGame.classList.add('connect-four');

    const chatbox = document.getElementById("chatbox");
    chatbox.appendChild(connectFourGame);
    newGame();
    chatbox.scrollTo(0, chatbox.scrollHeight);
}

function newGame() {
    availableColumns = [0,1,2,3,4,5,6]
    kiWon = false
    playerWon = false
    board = [
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue],
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue],
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue],
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue],
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue],
        [unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue, unsetCheckerValue]
    ]
    drawField();
    initiateCellClickEvents();
}

function initiateCellClickEvents() {
    const firstRowCells = document.getElementById("connect-four").getElementsByClassName('first-row-cell');

    for(let i = 0; i < firstRowCells.length; i++) {
        const cellElement = firstRowCells[i];
        const checkerElement = cellElement.firstChild;
        if (checkerElement.classList.contains(playerCheckerValue + '-checker') ||
            checkerElement.classList.contains(kiCheckerValue + '-checker')) {
            cellElement.style.cursor = 'not-allowed';
        }
        cellElement.addEventListener('click', () => {
            if (availableColumns.indexOf(parseInt(cellElement.dataset.column)) > -1) {
                const insertedAtRow = moveCheckerToNextFreeSpot(cellElement.dataset.column, playerCheckerValue);
                playerWon = checkIfWon(insertedAtRow, parseInt(cellElement.dataset.column));
                if (playerWon) {
                    handleGameEnd();
                    return;
                }
                if (board[parseInt(cellElement.dataset.row)][parseInt(cellElement.dataset.column)] !== unsetCheckerValue) {
                    cellElement.classList.add('board-cell-set');
                    cellElement.classList.remove('board-cell-unset');
                    availableColumns = availableColumns.filter(col => col !== parseInt(cellElement.dataset.column));
                    console.log(availableColumns);
                }

                if (!playerWon) {
                    setTimeout(() => {
                        let kiColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];

                        const insertedAtRow = moveCheckerToNextFreeSpot(kiColumn, kiCheckerValue)
                        kiWon = checkIfWon(insertedAtRow, kiColumn);
                        if (kiWon) {
                            handleGameEnd();
                        }
                        if (board[parseInt(cellElement.dataset.row)][kiColumn] !== unsetCheckerValue) {
                            const kiCellElement = document.getElementById(cellElement.dataset.row + '-' + kiColumn);
                            kiCellElement.classList.add('board-cell-set');
                            kiCellElement.classList.remove('board-cell-unset');
                            availableColumns = availableColumns.filter(col => col !== kiColumn);
                            console.log(availableColumns);
                        }
                    }, 150)
                }
            }
        });
    }
}

function handleGameEnd() {
    if (playerWon) {
        botWriteOn("ARGH!!!! That's it now you made me angry. The next game is impossible to win...")
        botWriteOn("But first let's get rid of this chat...The smalltalk is over")
        playWinSound();
        setTimeout(() => {
            document.getElementById('chatbox').classList.add('removed');
            setTimeout(() => {
                initializeRunner();
            }, 500)
        }, 3000);
    } else if (kiWon) {
        playLoseSound();
        let connectFour = document.getElementById("connect-four");
        const firstRowCells = connectFour.getElementsByClassName('first-row-cell');
        for(let i = 0; i < firstRowCells.length; i++) {
            const cellElement = firstRowCells[i];
            const parentEl = cellElement.parentElement;
            parentEl.replaceChild(cellElement.cloneNode(true), cellElement);
            let boardCells = document.getElementsByClassName('board-cell');
            for (let j = 0; j < boardCells.length; j++) {
                let boardCell = boardCells[j];
                boardCell.removeAttribute('id');
            }
        }
        botWriteOn('I knew you could never beat me. But keep on trying you are not going to win');
        setTimeout(() => {
            initializeConnectFour();
        }, 1000);

    }
}

function moveCheckerToNextFreeSpot(column, checkerValue) {
    let rowIdx = 0;
    let currentTimeout;
    // while we are not at the end and the current cell is unset
    while (rowIdx < board.length && board[rowIdx][column] === unsetCheckerValue) {
        if (!currentTimeout) {
            // remove previous checker
            if (rowIdx > 0) {
                board[rowIdx -1][column] = unsetCheckerValue;
                updateCellCheckerOnBoard(rowIdx - 1, column, unsetCheckerValue);
            }
            // add checker to current field
            board[rowIdx][column] = checkerValue;
            updateCellCheckerOnBoard(rowIdx, column, checkerValue);
            rowIdx++;
        }
    }
    return rowIdx - 1;
}

function updateCellCheckerOnBoard(row, column, checkerValue) {
    const checkerElement = document.getElementById(row + '-' + column).firstChild;
    if (checkerValue === unsetCheckerValue) {
        checkerElement.classList.remove(kiCheckerValue + '-checker');
        checkerElement.classList.remove(playerCheckerValue + '-checker');
    } else {
        checkerElement.classList.add(checkerValue + '-checker');
    }
}

function checkIfWon(rowLastPlaced, columnLastPlaced) {
    const lastCheckerInsertedBy = board[rowLastPlaced][columnLastPlaced]

    // check for horizontal match
    let cellsWithMatch = columnsWithHorizontalMatch(rowLastPlaced, columnLastPlaced, lastCheckerInsertedBy);
    if (cellsWithMatch.length === 4) {
        markWinningCells(cellsWithMatch, lastCheckerInsertedBy);
        return true;
    }

    // check for vertical match
    cellsWithMatch = columnsWithVerticalMatch(rowLastPlaced, columnLastPlaced, lastCheckerInsertedBy);
    if (cellsWithMatch.length === 4) {
        markWinningCells(cellsWithMatch, lastCheckerInsertedBy);
        return true;
    }

    //check for diagonal match
    cellsWithMatch = columnsWithDiagonalMatch(rowLastPlaced, columnLastPlaced, lastCheckerInsertedBy);
    if (cellsWithMatch.length === 4) {
        markWinningCells(cellsWithMatch, lastCheckerInsertedBy);
        return true;
    }

    return false;
}

function columnsWithHorizontalMatch(rowLastPlaced, columnLastPlaced, checkerValue) {
    let matchingColumns = [[rowLastPlaced, columnLastPlaced]];
    let row = board[rowLastPlaced];

    // count to the left
    let iterator = columnLastPlaced - 1;
    while (notCrossedFirstColumn(iterator) && row[iterator] === checkerValue) {
        matchingColumns.push([rowLastPlaced, iterator]);
        iterator--;
    }

    // count to the right
    iterator = columnLastPlaced + 1;
    while (notCrossedLastColumn(iterator) && row[iterator] === checkerValue) {
        matchingColumns.push([rowLastPlaced, iterator]);
        iterator++;
    }

    return matchingColumns.sort();
}

function columnsWithVerticalMatch(rowLastPlaced, columnLastPlaced, checkerValue) {
    let matchingColumns = [[rowLastPlaced, columnLastPlaced]];

    // count to top
    let iterator = rowLastPlaced - 1;
    while (notCrossedFirstRow(iterator) && board[iterator][columnLastPlaced] === checkerValue) {
        matchingColumns.push([iterator, columnLastPlaced]);
        iterator--;
    }

    // count to bottom
    iterator = rowLastPlaced + 1;
    while (notCrossedLastRow(iterator) && board[iterator][columnLastPlaced] === checkerValue) {
        matchingColumns.push([iterator, columnLastPlaced]);
        iterator++;
    }

    return matchingColumns.sort();
}

function columnsWithDiagonalMatch(rowLastPlaced, columnLastPlaced, checkerValue) {
    let matchingColumnsFromNorthEastToSouthWest = columnsWithDiagonalMatchFromNorthEastToSouthWest(rowLastPlaced, columnLastPlaced, checkerValue);
    let matchingColumnsFromNorthWestToSouthEast = columnsWithDiagonalMatchFromNorthWestToSouthEast(rowLastPlaced, columnLastPlaced, checkerValue);

    if (matchingColumnsFromNorthEastToSouthWest.length > matchingColumnsFromNorthWestToSouthEast.length) {
        return matchingColumnsFromNorthEastToSouthWest.sort();
    } else {
        return matchingColumnsFromNorthWestToSouthEast.sort();
    }
}

function columnsWithDiagonalMatchFromNorthEastToSouthWest(rowLastPlaced, columnLastPlaced, checkerValue) {
    let matchingColumns = [[rowLastPlaced, columnLastPlaced]];

    // go up
    let rowIterator = rowLastPlaced - 1;
    let columnIterator = columnLastPlaced + 1;

    while (notCrossedFirstRow(rowIterator) && notCrossedLastColumn(columnIterator) && board[rowIterator][columnIterator] === checkerValue) {
        matchingColumns.push([rowIterator, columnIterator]);
        columnIterator++;
        rowIterator--;
    }

    // go down
    rowIterator = rowLastPlaced + 1;
    columnIterator = columnLastPlaced - 1;

    while (notCrossedLastRow(rowIterator) && notCrossedFirstColumn(columnIterator) && board[rowIterator][columnIterator] === checkerValue) {
        matchingColumns.push([rowIterator, columnIterator]);
        columnIterator--;
        rowIterator++;
    }
    return matchingColumns;
}

function columnsWithDiagonalMatchFromNorthWestToSouthEast(rowLastPlaced, columnLastPlaced, checkerValue) {
    let matchingColumns = [[rowLastPlaced, columnLastPlaced]];

    // go up
    let rowIterator = rowLastPlaced - 1;
    let columnIterator = columnLastPlaced - 1;

    while (notCrossedFirstRow(rowIterator) && notCrossedFirstColumn(columnIterator) && board[rowIterator][columnIterator] === checkerValue) {
        matchingColumns.push([rowIterator, columnIterator]);
        columnIterator--;
        rowIterator--;
    }

    // go down
    rowIterator = rowLastPlaced + 1;
    columnIterator = columnLastPlaced + 1;

    while (notCrossedLastRow(rowIterator) && notCrossedLastColumn(columnIterator) && board[rowIterator][columnIterator] === checkerValue) {
        matchingColumns.push([rowIterator, columnIterator]);
        columnIterator++;
        rowIterator++;
    }
    return matchingColumns;
}

function markWinningCells(cells, checkerValue) {
    cells.forEach(cell => {
        let cellElement = document.getElementById(cell[0] + '-' + cell[1]);
        cellElement.classList.add(checkerValue + '-won');
    })
}
// redrawField
function drawField() {
    const connectFourBoard = document.getElementById('connect-four');

    for (let row = 0; row < board.length; row++) {
        const columns = board[row];
        const rowElement = document.createElement('div');
        rowElement.classList.add('board-row');
        connectFourBoard.appendChild(rowElement);

        for (let column = 0; column < columns.length; column++) {
            const checker = columns[column];

            const cellElement = document.createElement('div');
            cellElement.classList.add('board-cell');
            cellElement.classList.add('board-cell-unset')
            
            // add a col index data attribute to the first row since we need to make these cells clickable
            if (row === 0) {
                cellElement.classList.add('first-row-cell');
            }
            cellElement.dataset.row = row + '';
            cellElement.dataset.column = column + '';
            cellElement.id= cellElement.dataset.row + '-' + cellElement.dataset.column;

            const checkerElement = document.createElement('div');
            checkerElement.classList.add('checker');

            if (checker === playerCheckerValue) {
                checkerElement.classList.add('player-checker');
            } else if (checker === kiCheckerValue) {
                checkerElement.classList.add('ki-checker');
            }

            cellElement.appendChild(checkerElement);
            rowElement.appendChild(cellElement)
        }
    }
}


// helper

function notCrossedFirstColumn(columnIdx) {
    return columnIdx > -1;
}

function notCrossedLastColumn(columnIdx) {
    return columnIdx < 7;
}

function notCrossedFirstRow(rowIdx) {
    return rowIdx > -1;
}

function notCrossedLastRow(rowIdx) {
    return rowIdx < 6;
}

