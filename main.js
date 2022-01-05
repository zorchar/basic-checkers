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
let squaresWhichCanCapture = []

backDrop.addEventListener('click', (event) => {
    event.stopPropagation()
})

resignButton.addEventListener('click', (event) => {
    event.stopPropagation()
    gameIsWonModal.innerText = `Game over. ${currentTurn == "white" ? "red" : "white"} wins`
    gameIsWonModal.classList.remove('display-none')
    backDrop.classList.remove('display-none')
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


initPieces()
printBoard()
window.addEventListener('click', () => {
    removeHighlight()
    drawOfferModal.classList.add('display-none')
    backDrop.classList.add('display-none')
})

function toggleTurn() {
    currentTurn = currentTurn == "white" ? "red" : "white"//change location
}

function getRow(index) {
    return Math.floor(index / 8)
}
function getColumn(index) {
    return index % 8
}

function isLegalMove(from, to) {
    if (logicalBoardSquares[to] == undefined)
        return false
    const verticalStep = getRow(to) - getRow(from)
    const horizontalStep = getColumn(to) - getColumn(from)
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
    logicalBoardSquares[to].color = logicalBoardSquares[from].color
    logicalBoardSquares[to].type = logicalBoardSquares[from].type
    delete logicalBoardSquares[from].color
    delete logicalBoardSquares[from].type
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
            theSquare.addEventListener('click', squareIsClicked)
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

function AddPiecesToGraphicalBoard() {
    for (let i = 0; i < 63; i++) {
        if (logicalBoardSquares[i] == undefined)
            continue
        if (logicalBoardSquares[i].color == undefined)
            continue

        const piece = document.createElement('div')
        piece.addEventListener('click', (event) => {
            event.stopPropagation()
            if (!event.target.classList.contains(currentTurn == "white" ? "white" : "red"))
                removeHighlight()
            else {
                if (chosenPiece != undefined && chosenPiece != event.target)
                    chosenPiece.classList.remove('chosen')
                piece.classList.toggle('chosen')
                chosenPiece = event.target
            }
        })
        piece.classList.add('piece')
        if (logicalBoardSquares[i].color == "white")
            piece.classList.add('white')
        else
            piece.classList.add('red')

        graphicalBoard.children[i].appendChild(piece)

        //if is king
        const king = document.createElement('div')
        king.classList.add("king")

        if (logicalBoardSquares[i].type == "king") {
            graphicalBoard.children[i].appendChild(king)
            king.addEventListener('click', (event) => {
                event.stopPropagation()
                if (!event.target.previousElementSibling.classList.contains(currentTurn == "white" ? "white" : "red"))
                    removeHighlight()
                else {
                    if (chosenPiece != undefined && chosenPiece != event.target.previousElementSibling)
                        chosenPiece.classList.remove('chosen')
                    event.target.previousElementSibling.classList.toggle('chosen')
                    chosenPiece = event.target.previousElementSibling
                }
            })
        }
    }
}

function squareIsClicked(event) {
    let IndexFrom
    let indexTo = parseInt(event.target.id)
    if (chosenPiece != undefined)
        IndexFrom = parseInt(chosenPiece.parentElement.id)

    event.stopPropagation()

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
        //if not current turn's piece
        else
            removeHighlight()
    }
    //if square is empty
    else {
        if (chosenPiece != undefined && chosenPiece.classList.contains(currentTurn == "white" ? "white" : "red")) {
            if (isLegalMove(IndexFrom, indexTo)) {

                if (Math.abs(getRow(IndexFrom) - getRow(indexTo)) == 1) {
                    removeHighlight()
                    // burn pieces
                    for(let square of squaresWhichCanCapture){
                        delete square.color
                        delete square.type
                    }
                }

                makeMove(IndexFrom, indexTo)

                //if reached end
                if (getRow(indexTo) == (currentTurn == "white" ? 0 : 7))
                    logicalBoardSquares[indexTo].type = "king"

                printBoard()

                //check if can keep capturing after capture
                if (Math.abs(getRow(indexTo) - getRow(IndexFrom)) == 2) {
                    console.log("can piece catpture(indexTo): " + canPieceCapture(logicalBoardSquares[indexTo]))
                    if (canPieceCapture(logicalBoardSquares[indexTo])) {
                        removeHighlight()
                        chosenPiece = graphicalBoard.children[indexTo].firstChild
                        chosenPiece.classList.toggle('chosen')
                        inBetweenCaptures = true
                        return
                    }
                }

                inBetweenCaptures = false

                toggleTurn()
                canCurrentPlayerCapture()
                currentTurnBox.classList.toggle('red')
                currentTurnBox.classList.toggle('white')


                if (!isThereLegalMoves()) {
                    gameIsWonModal.innerText = `Game over. ${currentTurn == "white" ? "red" : "white"} wins`
                    gameIsWonModal.classList.remove('display-none')
                    backDrop.classList.remove('display-none')
                }


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

function canCurrentPlayerCapture() {
    let canCapture = false
    squaresWhichCanCapture = []
    for (let square of logicalBoardSquares) {
        if (square == undefined || square.type == undefined || square.color != currentTurn)
            continue
        if (canPieceCapture(square)) {
            squaresWhichCanCapture.push(square)
            canCapture = true
        }
    }
    return canCapture
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

// function endGameInDraw(){
// }