//array of all the cards
const cardObjectDefinitions = [
    {id:1 , imagePath:'https://i.ibb.co/jH7r9bh/card-King-Hearts.png'},
    {id:2 , imagePath:'https://i.ibb.co/jLX3zqQ/card-Jack-Clubs.png'},
    {id:3 , imagePath:'https://i.ibb.co/p3knS92/card-Queen-Diamonds.png'},
    {id:4 , imagePath:'https://i.ibb.co/nnkSY2s/card-Ace-Spades.png'}
]

// correct card to choose ID
aceId = 4

//src to back of the card
const cardBackImgPath = 'https://i.ibb.co/1qy5FqK/card-back-Blue.png'

// reference to card container element
const cardContainerElem = document.querySelector('.card-container')
// reference to score container element
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
//reference to round container element
const roundCountainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

let cards = [] //holds all the cards

const playGameButtonElem = document.getElementById('playGame')
const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"
const numCards = cardObjectDefinitions.length

//stores card positions
let cardPositons = [];

// progress indicators
gameInProgress = false 
shufflingInProgress = false 
cardsRevealed = false

// game win - loss status indicators and colors
const currentGameStatusElem = document.querySelector('.current-status')
const winColor = "green"
const loseColor = "red"
const primaryColor = "black"

// game scores & rounds
let roundNum = 0
let maxRounds = 4
let score = 0

loadGame() // loads the game

/**
 * function to close the game and print a message to let the user know 
 * about it
 */
function gameOver(){
    updateStatusElement(scoreContainerElem, "none")
    updateStatusElement(roundCountainerElem,"none")

    const gameOverMsg = `Game Over! Final Score - <span class='badge'> ${score}</span>
                        Click 'Play Game' button to play again`

    updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMsg)

    gameInProgress = false
    playGameButtonElem.disabled = false
}

/**
 * function that deals with whether to move the game to the next round
 * if the max number of rounds have not been reached yet or to end the game
 * if the max number of rounds have been reached
 */
function endRound(){
    setTimeout(() =>{
        if(roundNum == maxRounds){
            gameOver()
            return
        }
        else{
            startRound()
        }
    },3000)
}

/**
 * executes when the user presses a card 
 * @param {HTMLElement} card the card choosen
 */
function chooseCard(card){
    if(canChooseCard()){
        evaluateCardChoice(card)
        flipCard(card, false)

        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Card positions revealed")

            endRound()
        }, 3000)
        cardsRevealed = true
    }
}

/**
 * function to gift point for each round if the user was able to find
 * the ACE
 * @param {number} roundNum number of rounds 
 * @returns points for a round
 */
function calculateScoreToAdd(roundNum){
    if(roundNum == 1){
        return 100
    }
    else if(roundNum == 2){
        return 50
    }
    else if(roundNum == 3){
        return 25
    }
    else{
        return 10
    }
}

/**
 * calculates the total number of points with each round being played
 */
function calculateScore(){
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}

/**
 * displays the updated score
 */
function updateScore(){
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `<span class='badge'>${score}</span>`)
}

/**
 * function to display status of the game to the user
 * @param {HTMLElement} elem 
 * @param {DistanceModelType} display 
 * @param {color} color 
 * @param {string} innerHTML 
 */
function updateStatusElement(elem, display, color, innerHTML){
    elem.style.display = display

    if(arguments.length > 2){
        elem.style.color = color
        elem.innerHTML = innerHTML
    }
}

/**
 * displays feedback to user for both correct choice and vice-versa
 * @param {boolean} correct 
 */
function outputChoiceFeedBack(correct){
    if(correct){
        updateStatusElement(currentGameStatusElem, "block", winColor, "Well Done!! :)")
    }
    else{
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
    }
}

/**
 * checks whether the choosen card by the user is correct or not
 * @param {HTMLElement} card 
 */
