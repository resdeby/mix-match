import AudioController from './AudioController.js'

export default class MixOrMatch{
  constructor(totalTime, cards) {
    this.cardArray = cards
    this.totalTime = totalTime
    this.timeRemaining = totalTime
    this.timer = document.getElementById('time-remaining')
    this.ticker = document.getElementById('flips')
    this.audioController = new AudioController()
  }

  startGame() {
    this.cardToCheck = null
    this.totalClick = 0
    this.timeRemaining = this.totalTime
    this.matchedCards = []
    this.busy = true
    setTimeout(() => {
      this.audioController.startMusic()
      this.shuffleCards()
      this.countDown = this.startCountdown()
      this.busy = false
    }, 500)
    this.hideCards()
    this.timer.innerText = this.timeRemaining
    this.ticker.innerText = this.totalClick
  }

  hideCards() {
    this.cardArray.forEach(card => {
      card.classList.remove('visible')
      card.classList.remove('match')
    });
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src
  }

  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck)
    } else {
      this.cardMisMatch(card, this.cardToCheck)
    }
    this.cardToCheck = null
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip()
      this.totalClick++
      this.ticker.innerText = this.totalClick
      card.classList.add('visible')
      
      if (this.cardToCheck) {
        this.checkForCardMatch(card)
      } else {
        this.cardToCheck = card
      }
    }
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1)    
    this.matchedCards.push(card2)    
    card1.classList.add('match')
    card2.classList.add('match')
    this.audioController.match()
    if (this.matchedCards.length === this.cardArray.length) {
      this.victory()
    }
  }

  cardMisMatch(card1, card2) {
    this.busy = true
    setTimeout(() => {
      card1.classList.remove('visible')
      card2.classList.remove('visible')
      this.busy = false
    }, 1000)
  }

  startCountdown() {
    return setInterval(() => {
      this.timeRemaining--
      this.timer.innerText = this.timeRemaining
      if (this.timeRemaining === 0) {
        this.gameOver()
      }
    }, 1000)
  }

  gameOver() {
    clearInterval(this.countDown)
    this.audioController.gameOver()
    document.getElementById('game-over-text').classList.add('visible')
  }

  victory() {
    clearInterval(this.countDown)
    this.audioController.victory()
    document.getElementById('victory-text').classList.add('visible')
  }

  shuffleCards() {
    for (let i = this.cardArray.length - 1; i > 0; i--){
      let randIndex = Math.floor(Math.random() * (i + 1))
      this.cardArray[randIndex].style.order = i
      this.cardArray[i].style.order = randIndex
    }
  }

  canFlipCard(card) {
    return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
  }
}