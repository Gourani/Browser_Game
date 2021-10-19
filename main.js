new Vue({
    name:'Game',
    el:"#app",
    data:state,
    template:`<div id="#app" :class="cssClass">
    <top-bar :turn="turn" :players="players" :current-player-index="currentPlayerIndex" />
    <div class="world">
    <castle v-for="(player,index) in players" :player="player" :index="index" />
    <div class="land" />
    <div class="clouds">
        <cloud  v-for="index in 10" :type="(index-1)%5 + 1" />
    </div>
    </div>
    <transition name="hand">
    <hand :cards="currentHand" v-if="!activeOverlay" @card-play="handlePlay"  @card-leave-end="handleCardLeaveEnd"/>
    </transition>
    <transition name="fade">
        <div class="overlay-background" v-if="activeOverlay" />
    </transition>
    
    <transition name="zoom">
    <overlay v-if="activeOverlay" :key="activeOverlay" @close=" handleOverlayClose">
    <component :is="'overlay-content-'+activeOverlay" :player="currentPlayer" :opponent="currentOpponent" :players="players" />
    </overlay>
    </transition>
    </div>`,
    computed:{
        testCard(){
            return cards.archers
        },
        cssClass(){
            return{
                'can-play':this.canPlay
            }
        }
    },
    methods:{
        createTestHand(){
            const cards=[]
            for(let i=0;i<5;i++){
                cards.push(this.testDrawCard())
            }
            return cards
        },
        testDrawCard(){
            const ids=Object.keys(cards)
            const randomId=ids[Math.floor(Math.random()*ids.length)]
            return {
                uid:cardUid++,
                id:randomId,
                def:cards[randomId]
            }
        },
        handlePlay(card){
            playCard(card)
        },
        handleCardLeaveEnd(){
                applyCard()
        },
        handleOverlayClose(){
            overlayCloseHandlers[this.activeOverlay]()
        }
    },
    created(){
        this.testHand=this.createTestHand()
    },
    mounted(){
        beginGame()
    }
})

requestAnimationFrame(animate)

function animate(time){
    requestAnimationFrame(animate)
    TWEEN.update(time)
}

state.activeOverlay = 'player-turn'

function beginGame(){
    state.players.forEach(drawInitialHand)
}

function playCard(card){
    if(state.canPlay){
        state.canPlay=false
        currentPlayingCard=card 

        const index=state.currentPlayer.hand.indexOf(card)
        state.currentPlayer.hand.splice(index,1)

        addCardToPile(state.discardPile,card.id)
    }
}

function applyCard () {
    const card = currentPlayingCard
  
    applyCardEffect(card)
  
    // Wait a bit for the player to see what's going on
    setTimeout(() => {
      // Check if the players are dead
      state.players.forEach(checkPlayerLost)
  
      if (isOnePlayerDead()) {
        endGame()
      } else {
        nextTurn()
      }
    }, 700)
  }

function endGame(){
    state.activeOverlay="game-over"
}
function nextTurn () {
    state.turn ++
    state.currentPlayerIndex = state.currentOpponentId
    state.activeOverlay = 'player-turn'
  }
function newTurn(){
    state.activeOverlay=null
    if(state.currentPlayer.skipTurn){
        skipTurn()
    }else{
        startTurn()
    }
}

function skipTurn(){
    state.currentPlayer.skipTurn=false
    state.currentPlayer.skippedTurn=true 
    nextTurn()
}

function startTurn(){
    state.currentPlayer.skippedTurn=false
    if(state.turn>2){
setTimeout(()=>{
    state.currentPlayer.hand.push(drawCard())
    state.canPlay=true
},800)        
    }else{    state.canPlay=true
}

}

var overlayCloseHandlers={
    'player-turn'(){
        if(state.turn>1){
            state.activeOverlay="last-play"
        }else{
            newTurn()
        }
    },
    'last-play'(){
        newTurn()
    },
    'game-over'(){
        document.location.reload()
    }
}