function evaluateCardChoice(card){
    if(card.id == aceId){
        updateScore()
        outputChoiceFeedBack(true)
    }
    else{
        outputChoiceFeedBack(false)
    }
}

/**
 * indicates whether or not the game lets the user make a card choice
 * @returns boolean value indicating if there is any on going task
 */
function canChooseCard(){
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}

/**
 * function to launch the game
 */
function loadGame(){
    generateCards()
    cards = document.querySelectorAll('.card')
}

/**
 * function to start the game when the user presses start
 */
function startGame(){
    initializeNewGame() 
    startRound()   
}

/**
 * function to start the game round
 */
function startRound(){
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCard()
}

/**
 * function to initialize a new round of game
 */
function initializeNewRound(){
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...")
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)
}

/**
 * function to initialize new game
 */
function initializeNewGame(){
    score = 0
    roundNum = 0
    shufflingInProgress = false

    updateStatusElement(scoreContainerElem,"flex")
    updateStatusElement(roundCountainerElem,"flex")

    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)
}

/**
 * fuction to collect all cards from the grid and pile them up in one
 * position
 */
function collectCards(){
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)

}

/**
 * function to change the grid layout to only one postion
 * @param {CSSTransformComponent} areas 
 */
function transformGridArea(areas){
    cardContainerElem.style.gridTemplateAreas = areas

}

/**
 * helper function to add the cards to one cell of the grid
 * @param {string} cellPositionClassName position of a cell on the grid
 */
function addCardsToGridAreaCell(cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) =>{
        addChildElement(cellPositionElem, card)
    })

}

/**
 * helper function to add or remove the flip-it class
 * @param {string} card reference to a card
 * @param {boolean} flipToBack tells whether to flip or not
 */
function flipCard(card, flipToBack){
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it')){
        innerCardElem.classList.remove('flip-it')
    }
}

/**
 * fuction to flip the card if the boolean value is true and not to flip
 * the card if otherwise
 * @param {boolean} flipToBack tells whether to flip or not 
 */
function flipCards(flipToBack){
    cards.forEach((card, index) => {
        setTimeout(() => {
            flipCard(card, flipToBack)
        }, index * 100)
    })
}

/**
 * function for shuffling the card
 */
function shuffleCard(){
    const id = setInterval(shuffle, 12)
    let shuffleCount = 0

    function shuffle(){

        randomizeCardPostions()

        // stop shuffling when count hits 500
        if(shuffleCount == 500){
            clearInterval(id)
            shufflingInProgress = false
            dealCards()
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card that you think is the Ace of Spades...")
        }
        else{
            shuffleCount++
        }
    }
}

/**
 * randomly positioning the cards on the grid
 */
function randomizeCardPostions(){
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    const temp = cardPositons[random1 - 1]

    cardPositons[random1 - 1] = cardPositons[random2 - 1]
    cardPositons[random2 - 1] = temp
}

/**
 * function to restore the cards back to different postions on the grid
 */
function dealCards(){
    addCardsToAppropriateCell()
    const areasTeamplate = returnGridAreasMappedToCardPos()

    transformGridArea(areasTeamplate)
}

/**
 * function to generate a new grid Template changed due to our shuffle functionality
 * @returns a new grid template
 */
function returnGridAreasMappedToCardPos(){
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((cards, index)=>{
        if(cardPositons[index] == 1){
            areas += "a "
        }
        else if(cardPositons[index] == 1){
            areas += "a "
        }
        else if(cardPositons[index] == 2){
            areas += "b "
        }
        else if(cardPositons[index] == 3){
            areas += "c "
        }
        else if(cardPositons[index] == 4){
            areas += "d "
        }

        if(index == 1){
            firstPart = areas.substring(0, areas.length - 1)
            areas = ""
        }
        else if(index == 3){
            secondPart = areas.substring(0, areas.length - 1)
            areas = ""
        }
    })
    
    return `"${firstPart}" "${secondPart}"`
}

