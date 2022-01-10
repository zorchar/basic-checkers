let checkersGamesCounter = 0
const checkersGames = []

function createCheckersGame() {
    checkersGames.push(createBlankCheckersGame())
    checkersGames[checkersGamesCounter].checkersLogic = createCheckersLogic()
    checkersGames[checkersGamesCounter].UI = createUI()
    // checkersGames[checkersGamesCounter].UI.graphicalBoard.gameID = checkersGamesCounter

    checkersGamesCounter++
}
function createBlankCheckersGame() {
    const NewCheckersGame = {
        checkersLogic: "",
        UI: "",
    }
    return NewCheckersGame
}
function createCheckersLogic() {
    const checkersLogic = {
        currentTurn: "white",
        logicalBoardSquares: [],
        inBetweenCaptures: false,
        toggleTurn: function () {
            checkersLogic.currentTurn = checkersLogic.currentTurn == "white" ? "red" : "white"
        },
        initPieces: function () {
            for (let i = 0; i < 24; i++) {
                if (getRow(i) % 2 == 0) {
                    if ((getColumn(i)) % 2 == 1)
                        checkersLogic.logicalBoardSquares[i] = { type: "pawn", color: "red", id: i }
                }
                else
                    if (getColumn(i) % 2 == 0)
                        checkersLogic.logicalBoardSquares[i] = { type: "pawn", color: "red", id: i }
            }
            for (let i = 24; i < 40; i++) {
                if (getRow(i) % 2 == 0) {
                    if ((getColumn(i)) % 2 == 1)
                        checkersLogic.logicalBoardSquares[i] = { id: i }
                }
                else {
                    if (getColumn(i) % 2 == 0)
                        checkersLogic.logicalBoardSquares[i] = { id: i }
                }
            }
            for (let i = 40; i < 64; i++) {
                if (getRow(i) % 2 == 0) {
                    if (getColumn(i) % 2 == 1)
                        checkersLogic.logicalBoardSquares[i] = { type: "pawn", color: "white", id: i }
                }
                else
                    if (getColumn(i) % 2 == 0)
                        checkersLogic.logicalBoardSquares[i] = { type: "pawn", color: "white", id: i }
            }
        },
        isLegalMove: function (from, to) {
            const verticalStep = getRow(to) - getRow(from)
            const horizontalStep = getColumn(to) - getColumn(from)
            if (checkersLogic.logicalBoardSquares[to] == undefined)
                return false
            if (!checkersLogic.inBetweenCaptures && verticalStep == (checkersLogic.logicalBoardSquares[from].color == "white" ? -1 : 1) && Math.abs(horizontalStep) == 1 && checkersLogic.logicalBoardSquares[to].type == undefined)
                return true
            else if (Math.abs(verticalStep) == 2 && Math.abs(horizontalStep) == 2 && checkersLogic.logicalBoardSquares[to].type == undefined && checkersLogic.logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].color == (checkersLogic.logicalBoardSquares[from].color == "white" ? "red" : "white"))
                return true
            else if (checkersLogic.logicalBoardSquares[from].type == "king") {
                if (Math.abs(verticalStep) == 1 && Math.abs(horizontalStep) == 1 && checkersLogic.logicalBoardSquares[to].type == undefined)
                    return true
            }
            return false
        },
        makeMove: function (from, to) {
            const verticalStep = getRow(to) - getRow(from)
            const horizontalStep = getColumn(to) - getColumn(from)
            checkersLogic.logicalBoardSquares[to].type = checkersLogic.logicalBoardSquares[from].type
            checkersLogic.logicalBoardSquares[to].color = checkersLogic.logicalBoardSquares[from].color
            delete checkersLogic.logicalBoardSquares[from].type
            delete checkersLogic.logicalBoardSquares[from].color
            if (Math.abs(horizontalStep) == 2) {
                delete checkersLogic.logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].type
                delete checkersLogic.logicalBoardSquares[from + horizontalStep / 2 + verticalStep / 2 * 8].color
            }
        },
        AreThereLegalMoves: function () {
            for (let square of checkersLogic.logicalBoardSquares) {
                if (square == undefined || square.type == undefined || square.color != checkersLogic.currentTurn)
                    continue
                for (let i = 0; i < 63; i++)
                    if (square.id != undefined && checkersLogic.isLegalMove(square.id, i))
                        return true
            }
            return false
        },
        burnPiecesWhichCanCapture: function () {
            for (let square of checkersLogic.logicalBoardSquares) {
                if (square == undefined || square.type == undefined || square.color != checkersLogic.currentTurn)
                    continue
                if (checkersLogic.canPieceCapture(square)) {
                    delete square.color
                    delete square.type
                }
            }
        },
        canPieceCapture: function (squarePiece) {
            if (getRow(squarePiece.id) + 2 < 8 && getColumn(squarePiece.id) + 2 < 8)
                if (checkersLogic.isLegalMove(squarePiece.id, squarePiece.id + 18))
                    return true
            if (getRow(squarePiece.id) + 2 < 8 && getColumn(squarePiece.id) - 2 < 8)
                if (checkersLogic.isLegalMove(squarePiece.id, squarePiece.id + 14))
                    return true
            if (getRow(squarePiece.id) - 2 < 8 && getColumn(squarePiece.id) + 2 < 8)
                if (checkersLogic.isLegalMove(squarePiece.id, squarePiece.id - 14))
                    return true
            if (getRow(squarePiece.id) - 2 < 8 && getColumn(squarePiece.id) - 2 < 8)
                if (checkersLogic.isLegalMove(squarePiece.id, squarePiece.id - 18))
                    return true
            return false
        },
        HowManyPiecesLeft() {
            let pieceCounter = 0
            for (let square of this.logicalBoardSquares) {
                if (square != undefined && square.color == this.currentTurn)
                    pieceCounter++
            }
            return pieceCounter
        }
    }
    checkersLogic.initPieces()
    return checkersLogic
}
function createUI() {
    function createDivWithID(id) {
        div = document.createElement('div')
        div.id = id
        return div
    }
    // create board visually
    // graphicalBoard = document.createElement('div')
    // graphicalBoard.id = 'chess-board'
    // //append chess board to document
    // document.body.appendChild(graphicalBoard)

    //create buttons
    // drawButton = document.createElement('div')
    // drawButton.id = 'draw-button'
    // //append draw button
    // graphicalBoard.appendChild(drawButton)

    // resignButton = document.createElement('div')
    // resignButton.id = 'resign-button'
    // //append resign button
    // graphicalBoard.appendChild(resignButton)

    const checkersGameContainer = document.body.appendChild(createDivWithID('checkers-game-container'))
    const graphicalBoard = checkersGameContainer.appendChild(createDivWithID('chess-board'))
    const resignButton = checkersGameContainer.appendChild(createDivWithID('resign-button'))
    resignButton.innerText = "Resign"
    resignButton.addEventListener('click', (event) => {
        event.stopPropagation()
        UI.endGameWithWin()
    })
    const drawButton = checkersGameContainer.appendChild(createDivWithID('draw-button'))
    drawButton.innerText = "Draw"
    drawButton.addEventListener('click', (event) => {
        event.stopPropagation()
        drawOfferModal.classList.remove('display-none')
        backDrop.classList.remove('display-none')
    })
    const drawOfferModal = checkersGameContainer.appendChild(createDivWithID('draw-offer'))
    drawOfferModal.classList.add('modal', 'display-none')
    const gameIsDrawModal = checkersGameContainer.appendChild(createDivWithID('game-is-draw'))
    gameIsDrawModal.innerText = "Game Drawn"
    gameIsDrawModal.classList.add('modal', 'display-none')
    gameIsDrawModal.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    const acceptDraw = drawOfferModal.appendChild(createDivWithID('accept-draw'))
    acceptDraw.innerText = "Would you like to accept draw?"
    const gameIsWonModal = checkersGameContainer.appendChild(createDivWithID('game-is-won'))
    gameIsWonModal.classList.add('modal', 'display-none')
    gameIsWonModal.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    const currentTurnBox = checkersGameContainer.appendChild(createDivWithID('current-turn'))
    currentTurnBox.innerText = "Current turn"
    currentTurnBox.classList.add('red', 'white')
    const backDrop = checkersGameContainer.appendChild(createDivWithID('back-drop'))
    backDrop.classList.add('display-none')
    backDrop.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    const noButton = drawOfferModal.appendChild(createDivWithID('no-button'))
    noButton.classList.add('no', 'button')
    noButton.innerText = "No"
    const yesButton = drawOfferModal.appendChild(createDivWithID('yes-button'))
    yesButton.classList.add('yes', 'button')
    yesButton.innerText = "Yes"
    yesButton.addEventListener('click', (event) => {
        event.stopPropagation()
        drawOfferModal.classList.add('display-none')
        gameIsDrawModal.classList.remove('display-none')
    })
    const UI = {
        chosenPiece: undefined,
        checkersGameContainer: checkersGameContainer,
        graphicalBoard: graphicalBoard,
        drawButton: drawButton,
        resignButton: resignButton,
        noButton: noButton,
        yesButton: yesButton,
        drawOfferModal: drawOfferModal,
        gameIsDrawModal: gameIsDrawModal,
        gameIsWonModal: gameIsWonModal,
        currentTurnBox: currentTurnBox,
        backDrop: backDrop,//maybe outside maybe dont use
        printBoard: function () {
            UI.graphicalBoard.replaceChildren();
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
                    theSquare.addEventListener('click', UI.squareIsTarget)
                    theSquare.addEventListener('drop', UI.squareIsTarget)
                    theSquare.addEventListener('dragover', (event) => {
                        event.stopPropagation()
                        event.preventDefault()
                    })
                    UI.graphicalBoard.appendChild(theSquare)
                }
            }
            UI.AddPiecesToGraphicalBoard()

        },
        removeHighlight: function () {
            if (UI.chosenPiece != undefined)
                UI.chosenPiece.classList.remove('chosen')
            UI.chosenPiece = undefined
        },
        PieceDragStartHandler: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red"))
                event.preventDefault()
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece != event.target)
                    UI.chosenPiece.classList.remove('chosen')
                event.target.classList.toggle('chosen')
                UI.chosenPiece = event.target
                event.target.parentElement.classList.add("transparent")
            }
        },
        CreatePiece: function (i) {
            const piece = document.createElement('div')
            piece.draggable = "true"
            piece.addEventListener('click', UI.PieceClick)
            piece.addEventListener('dragstart', UI.PieceDragStartHandler)
            piece.addEventListener('dragover', (event) => {
                event.stopPropagation()
                event.preventDefault()
                event.target.parentElement.classList.remove("transparent")
            })
            piece.classList.add('piece')
            if (checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i].color == "white")
                piece.classList.add('white')
            else
                piece.classList.add('red')
            return piece
        },
        AddPiecesToGraphicalBoard: function () {
            for (let i = 0; i < 63; i++) {
                if (checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i] == undefined || checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i].color == undefined)
                    continue
                UI.graphicalBoard.children[i].appendChild(UI.CreatePiece(i))
                if (checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i].type == "king") {
                    UI.graphicalBoard.children[i].appendChild(UI.CreateKing())
                }
            }
        },
        CreateKing: function () {
            const king = document.createElement('div')
            king.classList.add("king")
            king.draggable = "true"
            king.addEventListener('click', UI.KingClick)
            king.addEventListener('dragstart', UI.KingDragStart)
            king.addEventListener('dragover', (event) => {
                event.stopPropagation()
                event.preventDefault()
                event.target.parentElement.classList.remove("transparent")
            })
            return king
        },
        squareIsTarget: function (event) {
            event.stopPropagation()
            let indexFrom
            let indexTo = parseInt(event.target.id)
            if (UI.chosenPiece != undefined)
                indexFrom = parseInt(UI.chosenPiece.parentElement.id)
            if (event.target.classList.contains("white"))
                UI.removeHighlight()
            //if square has a piece
            else if (event.target.children[0] != undefined) {
                //if current turn's piece
                if (event.target.children[0].classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (UI.chosenPiece != undefined && UI.chosenPiece != event.target.children[0])
                        UI.chosenPiece.classList.remove('chosen')
                    event.target.children[0].classList.toggle('chosen')
                    UI.chosenPiece = event.target.children[0]
                }
                else
                    UI.removeHighlight()
            }
            //if square is empty
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece.classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (checkersGames[UI.graphicalBoard.gameID].checkersLogic.isLegalMove(indexFrom, indexTo)) {
                        if (Math.abs(getRow(indexFrom) - getRow(indexTo)) == 1)
                            checkersGames[UI.graphicalBoard.gameID].checkersLogic.burnPiecesWhichCanCapture()
                        checkersGames[UI.graphicalBoard.gameID].checkersLogic.makeMove(indexFrom, indexTo)
                        if (getRow(indexTo) == (checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? 0 : 7))
                            checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[indexTo].type = "king"
                        UI.printBoard()
                        if (UI.canKeepCapturing(indexFrom, indexTo))
                            return
                        checkersGames[UI.graphicalBoard.gameID].checkersLogic.inBetweenCaptures = false
                        if (!checkersGames[UI.graphicalBoard.gameID].checkersLogic.AreThereLegalMoves() && checkersGames[UI.graphicalBoard.gameID].checkersLogic.HowManyPiecesLeft() == 0)
                            UI.endGameWithWin()
                        checkersGames[UI.graphicalBoard.gameID].checkersLogic.toggleTurn()
                        UI.currentTurnBox.classList.toggle('white')
                        if (!checkersGames[UI.graphicalBoard.gameID].checkersLogic.AreThereLegalMoves())
                            UI.endGameWithWin()
                    }
                    UI.removeHighlight()
                }
                else
                    UI.removeHighlight()
            }
        },
        endGameWithWin: function () {
            UI.gameIsWonModal.innerText = `Game over. ${checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "Red" : "White"} wins.`
            UI.gameIsWonModal.classList.remove('display-none')
            UI.gameIsWonModal.classList.add(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "red" : "white")
            UI.backDrop.classList.remove('display-none')
        },
        canKeepCapturing: function (indexFrom, indexTo) {
            if (Math.abs(getRow(indexTo) - getRow(indexFrom)) == 2 && checkersGames[UI.graphicalBoard.gameID].checkersLogic.canPieceCapture(checkersGames[UI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[indexTo])) {
                UI.removeHighlight()
                UI.chosenPiece = UI.graphicalBoard.children[indexTo].firstChild
                UI.chosenPiece.classList.toggle('chosen')
                checkersGames[UI.graphicalBoard.gameID].checkersLogic.inBetweenCaptures = true
                return true
            }
        },
        PieceClick: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                UI.removeHighlight()
            }
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece != event.target)
                    UI.chosenPiece.classList.remove('chosen')
                event.target.classList.toggle('chosen')
                UI.chosenPiece = event.target
            }
        },
        KingClick: function (event) {
            event.stopPropagation()
            if (!event.target.previousElementSibling.classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red"))
                UI.removeHighlight()
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece != event.target.previousElementSibling)
                    UI.chosenPiece.classList.remove('chosen')
                event.target.previousElementSibling.classList.toggle('chosen')
                UI.chosenPiece = event.target.previousElementSibling
            }
        },
        KingDragStart: function (event) {
            event.stopPropagation()
            if (!event.target.previousElementSibling.classList.contains(checkersGames[UI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                event.preventDefault()
                UI.removeHighlight()
            }
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece != event.target.previousElementSibling)
                    UI.chosenPiece.classList.remove('chosen')
                event.target.previousElementSibling.classList.toggle('chosen')
                UI.chosenPiece = event.target.previousElementSibling
                UI.addBackgroundPiece(event)
            }
        },
        addBackgroundPiece: function (event) {
            const backgroundPiece = document.createElement('div')
            backgroundPiece.addEventListener('dragover', (event) => {
                event.stopPropagation()
                event.preventDefault()
                event.target.parentElement.parentElement.classList.remove("transparent")
            })
            backgroundPiece.classList.add('piece')
            if (checkersGames[event.target.parentElement.parentElement.gameID].checkersLogic.logicalBoardSquares[event.target.parentElement.id].color == "white")
                event.target.previousElementSibling.classList.add('white')
            else
                event.target.previousElementSibling.classList.add('red')
            if (event.target.children[0] == undefined)
                event.target.appendChild(backgroundPiece)
            event.target.parentElement.classList.add("transparent")

        }
    }
    UI.graphicalBoard.gameID = checkersGamesCounter
    UI.printBoard()
    return UI
}

