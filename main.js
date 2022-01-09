let currentTurn = "white"
let chosenPiece
const graphicalBoard = document.getElementById('chess-board')
const blackSquares = document.getElementsByClassName('black square')
let logicalBoardSquares = []
let inBetweenCaptures = false
const drawButton = document.getElementById('draw-button')
const resignButton = document.getElementById('resign-button')
const noButton = document.getElementById('no-button')
const yesButton = document.getElementById('yes-button')
const drawOfferModal = document.getElementById('draw-offer')
const gameIsDrawModal = document.getElementById("game-is-draw")
const gameIsWonModal = document.getElementById("game-is-won")
const currentTurnBox = document.getElementById("current-turn")
const backDrop = document.getElementById("back-drop")

backDrop.addEventListener('click', (event) => {
    event.stopPropagation()
})
resignButton.addEventListener('click', (event) => {
    event.stopPropagation()
    endGameWithWin()
})
drawButton.addEventListener('click', (event) => {
    event.stopPropagation()
    drawOfferModal.classList.remove('display-none')
    backDrop.classList.remove('display-none')
})
yesButton.addEventListener('click', (event) => {
    event.stopPropagation()
    drawOfferModal.classList.add('display-none')
    gameIsDrawModal.classList.remove('display-none')
})
window.addEventListener('click', () => {
    removeHighlight()
    drawOfferModal.classList.add('display-none')
    backDrop.classList.add('display-none')
})
initPieces()
printBoard()
function toggleTurn() {
    currentTurn = currentTurn == "white" ? "red" : "white"
    currentTurnBox.classList.toggle('white')
}
function getRow(index) {
    return Math.floor(index / 8)
}
function getColumn(index) {
    return index % 8
}
function isLegalMove(from, to) {
    const verticalStep = getRow(to) - getRow(from)
    const horizontalStep = getColumn(to) - getColumn(from)
    if (logicalBoardSquares[to] == undefined)
        return false
    if (!inBetweenCaptures && verticalStep == (logicalBoardSquares[from].color == "white" ? -1 : 1) && Math.abs(horizontalStep) == 1 && logicalBoardSquares[to].type == undefined)
        return true
    else if (Math.abs(verticalStep) == 2 && Math.abs(horizontalStep) == 2 && logicalBoardSquares[to].type == undefined && logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].color == (logicalBoardSquares[from].color == "white" ? "red" : "white"))
        return true
    else if (logicalBoardSquares[from].type == "king") {
        if (Math.abs(verticalStep) == 1 && Math.abs(horizontalStep) == 1 && logicalBoardSquares[to].type == undefined)
            return true
    }
    return false
}
function makeMove(from, to) {
    const verticalStep = getRow(to) - getRow(from)
    const horizontalStep = getColumn(to) - getColumn(from)
    logicalBoardSquares[to].type = logicalBoardSquares[from].type
    logicalBoardSquares[to].color = logicalBoardSquares[from].color
    delete logicalBoardSquares[from].type
    delete logicalBoardSquares[from].color
    if (Math.abs(horizontalStep) == 2) {
        delete logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].type
        delete logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].color
    }
}
function printBoard() {
    graphicalBoard.replaceChildren();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const whiteSquare = document.createElement('div')
            whiteSquare.classList.add('white', 'square')
            const blackSquare = document.createElement('div')
            blackSquare.classList.add('black', 'square')
            let theSquare
            if (i % 2 == 0)
                theSquare = j % 2 == 0 ? whiteSquare : blackSquare
            else
                theSquare = j % 2 == 0 ? blackSquare : whiteSquare
            theSquare.id = i * 8 + j
            theSquare.addEventListener('click', squareIsTarget)
            theSquare.addEventListener('drop', squareIsTarget)
            theSquare.addEventListener('dragover', (event) => {
                event.stopPropagation()
                event.preventDefault()
            })
            graphicalBoard.appendChild(theSquare)
        }
    }
    AddPiecesToGraphicalBoard()
}
function initPieces() {
    for (let i = 0; i < 24; i++) {
        if (getRow(i) % 2 == 0) {
            if ((getColumn(i)) % 2 == 1)
                logicalBoardSquares[i] = { type: "pawn", color: "red", id: i }
        }
        else
            if (getColumn(i) % 2 == 0)
                logicalBoardSquares[i] = { type: "pawn", color: "red", id: i }
    }
    for (let i = 24; i < 40; i++) {
        if (getRow(i) % 2 == 0) {
            if ((getColumn(i)) % 2 == 1)
                logicalBoardSquares[i] = { id: i }
        }
        else {
            if (getColumn(i) % 2 == 0)
                logicalBoardSquares[i] = { id: i }
        }
    }
    for (let i = 40; i < 64; i++) {
        if (getRow(i) % 2 == 0) {
            if (getColumn(i) % 2 == 1)
                logicalBoardSquares[i] = { type: "pawn", color: "white", id: i }
        }
        else
            if (getColumn(i) % 2 == 0)
                logicalBoardSquares[i] = { type: "pawn", color: "white", id: i }
    }
}
function removeHighlight() {
    if (chosenPiece != undefined)
        chosenPiece.classList.remove('chosen')
    chosenPiece = undefined
}
function PieceDragStart(event) {
    event.stopPropagation()
    if (!event.target.classList.contains(currentTurn == "white" ? "white" : "red"))
        event.preventDefault()
    else {
        if (chosenPiece != undefined && chosenPiece != event.target)
            chosenPiece.classList.remove('chosen')
        event.target.classList.toggle('chosen')
        chosenPiece = event.target
        event.target.parentElement.classList.add("transparent")
    }
}
function CreatePiece(i) {
    const piece = document.createElement('div')
    piece.draggable = "true"
    piece.addEventListener('click', PieceClick)
    piece.addEventListener('dragstart', PieceDragStart)
    piece.addEventListener('dragover', (event) => {
        event.stopPropagation()
        event.preventDefault()
        event.target.parentElement.classList.remove("transparent")
    })
    piece.classList.add('piece')
    if (logicalBoardSquares[i].color == "white")
        piece.classList.add('white')
    else
        piece.classList.add('red')
    return piece
}
function AddPiecesToGraphicalBoard() {
    for (let i = 0; i < 63; i++) {
        if (logicalBoardSquares[i] == undefined || logicalBoardSquares[i].color == undefined)
            continue
        graphicalBoard.children[i].appendChild(CreatePiece(i))
        if (logicalBoardSquares[i].type == "king") {
            graphicalBoard.children[i].appendChild(CreateKing())
        }
    }
}
function CreateKing() {
    const king = document.createElement('div')
    king.classList.add("king")
    king.draggable = "true"
    king.addEventListener('click', KingClick)
    king.addEventListener('dragstart', KingDragStart)
    king.addEventListener('dragover', (event) => {
        event.stopPropagation()
        event.preventDefault()
        event.target.parentElement.classList.remove("transparent")
    })
    return king
}
function squareIsTarget(event) {
    event.stopPropagation()
    let indexFrom
    let indexTo = parseInt(event.target.id)
    if (chosenPiece != undefined)
        indexFrom = parseInt(chosenPiece.parentElement.id)
    if (event.target.classList.contains("white"))
        removeHighlight()
    //if square has a piece
    else if (event.target.children[0] != undefined) {
        //if current turn's piece
        if (event.target.children[0].classList.contains(currentTurn == "white" ? "white" : "red")) {
            if (chosenPiece != undefined && chosenPiece != event.target.children[0])
                chosenPiece.classList.remove('chosen')
            event.target.children[0].classList.toggle('chosen')
            chosenPiece = event.target.children[0]
        }
        else
            removeHighlight()
    }
    //if square is empty
    else {
        if (chosenPiece != undefined && chosenPiece.classList.contains(currentTurn == "white" ? "white" : "red")) {
            if (isLegalMove(indexFrom, indexTo)) {
                if (Math.abs(getRow(indexFrom) - getRow(indexTo)) == 1)
                    burnPiecesWhichCanCapture()
                makeMove(indexFrom, indexTo)
                if (getRow(indexTo) == (currentTurn == "white" ? 0 : 7))
                    logicalBoardSquares[indexTo].type = "king"
                printBoard()
                if (canKeepCapturing(indexFrom, indexTo))
                    return
                inBetweenCaptures = false
                if (!isThereLegalMoves())
                    endGameWithWin()
                toggleTurn()
                if (!isThereLegalMoves())
                    endGameWithWin()
            }
            removeHighlight()
        }
        else
            removeHighlight()
    }
}
function isThereLegalMoves() {
    for (let square of logicalBoardSquares) {
        if (square == undefined || square.type == undefined || square.color != currentTurn)
            continue
        for (let i = 0; i < 63; i++)
            if (square.id != undefined && isLegalMove(square.id, i))
                return true
    }
    return false
}
function burnPiecesWhichCanCapture() {
    for (let square of logicalBoardSquares) {
        if (square == undefined || square.type == undefined || square.color != currentTurn)
            continue
        if (canPieceCapture(square)) {
            delete square.color
            delete square.type
        }
    }
}
function canPieceCapture(squarePiece) {
    if (getRow(squarePiece.id) + 2 < 8 && getColumn(squarePiece.id) + 2 < 8)
        if (isLegalMove(squarePiece.id, squarePiece.id + 18))
            return true
    if (getRow(squarePiece.id) + 2 < 8 && getColumn(squarePiece.id) - 2 < 8)
        if (isLegalMove(squarePiece.id, squarePiece.id + 14))
            return true
    if (getRow(squarePiece.id) - 2 < 8 && getColumn(squarePiece.id) + 2 < 8)
        if (isLegalMove(squarePiece.id, squarePiece.id - 14))
            return true
    if (getRow(squarePiece.id) - 2 < 8 && getColumn(squarePiece.id) - 2 < 8)
        if (isLegalMove(squarePiece.id, squarePiece.id - 18))
            return true
    return false
}
function endGameWithWin() {
    gameIsWonModal.innerText = `Game over. ${currentTurn == "white" ? "Red" : "White"} wins.`
    gameIsWonModal.classList.remove('display-none')
    backDrop.classList.remove('display-none')
}
function canKeepCapturing(indexFrom, indexTo) {
    if (Math.abs(getRow(indexTo) - getRow(indexFrom)) == 2 && canPieceCapture(logicalBoardSquares[indexTo])) {
        removeHighlight()
        chosenPiece = graphicalBoard.children[indexTo].firstChild
        chosenPiece.classList.toggle('chosen')
        inBetweenCaptures = true
        return true
    }
}
function PieceClick(event) {
    event.stopPropagation()
    if (!event.target.classList.contains(currentTurn == "white" ? "white" : "red")) {
        removeHighlight()
    }
    else {
        if (chosenPiece != undefined && chosenPiece != event.target)
            chosenPiece.classList.remove('chosen')
        event.target.classList.toggle('chosen')
        chosenPiece = event.target
    }
}
function KingClick(event) {
    event.stopPropagation()
    if (!event.target.previousElementSibling.classList.contains(currentTurn == "white" ? "white" : "red"))
        removeHighlight()
    else {
        if (chosenPiece != undefined && chosenPiece != event.target.previousElementSibling)
            chosenPiece.classList.remove('chosen')
        event.target.previousElementSibling.classList.toggle('chosen')
        chosenPiece = event.target.previousElementSibling
    }
}
function KingDragStart(event) {
    event.stopPropagation()
    if (!event.target.previousElementSibling.classList.contains(currentTurn == "white" ? "white" : "red")) {
        event.preventDefault()
        removeHighlight()
    }
    else {
        if (chosenPiece != undefined && chosenPiece != event.target.previousElementSibling)
            chosenPiece.classList.remove('chosen')
        event.target.previousElementSibling.classList.toggle('chosen')
        chosenPiece = event.target.previousElementSibling
        // add piece background
        const backgroundPiece = document.createElement('div')
        backgroundPiece.addEventListener('dragover', (event) => {
            event.stopPropagation()
            event.preventDefault()

            event.target.parentElement.parentElement.classList.remove("transparent")
        })
        backgroundPiece.classList.add('piece')
        if (logicalBoardSquares[event.target.parentElement.id].color == "white")
            event.target.previousElementSibling.classList.add('white')
        else
            event.target.previousElementSibling.classList.add('red')
        if (event.target.children[0] == undefined)
            event.target.appendChild(backgroundPiece)
        event.target.parentElement.classList.add("transparent")
    }
}
