let checkersGamesCounter = 0
const checkersGames = []

document.getElementById('create-new-game-container').addEventListener('click', (event) => {
    event.stopPropagation()
    createCheckersGame()
})
function createCheckersGame() {
    checkersGames.push(createBlankCheckersGame())
    checkersGames[checkersGamesCounter].checkersLogic = createCheckersLogic()
    checkersGames[checkersGamesCounter].UI = createUI()

    checkersGamesCounter++
}
function createBlankCheckersGame() {
    const NewCheckersGame = {
        checkersLogic: "",
        UI: "",
    }
    return NewCheckersGame
}
function getRow(index) {
    return Math.floor(index / 8)
}
function getColumn(index) {
    return index % 8
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
            if (!checkersLogic.inBetweenCaptures && verticalStep == (checkersLogic.logicalBoardSquares[from].color == "white" ? -1 : 1) && Math.abs(horizontalStep) == 1 && checkersLogic.logicalBoardSquares[to].color == undefined)
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
        HowManyOfMyPiecesLeft() {
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
    const UI = {
        checkersLogic : undefined,
        chosenPiece: undefined,
        checkersGameContainer: "checkersGameContainer",
        boardInterface: "boardInterface",
        drawButton: "drawButton",
        resignButton: "resignButton",
        noButton: "noButton",
        yesButton: "yesButton",
        drawOfferModal: "drawOfferModal",
        gameIsDrawModal: "gameIsDrawModal",
        gameIsWonModal: "gameIsWonModal",
        currentTurnBox: "currentTurnBox",
        backDrop: "backDrop",
        printBoard: () => {
            UI.boardInterface.replaceChildren();
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
                    UI.boardInterface.appendChild(theSquare)
                }
            }
            UI.AddPiecesToboardInterface()
        },
        removeHighlight: function () {
            if (UI.chosenPiece != undefined)
                UI.chosenPiece.classList.remove('chosen')
            UI.chosenPiece = undefined
        },
        PieceDragStartHandler: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red"))
                event.preventDefault()
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece != event.target)
                    UI.chosenPiece.classList.remove('chosen')
                event.target.classList.toggle('chosen')
                UI.chosenPiece = event.target
                event.target.parentElement.classList.add("transparent")
            }
        },
        AddPiecesToboardInterface: function () {
            for (let i = 0; i < 63; i++) {
                if (UI.checkersLogic.logicalBoardSquares[i] == undefined || UI.checkersLogic.logicalBoardSquares[i].color == undefined)
                    continue
                UI.boardInterface.children[i].appendChild(UI.CreatePiece(i))
                if (UI.checkersLogic.logicalBoardSquares[i].type == "king") {
                    UI.boardInterface.children[i].appendChild(UI.CreateKing())
                }
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
            if (UI.checkersLogic.logicalBoardSquares[i].color == "white")
                piece.classList.add('white')
            else
                piece.classList.add('red')
            return piece
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
            const piece = event.target.children[0]
            event.stopPropagation()
            let indexFrom
            let indexTo = parseInt(event.target.id)
            if (UI.chosenPiece != undefined)
                indexFrom = parseInt(UI.chosenPiece.parentElement.id)
            if (event.target.classList.contains("white"))
                UI.removeHighlight()
            //if square has a piece
            else if (piece != undefined) {
                //if current turn's piece
                if (piece.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (UI.chosenPiece != undefined && UI.chosenPiece != piece)
                        UI.chosenPiece.classList.remove('chosen')
                        piece.classList.toggle('chosen')
                    UI.chosenPiece = piece
                }
                else
                    UI.removeHighlight()
            }
            //if square is empty
            else {
                if (UI.chosenPiece != undefined && UI.chosenPiece.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red")) {
                    if (UI.checkersLogic.isLegalMove(indexFrom, indexTo)) {
                        if (Math.abs(getRow(indexFrom) - getRow(indexTo)) == 1)
                        UI.checkersLogic.burnPiecesWhichCanCapture()
                        UI.checkersLogic.makeMove(indexFrom, indexTo)
                        if (getRow(indexTo) == (UI.checkersLogic.currentTurn == "white" ? 0 : 7))
                        UI.checkersLogic.logicalBoardSquares[indexTo].type = "king"
                        UI.printBoard()
                        if (UI.canKeepCapturing(indexFrom, indexTo))
                            return
                            UI.checkersLogic.inBetweenCaptures = false
                        if (!UI.checkersLogic.AreThereLegalMoves() && UI.checkersLogic.HowManyOfMyPiecesLeft() == 0)
                            UI.endGameWithWin()
                            UI.checkersLogic.toggleTurn()
                        UI.currentTurnBox.classList.toggle('white')
                        if (!UI.checkersLogic.AreThereLegalMoves())
                            UI.endGameWithWin()
                    }
                    UI.removeHighlight()
                }
                else
                    UI.removeHighlight()
            }
        },
        endGameWithWin: function () {
            UI.gameIsWonModal.innerText = `Game over. ${UI.checkersLogic.currentTurn == "white" ? "Red" : "White"} wins.`
            UI.gameIsWonModal.classList.remove('display-none')
            UI.gameIsWonModal.classList.add(UI.checkersLogic.currentTurn == "white" ? "red" : "white")
            UI.backDrop.classList.remove('display-none')
        },
        canKeepCapturing: function (indexFrom, indexTo) {
            if (Math.abs(getRow(indexTo) - getRow(indexFrom)) == 2 && UI.checkersLogic.canPieceCapture(UI.checkersLogic.logicalBoardSquares[indexTo])) {
                UI.removeHighlight()
                UI.chosenPiece = UI.boardInterface.children[indexTo].firstChild
                UI.chosenPiece.classList.toggle('chosen')
                UI.checkersLogic.inBetweenCaptures = true
                return true
            }
        },
        PieceClick: function (event) {
            event.stopPropagation()
            if (!event.target.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red")) {
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
            if (!event.target.previousElementSibling.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red"))
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
            if (!event.target.previousElementSibling.classList.contains(UI.checkersLogic.currentTurn == "white" ? "white" : "red")) {
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
            backgroundPiece.addEventListener('click', (event)=>{
                event.stopPropagation()
                event.preventDefault()
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
    UI.checkersGameContainer = document.body.children[1].appendChild(createDivWithID('checkers-game-container'))
    UI.currentTurnBox = currentTurnBoxInit()
    UI.boardInterface = UI.checkersGameContainer.appendChild(createDivWithID('chess-board'))
    UI.drawButton = drawButtonInit()
    UI.resignButton = resignButtonInit()
    UI.drawOfferModal = drawOfferModalInit()
    UI.gameIsDrawModal = gameIsDrawModalInit()
    UI.acceptDraw = acceptDrawInit()
    UI.gameIsWonModal = gameIsWonModalInit()
    UI.backDrop = backDropInit()
    UI.noButton = noButtonInit()
    UI.yesButton = yesButtonInit()
    UI.boardInterface.gameID = checkersGamesCounter
    UI.checkersLogic = checkersGames[UI.boardInterface.gameID].checkersLogic
    UI.printBoard()
    console.table(UI)
    return UI

    function createDivWithID(id) {
        div = document.createElement('div')
        div.id = id
        return div
    }
    function currentTurnBoxInit() {
        const currentTurnBox = UI.checkersGameContainer.appendChild(createDivWithID('current-turn'))
        currentTurnBox.innerText = "Current turn"
        currentTurnBox.classList.add('red', 'white')
        return currentTurnBox
    }
    function drawButtonInit() {
        const drawButton = UI.checkersGameContainer.appendChild(createDivWithID('draw-button'))
        drawButton.innerText = "Draw"
        drawButton.addEventListener('click', (event) => {
            event.stopPropagation()
            UI.drawOfferModal.classList.remove('display-none')
            UI.backDrop.classList.remove('display-none')
        })
        return drawButton
    }
    function resignButtonInit() {
        const resignButton = UI.checkersGameContainer.appendChild(createDivWithID('resign-button'))
        resignButton.innerText = "Resign"
        resignButton.addEventListener('click', (event) => {
            event.stopPropagation()
            UI.endGameWithWin()
        })
        return resignButton
    }
    function drawOfferModalInit() {
        const drawOfferModal = UI.checkersGameContainer.appendChild(createDivWithID('draw-offer'))
        drawOfferModal.classList.add('modal', 'display-none')
        return drawOfferModal
    }
    function gameIsDrawModalInit() {
        const gameIsDrawModal = UI.checkersGameContainer.appendChild(createDivWithID('game-is-draw'))
        gameIsDrawModal.innerText = "Game Drawn"
        gameIsDrawModal.classList.add('modal', 'display-none')
        gameIsDrawModal.addEventListener('click', (event) => {
            event.stopPropagation()
        })
        return gameIsDrawModal
    }
    function acceptDrawInit() {
        const acceptDraw = UI.drawOfferModal.appendChild(createDivWithID('accept-draw'))
        acceptDraw.innerText = "Would you like to accept draw?"
        return acceptDraw
    }
    function gameIsWonModalInit() {
        const gameIsWonModal = UI.checkersGameContainer.appendChild(createDivWithID('game-is-won'))
        gameIsWonModal.classList.add('modal', 'display-none')
        gameIsWonModal.addEventListener('click', (event) => {
            event.stopPropagation()
        })
        return gameIsWonModal
    }
    function backDropInit() {
        const backDrop = UI.checkersGameContainer.appendChild(createDivWithID('back-drop'))
        backDrop.classList.add('display-none')
        backDrop.addEventListener('click', (event) => {
            event.stopPropagation()
        })
        return backDrop
    }
    function noButtonInit() {
        const noButton = UI.drawOfferModal.appendChild(createDivWithID('no-button'))
        noButton.classList.add('no', 'button')
        noButton.innerText = "No"
        noButton.addEventListener('click', (event) => {
            //stop propagation?
            UI.drawOfferModal.classList.add('display-none')
            UI.backDrop.classList.add('display-none')
        })
        return noButton
    }
    function yesButtonInit() {
        const yesButton = UI.drawOfferModal.appendChild(createDivWithID('yes-button'))
        yesButton.classList.add('yes', 'button')
        yesButton.innerText = "Yes"
        yesButton.addEventListener('click', (event) => {
            event.stopPropagation()
            UI.drawOfferModal.classList.add('display-none')
            UI.gameIsDrawModal.classList.remove('display-none')
        })
        return yesButton
    }
}