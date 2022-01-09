let checkersGamesCounter = 0
const checkersGames = []
createCheckersGame()
function createCheckersGame() {
    checkersGames.push(createBlankCheckersGame())
    checkersGames[checkersGamesCounter].checkersLogic = createCheckersLogic()
    checkersGames[checkersGamesCounter].userUI = createUserUI()
    // checkersGames[checkersGamesCounter].userUI.graphicalBoard.gameID = checkersGamesCounter

    checkersGamesCounter++
}
function createBlankCheckersGame() {
    const NewCheckersGame = {
        checkersLogic: "",
        userUI: "",
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
function createUserUI() {
    const userUI = {
        chosenPiece: undefined,
        graphicalBoard: document.getElementById('chess-board'),
        drawButton: document.getElementById('draw-button'),
        resignButton: document.getElementById('resign-button'),
        noButton: document.getElementById('no-button'),
        yesButton: document.getElementById('yes-button'),
        drawOfferModal: document.getElementById('draw-offer'),
        gameIsDrawModal: document.getElementById("game-is-draw"),
        gameIsWonModal: document.getElementById("game-is-won"),
        currentTurnBox: document.getElementById("current-turn"),
        backDrop: document.getElementById("back-drop"),//maybe outside maybe dont use
        printBoard: function () {
            originalID = userUI.graphicalBoard.gameID
            userUI.graphicalBoard.replaceChildren();
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
                    theSquare.addEventListener('click', userUI.squareIsTarget)
                    theSquare.addEventListener('drop', userUI.squareIsTarget)
                    theSquare.addEventListener('dragover', (event) => {
                        event.stopPropagation()
                        event.preventDefault()
                    })
                    userUI.graphicalBoard.appendChild(theSquare)
                }
            }
            userUI.graphicalBoard.gameID = originalID
            userUI.AddPiecesToGraphicalBoard()

        },
        removeHighlight: function () {
            if (userUI.chosenPiece != undefined)
                userUI.chosenPiece.classList.remove('chosen')
            userUI.chosenPiece = undefined
        },
        PieceDragStartHandler: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(checkersGames[event.target.parentElement.parentElement.gameID].checkersLogic.currentTurn == "white" ? "white" : "red"))
                event.preventDefault()
            else {
                if (userUI.chosenPiece != undefined && userUI.chosenPiece != event.target)
                    userUI.chosenPiece.classList.remove('chosen')
                event.target.classList.toggle('chosen')
                userUI.chosenPiece = event.target
                event.target.parentElement.classList.add("transparent")
            }
        },
        CreatePiece: function (i, gameID) {
            const piece = document.createElement('div')
            piece.draggable = "true"
            piece.addEventListener('click', userUI.PieceClick)
            piece.addEventListener('dragstart', userUI.PieceDragStartHandler)
            piece.addEventListener('dragover', (event) => {
                event.stopPropagation()
                event.preventDefault()
                event.target.parentElement.classList.remove("transparent")
            })
            piece.classList.add('piece')
            if (checkersGames[gameID].checkersLogic.logicalBoardSquares[i].color == "white")
                piece.classList.add('white')
            else
                piece.classList.add('red')
            return piece
        },
        AddPiecesToGraphicalBoard: function () {
            for (let i = 0; i < 63; i++) {
                if (checkersGames[userUI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i] == undefined || checkersGames[userUI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i].color == undefined)
                    continue
                userUI.graphicalBoard.children[i].appendChild(userUI.CreatePiece(i, userUI.graphicalBoard.gameID))
                if (checkersGames[userUI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[i].type == "king") {
                    userUI.graphicalBoard.children[i].appendChild(userUI.CreateKing())
                }
            }
        },
        CreateKing: function () {
            const king = document.createElement('div')
            king.classList.add("king")
            king.draggable = "true"
            king.addEventListener('click', userUI.KingClick)
            king.addEventListener('dragstart', userUI.KingDragStart)
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
            if (userUI.chosenPiece != undefined)
                indexFrom = parseInt(userUI.chosenPiece.parentElement.id)
            if (event.target.classList.contains("white"))
                userUI.removeHighlight()
            //if square has a piece
            else if (event.target.children[0] != undefined) {
                //if current turn's piece
                if (event.target.children[0].classList.contains(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (userUI.chosenPiece != undefined && userUI.chosenPiece != event.target.children[0])
                        userUI.chosenPiece.classList.remove('chosen')
                    event.target.children[0].classList.toggle('chosen')
                    userUI.chosenPiece = event.target.children[0]
                }
                else
                    userUI.removeHighlight()
            }
            //if square is empty
            else {
                if (userUI.chosenPiece != undefined && userUI.chosenPiece.classList.contains(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (checkersGames[userUI.graphicalBoard.gameID].checkersLogic.isLegalMove(indexFrom, indexTo)) {
                        if (Math.abs(getRow(indexFrom) - getRow(indexTo)) == 1)
                            checkersGames[userUI.graphicalBoard.gameID].checkersLogic.burnPiecesWhichCanCapture()
                        checkersGames[userUI.graphicalBoard.gameID].checkersLogic.makeMove(indexFrom, indexTo)
                        if (getRow(indexTo) == (checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? 0 : 7))
                            checkersGames[userUI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[indexTo].type = "king"
                        userUI.printBoard()
                        if (userUI.canKeepCapturing(indexFrom, indexTo))
                            return
                        checkersGames[userUI.graphicalBoard.gameID].checkersLogic.inBetweenCaptures = false
                        if (!checkersGames[userUI.graphicalBoard.gameID].checkersLogic.AreThereLegalMoves() && checkersGames[userUI.graphicalBoard.gameID].checkersLogic.HowManyPiecesLeft() == 0)
                            userUI.endGameWithWin()
                        checkersGames[userUI.graphicalBoard.gameID].checkersLogic.toggleTurn()
                        userUI.currentTurnBox.classList.toggle('white')
                        if (!checkersGames[userUI.graphicalBoard.gameID].checkersLogic.AreThereLegalMoves())
                            userUI.endGameWithWin()
                    }
                    userUI.removeHighlight()
                }
                else
                    userUI.removeHighlight()
            }
        },
        endGameWithWin: function () {
            userUI.gameIsWonModal.innerText = `Game over. ${checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "Red" : "White"} wins.`
            userUI.gameIsWonModal.classList.remove('display-none')
            userUI.backDrop.classList.remove('display-none')
        },
        canKeepCapturing: function (indexFrom, indexTo) {
            if (Math.abs(getRow(indexTo) - getRow(indexFrom)) == 2 && checkersGames[userUI.graphicalBoard.gameID].checkersLogic.canPieceCapture(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.logicalBoardSquares[indexTo])) {
                userUI.removeHighlight()
                userUI.chosenPiece = userUI.graphicalBoard.children[indexTo].firstChild
                userUI.chosenPiece.classList.toggle('chosen')
                checkersGames[userUI.graphicalBoard.gameID].checkersLogic.inBetweenCaptures = true
                return true
            }
        },
        PieceClick: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                userUI.removeHighlight()
            }
            else {
                if (userUI.chosenPiece != undefined && userUI.chosenPiece != event.target)
                    userUI.chosenPiece.classList.remove('chosen')
                event.target.classList.toggle('chosen')
                userUI.chosenPiece = event.target
            }
        },
        KingClick: function (event) {
            event.stopPropagation()
            if (!event.target.previousElementSibling.classList.contains(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red"))
                userUI.removeHighlight()
            else {
                if (userUI.chosenPiece != undefined && userUI.chosenPiece != event.target.previousElementSibling)
                    userUI.chosenPiece.classList.remove('chosen')
                event.target.previousElementSibling.classList.toggle('chosen')
                userUI.chosenPiece = event.target.previousElementSibling
            }
        },
        KingDragStart: function (event) {
            event.stopPropagation()
            if (!event.target.previousElementSibling.classList.contains(checkersGames[userUI.graphicalBoard.gameID].checkersLogic.currentTurn == "white" ? "white" : "red")) {
                event.preventDefault()
                userUI.removeHighlight()
            }
            else {
                if (userUI.chosenPiece != undefined && userUI.chosenPiece != event.target.previousElementSibling)
                    userUI.chosenPiece.classList.remove('chosen')
                event.target.previousElementSibling.classList.toggle('chosen')
                userUI.chosenPiece = event.target.previousElementSibling
                userUI.addBackgroundPiece(event)
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
    userUI.graphicalBoard.gameID = checkersGamesCounter
    userUI.printBoard()
    return userUI
}

function getRow(index) {
    return Math.floor(index / 8)
}
function getColumn(index) {
    return index % 8
}

// needs to make this work even if more than 1 game

checkersGames[0].userUI.backDrop.addEventListener('click', (event) => {
    event.stopPropagation()
})
checkersGames[0].userUI.resignButton.addEventListener('click', (event) => {
    event.stopPropagation()
    checkersGames[0].userUI.endGameWithWin()
})
checkersGames[0].userUI.drawButton.addEventListener('click', (event) => {
    event.stopPropagation()
    checkersGames[0].userUI.drawOfferModal.classList.remove('display-none')
    checkersGames[0].userUI.backDrop.classList.remove('display-none')
})
checkersGames[0].userUI.yesButton.addEventListener('click', (event) => {
    event.stopPropagation()
    checkersGames[0].userUI.drawOfferModal.classList.add('display-none')
    checkersGames[0].userUI.gameIsDrawModal.classList.remove('display-none')
})
window.addEventListener('click', () => {
    checkersGames[0].userUI.removeHighlight()
    checkersGames[0].userUI.drawOfferModal.classList.add('display-none')
    checkersGames[0].userUI.backDrop.classList.add('display-none')
})
