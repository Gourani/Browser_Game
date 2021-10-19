// Some usefull variables
var maxHealth = 10
var maxFood = 10
var handSize = 5
var cardUid = 0
var currentPlayingCard = null

// The consolidated state of our app
var state = {
  // World
  worldRatio: getWorldRatio(),
  // TODO Other things
  turn:1,
  currentPlayerIndex:Math.round(Math.random()),
  players:[
    {
      name:"anas",
      food:10,
      health:10,
      skipTurn:false,
      skippedTurn:false,
      dead:false,
      hand:[],
      currentPlayingCardId:null
    },
    {
      name:"achraf",
      food:10,
      health:10,
      skipTurn:false,
      skippedTurn:false,
      dead:false,
      hand:[],
      currentPlayingCardId:null
    }
  ],
  testHand:[],
  activeOverlay:null,
  get currentPlayer(){
    return state.players[state.currentPlayerIndex]
  },
  get currentOpponentId(){
    return this.currentPlayerIndex===1?0:1
  },
  get currentOpponent(){
    return state.players[state.currentOpponentId]
  },
  drawPile:pile,
  discardPile:{},
  get currentHand(){
    return state.currentPlayer.hand
  },
  canPlay:false
}