function getRow(index) {
    return Math.floor(index / 8)
}
function getColumn(index) {
    return index % 8
}

// needs to make this work even if more than 1 game

// checkersGames[0].UI.backDrop.addEventListener('click', (event) => {
//     event.stopPropagation()
// })
// checkersGames[0].UI.resignButton.addEventListener('click', (event) => {
//     event.stopPropagation()
//     checkersGames[0].UI.endGameWithWin()
// })
// checkersGames[0].UI.drawButton.addEventListener('click', (event) => {
//     event.stopPropagation()
//     checkersGames[0].UI.drawOfferModal.classList.remove('display-none')
//     checkersGames[0].UI.backDrop.classList.remove('display-none')
// })
// checkersGames[0].UI.yesButton.addEventListener('click', (event) => {
//     event.stopPropagation()
//     checkersGames[0].UI.drawOfferModal.classList.add('display-none')
//     checkersGames[0].UI.gameIsDrawModal.classList.remove('display-none')
// })
window.addEventListener('click', () => {
    for (let game of checkersGames) {
        game.UI.removeHighlight()
        game.UI.drawOfferModal.classList.add('display-none')
        game.UI.backDrop.classList.add('display-none')
    }
})
document.getElementById('create-new-game-container').addEventListener('click', (event)=>{
    event.stopPropagation()
    createCheckersGame()
})