/**
 * rearranging the cards assigning them positions in the grid
 */
function addCardsToAppropriateCell(){
    cards.forEach((card) =>{
        addCardToGridCell(card)
    })
}

/**
 * fuction to generate the HTML objects for each element of the array
 */
function generateCards(){
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}

/**
 * function to create the cards dynamically
 * @param {Object} cardItem 
 */
function createCard(cardItem){

    //create div elements that make up the cards
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    //create front and back Image elements for a card
    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    // add class and id to card element
    addClassToElement(cardElem, 'card')
    addIdToElement(cardElem, cardItem.id)

    // add class to inner card element
    addClassToElement(cardInnerElem, 'card-inner')

    // add class to front card element
    addClassToElement(cardFrontElem, 'card-front')

    // add class to back card element
    addClassToElement(cardBackElem, 'card-back')

    // add src attribute and appropriate value to img element - front and back of the card
    addSrcToImageElement(cardFrontImg, cardItem.imagePath)
    addSrcToImageElement(cardBackImg, cardBackImgPath)

    // add class to img elements - front & back
    addClassToElement(cardFrontImg, 'card-img')
    addClassToElement(cardBackImg, 'card-img')

    // assign image element as child element to card element - front & back
    addChildElement(cardFrontElem, cardFrontImg)
    addChildElement(cardBackElem, cardBackImg)

    // assign front and back card elements as child elements to inner card element
    addChildElement(cardInnerElem, cardFrontElem)
    addChildElement(cardInnerElem, cardBackElem)

    // assign inner card element as child to card element
    addChildElement(cardElem, cardInnerElem)

    // add card element as card element to appropriate grid cell
    addCardToGridCell(cardElem)

    // record card positions
    initializeCardPositions(cardElem)

    // add Mouse Click event Listener
    attatchClickEventHandlerToCard(cardElem)
}

/**
 * function to add click event to cards
 * @param {HTMLElement} card reference to the card object
 */
function attatchClickEventHandlerToCard(card){
    card.addEventListener('click', ()=> chooseCard(card))
}

/**
 * function to store the initial positions of the cards
 * @param {HTMLElement} card reference to the card object 
 */
function initializeCardPositions(card){
    cardPositons.push(card.id)
}
/**
 * fuction to generate an HTML element
 * @param {string} elemType element type
 * @returns {HTMLElement} HTML element
 */
function createElement(elemType){
    return document.createElement(elemType)
}

/**
 * function to add class to an HTML element
 * @param {HTMLElement} elem html element
 * @param {string} classname name of the class
 */
function addClassToElement(elem , classname){
    elem.classList.add(classname);
}

/**
 * function to add ID to an HTML element
 * @param {HTMLElement} elem html element
 * @param {number} id element id
 */
function addIdToElement(elem, id){
    elem.id = id
}

/**
 * function to add src attribute to HTML img elements
 * @param {HTMLElement} imgElement img html element
 * @param {string} src sourse of the img
 */
function addSrcToImageElement(imgElement, src){
    imgElement.src = src
}

/**
 * function to add child elements to the parent element
 * @param {HTMLElement} parentElem parent html element
 * @param {HTMLElement} childElem child html element
 */
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}

/**
 * assign each card as the child to appropriate positions of the grid
 * @param {HTMLElement} card 
 */
function addCardToGridCell(card){
    const cardPosElem = document.querySelector(mapCardIdToGridCell(card))
    addChildElement(cardPosElem, card)
}

/**
 * helper function to find the appropriate class name for each card
 * @param {HTMLElement} card html card element
 * @returns an appropriate class name
 */
function mapCardIdToGridCell(card){
    if(card.id == 1){
        return '.card-pos-a'
    }
    else if(card.id == 2){
        return '.card-pos-b'
    }
    else if(card.id == 3){
        return '.card-pos-c'
    }
    else if(card.id == 4){
        return '.card-pos-d'
    }
}
